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

-- =====================================================
-- 1. Supprimer les tables existantes (optionnel, pour repartir de zéro)
-- Attention : cela efface toutes les données existantes !
-- =====================================================
DROP TABLE IF EXISTS product_variants;
DROP TABLE IF EXISTS products;
DROP TABLE IF EXISTS categories;

-- =====================================================
-- 2. Création des tables
-- =====================================================
CREATE TABLE categories (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text UNIQUE NOT NULL,
  slug text UNIQUE NOT NULL,
  description text NOT NULL,
  image_url text,  -- Pour l'image du bloc de catégorie
  created_at timestamptz DEFAULT now()
);

CREATE TABLE products (
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

CREATE TABLE product_variants (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id uuid REFERENCES products(id) ON DELETE CASCADE,
  color text NOT NULL,
  sizes text[] NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- =====================================================
-- 3. Activation de RLS et politiques de lecture publique
-- =====================================================
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE product_variants ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can view categories" ON categories FOR SELECT TO anon USING (true);
CREATE POLICY "Public can view products" ON products FOR SELECT TO anon USING (true);
CREATE POLICY "Public can view variants" ON product_variants FOR SELECT TO anon USING (true);

-- =====================================================
-- 4. Insertion des catégories (9)
-- =====================================================
INSERT INTO categories (name, slug, description, image_url) VALUES
  ('Bodys', 'bodys', 'Raffinement, maintien et allure sophistiquée', 'https://img01.ztat.net/article/spp-media-p1/73f799eb3e954f2398009e4eb7519b99/22ab062832924a0cabd7f9c75fb33dc7.jpg?imwidth=762'),
  ('Culottes & Strings', 'culottes-strings', 'Douceur, discrétion et élégance au quotidien', 'https://www.innee-lingerie.com/2252-home_default/culotte-string-en-tulle-transparent.jpg'),
  ('Ensembles', 'ensembles', 'Harmonie, confiance et sensation de complétude', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRg5kbLaB2KWyKupNVV5Q1E0qVt27kYsOTs_Q&s'),
  ('Grande Taille', 'grande-taille', 'Adaptation parfaite, maintien et valorisation de toutes les morphologies', 'https://static.kiabi.com/images/soutien-gorge-grande-taille-douce---rougegorge-lingerie-noir-multicolore-fpa05_1_hd1.jpg?width=800'),
  ('Lingerie de Nuit', 'lingerie-de-nuit', 'Confort, légèreté et bien-être intime', 'https://cdn.shopify.com/s/files/1/0276/4777/0659/files/2GENEVIEVEBABYDOLL.jpg?crop=center&format=webp&height=518&quality=80&v=1752479513&width=345'),
  ('Lingerie Sculptante', 'lingerie-sculptante', 'Maintien, structure et valorisation des courbes', 'https://cdn.lamodeuse.com/163230-home_default/body-sculptant-a-decollete-en-u-beige.jpg'),
  ('Maillots de Bain', 'maillots-de-bain', 'Confiance, style et mise en valeur en toutes circonstances', 'https://media.cdnws.com/_i/236867/6211/3858/13/in-x-bikini-imprim-floral-maillot-de-bain-femme-triangle-taille-haute.jpeg'),
  ('Pièces Sensuelles', 'pieces-sensuelles', 'Affirmation de soi, élégance et confiance subtile', 'https://i0.wp.com/www.youreleganceshop.com/wp-content/uploads/2024/02/ensemble-lingerie-sexy-4-pieces-dentelle-youreleganceshop.png?fit=1092%2C1456&ssl=1'),
  ('Soutiens-gorge', 'soutiens-gorge', 'Maintien parfait, confort quotidien et mise en valeur naturelle de la silhouette', 'https://images.ctfassets.net/3zzevkhc8io9/50Yh62li1eSikEF3a4e7uq/16cc2ea443bcf1ace3629fe4d088fedc/Low-ca_0161330_COG_0561331_COG_3.jpg?fit=fill&fm=jpg&q=50&w=1600')
ON CONFLICT (slug) DO NOTHING;

-- =====================================================
-- 5. Insertion massive de produits (20 par catégorie)
-- =====================================================

DO $$
DECLARE
    cat_record RECORD;
    i INTEGER;
    product_name TEXT;
    product_slug TEXT;
    product_desc TEXT;
    product_care TEXT;
    product_image TEXT;
    color_choice TEXT;
    sizes_array TEXT[];
    product_id_var UUID;
    image_index INTEGER;
BEGIN
    FOR cat_record IN SELECT id, slug FROM categories LOOP
        FOR i IN 1..20 LOOP
            -- Générer un nom et slug uniques
            product_name := initcap(cat_record.slug) || ' Modèle ' || i;
            product_slug := cat_record.slug || '-modele-' || i;
            product_desc := 'Découvrez ce magnifique produit de la catégorie ' || cat_record.slug || '. Alliant confort et élégance, il sublimera votre quotidien.';
            product_care := 'Lavage à la main recommandé à 30°C. Séchage à plat à l''ombre. Ne pas utiliser de sèche-linge.';
            
            -- Sélectionner une image différente selon l'index pour varier
            image_index := i % 5;
            CASE cat_record.slug
                WHEN 'bodys' THEN
                    product_image := CASE image_index
                        WHEN 0 THEN 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRPy3xg11qozbxLDwA_IAvQyQH_N3m1bTq4Kw&s'
                        WHEN 1 THEN 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSOJz548behBR8eOVlE-uu_GE1KX1YrQV7bJA&s'
                        WHEN 2 THEN 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRcQJnIoFXjudYijtlux7C3V4oX4oxegvnIvw&s'
                        WHEN 3 THEN 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSm1vkB4IeZhLIr_kfZmNno3nx5CYmOS0Rx-Q&s'
                        ELSE 'https://cdn.aboutstatic.com/file/images/35920b25a32f15337a3d718a1582d36e.jpg?quality=75&height=480&width=360'
                    END;
                WHEN 'culottes-strings' THEN
                    product_image := CASE image_index
                        WHEN 0 THEN 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTK3KAyBBnFfbqqKNR_588qfedtKd9B0wXjgA&s'
                        WHEN 1 THEN 'https://m.media-amazon.com/images/I/71b1q+jDiRL._AC_UF1000,1000_QL80_.jpg'
                        WHEN 2 THEN 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSfRKHWWkorLxCLIvDw0elt1DxoNJMrKc9L9A&s'
                        WHEN 3 THEN 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTe7B8kJyY2hzOsM1KkdyfZQWBt-7tuob7FaA&s'
                        ELSE 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRbj7PPFbK-yrNMUS7TvmtK3_F7MNlFSvlJWQ&s'
                    END;
                WHEN 'ensembles' THEN
                    product_image := CASE image_index
                        WHEN 0 THEN 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSBCS4kv3XpAN8Y3PZdy8gCshjvIVNr8Q9DZw&s'
                        WHEN 1 THEN 'https://cdn.shopify.com/s/files/1/0276/4777/0659/files/1.HotPinkTwo-ToneBlossomBra_Thong-Adison.jpg?crop=center&format=webp&height=518&quality=80&v=1710258674&width=345'
                        WHEN 2 THEN 'https://i0.wp.com/www.youreleganceshop.com/wp-content/uploads/2023/01/ensemble-lingerie-sexy-4-pieces.jpg?fit=900%2C1198&ssl=1'
                        WHEN 3 THEN 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTRXhUck72VhinimRY8OfCjRlmk9dzrXMakcQ&s'
                        ELSE 'https://cdn.cocote.com/media/cache/product_main_image/storage/images/offers/4182/roza-anuk-ensemble-lingerie-sexy-femme-blanc-soutien-gorge-soft-et-culotte-sur-commande/4-1ade.jpg.webp'
                    END;
                WHEN 'grande-taille' THEN
                    product_image := 'https://m.media-amazon.com/images/I/61LHtRZi7-L._AC_UF1000,1000_QL80_.jpg';
                WHEN 'lingerie-de-nuit' THEN
                    product_image := CASE image_index
                        WHEN 0 THEN 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR7iHbXHh04GYiBwZqMZvvgcxrAMj7ss0zveA&s'
                        WHEN 1 THEN 'https://iris-lingerie.com/cdn/shop/files/Cassie1.jpg?v=1762701089&width=1000'
                        WHEN 2 THEN 'https://m.media-amazon.com/images/I/619HWeJsjiL._AC_UY1000_.jpg'
                        WHEN 3 THEN 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQYPsFZg4aJImLDLS0RVVpOlG2-jZCQuKQT5A&s'
                        ELSE 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSljaNprHJetsKYIDy-dtAPfR1-qMNzvwHF9A&s'
                    END;
                WHEN 'lingerie-sculptante' THEN
                    product_image := 'https://fac.img.pmdstatic.net/scale/http.3A.2F.2Fprd2-bone-image.2Es3-website-eu-west-1.2Eamazonaws.2Ecom.2FFAC.2F2019.2F09.2F20.2F144599e1-7bfb-4d2c-901a-6f3e98e101ce.2Ejpeg/autox450/quality/65/crop-from/center/picture.jpeg';
                WHEN 'maillots-de-bain' THEN
                    product_image := CASE image_index
                        WHEN 0 THEN 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS8MDDqrnfFEVMx5RmXdwEojdjsFX-Ekx3bzg&s'
                        WHEN 1 THEN 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT4cF4EuTIolKTsTJ_Ow9JExPCq-8_pBy5Ixg&s'
                        WHEN 2 THEN 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS2wqqqoh2YM_ffneD3p8-t4kPudQH3eijrSA&s'
                        WHEN 3 THEN 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTyejJzUIN9Aln7dXkk7W2NcAlXJZS50AiLbw&s'
                        ELSE 'https://otherskin.fr/cdn/shop/files/maillot_de_bain_natation_femme_08116f0c-fbb0-4d88-a7eb-d13b480ec3b0.webp?v=1695908819&width=1125'
                    END;
                WHEN 'pieces-sensuelles' THEN
                    product_image := CASE image_index
                        WHEN 0 THEN 'https://m.media-amazon.com/images/I/71nufnz+u8L._AC_UY1000_.jpg'
                        WHEN 1 THEN 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSB79PPHiYkRc1qqQKy720fDTv7SUDq4p2l0w&s'
                        WHEN 2 THEN 'https://louna-shop.com/cdn/shop/files/31.png?v=1713084826&width=1445'
                        WHEN 3 THEN 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSUgWuT8Br4ac1sapX_aHLMtY8bnAGfczjl2A&s'
                        ELSE 'https://m.media-amazon.com/images/I/61jItIbSI7L._AC_UY1000_.jpg'
                    END;
                WHEN 'soutiens-gorge' THEN
                    product_image := CASE image_index
                        WHEN 0 THEN 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRanMcHusfph-V1dQ0Jwqd419XTlLUBHXRXtg&s'
                        WHEN 1 THEN 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRbJ-B7Q_F39hbH3p_Ejo8m8miK3uiUxRViCg&s'
                        WHEN 2 THEN 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTcHZVh9dSjzbZ-BeWMx9c-CvGm40zk5F8G1w&s'
                        WHEN 3 THEN 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRhD0zL1WC0n9aS2emaSuiVPtuDjQNmjAMfDQ&s'
                        ELSE 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSxdi6Vo2GYHJEuo224qpq1QqQs5UDO1QPejw&s'
                    END;
                ELSE
                    product_image := 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ8DhHYOJS0uo7P78ZE--3xV91yOkttXUEDsw&s';
            END CASE;
            
            -- Insérer le produit
            INSERT INTO products (category_id, name, slug, description, care_instructions, image_url, is_featured)
            VALUES (cat_record.id, product_name, product_slug, product_desc, product_care, product_image, false)
            RETURNING id INTO product_id_var;
            
            -- Déterminer la couleur et les tailles
            IF i % 3 = 0 THEN color_choice := 'Noir';
            ELSIF i % 3 = 1 THEN color_choice := 'Blanc';
            ELSE color_choice := 'Beige';
            END IF;
            
            -- Tailles spécifiques selon la catégorie
            IF cat_record.slug = 'soutiens-gorge' THEN
                sizes_array := ARRAY['85B', '85C', '90B', '90C', '95B', '95C'];
            ELSIF cat_record.slug = 'maillots-de-bain' THEN
                sizes_array := ARRAY['XS', 'S', 'M', 'L', 'XL', 'XXL'];
            ELSE
                sizes_array := ARRAY['XS', 'S', 'M', 'L', 'XL'];
            END IF;
            
            -- Insérer le variant
            INSERT INTO product_variants (product_id, color, sizes)
            VALUES (product_id_var, color_choice, sizes_array);
        END LOOP;
    END LOOP;
END $$;

-- =====================================================
-- 6. Option : marquer quelques produits comme "featured"
-- =====================================================
UPDATE products SET is_featured = true
WHERE slug IN (
  'bodys-modele-1', 'culottes-strings-modele-2', 'ensembles-modele-3',
  'lingerie-de-nuit-modele-4', 'pieces-sensuelles-modele-5', 'soutiens-gorge-modele-6'
);