-- CreateTable
CREATE TABLE "StringIdModel" (
    "id" TEXT NOT NULL,
    "value" TEXT NOT NULL,

    CONSTRAINT "StringIdModel_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "IntegerIdModel" (
    "id" SERIAL NOT NULL,
    "value" TEXT NOT NULL,

    CONSTRAINT "IntegerIdModel_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "BigIntegerIdModel" (
    "id" BIGSERIAL NOT NULL,
    "value" TEXT NOT NULL,

    CONSTRAINT "BigIntegerIdModel_pkey" PRIMARY KEY ("id")
);
