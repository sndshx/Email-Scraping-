const { PrismaClient } = require('@prisma/client');
const { PrismaNeon } = require('@prisma/adapter-neon');
const ws = require('ws');
const bcrypt = require('bcryptjs');

const connectionString = process.env.DATABASE_URL;
if (!connectionString) {
  console.error("❌ DATABASE_URL is not set in environment!");
  process.exit(1);
}

const neonConfig = require('@neondatabase/serverless').neonConfig;
neonConfig.webSocketConstructor = ws;

const adapter = new PrismaNeon({ connectionString });
const prisma = new PrismaClient({ adapter });

async function run() {
  const email = 'wsandyyyy@gmail.com';
  const password = process.argv[2];

  if (!password) {
    console.error('❌ Please specify a password: node set-admin-password.js <your-secure-password>');
    process.exit(1);
  }

  console.log(`Setting password for ${email}...`);
  
  try {
    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await prisma.user.update({
      where: { email },
      data: {
        password: hashedPassword,
        role: 'admin'
      }
    });

    console.log(`✅ Hashed password successfully updated for admin user: ${user.email}`);
  } catch (error) {
    console.error('❌ Error setting admin password:', error);
  } finally {
    await prisma.$disconnect();
  }
}

run();
