import { Client, RemoteAuth } from 'whatsapp-web.js';
import { PrismaClient } from '@prisma/client';
import { AwsS3Store } from 'wwebjs-aws-s3';
import { Storage } from '@google-cloud/storage';
import {
    S3Client,
    PutObjectCommand,
    HeadObjectCommand,
    GetObjectCommand,
    DeleteObjectCommand
} from '@aws-sdk/client-s3';
import 'dotenv/config'

const s3 = new S3Client({
    region: process.env.AWS_REGION || '',
    credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID || '',
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || ''
    }
});

const putObjectCommand = PutObjectCommand;
const headObjectCommand = HeadObjectCommand;
const getObjectCommand = GetObjectCommand;
const deleteObjectCommand = DeleteObjectCommand;

const store = new AwsS3Store({
    bucketName: 'lyradev',
    remoteDataPath: 'whatsappBot',
    s3Client: s3,
    putObjectCommand,
    headObjectCommand,
    getObjectCommand,
    deleteObjectCommand
});


const prisma = new PrismaClient();

const client = new Client({
    puppeteer: {
        args: ['--no-sandbox', '--disable-setuid-sandbox'],
    },
    authStrategy: new RemoteAuth({
        clientId: process.env.WHATSAPP_SESSION_CLIENT_ID || '',
        dataPath: 'whatsappBotSessionDataPath',
        store: store,
        backupSyncIntervalMs: 600000
    })
});

const storage = new Storage({
    projectId: 'symbolic-yeti-244015',
    credentials: {
      client_email: process.env.GCP_BUCKET_CLIENT_EMAIL || '',
      private_key: process.env.GCP_BUCKET_PRIVATE_KEY?.split(String.raw`\n`).join('\n') || '',
    },
  })

client.on('ready', () => {
    console.log('Client is ready!');
});

client.on('qr', qr => {
    console.log(qr);
});

client.on('remote_session_saved', () => {
    console.log('Remote session saved');
});

client.on('message', async msg => {
    try {
        console.log('Message Event');
        console.log(msg.type);
        console.log(msg.id._serialized);

        const chat = await msg.getChat();
        const contact = await msg.getContact();

        const chatRecord = await prisma.whatsapp_chat.upsert({
            where: { chatId: chat.id._serialized },
            create: {
                chatId: chat.id._serialized,
                name: chat.name,
            },
            update: {
                name: chat.name
            }
        });
        const profileUrl = await contact.getProfilePicUrl();
        const contactRecord = await prisma.whatsapp_contact.upsert({
            where: { contactId: contact.id._serialized },
            create: {
                contactId: contact.id._serialized,
                name: contact.name || null,
                phoneNumber: contact.number,
                pushName: contact.pushname || '',
                shortName: contact.shortName || null,
                profileUrl: profileUrl || null
            },
            update: {
                name: contact.name || null,
                phoneNumber: contact.number,
                pushName: contact.pushname || '',
                shortName: contact.shortName || null,
                profileUrl: profileUrl || null
            }
        });

        let contactToChat = await prisma.whatsapp_contact_to_chat.findFirst({
            where: {
                contact: {
                    contactId: contact.id._serialized
                },
                chat: {
                    chatId: chat.id._serialized
                }
            }
        });

        if (!contactToChat) {
            contactToChat = await prisma.whatsapp_contact_to_chat.create({
                data: {
                    contact: {
                        connect: {
                            contactId: contact.id._serialized
                        }
                    },
                    chat: {
                        connect: {
                            chatId: chat.id._serialized
                        }
                    }
                }
            });
        }

        await prisma.whatsapp_message.create({
            data: {
                messageId: msg.id._serialized,
                body: msg.body,
                type: msg.type,
                timestamp: msg.timestamp,
                contactToChatId: contactToChat.id
            }
        });

        if (msg.hasMedia) {
            console.log("Media included Message");
            const media = await msg.downloadMedia();
            
            const buffer = Buffer.from(media.data, 'base64');
            const filename = `${msg.id._serialized}.${media.mimetype.split('/')[1]}`;
            const bucket = storage.bucket('lyra-whatsapp-bot');
            const file = bucket.file(`files/${filename}`);
            
            await file.save(buffer, {
                metadata: {
                    contentType: media.mimetype
                }
            });
            
            const publicUrl = `https://storage.googleapis.com/lyra-whatsapp-bot/files/${filename}`;
            
            await prisma.whatsapp_message.update({
                where: {
                    messageId: msg.id._serialized,
                },
                data: {
                    dataUrl: publicUrl,
                    filename: media.filename || null,
                    filesize: media.filesize || null,
                    mimetype: media.mimetype || null,
                }
            });
        }
    } catch (e) {
        console.error("Error receiving message: ", e);
    }
});

void client.initialize();
