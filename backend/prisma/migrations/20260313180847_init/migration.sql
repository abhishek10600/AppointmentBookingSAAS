-- AlterTable
ALTER TABLE "AvailabilityRule" ALTER COLUMN "startTime" SET DATA TYPE TEXT,
ALTER COLUMN "endTime" SET DATA TYPE TEXT;

-- AlterTable
ALTER TABLE "Booking" ALTER COLUMN "meetingLink" DROP NOT NULL;
