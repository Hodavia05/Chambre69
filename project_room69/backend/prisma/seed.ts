import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  // Clean DB
  await prisma.productVariant.deleteMany();
  await prisma.product.deleteMany();
  await prisma.category.deleteMany();

  const categories = [
    { name: 'Bodys', slug: 'bodys', image_url: 'http://localhost:5000/images/Ysabel Mora/10138-1-tanga-encaje-mujer-ysabel-mora-cava.jpg' },
    { name: 'Culottes & Strings', slug: 'culottes-strings', image_url: 'http://localhost:5000/images/Elomi/slips/slip1.jpg' },
    { name: 'Ensembles', slug: 'ensembles', image_url: 'http://localhost:5000/images/Dita von teese/ensemble1.jpg' },
    { name: 'Grande Taille', slug: 'grande-taille', image_url: 'http://localhost:5000/images/curvy kate/grande-taille1.jpg' },
    { name: 'Lingerie de Nuit', slug: 'lingerie-de-nuit', image_url: 'http://localhost:5000/images/Wacoal/nuit1.jpg' },
    { name: 'Lingerie Sculptante', slug: 'lingerie-sculptante', image_url: 'http://localhost:5000/images/Fantasie/sculpt1.jpg' },
    { name: 'Maillots de Bain', slug: 'maillots-de-bain', image_url: 'http://localhost:5000/images/Freya/bain1.jpg' },
    { name: 'Pièces Sensuelles', slug: 'pieces-sensuelles', image_url: 'http://localhost:5000/images/Louisa bracq/sensuelle1.jpg' },
    { name: 'Soutiens-gorge', slug: 'soutiens-gorge', image_url: 'http://localhost:5000/images/Elomi/soutien gorge/Soutien gorge collection taegan/TEAGAN_RAINBOW_UW-PADDED-HALF-CUP-BRA_EL302615_CUTOUT_WEB_SS26.jpg' }
  ];

  const createdCategories = [];
  for (const cat of categories) {
    const c = await prisma.category.create({
      data: {
        name: cat.name,
        slug: cat.slug,
        image_url: cat.image_url,
        description: `Collection de ${cat.name}`
      }
    });
    createdCategories.push(c);
  }

  const products = [
    {
      name: 'Soutien-gorge Taegan Rainbow',
      slug: 'soutien-gorge-taegan-rainbow',
      category_id: createdCategories[8].id,
      description: 'Magnifique soutien-gorge de la collection Taegan Rainbow par Elomi.',
      image_url: 'http://localhost:5000/images/Elomi/soutien gorge/Soutien gorge collection taegan/TEAGAN_RAINBOW_UW-PADDED-HALF-CUP-BRA_EL302615_CUTOUT_WEB_SS26.jpg',
      is_featured: true,
      variants: [{ color: 'Rainbow', sizes: ['90D', '95E', '100F'] }]
    },
    {
      name: 'Body Dentelle Elégance',
      slug: 'body-dentelle-elegance',
      category_id: createdCategories[0].id,
      description: 'Body en dentelle raffinée pour sublimer votre silhouette.',
      image_url: 'http://localhost:5000/images/Ysabel Mora/body1.jpg',
      is_featured: true,
      variants: [{ color: 'Noir', sizes: ['S', 'M', 'L'] }]
    }
  ];

  for (const prod of products) {
    await prisma.product.create({
      data: {
        name: prod.name,
        slug: prod.slug,
        category_id: prod.category_id,
        description: prod.description,
        image_url: prod.image_url,
        is_featured: prod.is_featured,
        variants: {
          create: prod.variants
        }
      }
    });
  }

  console.log('Seed completed successfully');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
