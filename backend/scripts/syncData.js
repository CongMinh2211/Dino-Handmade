import mongoose from 'mongoose';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { Product } from '../models/Product.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const MONGO_URI = process.env.MONGO_URI || 'mongodb+srv://admin:Dino123456@cluster0.92uaoys.mongodb.net/dino_handmade?retryWrites=true&w=majority&appName=Cluster0';

async function syncData() {
  try {
    console.log('🚀 Starting data sync...');
    await mongoose.connect(MONGO_URI);
    console.log('✅ Connected to MongoDB');

    const jsonPath = path.join(__dirname, '../data/products.json');
    if (!fs.existsSync(jsonPath)) {
      console.error('❌ products.json not found at:', jsonPath);
      process.exit(1);
    }

    const productsData = JSON.parse(fs.readFileSync(jsonPath, 'utf-8'));
    console.log(`📦 Found ${productsData.length} products in JSON`);

    for (const item of productsData) {
      // Remove _id from JSON to let Mongo handle it or avoid collision if it's already there
      const itemData = { ...item };
      delete itemData._id;
      delete itemData.id;

      const existing = await Product.findOne({ name: item.name });
      if (existing) {
        Object.assign(existing, itemData);
        await existing.save();
        console.log(`  [UPDATE] ${item.name}`);
      } else {
        const product = new Product(itemData);
        await product.save();
        console.log(`  [CREATE] ${item.name}`);
      }
    }

    console.log('✨ Data synchronization complete!');
    process.exit(0);
  } catch (err) {
    console.error('❌ Error syncing data:', err);
    process.exit(1);
  }
}

syncData();
