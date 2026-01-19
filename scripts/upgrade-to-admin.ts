/**
 * Script to upgrade an EXISTING user to platform admin
 * This updates both Firestore and Firebase Auth custom claims
 *
 * Usage: npm run upgrade-admin email@example.com
 *
 * Use this when you can't create new users due to IAM permissions,
 * but the user was already created via the app signup.
 */

import { config } from 'dotenv';
import { resolve } from 'path';
import * as readline from 'readline';

// Load environment variables from .env.local
config({ path: resolve(process.cwd(), '.env.local') });

import { auth, db } from '../src/lib/firebaseAdmin.ts';
import { CustomClaims } from '../src/types/user.ts';

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

function question(prompt: string): Promise<string> {
  return new Promise((resolve) => {
    rl.question(prompt, (answer) => {
      resolve(answer);
    });
  });
}

async function upgradeToAdmin(email: string) {
  try {
    console.log(`\n🔍 Looking up user: ${email}...`);

    // 1. Find user in Firebase Auth
    const userRecord = await auth.getUserByEmail(email);
    console.log(`✅ Found user: ${userRecord.displayName || userRecord.email} (UID: ${userRecord.uid})`);

    // 2. Ask for admin level
    console.log('\nNíveis de acesso disponíveis:');
    console.log('1. super_admin - Acesso total');
    console.log('2. support - Suporte ao cliente');
    console.log('3. analyst - Analista (somente leitura)');

    const roleChoice = await question('\nEscolha o nível (1-3) [padrão: 1]: ');
    const roleMap = {
      '1': 'super_admin' as const,
      '2': 'support' as const,
      '3': 'analyst' as const,
    };
    const role = roleMap[roleChoice as '1' | '2' | '3'] || 'super_admin';

    const confirm = await question(`\n⚠️  Transformar ${email} em Platform Admin (${role})? (s/n): `);
    if (confirm.toLowerCase() !== 's' && confirm.toLowerCase() !== 'sim') {
      console.log('\n❌ Operação cancelada');
      rl.close();
      process.exit(0);
    }

    console.log('\n⏳ Atualizando permissões...');

    // 3. Update Firebase Auth custom claims
    const customClaims: CustomClaims = {
      userType: 'platform_admin',
      platformAdmin: true,
      platformRole: role,
    };

    await auth.setCustomUserClaims(userRecord.uid, customClaims);
    console.log('✅ Custom claims atualizados no Firebase Auth');

    // 4. Update Firestore user document
    const userDocRef = db.collection('users').doc(userRecord.uid);
    await userDocRef.update({
      type: 'platform_admin',
      customClaims: customClaims,
    });
    console.log('✅ Documento do usuário atualizado no Firestore');

    console.log('\n🎉 Usuário transformado em Platform Admin com sucesso!');
    console.log(`\nEmail: ${email}`);
    console.log(`Nível: ${role}`);
    console.log('\n📝 IMPORTANTE:');
    console.log('   O usuário deve fazer LOGOUT e LOGIN novamente');
    console.log('   para que as novas permissões sejam aplicadas.');
    console.log('\n   Login em:');
    console.log('   http://localhost:3000?subdomain=admin\n');

    rl.close();
    process.exit(0);
  } catch (error: any) {
    console.error('\n❌ Erro ao atualizar usuário:', error.message);

    if (error.code === 'auth/user-not-found') {
      console.error('\n⚠️  Usuário não encontrado.');
      console.error('   Primeiro crie o usuário em: http://localhost:3000/auth/signup');
    }

    rl.close();
    process.exit(1);
  }
}

// Get email from command line arguments
const email = process.argv[2];

if (!email) {
  console.error('❌ Error: Email is required');
  console.log('\nUsage: npm run upgrade-admin <email>');
  console.log('Example: npm run upgrade-admin admin@puncto.com.br\n');
  process.exit(1);
}

// Validate email format
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
if (!emailRegex.test(email)) {
  console.error('❌ Error: Invalid email format');
  process.exit(1);
}

upgradeToAdmin(email);
