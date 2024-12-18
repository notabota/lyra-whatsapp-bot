-- CreateTable
CREATE TABLE "chats" (
    "id" TEXT NOT NULL,
    "name" TEXT,

    CONSTRAINT "chats_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "contacts" (
    "id" TEXT NOT NULL,
    "name" TEXT,
    "number" TEXT,
    "pushname" TEXT,
    "shortName" TEXT,

    CONSTRAINT "contacts_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "messages" (
    "id" TEXT NOT NULL,
    "body" TEXT,
    "author" TEXT,
    "from" TEXT,
    "to" TEXT,
    "type" TEXT,
    "data" TEXT,
    "filename" TEXT,
    "mimetype" TEXT,
    "filesize" INTEGER,
    "timestamp" INTEGER,

    CONSTRAINT "messages_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "contact_chat" (
    "id" SERIAL NOT NULL,
    "contact_id" TEXT,
    "chat_id" TEXT,

    CONSTRAINT "contact_chat_pkey" PRIMARY KEY ("id")
);
