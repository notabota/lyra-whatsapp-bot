import { Client, LocalAuth } from 'whatsapp-web.js';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const client = new Client({
    puppeteer: {
        args: ['--no-sandbox', '--disable-setuid-sandbox'],
    },
    authStrategy: new LocalAuth()
});

client.on('ready', () => {
    console.log('Client is ready!');
});

client.on('qr', qr => {
    console.log(qr);
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

        const contactRecord = await prisma.whatsapp_contact.upsert({
            where: { contactId: contact.id._serialized },
            create: {
                contactId: contact.id._serialized,
                name: contact.name || null,
                phoneNumber: contact.number,
                pushName: contact.pushname || '',
                shortName: contact.shortName || null
            },
            update: {
                name: contact.name || null,
                phoneNumber: contact.number,
                pushName: contact.pushname || '',
                shortName: contact.shortName || null
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
            await prisma.whatsapp_message.update({
                where: {
                    messageId: msg.id._serialized,
                },
                data: {
                    data: media.data,
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
