-- DropIndex
DROP INDEX "Booking_roomId_checkIn_checkOut_idx";

-- CreateIndex
CREATE INDEX "Booking_roomId_status_checkIn_checkOut_idx" ON "Booking"("roomId", "status", "checkIn", "checkOut");
