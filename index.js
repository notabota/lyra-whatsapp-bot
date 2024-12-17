const {Client, LocalAuth} = require('whatsapp-web.js');
const qrcode = require('qrcode-terminal');
const {PrismaClient} = require('@prisma/client');

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
    // qrcode.generate(qr, {small: true});
    console.log(qr);
});

client.on('message', async msg => {
    try {
        console.log('Message Event');
        console.log(msg.type);
        console.log(msg.id._serialized);
        const chat = await msg.getChat();
        const contact = await msg.getContact();
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

void client.initialize();
