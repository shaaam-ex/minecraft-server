/*
  Warnings:

  - A unique constraint covering the columns `[ipAddress,port]` on the table `Server` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "Server_ipAddress_key";

-- CreateIndex
CREATE UNIQUE INDEX "Server_ipAddress_port_key" ON "Server"("ipAddress", "port");
