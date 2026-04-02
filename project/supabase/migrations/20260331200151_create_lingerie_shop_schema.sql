/*
  # Chambre 69 - Lingerie E-commerce Database Schema

  1. New Tables
    - `categories`
      - `id` (uuid, primary key)
      - `name` (text, unique)
      - `slug` (text, unique)
      - `description` (text)
      - `created_at` (timestamp)
    
    - `products`
      - `id` (uuid, primary key)
      - `category_id` (uuid, foreign key)
      - `name` (text)
      - `slug` (text, unique)
      - `description` (text)
      - `care_instructions` (text)
      - `image_url` (text)
      - `is_featured` (boolean)
      - `created_at` (timestamp)
    
    - `product_variants`
      - `id` (uuid, primary key)
      - `product_id` (uuid, foreign key)
      - `color` (text)
      - `sizes` (text array)
      - `created_at` (timestamp)

  2. Security
    - Enable RLS on all tables
    - Add public read access policies (no auth required for e-commerce)
    - No write access needed (products managed via admin)
*/

-- Create categories table
CREATE TABLE IF NOT EXISTS categories (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text UNIQUE NOT NULL,
  slug text UNIQUE NOT NULL,
  description text NOT NULL,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE categories ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view categories"
  ON categories FOR SELECT
  TO anon
  USING (true);

-- Create products table
CREATE TABLE IF NOT EXISTS products (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  category_id uuid REFERENCES categories(id) ON DELETE CASCADE,
  name text NOT NULL,
  slug text UNIQUE NOT NULL,
  description text NOT NULL,
  care_instructions text NOT NULL,
  image_url text NOT NULL,
  is_featured boolean DEFAULT false,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE products ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view products"
  ON products FOR SELECT
  TO anon
  USING (true);

-- Create product variants table
CREATE TABLE IF NOT EXISTS product_variants (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id uuid REFERENCES products(id) ON DELETE CASCADE,
  color text NOT NULL,
  sizes text[] NOT NULL,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE product_variants ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view product variants"
  ON product_variants FOR SELECT
  TO anon
  USING (true);

-- Insert categories
INSERT INTO categories (name, slug, description) VALUES
  ('Soutiens-gorge', 'soutiens-gorge', 'Maintien parfait, confort quotidien et mise en valeur naturelle de la silhouette'),
  ('Culottes & Strings', 'culottes-strings', 'Douceur, discrétion et élégance au quotidien'),
  ('Ensembles', 'ensembles', 'Harmonie, confiance et sensation de complétude'),
  ('Lingerie Sculptante', 'lingerie-sculptante', 'Maintien, structure et valorisation des courbes'),
  ('Bodys', 'bodys', 'Raffinement, maintien et allure sophistiquée'),
  ('Maillots de Bain', 'maillots-de-bain', 'Confiance, style et mise en valeur en toutes circonstances'),
  ('Lingerie de Nuit', 'lingerie-de-nuit', 'Confort, légèreté et bien-être intime'),
  ('Grande Taille', 'grande-taille', 'Adaptation parfaite, maintien et valorisation de toutes les morphologies'),
  ('Pièces Sensuelles', 'pieces-sensuelles', 'Affirmation de soi, élégance et confiance subtile')
ON CONFLICT (slug) DO NOTHING;

-- Insert sample featured products
INSERT INTO products (category_id, name, slug, description, care_instructions, image_url, is_featured)
SELECT 
  c.id,
  'Ensemble Dentelle Noir',
  'ensemble-dentelle-noir',
  'Un ensemble raffiné alliant dentelle délicate et coupe sophistiquée. Parfait pour révéler votre féminité avec élégance.',
  'Lavage à la main à 30°C. Ne pas repasser. Séchage à plat.',
  'https://images.pexels.com/photos/8129903/pexels-photo-8129903.jpeg?auto=compress&cs=tinysrgb&w=800',
  true
FROM categories c WHERE c.slug = 'ensembles'
ON CONFLICT (slug) DO NOTHING;

INSERT INTO products (category_id, name, slug, description, care_instructions, image_url, is_featured)
SELECT 
  c.id,
  'Soutien-gorge Balconnet Rose',
  'soutien-gorge-balconnet-rose',
  'Soutien-gorge balconnet au maintien parfait. Sa coupe élégante sublime naturellement votre silhouette.',
  'Lavage en machine à 30°C en filet de lavage. Ne pas utiliser de sèche-linge.',
  'https://images.pexels.com/photos/7148629/pexels-photo-7148629.jpeg?auto=compress&cs=tinysrgb&w=800',
  true
FROM categories c WHERE c.slug = 'soutiens-gorge'
ON CONFLICT (slug) DO NOTHING;

INSERT INTO products (category_id, name, slug, description, care_instructions, image_url, is_featured)
SELECT 
  c.id,
  'Body Dentelle Nude',
  'body-dentelle-nude',
  'Body élégant en dentelle délicate. Raffinement et maintien pour une allure sophistiquée.',
  'Lavage à la main à 30°C. Séchage à plat à l''ombre.',
  'https://images.pexels.com/photos/6463348/pexels-photo-6463348.jpeg?auto=compress&cs=tinysrgb&w=800',
  true
FROM categories c WHERE c.slug = 'bodys'
ON CONFLICT (slug) DO NOTHING;

INSERT INTO products (category_id, name, slug, description, care_instructions, image_url, is_featured)
SELECT 
  c.id,
  'Nuisette Satin Blanc',
  'nuisette-satin-blanc',
  'Nuisette en satin doux offrant confort et légèreté pour vos nuits.',
  'Lavage délicat à 30°C. Repasser à basse température si nécessaire.',
  'https://images.pexels.com/photos/6463430/pexels-photo-6463430.jpeg?auto=compress&cs=tinysrgb&w=800',
  true
FROM categories c WHERE c.slug = 'lingerie-de-nuit'
ON CONFLICT (slug) DO NOTHING;

INSERT INTO products (category_id, name, slug, description, care_instructions, image_url, is_featured)
SELECT 
  c.id,
  'String Dentelle Noir',
  'string-dentelle-noir',
  'String en dentelle raffinée alliant discrétion et élégance pour un confort absolu.',
  'Lavage à la main recommandé. Ne pas essorer.',
  'https://images.pexels.com/photos/7148624/pexels-photo-7148624.jpeg?auto=compress&cs=tinysrgb&w=800',
  true
FROM categories c WHERE c.slug = 'culottes-strings'
ON CONFLICT (slug) DO NOTHING;

INSERT INTO products (category_id, name, slug, description, care_instructions, image_url, is_featured)
SELECT 
  c.id,
  'Ensemble Rouge Passion',
  'ensemble-rouge-passion',
  'Ensemble audacieux pour affirmer votre sensualité avec confiance et élégance.',
  'Lavage à la main à 30°C. Ne pas repasser les parties en dentelle.',
  'https://images.pexels.com/photos/6463347/pexels-photo-6463347.jpeg?auto=compress&cs=tinysrgb&w=800',
  true
FROM categories c WHERE c.slug = 'pieces-sensuelles'
ON CONFLICT (slug) DO NOTHING;

-- Insert product variants
INSERT INTO product_variants (product_id, color, sizes)
SELECT p.id, 'Noir', ARRAY['XS', 'S', 'M', 'L', 'XL']
FROM products p WHERE p.slug = 'ensemble-dentelle-noir';

INSERT INTO product_variants (product_id, color, sizes)
SELECT p.id, 'Rose Nude', ARRAY['85B', '85C', '90B', '90C', '95B', '95C']
FROM products p WHERE p.slug = 'soutien-gorge-balconnet-rose';

INSERT INTO product_variants (product_id, color, sizes)
SELECT p.id, 'Nude', ARRAY['XS', 'S', 'M', 'L']
FROM products p WHERE p.slug = 'body-dentelle-nude';

INSERT INTO product_variants (product_id, color, sizes)
SELECT p.id, 'Blanc', ARRAY['S', 'M', 'L', 'XL']
FROM products p WHERE p.slug = 'nuisette-satin-blanc';

INSERT INTO product_variants (product_id, color, sizes)
SELECT p.id, 'Noir', ARRAY['XS', 'S', 'M', 'L', 'XL']
FROM products p WHERE p.slug = 'string-dentelle-noir';

INSERT INTO product_variants (product_id, color, sizes)
SELECT p.id, 'Rouge', ARRAY['S', 'M', 'L', 'XL']
FROM products p WHERE p.slug = 'ensemble-rouge-passion';