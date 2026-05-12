import { PrismaClient } from '@prisma/client';
import fs from 'fs';
import path from 'path';
import crypto from 'crypto';

const prisma = new PrismaClient();

const ROOT_PATH = path.join(__dirname, '../../..');

async function main() {
  console.log('Starting dynamic seeding with full architecture scan...');
  
  await prisma.productVariant.deleteMany();
  await prisma.product.deleteMany();
  await prisma.brand.deleteMany();
  await prisma.category.deleteMany();

  const defaultCategory = await prisma.category.create({
    data: { name: 'Lingerie', slug: 'lingerie', description: 'Toute la lingerie' }
  });

  const rootItems = fs.readdirSync(ROOT_PATH, { withFileTypes: true });
  
  for (const item of rootItems) {
    if (item.isDirectory() && !item.name.startsWith('.') && item.name !== 'project_room69' && item.name !== 'node_modules') {
      const brandName = item.name.trim(); // We'll use the trimmed name for display but path needs the real name
      console.log(`Processing folder as brand: "${item.name}"`);
      
      const brand = await prisma.brand.create({
        data: {
          name: brandName,
          description: `Collection ${brandName}`
        }
      });

      const brandPath = path.join(ROOT_PATH, item.name);
      await scanAndCreateProducts(brandPath, brand.id, defaultCategory.id);

      // Update brand with a representative image
      const firstProduct = await prisma.product.findFirst({
        where: { brand_id: brand.id },
        select: { image_url: true }
      });
      if (firstProduct) {
        await prisma.brand.update({
          where: { id: brand.id },
          data: { image_url: firstProduct.image_url }
        });
      }
    }
  }

  console.log('Dynamic seed completed successfully');
}

async function scanAndCreateProducts(dir: string, brandId: string, categoryId: string, subcategory?: string, collection?: string) {
  const items = fs.readdirSync(dir, { withFileTypes: true });
  
  for (const item of items) {
    const fullPath = path.join(dir, item.name);
    
    if (item.isDirectory()) {
      // Determine if this is a subcategory or a collection
      // Strategy: if we don't have a subcategory yet, this is likely one.
      // If we have a subcategory but no collection, this is a collection.
      if (!subcategory) {
        await scanAndCreateProducts(fullPath, brandId, categoryId, item.name, collection);
      } else if (!collection) {
        await scanAndCreateProducts(fullPath, brandId, categoryId, subcategory, item.name);
      } else {
        // Deeply nested collection or images
        await scanAndCreateProducts(fullPath, brandId, categoryId, subcategory, collection);
      }
    } else if (item.isFile() && isImage(item.name)) {
      await createProduct(fullPath, brandId, categoryId, subcategory, collection);
    }
  }
}

async function createProduct(filePath: string, brandId: string, categoryId: string, subcategory?: string, collection?: string) {
  const relativePath = path.relative(ROOT_PATH, filePath).replace(/\\/g, '/');
  const fileName = path.basename(filePath, path.extname(filePath));
  const hash = crypto.createHash('md5').update(relativePath).digest('hex').substring(0, 6);
  
  // Clean up names
  const cleanSub = subcategory ? subcategory.trim() : undefined;
  let cleanCol = collection ? collection.trim() : undefined;
  if (cleanCol && cleanCol.toLowerCase().includes('collection')) {
    cleanCol = cleanCol.replace(/collection/i, '').trim();
    cleanCol = cleanCol.charAt(0).toUpperCase() + cleanCol.slice(1);
  }

  const slugBasis = `${brandId.substring(0,4)}-${cleanSub || 'main'}-${cleanCol || 'none'}-${fileName}`.toLowerCase().replace(/\s+/g, '-');
  const slug = `${slugBasis}-${hash}`;

  try {
    await prisma.product.create({
      data: {
        name: fileName,
        slug: slug,
        brand_id: brandId,
        subcategory: cleanSub,
        collection: cleanCol,
        category_id: categoryId,
        image_url: `http://localhost:5000/images/${relativePath}`,
        variants: {
          create: [{ color: 'Standard', sizes: ['S', 'M', 'L'] }]
        }
      }
    });
  } catch (e) {
    // console.error(`Error creating product for ${relativePath}:`, e);
  }
}

function isImage(filename: string): boolean {
  const ext = path.extname(filename).toLowerCase();
  return ['.jpg', '.jpeg', '.png', '.webp', '.avif'].includes(ext);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
