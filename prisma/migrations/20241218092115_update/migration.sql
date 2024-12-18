/*
  Warnings:

  - A unique constraint covering the columns `[phoneNumber]` on the table `whatsapp_contact` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "whatsapp_contact_phoneNumber_key" ON "whatsapp_contact"("phoneNumber");

-- CreateIndex
CREATE INDEX "whatsapp_contact_phoneNumber_idx" ON "whatsapp_contact"("phoneNumber");

-- CreateIndex
CREATE INDEX "whatsapp_contact_name_idx" ON "whatsapp_contact"("name");

-- CreateIndex
CREATE INDEX "whatsapp_contact_to_chat_contactId_idx" ON "whatsapp_contact_to_chat"("contactId");

-- CreateIndex
CREATE INDEX "whatsapp_contact_to_chat_chatId_idx" ON "whatsapp_contact_to_chat"("chatId");

-- CreateIndex
CREATE INDEX "whatsapp_message_messageId_idx" ON "whatsapp_message"("messageId");
