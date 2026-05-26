import mongoose from 'mongoose';
import { config } from './config/env';
import { PromoCode, IPromoCode } from './models/PromoCode';
import { Order } from './models/Order';

async function runTests() {
  console.log('Connecting to database...');
  await mongoose.connect(config.MONGODB_URI);
  console.log('Connected!');

  console.log('\n--- VERIFYING PROMO CODES ---');
  const promoCount = await PromoCode.countDocuments();
  console.log(`Total Promo Codes: ${promoCount}`);
  
  const promos = await PromoCode.find({});
  console.log('Available promo codes:');
  promos.forEach((p: IPromoCode) => {
    console.log(`- Code: ${p.code}, Discount: ${p.discount}%, Active: ${p.isActive}`);
  });

  console.log('\n--- VERIFYING ORDERS SCHEMA ---');
  const lastOrder = await Order.findOne().sort({ createdAt: -1 });
  if (lastOrder) {
    console.log(`Last Order ID: ${lastOrder._id}`);
    console.log(`Payment Method: ${lastOrder.paymentMethod}`);
    console.log(`Promo Code applied: ${(lastOrder as any).promoCode || 'None'}`);
    console.log(`Payment Status: ${lastOrder.paymentStatus}`);
  } else {
    console.log('No orders found in database yet.');
  }

  await mongoose.connection.close();
  console.log('\nDatabase connection closed. All checks complete.');
}

runTests().catch(err => {
  console.error('Test execution failed:', err);
  process.exit(1);
});
