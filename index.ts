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
        console.log('Hmm');
        console.log(chat);
        return;
        await prisma.messages.create({
            data: {
                id: msg.id._serialized,
                body: msg.body,
                author: msg.author,
                from: msg.from,
                to: msg.to,
                type: msg.type
            }
        });
        await prisma.chats.upsert({
            where: {
                id: chat.id._serialized
            },
            create: {
                id: chat.id._serialized,
                name: chat.name,
            },
            update: {
                name: chat.name
            }
        });
        await prisma.contacts.upsert({
            where: {
                id: contact.id._serialized
            },
            create: {
                id: contact.id._serialized,
                name: contact.name,
                number: contact.number,
                pushname: contact.pushname,
                shortName: contact.shortName
            },
            update: {
                name: contact.name,
                number: contact.number,
                pushname: contact.pushname,
                shortName: contact.shortName
            }
        });
        if (msg.hasMedia) {
            console.log("Media included Message");
            const media = await msg.downloadMedia();
            await prisma.messages.update({
                where: {
                    id: msg.id._serialized,
                },
                data: {
                    data: media.data,
                    filename: media.filename,
                    filesize: media.filesize,
                    mimetype: media.mimetype,
                }
            });
        }
    } catch (e) {
        console.error("Error receiving message: ", e);
    }
});

client.on('group_join', async (notification) => {
    try {
        console.log('Group join notification type:', notification.type);
        const chat = await notification.getChat();

        const existed_chat = await prisma.chats.findUnique({
            where: {
                id: chat.id._serialized
            }
        });

        if (!existed_chat) {
            // If group doesn't exist, add all members
            console.log("test");
            console.log(chat);
            console.log(chat.participants);

        } else {
            // If group exists, just add the new participant

            // const participant = notification.recipientIds[0];
            
            // await prisma.contacts.upsert({
            //     where: {
            //         id: participant._serialized
            //     },
            //     create: {
            //         id: participant._serialized,
            //         number: participant.user
            //     },
            //     update: {
            //         number: participant.user
            //     }
            // });

            // await prisma.contact_chat.create({
            //     data: {
            //         contact_id: participant._serialized,
            //         chat_id: notification.chatId._serialized
            //     }
            // });
        }
    } catch (e) {
        console.error("Error handling group join:", e);
    }
});

client.on('group_leave', async (notification) => {
    console.log('Group leave notification type:', notification.type);
});

client.on('group_update', async (notification) => {
    console.log('Group update notification type:', notification.type);
});


void client.initialize();
