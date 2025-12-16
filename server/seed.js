require('dotenv').config();
const mongoose = require('mongoose');
const MenuItem = require('./src/models/MenuItem');

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/strawbeary';

const menuItems = [
  {
    name: 'Strawbeary Jam',
    description: 'A delightful jammy dessert made from fresh strawberries and a hint of mint.',
    price: 5.99,
    imageURL: '/images/cake.png',
    isAvailable: true,
    category: 'dessert'
  },
  {
    name: 'Strawbeary Delight',
    description: 'A layered dessert with strawberries, cream, and fluffy cake.',
    price: 6.49,
    imageURL: '/images/cakeslice.webp',
    isAvailable: true,
    category: 'dessert'
  },
  {
    name: 'Strawbeary Combo',
    description: 'Get three flavors of our signature cupcakes in one combo!',
    price: 24.99,
    imageURL: '/images/threecake.png',
    isAvailable: true,
    category: 'dessert'
  },
  {
    name: 'Strawbeary Sparkle',
    description: 'A refreshing blend of strawberries and sparkling water. Hints of refreshing mint.',
    price: 12.99,
    imageURL: '/images/drink.png',
    isAvailable: true,
    category: 'drink'
  },
  {
    name: 'Strawbeary Juice',
    description: 'An aromatic juice made from fresh strawberries and a hint of mint.',
    price: 6.99,
    imageURL: '/images/drink2.webp',
    isAvailable: true,
    category: 'drink'
  },
  {
    name: 'Strawbeary Latte',
    description: 'A creamy latte made with fresh strawberries, milk, and a touch of honey.',
    price: 7.49,
    imageURL: '/images/latte.webp',
    isAvailable: true,
    category: 'drink'
  }
];

async function seed() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to MongoDB');

    // Clear existing menu items
    await MenuItem.deleteMany({});
    console.log('Cleared existing menu items');

    // Insert new menu items
    const inserted = await MenuItem.insertMany(menuItems);
    console.log(`✅ Seeded ${inserted.length} menu items:`);
    inserted.forEach(item => {
      console.log(`   - ${item.name} ($${item.price})`);
    });

    await mongoose.disconnect();
    console.log('✅ Database seeding completed!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Seeding failed:', error);
    process.exit(1);
  }
}

seed();

