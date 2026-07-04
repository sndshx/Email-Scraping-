const { PrismaClient } = require('@prisma/client');
const { PrismaNeon } = require('@prisma/adapter-neon');
const ws = require('ws');
const { neonConfig } = require('@neondatabase/serverless');

neonConfig.webSocketConstructor = ws;
const adapter = new PrismaNeon({ connectionString: process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter });

prisma.user.findUnique({
  where: { email: 'wsandyyyy@gmail.com' },
  select: { email: true, role: true, name: true, plan: true, isBanned: true }
}).then(u => {
  console.log('DB User:', JSON.stringify(u, null, 2));
  return prisma.$disconnect();
}).catch(e => {
  console.error(e);
  return prisma.$disconnect();
});
