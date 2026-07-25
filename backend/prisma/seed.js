const path = require('path');
const bcrypt = require('bcryptjs');
const { PrismaClient } = require('@prisma/client');
require('dotenv').config({ path: path.resolve(__dirname, '../.env') });

const prisma = new PrismaClient();

async function main() {
  const testUsers = [
    { name: 'Test User', email: 'test@example.com', password: 'Password123!' },
    { name: 'Admin User', email: 'admin@example.com', password: 'Admin123!' }
  ];

  for (const userData of testUsers) {
    const existing = await prisma.user.findUnique({ where: { email: userData.email } });
    if (existing) {
      console.log(`Skipping existing user: ${userData.email}`);
      continue;
    }

    const hashedPassword = await bcrypt.hash(userData.password, 10);
    const user = await prisma.user.create({
      data: {
        email: userData.email,
        name: userData.name,
        password: hashedPassword
      }
    });
    console.log(`Created user: ${user.email}`);
  }
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
