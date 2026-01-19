/**
 * Script to create a platform admin user
 * Usage: npm run create-admin
 *
 * This script creates a NEW user with platform admin access.
 * It does NOT modify existing users.
 */

import { config } from 'dotenv';
import { resolve } from 'path';
import * as readline from 'readline';

// Load environment variables from .env.local
config({ path: resolve(process.cwd(), '.env.local') });

import { createPlatformAdmin } from '../src/lib/auth/create-user.ts';

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

async function main() {
  console.log('\n🔐 Criar Administrador da Plataforma Puncto\n');
  console.log('Este script cria um novo usuário com acesso de administrador da plataforma.\n');

  try {
    // Get user information
    const email = await question('Email do administrador: ');
    if (!email || !email.includes('@')) {
      console.error('❌ Email inválido');
      rl.close();
      process.exit(1);
    }

    const displayName = await question('Nome completo: ');
    if (!displayName) {
      console.error('❌ Nome é obrigatório');
      rl.close();
      process.exit(1);
    }

    const password = await question('Senha (mínimo 6 caracteres): ');
    if (!password || password.length < 6) {
      console.error('❌ Senha deve ter no mínimo 6 caracteres');
      rl.close();
      process.exit(1);
    }

    console.log('\nNíveis de acesso disponíveis:');
    console.log('1. super_admin - Acesso total');
    console.log('2. support - Suporte ao cliente');
    console.log('3. analyst - Analista (somente leitura)');

    const roleChoice = await question('\nEscolha o nível (1-3) [padrão: 3]: ');
    const roleMap = {
      '1': 'super_admin' as const,
      '2': 'support' as const,
      '3': 'analyst' as const,
    };
    const role = roleMap[roleChoice as '1' | '2' | '3'] || 'analyst';

    console.log('\n📋 Resumo:');
    console.log(`Email: ${email}`);
    console.log(`Nome: ${displayName}`);
    console.log(`Nível: ${role}`);

    const confirm = await question('\nConfirmar criação? (s/n): ');
    if (confirm.toLowerCase() !== 's' && confirm.toLowerCase() !== 'sim') {
      console.log('\n❌ Criação cancelada');
      rl.close();
      process.exit(0);
    }

    console.log('\n⏳ Criando administrador...');

    // Create the platform admin
    const result = await createPlatformAdmin({
      email,
      password,
      displayName,
      role,
    });

    console.log('\n✅ Administrador criado com sucesso!');
    console.log(`\nUser ID: ${result.userId}`);
    console.log(`Email: ${email}`);
    console.log(`Tipo: Platform Admin (${role})`);
    console.log('\n📝 O administrador pode fazer login em:');
    console.log('   http://localhost:3000?subdomain=admin');
    console.log('   ou https://admin.puncto.com.br (produção)\n');

    rl.close();
    process.exit(0);
  } catch (error: any) {
    console.error('\n❌ Erro ao criar administrador:', error.message);

    if (error.code === 'auth/email-already-exists') {
      console.error('\n⚠️  Este email já está em uso.');
      console.error('   Use o script set-admin para conceder acesso admin a um usuário existente.');
    }

    rl.close();
    process.exit(1);
  }
}

main();
