// Quick test script to check subscription data in database
// Run with: node test-subscription.js <user-email>

const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function checkSubscription(email) {
  if (!email) {
    console.log('❌ Please provide email: node test-subscription.js user@example.com');
    process.exit(1);
  }

  console.log(`\n🔍 Checking subscription for: ${email}\n`);

  try {
    // Check User table
    const user = await prisma.user.findUnique({
      where: { email }
    });

    console.log('👤 User Table:');
    if (user) {
      console.log(`   ✅ Found user`);
      console.log(`   - ID: ${user.id}`);
      console.log(`   - Name: ${user.name}`);
      console.log(`   - Email: ${user.email}`);
      console.log(`   - Plan: ${user.plan}`);
      console.log(`   - Stripe Customer ID: ${user.stripeCustomerId || 'none'}`);
      console.log(`   - Created: ${user.createdAt}`);
    } else {
      console.log('   ❌ No user found');
    }

    // Check Subscription table
    const subscription = await prisma.subscription.findUnique({
      where: { userId: email }
    });

    console.log('\n📦 Subscription Table:');
    if (subscription) {
      console.log(`   ✅ Found subscription`);
      console.log(`   - ID: ${subscription.id}`);
      console.log(`   - User ID (email): ${subscription.userId}`);
      console.log(`   - Plan: ${subscription.plan}`);
      console.log(`   - Status: ${subscription.status}`);
      console.log(`   - Stripe Customer ID: ${subscription.stripeCustomerId || 'none'}`);
      console.log(`   - Subscription ID: ${subscription.subscriptionId || 'none'}`);
      console.log(`   - Current Period End: ${subscription.currentPeriodEnd || 'none'}`);
      console.log(`   - Created: ${subscription.createdAt}`);
      console.log(`   - Updated: ${subscription.updatedAt}`);
    } else {
      console.log('   ❌ No subscription found');
    }

    // Check Payments
    const payments = await prisma.payment.findMany({
      where: { customerEmail: email },
      orderBy: { createdAt: 'desc' },
      take: 5
    });

    console.log('\n💳 Recent Payments:');
    if (payments.length > 0) {
      payments.forEach((payment, idx) => {
        console.log(`   ${idx + 1}. ${payment.amount} ${payment.currency.toUpperCase()} - ${payment.status}`);
        console.log(`      Stripe ID: ${payment.stripePaymentId}`);
        console.log(`      Date: ${payment.createdAt}`);
      });
    } else {
      console.log('   ❌ No payments found');
    }

    console.log('\n');

  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

const email = process.argv[2];
checkSubscription(email);
