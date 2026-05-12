import { PrismaClient } from '@prisma/client';
import fs from 'fs';
import path from 'path';
import crypto from 'crypto';

const prisma = new PrismaClient();

const ROOT_PATH = path.join(__dirname, '../../..');

// Explicitly exclude these folders from being treated as brands
const EXCLUDED_FOLDERS = ['.git', 'project_room69', 'node_modules', 'backend', '.gemini', 'artifacts'];

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
    if (item.isDirectory() && !item.name.startsWith('.') && !EXCLUDED_FOLDERS.includes(item.name)) {
      const brandName = item.name.trim();
      console.log(`Processing folder as brand: "${brandName}"`);
      
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
      if (!subcategory) {
        // First level folder is subcategory
        await scanAndCreateProducts(fullPath, brandId, categoryId, item.name, collection);
      } else {
        // Any deeper folder is treated as a collection
        // We accumulate collection name if it's multiple levels deep
        const newCollection = collection ? `${collection} - ${item.name}` : item.name;
        await scanAndCreateProducts(fullPath, brandId, categoryId, subcategory, newCollection);
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
  
  // Improved collection cleaning
  if (cleanCol) {
    cleanCol = cleanCol.replace(/collection/gi, '').trim();
    // Remove extra dashes if any
    cleanCol = cleanCol.replace(/-+/g, '-').replace(/^-|-$/g, '').trim();
    if (cleanCol) {
      cleanCol = cleanCol.charAt(0).toUpperCase() + cleanCol.slice(1);
    } else {
      cleanCol = undefined;
    }
  }

  // Ensure slug is unique and safe
  const brandPart = brandId.substring(0,4);
  const slug = `p-${brandPart}-${hash}`;

  try {
    await prisma.product.create({
      data: {
        name: fileName,
        slug: slug,
        brand_id: brandId,
        subcategory: cleanSub,
        collection: cleanCol || 'Général',
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
