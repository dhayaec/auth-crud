import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  const password = await bcrypt.hash("password123", 12);

  const users = [
    {
      email: "alice@example.com",
      password,
      name: "Alice Johnson",
      bio: "Full-stack developer passionate about TypeScript.",
    },
    {
      email: "bob@example.com",
      password,
      name: "Bob Smith",
      bio: "Product designer and UI/UX enthusiast.",
    },
  ];

  for (const user of users) {
    await prisma.user.upsert({
      where: { email: user.email },
      update: {},
      create: user,
    });
  }

  console.log("Seeded 2 users");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
