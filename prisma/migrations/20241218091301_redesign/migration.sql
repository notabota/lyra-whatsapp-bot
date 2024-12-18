/*
  Warnings:

  - You are about to drop the `chats` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `contact_chat` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `contacts` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `messages` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
DROP TABLE "chats";

-- DropTable
DROP TABLE "contact_chat";

-- DropTable
DROP TABLE "contacts";

-- DropTable
DROP TABLE "messages";

-- CreateTable
CREATE TABLE "whatsapp_chat" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "name" TEXT,

    CONSTRAINT "whatsapp_chat_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "whatsapp_contact" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "name" TEXT,
    "phoneNumber" TEXT NOT NULL,
    "pushName" TEXT NOT NULL,
    "shortName" TEXT,

    CONSTRAINT "whatsapp_contact_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "whatsapp_message" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "messageId" TEXT NOT NULL,
    "body" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "data" TEXT,
    "filename" TEXT,
    "mimetype" TEXT,
    "filesize" INTEGER,
    "timestamp" INTEGER NOT NULL,
    "contactToChatId" INTEGER NOT NULL,

    CONSTRAINT "whatsapp_message_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "whatsapp_contact_to_chat" (
    "id" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "contactId" TEXT NOT NULL,
    "chatId" TEXT NOT NULL,

    CONSTRAINT "whatsapp_contact_to_chat_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "whatsapp_chat_name_idx" ON "whatsapp_chat"("name");

-- CreateIndex
CREATE UNIQUE INDEX "whatsapp_message_messageId_key" ON "whatsapp_message"("messageId");

-- CreateIndex
CREATE INDEX "whatsapp_message_contactToChatId_idx" ON "whatsapp_message"("contactToChatId");

-- CreateIndex
CREATE UNIQUE INDEX "whatsapp_contact_to_chat_contactId_chatId_key" ON "whatsapp_contact_to_chat"("contactId", "chatId");

-- AddForeignKey
ALTER TABLE "whatsapp_message" ADD CONSTRAINT "whatsapp_message_contactToChatId_fkey" FOREIGN KEY ("contactToChatId") REFERENCES "whatsapp_contact_to_chat"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "whatsapp_contact_to_chat" ADD CONSTRAINT "whatsapp_contact_to_chat_contactId_fkey" FOREIGN KEY ("contactId") REFERENCES "whatsapp_contact"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "whatsapp_contact_to_chat" ADD CONSTRAINT "whatsapp_contact_to_chat_chatId_fkey" FOREIGN KEY ("chatId") REFERENCES "whatsapp_chat"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
