import { prisma } from '../src/lib/prisma.js';
import { hashPassword } from '../src/lib/auth.js';

async function main() {
  console.log('Seeding database...');

  const org = await prisma.organization.upsert({
    where: { slug: 'aurum' },
    update: {},
    create: {
      name: 'AurumClass University',
      slug: 'aurum',
      logo: 'https://api.dicebear.com/7.x/shapes/svg?seed=aurum',
    },
  });

  console.log(`Created organization: ${org.name}`);

  const admin = await prisma.user.upsert({
    where: { email: 'admin@aurumclass.pro' },
    update: {},
    create: {
      email: 'admin@aurumclass.pro',
      password: await hashPassword('admin123'),
      name: 'Aurum Admin',
      role: 'ADMIN',
      organizationId: org.id,
    },
  });

  console.log(`Created admin user: ${admin.name}`);

  console.log('Seeding completed!');

  // Create some events
  await prisma.systemEvent.createMany({
    data: [
      { title: 'Inicio de Semestre', description: 'Ceremonia de bienvenida en el auditorio.', type: 'INFO' },
      { title: 'Actualización de Plataforma', description: 'Se integró el módulo de Google Classroom.', type: 'SUCCESS' },
    ]
  });
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    // Adapter cleanup if needed, but here we just exit
    process.exit(0);
  });
