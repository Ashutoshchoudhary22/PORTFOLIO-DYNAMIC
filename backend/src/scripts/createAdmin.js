import 'dotenv/config';
import readline from 'readline/promises';
import { stdin as input, stdout as output } from 'process';
import mongoose from 'mongoose';
import { connectDatabase } from '../config/database.js';
import { Admin } from '../models/Admin.js';

async function promptCredentials() {
  const rl = readline.createInterface({ input, output });

  try {
    const email =
      process.env.ADMIN_EMAIL ||
      (await rl.question('Admin email: '));
    const password =
      process.env.ADMIN_PASSWORD ||
      (await rl.question('Admin password (min 8 chars): '));

    return { email: email.trim().toLowerCase(), password: password.trim() };
  } finally {
    rl.close();
  }
}

async function createAdmin() {
  await connectDatabase();

  const { email, password } = await promptCredentials();

  if (!email || !password || password.length < 8) {
    throw new Error('Valid email and password (min 8 characters) are required');
  }

  const existing = await Admin.findOne({ email });

  if (existing) {
    existing.password = password;
    existing.isActive = true;
    await existing.save();
    console.log(`Admin password updated for ${email}`);
  } else {
    await Admin.create({ email, password, name: 'Portfolio Admin' });
    console.log(`Admin account created for ${email}`);
  }

  await mongoose.disconnect();
}

createAdmin().catch(async (error) => {
  console.error('Failed to create admin:', error.message);
  await mongoose.disconnect();
  process.exit(1);
});
