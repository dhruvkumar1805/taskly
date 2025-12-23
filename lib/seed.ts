import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";

async function seed() {
  const hashed = await bcrypt.hash("password123", 10);

  await prisma.user.create({
    data: {
      email: "test@taskly.dev",
      name: "Test User",
      password: hashed,
    },
  });

  console.log("Seeded user");
}

seed();
