import { initializeApp, cert } from 'firebase-admin/app';
import { getFirestore, Timestamp } from 'firebase-admin/firestore';
import { config } from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, resolve } from 'path';

// Get __dirname equivalent in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load environment variables from .env.local
config({ path: resolve(__dirname, '../.env.local') });

// Initialize Firebase Admin
const app = initializeApp({
  credential: cert({
    projectId: process.env.FIREBASE_ADMIN_PROJECT_ID,
    clientEmail: process.env.FIREBASE_ADMIN_CLIENT_EMAIL,
    privateKey: process.env.FIREBASE_ADMIN_PRIVATE_KEY?.replace(/\\n/g, '\n'),
  }),
});

const db = getFirestore(app);

async function seedDatabase() {
  console.log('🌱 Starting database seed...\n');

  try {
    // Create demo business
    console.log('📊 Creating demo business...');
    const businessRef = db.collection('businesses').doc('demo');

    await businessRef.set({
      slug: 'demo',
      displayName: 'Studio Lumière — Beleza & Estética',
      legalName: 'Lumière Estética LTDA',
      taxId: '12345678000199',
      email: 'contato@studiolumiere.com',
      phone: '+5541999999999',
      about: 'Serviços de corte, coloração, manicure e estética com equipe premiada. Atendimento personalizado em ambiente acolhedor.',
      industry: 'beauty',
      website: 'https://studiolumiere.com',

      branding: {
        logoUrl: 'https://images.unsplash.com/photo-1560066984-138dadb4c035?w=400',
        coverUrl: 'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?q=80&w=1600&auto=format&fit=crop',
        primaryColor: '#FF6B9D',
        secondaryColor: '#4A5568',
        gallery: [
          'https://images.unsplash.com/photo-1519415387722-a1c3bbef7161?q=80&w=1200&auto=format&fit=crop',
          'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?q=80&w=1200&auto=format&fit=crop',
          'https://images.unsplash.com/photo-1515378791036-0648a3ef77b2?q=80&w=1200&auto=format&fit=crop',
        ],
      },

      address: {
        street: 'Av. Central',
        number: '1234',
        complement: 'Sala 201',
        neighborhood: 'Centro',
        city: 'Curitiba',
        state: 'PR',
        zipCode: '80000-000',
        country: 'BR',
        coordinates: {
          lat: -25.4284,
          lng: -49.2733,
        },
      },

      subscription: {
        tier: 'free',
        status: 'active',
        currentPeriodStart: Timestamp.now(),
        currentPeriodEnd: Timestamp.fromDate(new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)),
        billingEmail: 'financeiro@studiolumiere.com',
      },

      features: {
        maxLocations: 1,
        maxProfessionals: 2,
        maxServicesPerMonth: 50,
        whatsappReminders: false,
        emailReminders: true,
        smsReminders: false,
        customBranding: false,
        advancedReports: false,
        apiAccess: false,
        multiLocation: false,
        dependentBooking: false,
        customFields: false,
        prioritySupport: false,
        webhooks: false,
        whiteLabel: false,
        bookingRetentionDays: 90,
        customerRetentionDays: 365,
        exportFormats: ['csv'],
      },

      settings: {
        timezone: 'America/Sao_Paulo',
        locale: 'pt-BR',
        currency: 'BRL',
        bookingWindow: 30,
        cancellationPolicy: {
          enabled: true,
          hoursBeforeService: 24,
          penalty: 0,
        },
        workingHours: {
          monday: { open: '09:00', close: '19:00', closed: false },
          tuesday: { open: '09:00', close: '19:00', closed: false },
          wednesday: { open: '09:00', close: '19:00', closed: false },
          thursday: { open: '09:00', close: '19:00', closed: false },
          friday: { open: '09:00', close: '19:00', closed: false },
          saturday: { open: '09:00', close: '17:00', closed: false },
          sunday: { closed: true },
        },
      },

      rating: 4.8,
      reviewsCount: 327,
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now(),
      createdBy: 'seed-script',
      dataRetentionDays: 365,
      consentVersion: '1.0',
    });

    console.log('✅ Demo business created: "demo"\n');

    // Create professionals
    console.log('👥 Creating professionals...');
    const professionals = [
      {
        id: 'pro_andreia',
        name: 'Andreia Santos',
        email: 'andreia@studiolumiere.com',
        phone: '+5541988881111',
        bio: 'Colorista sênior com especialização em técnicas de mechas avançadas e coloração de alta performance.',
        avatarUrl: 'https://i.pravatar.cc/150?img=47',
        specialties: ['Coloração', 'Luzes', 'Tonalização', 'Ombré'],
        rating: 4.9,
        totalReviews: 156,
      },
      {
        id: 'pro_rafael',
        name: 'Rafael Costa',
        email: 'rafael@studiolumiere.com',
        phone: '+5541988882222',
        bio: 'Especialista em cortes masculinos e barbearia clássica. Mais de 10 anos de experiência.',
        avatarUrl: 'https://i.pravatar.cc/150?img=12',
        specialties: ['Corte masculino', 'Barba', 'Navalha'],
        rating: 4.7,
        totalReviews: 98,
      },
      {
        id: 'pro_bianca',
        name: 'Bianca Moreira',
        email: 'bianca@studiolumiere.com',
        phone: '+5541988883333',
        bio: 'Design de sobrancelhas e maquiagem profissional para eventos especiais.',
        avatarUrl: 'https://i.pravatar.cc/150?img=32',
        specialties: ['Sobrancelhas', 'Maquiagem', 'Cílios'],
        rating: 4.8,
        totalReviews: 73,
      },
    ];

    for (const pro of professionals) {
      await businessRef.collection('professionals').doc(pro.id).set({
        businessId: 'demo',
        userId: null,
        name: pro.name,
        email: pro.email,
        phone: pro.phone,
        bio: pro.bio,
        avatarUrl: pro.avatarUrl,
        specialties: pro.specialties,
        rating: pro.rating,
        totalReviews: pro.totalReviews,
        locationIds: [],
        active: true,
        canBookOnline: true,
        bufferTimeBefore: 0,
        bufferTimeAfter: 15,
        createdAt: Timestamp.now(),
        updatedAt: Timestamp.now(),
      });
      console.log(`  ✅ Created: ${pro.name}`);
    }
    console.log();

    // Create services
    console.log('💇 Creating services...');
    const services = [
      {
        id: 'svc_corte_feminino',
        name: 'Corte Feminino',
        description: 'Consultoria personalizada + corte feminino com acabamento profissional.',
        category: 'Cabelo',
        price: 9500, // R$ 95.00
        durationMinutes: 60,
        professionalIds: ['pro_andreia', 'pro_bianca'],
      },
      {
        id: 'svc_coloracao',
        name: 'Coloração Completa',
        description: 'Coloração completa do cabelo com produtos premium e tonalização.',
        category: 'Cabelo',
        price: 22000, // R$ 220.00
        durationMinutes: 120,
        professionalIds: ['pro_andreia'],
      },
      {
        id: 'svc_corte_masculino',
        name: 'Corte Masculino',
        description: 'Corte masculino com máquina e tesoura + acabamento e finalização.',
        category: 'Cabelo',
        price: 6000, // R$ 60.00
        durationMinutes: 45,
        professionalIds: ['pro_rafael'],
      },
      {
        id: 'svc_barba',
        name: 'Barba Completa',
        description: 'Aparar, desenhar e finalizar a barba com navalha e produtos premium.',
        category: 'Barba',
        price: 4500, // R$ 45.00
        durationMinutes: 30,
        professionalIds: ['pro_rafael'],
      },
      {
        id: 'svc_sobrancelhas',
        name: 'Design de Sobrancelhas',
        description: 'Design profissional de sobrancelhas com medição e finalização perfeita.',
        category: 'Estética',
        price: 4500, // R$ 45.00
        durationMinutes: 30,
        professionalIds: ['pro_bianca'],
      },
      {
        id: 'svc_luzes',
        name: 'Luzes e Mechas',
        description: 'Aplicação de luzes e mechas com técnicas modernas (ombré, balayage).',
        category: 'Cabelo',
        price: 28000, // R$ 280.00
        durationMinutes: 150,
        professionalIds: ['pro_andreia'],
      },
    ];

    for (const svc of services) {
      await businessRef.collection('services').doc(svc.id).set({
        businessId: 'demo',
        name: svc.name,
        description: svc.description,
        category: svc.category,
        price: svc.price,
        currency: 'BRL',
        durationMinutes: svc.durationMinutes,
        professionalIds: svc.professionalIds,
        locationIds: [],
        active: true,
        requiresDeposit: false,
        displayOrder: 0,
        createdAt: Timestamp.now(),
        updatedAt: Timestamp.now(),
      });
      console.log(`  ✅ Created: ${svc.name} (${svc.price / 100} BRL)`);
    }

    console.log('\n✨ Database seeded successfully!');
    console.log('\n📋 Summary:');
    console.log(`  - Business: 1 (slug: "demo")`);
    console.log(`  - Professionals: ${professionals.length}`);
    console.log(`  - Services: ${services.length}`);
    console.log('\n🌐 Test it at: http://localhost:3000?subdomain=demo\n');

  } catch (error) {
    console.error('❌ Error seeding database:', error);
    process.exit(1);
  }

  process.exit(0);
}

// Run the seed
seedDatabase();
