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
      displayName: 'Clínica VitalCare — Saúde & Bem-Estar',
      legalName: 'VitalCare Serviços Médicos LTDA',
      taxId: '98765432000188',
      email: 'contato@vitalcare.com.br',
      phone: '+5511987654321',
      about: 'Clínica multidisciplinar especializada em fisioterapia, nutrição e acupuntura. Cuidamos da sua saúde com excelência e dedicação há mais de 15 anos.',
      industry: 'healthcare',
      website: 'https://vitalcare.com.br',

      branding: {
        logoUrl: 'https://images.unsplash.com/photo-1505751172876-fa1923c5c528?w=400',
        coverUrl: 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?q=80&w=1600&auto=format&fit=crop',
        primaryColor: '#10B981',
        secondaryColor: '#065F46',
        gallery: [
          'https://images.unsplash.com/photo-1576091160550-2173dba999ef?q=80&w=1200&auto=format&fit=crop',
          'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?q=80&w=1200&auto=format&fit=crop',
          'https://images.unsplash.com/photo-1559757175-5700dde675bc?q=80&w=1200&auto=format&fit=crop',
        ],
      },

      address: {
        street: 'Rua das Acácias',
        number: '789',
        complement: '3º Andar',
        neighborhood: 'Jardim Paulista',
        city: 'São Paulo',
        state: 'SP',
        zipCode: '01310-200',
        country: 'BR',
        coordinates: {
          lat: -23.5505,
          lng: -46.6333,
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

      rating: 4.9,
      reviewsCount: 412,
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
        id: 'pro_dr_carlos',
        name: 'Dr. Carlos Mendes',
        email: 'carlos.mendes@vitalcare.com.br',
        phone: '+5511988771111',
        bio: 'Fisioterapeuta especializado em reabilitação ortopédica e esportiva. CREFITO 123456-F. Mais de 12 anos de experiência.',
        avatarUrl: 'https://i.pravatar.cc/150?img=33',
        specialties: ['Fisioterapia', 'Reabilitação', 'Pilates'],
        rating: 4.9,
        totalReviews: 203,
      },
      {
        id: 'pro_dra_marina',
        name: 'Dra. Marina Silva',
        email: 'marina.silva@vitalcare.com.br',
        phone: '+5511988772222',
        bio: 'Nutricionista clínica e esportiva. CRN 45678. Especialista em emagrecimento saudável e nutrição funcional.',
        avatarUrl: 'https://i.pravatar.cc/150?img=45',
        specialties: ['Nutrição', 'Emagrecimento', 'Nutrição Esportiva'],
        rating: 5.0,
        totalReviews: 189,
      },
      {
        id: 'pro_dr_roberto',
        name: 'Dr. Roberto Tanaka',
        email: 'roberto.tanaka@vitalcare.com.br',
        phone: '+5511988773333',
        bio: 'Acupunturista e terapeuta em medicina tradicional chinesa. Especialista em tratamento de dor crônica e ansiedade.',
        avatarUrl: 'https://i.pravatar.cc/150?img=59',
        specialties: ['Acupuntura', 'Medicina Chinesa', 'Dor Crônica'],
        rating: 4.8,
        totalReviews: 156,
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
    console.log('🏥 Creating services...');
    const services = [
      {
        id: 'svc_fisio_avaliacao',
        name: 'Avaliação Fisioterapêutica',
        description: 'Avaliação completa com análise postural, testes funcionais e diagnóstico fisioterapêutico.',
        category: 'Fisioterapia',
        price: 15000, // R$ 150.00
        durationMinutes: 60,
        professionalIds: ['pro_dr_carlos'],
      },
      {
        id: 'svc_fisio_sessao',
        name: 'Sessão de Fisioterapia',
        description: 'Sessão individual de fisioterapia com tratamento personalizado para sua condição.',
        category: 'Fisioterapia',
        price: 18000, // R$ 180.00
        durationMinutes: 50,
        professionalIds: ['pro_dr_carlos'],
      },
      {
        id: 'svc_nutri_consulta',
        name: 'Consulta Nutricional',
        description: 'Consulta completa com avaliação antropométrica, anamnese e plano alimentar personalizado.',
        category: 'Nutrição',
        price: 25000, // R$ 250.00
        durationMinutes: 60,
        professionalIds: ['pro_dra_marina'],
      },
      {
        id: 'svc_nutri_retorno',
        name: 'Retorno Nutricional',
        description: 'Consulta de acompanhamento para ajustes no plano alimentar e avaliação de resultados.',
        category: 'Nutrição',
        price: 15000, // R$ 150.00
        durationMinutes: 40,
        professionalIds: ['pro_dra_marina'],
      },
      {
        id: 'svc_acupuntura',
        name: 'Sessão de Acupuntura',
        description: 'Sessão de acupuntura tradicional para tratamento de dores, ansiedade e outros desequilíbrios.',
        category: 'Acupuntura',
        price: 20000, // R$ 200.00
        durationMinutes: 50,
        professionalIds: ['pro_dr_roberto'],
      },
      {
        id: 'svc_pilates',
        name: 'Aula de Pilates',
        description: 'Aula individual de pilates com foco em fortalecimento, flexibilidade e consciência corporal.',
        category: 'Fisioterapia',
        price: 12000, // R$ 120.00
        durationMinutes: 50,
        professionalIds: ['pro_dr_carlos'],
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
