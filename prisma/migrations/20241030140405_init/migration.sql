-- CreateTable
CREATE TABLE "Cat" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "Cat_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Sub_cat" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "Sub_cat_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Course" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "cat_id" INTEGER NOT NULL,
    "sub_cat_id" INTEGER NOT NULL,

    CONSTRAINT "Course_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Cat_name_key" ON "Cat"("name");

-- CreateIndex
CREATE UNIQUE INDEX "Sub_cat_name_key" ON "Sub_cat"("name");

-- CreateIndex
CREATE UNIQUE INDEX "Course_name_key" ON "Course"("name");

-- AddForeignKey
ALTER TABLE "Course" ADD CONSTRAINT "Course_cat_id_fkey" FOREIGN KEY ("cat_id") REFERENCES "Cat"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Course" ADD CONSTRAINT "Course_sub_cat_id_fkey" FOREIGN KEY ("sub_cat_id") REFERENCES "Sub_cat"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
