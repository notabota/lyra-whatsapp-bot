/*
  Warnings:

  - The primary key for the `whatsapp_chat` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The `id` column on the `whatsapp_chat` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The primary key for the `whatsapp_contact` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The `id` column on the `whatsapp_contact` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The primary key for the `whatsapp_message` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The `id` column on the `whatsapp_message` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - A unique constraint covering the columns `[chatId]` on the table `whatsapp_chat` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[contactId]` on the table `whatsapp_contact` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `chatId` to the `whatsapp_chat` table without a default value. This is not possible if the table is not empty.
  - Added the required column `contactId` to the `whatsapp_contact` table without a default value. This is not possible if the table is not empty.
  - Changed the type of `contactId` on the `whatsapp_contact_to_chat` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `chatId` on the `whatsapp_contact_to_chat` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- DropForeignKey
ALTER TABLE "whatsapp_contact_to_chat" DROP CONSTRAINT "whatsapp_contact_to_chat_chatId_fkey";

-- DropForeignKey
ALTER TABLE "whatsapp_contact_to_chat" DROP CONSTRAINT "whatsapp_contact_to_chat_contactId_fkey";

-- DropForeignKey
ALTER TABLE "whatsapp_message" DROP CONSTRAINT "whatsapp_message_contactToChatId_fkey";

-- AlterTable
ALTER TABLE "whatsapp_chat" DROP CONSTRAINT "whatsapp_chat_pkey",
ADD COLUMN     "chatId" TEXT NOT NULL,
DROP COLUMN "id",
ADD COLUMN     "id" SERIAL NOT NULL,
ADD CONSTRAINT "whatsapp_chat_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "whatsapp_contact" DROP CONSTRAINT "whatsapp_contact_pkey",
ADD COLUMN     "contactId" TEXT NOT NULL,
DROP COLUMN "id",
ADD COLUMN     "id" SERIAL NOT NULL,
ADD CONSTRAINT "whatsapp_contact_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "whatsapp_contact_to_chat" DROP COLUMN "contactId",
ADD COLUMN     "contactId" INTEGER NOT NULL,
DROP COLUMN "chatId",
ADD COLUMN     "chatId" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "whatsapp_message" DROP CONSTRAINT "whatsapp_message_pkey",
DROP COLUMN "id",
ADD COLUMN     "id" SERIAL NOT NULL,
ADD CONSTRAINT "whatsapp_message_pkey" PRIMARY KEY ("id");

-- CreateIndex
CREATE UNIQUE INDEX "whatsapp_chat_chatId_key" ON "whatsapp_chat"("chatId");

-- CreateIndex
CREATE UNIQUE INDEX "whatsapp_contact_contactId_key" ON "whatsapp_contact"("contactId");

-- CreateIndex
CREATE INDEX "whatsapp_contact_to_chat_contactId_idx" ON "whatsapp_contact_to_chat"("contactId");

-- CreateIndex
CREATE INDEX "whatsapp_contact_to_chat_chatId_idx" ON "whatsapp_contact_to_chat"("chatId");

-- CreateIndex
CREATE UNIQUE INDEX "whatsapp_contact_to_chat_contactId_chatId_key" ON "whatsapp_contact_to_chat"("contactId", "chatId");

-- AddForeignKey
ALTER TABLE "whatsapp_message" ADD CONSTRAINT "whatsapp_message_contactToChatId_fkey" FOREIGN KEY ("contactToChatId") REFERENCES "whatsapp_contact_to_chat"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "whatsapp_contact_to_chat" ADD CONSTRAINT "whatsapp_contact_to_chat_contactId_fkey" FOREIGN KEY ("contactId") REFERENCES "whatsapp_contact"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "whatsapp_contact_to_chat" ADD CONSTRAINT "whatsapp_contact_to_chat_chatId_fkey" FOREIGN KEY ("chatId") REFERENCES "whatsapp_chat"("id") ON DELETE CASCADE ON UPDATE CASCADE;
