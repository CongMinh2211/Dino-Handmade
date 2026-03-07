import mongoose from 'mongoose';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { Product } from './models/Product.js';
import { User } from './models/User.js';
import { Order } from './models/Order.js';
import { Blog } from './models/Blog.js';
import { Feedback } from './models/Feedback.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const MONGO_URI = 'mongodb+srv://admin:Dino123456@cluster0.92uaoys.mongodb.net/dino_handmade?retryWrites=true&w=majority&appName=Cluster0';

async function migrate() {
  try {
    await mongoose.connect(MONGO_URI);
    console.log('✅ Connected to MongoDB for migration');

    // Migrate Users
    const usersData = JSON.parse(fs.readFileSync(path.join(__dirname, 'data', 'users.json'), 'utf-8'));
    console.log(`Found ${usersData.length} users in JSON`);
    for (const u of usersData) {
      await User.findOneAndUpdate({ username: u.username }, u, { upsert: true });
    }
    console.log('✅ Users migrated');

    // Migrate Products
    const productsData = JSON.parse(fs.readFileSync(path.join(__dirname, 'data', 'products.json'), 'utf-8'));
    console.log(`Found ${productsData.length} products in JSON`);
    for (const p of productsData) {
      // Remove JSON id to let MongoDB generate its own _id, or keep as string if desired
      const { id, ...pData } = p;
      await Product.findOneAndUpdate({ name: p.name }, pData, { upsert: true });
    }
    console.log('✅ Products migrated');

    // Migrate Orders
    const ordersData = JSON.parse(fs.readFileSync(path.join(__dirname, 'data', 'orders.json'), 'utf-8'));
    console.log(`Found ${ordersData.length} orders in JSON`);
    for (const o of ordersData) {
      const { id, ...oData } = o;
      await Order.create(oData);
    }
    console.log('✅ Orders migrated');

    // Migrate Blog
    const blogPath = path.join(__dirname, 'data', 'blog.json');
    if (fs.existsSync(blogPath)) {
      const blogData = JSON.parse(fs.readFileSync(blogPath, 'utf-8'));
      console.log(`Found ${blogData.length} blog posts in JSON`);
      for (const b of blogData) {
        const { id, ...bData } = b;
        await Blog.findOneAndUpdate({ title: b.title }, bData, { upsert: true });
      }
      console.log('✅ Blog migrated');
    } else {
      console.log('ℹ️ blog.json missing, skipping blog migration');
    }

    // Migrate Feedback
    const feedbackPath = path.join(__dirname, 'data', 'feedback.json');
    if (fs.existsSync(feedbackPath)) {
      const feedbackData = JSON.parse(fs.readFileSync(feedbackPath, 'utf-8'));
      console.log(`Found ${feedbackData.length} feedback items in JSON`);
      for (const f of feedbackData) {
        const { id, ...fData } = f;
        await Feedback.findOneAndUpdate({ comment: f.comment }, fData, { upsert: true });
      }
      console.log('✅ Feedback migrated');
    } else {
      console.log('ℹ️ feedback.json missing, skipping feedback migration');
    }

    console.log('🎉 Migration completed successfully!');
    process.exit(0);
  } catch (err) {
    console.error('❌ Migration failed:', err);
    process.exit(1);
  }
}

migrate();
