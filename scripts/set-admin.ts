/**
 * Script to set platform admin custom claim for a user
 * Usage: npm run set-admin email@example.com
 */

import { config } from 'dotenv';
import { resolve } from 'path';
import * as readline from 'readline';

// Load environment variables from .env.local
config({ path: resolve(process.cwd(), '.env.local') });

import { auth } from '../src/lib/firebaseAdmin.ts';

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

async function setPlatformAdmin(email: string) {
  try {
    console.log(`\n🔍 Looking up user with email: ${email}...`);
    
    // Find user by email
    const userRecord = await auth.getUserByEmail(email);
    
    console.log(`✅ Found user: ${userRecord.displayName || userRecord.email} (UID: ${userRecord.uid})`);
    
    // Check current custom claims
    const currentClaims = userRecord.customClaims || {};
    const isCurrentlyAdmin = currentClaims.platformAdmin === true;
    
    if (isCurrentlyAdmin) {
      console.log(`\n⚠️  User already has platform admin access.`);
      rl.question('\nDo you want to remove admin access? (yes/no): ', async (answer) => {
        if (answer.toLowerCase() === 'yes' || answer.toLowerCase() === 'y') {
          const newClaims = { ...currentClaims };
          delete newClaims.platformAdmin;
          
          await auth.setCustomUserClaims(userRecord.uid, newClaims);
          console.log(`\n✅ Platform admin access REMOVED for ${email}`);
          rl.close();
          process.exit(0);
        } else {
          console.log('\n❌ No changes made.');
          rl.close();
          process.exit(0);
        }
      });
    } else {
      // Set platform admin claim
      const newClaims = {
        ...currentClaims,
        platformAdmin: true,
      };
      
      console.log(`\n⏳ Setting platform admin custom claim...`);
      await auth.setCustomUserClaims(userRecord.uid, newClaims);
      
      console.log(`\n✅ Platform admin access GRANTED to ${email}`);
      console.log(`\n📝 Note: The user must sign out and sign in again for the changes to take effect.`);
      console.log(`   The custom claim will be included in their ID token after re-authentication.\n`);
      
      rl.close();
      process.exit(0);
    }
  } catch (error: any) {
    if (error.code === 'auth/user-not-found') {
      console.error(`\n❌ Error: No user found with email: ${email}`);
    } else {
      console.error(`\n❌ Error setting platform admin:`, error.message);
    }
    rl.close();
    process.exit(1);
  }
}

// Get email from command line arguments
const email = process.argv[2];

if (!email) {
  console.error('❌ Error: Email is required');
  console.log('\nUsage: npm run set-admin <email>');
  console.log('Example: npm run set-admin admin@puncto.com.br\n');
  process.exit(1);
}

// Validate email format
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
if (!emailRegex.test(email)) {
  console.error('❌ Error: Invalid email format');
  process.exit(1);
}

setPlatformAdmin(email);
