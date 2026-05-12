import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { PrismaClient } from '@prisma/client';

dotenv.config();

const app = express();
const prisma = new PrismaClient();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Serve static images from the repository folders
// Assumes images are in the parent directory of project_room69
app.use('/images', express.static(path.join(__dirname, '../../..')));

// Routes
app.get('/api/categories', async (req, res) => {
  try {
    const categories = await prisma.category.findMany({
      orderBy: { name: 'asc' }
    });
    res.json(categories);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch categories' });
  }
});

app.get('/api/products', async (req, res) => {
  try {
    const { category_id, featured } = req.query;
    const where: any = {};
    
    if (category_id) where.category_id = category_id as string;
    if (featured === 'true') where.is_featured = true;

    const products = await prisma.product.findMany({
      where,
      include: {
        variants: true
      },
      orderBy: { created_at: 'desc' }
    });
    res.json(products);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch products' });
  }
});

app.get('/api/products/:slug', async (req, res) => {
  try {
    const { slug } = req.params;
    const product = await prisma.product.findUnique({
      where: { slug },
      include: {
        variants: true,
        category: true
      }
    });
    if (!product) return res.status(404).json({ error: 'Product not found' });
    res.json(product);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch product' });
  }
});

app.get('/api/shop-data', async (req, res) => {
  try {
    const categories = await prisma.category.findMany({
      orderBy: { name: 'asc' }
    });
    
    const products = await prisma.product.findMany({
      include: {
        variants: true
      }
    });

    const productsByCategory: Record<string, any[]> = {};
    categories.forEach(cat => {
      productsByCategory[cat.id] = products
        .filter(p => p.category_id === cat.id)
        .map(p => ({
          ...p,
          variant: p.variants[0] // Just take the first variant for the shop display
        }));
    });

    res.json({
      categories,
      productsByCategory
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch shop data' });
  }
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
