-- CreateEnum
CREATE TYPE "Recurrence" AS ENUM ('DAILY', 'WEEKDAYS', 'WEEKLY', 'MONTHLY', 'YEARLY');

-- AlterTable
ALTER TABLE "Task" ADD COLUMN     "recurrence" "Recurrence";
