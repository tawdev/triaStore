const mysql = require('mysql2/promise');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../.env') });

async function seed() {
    const connection = await mysql.createConnection({
        host: process.env.DB_HOST || 'localhost',
        user: process.env.DB_USERNAME || 'root',
        password: process.env.DB_PASSWORD || '',
        database: process.env.DB_NAME || 'droguerie_db',
    });

    console.log('Connected to MySQL database!');

    try {
        // 1. Categories
        const categories = [
            { name: 'Suspensions', description: 'Luminaires suspendus pour plafonds hauts et espaces ouverts.', imageUrl: 'https://images.unsplash.com/photo-1540932239986-30128078f3c5?auto=format&fit=crop&q=80&w=800' },
            { name: 'Plafonniers', description: 'Éclairage direct et indirect pour une ambiance épurée.', imageUrl: 'https://images.unsplash.com/photo-1565814329452-e1efa11c5b89?auto=format&fit=crop&q=80&w=800' },
            { name: 'Appliques Murales', description: 'Accents lumineux pour sublimer vos murs et couloirs.', imageUrl: 'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?auto=format&fit=crop&q=80&w=800' },
            { name: 'Lampes à Poser', description: 'Sculptures lumineuses pour bureaux, consoles et tables de nuit.', imageUrl: 'https://images.unsplash.com/photo-1534073828943-f801091bb18c?auto=format&fit=crop&q=80&w=800' },
            { name: 'Éclairage Extérieur', description: 'Mise en lumière de vos jardins, terrasses et façades.', imageUrl: 'https://images.unsplash.com/photo-1563298723-dcfebaa392e3?auto=format&fit=crop&q=80&w=800' }
        ];

        console.log('Inserting Tria categories...');
        const categoryIds = {};
        for (const cat of categories) {
            const [existing] = await connection.execute('SELECT id FROM categories WHERE name = ?', [cat.name]);
            if (existing.length === 0) {
                const [result] = await connection.execute(
                    'INSERT INTO categories (name, description, imageUrl, isActive, createdAt) VALUES (?, ?, ?, ?, NOW())',
                    [cat.name, cat.description, cat.imageUrl, true]
                );
                categoryIds[cat.name] = result.insertId;
            } else {
                categoryIds[cat.name] = existing[0].id;
            }
        }

        // 2. Brands
        const brands = [
            { name: 'Tria Signature', logo: '' },
            { name: 'Artemis Design', logo: '' },
            { name: 'Luxura Atelier', logo: '' },
            { name: 'Crystal & Co', logo: '' },
            { name: 'L\'Atelier Lumineux', logo: '' }
        ];

        console.log('Inserting Tria brands...');
        const brandIds = {};
        for (const brand of brands) {
            const [existing] = await connection.execute('SELECT id FROM brands WHERE name = ?', [brand.name]);
            if (existing.length === 0) {
                const [result] = await connection.execute(
                    'INSERT INTO brands (name, logoUrl, isActive, createdAt) VALUES (?, ?, ?, NOW())',
                    [brand.name, brand.logo, true]
                );
                brandIds[brand.name] = result.insertId;
            } else {
                brandIds[brand.name] = existing[0].id;
            }
        }

        // 3. Products (20 Luxury Items)
        const products = [
            // Suspensions
            { name: 'Suspension Cristalline Royale', price: 8500, stock: 5, categoryName: 'Suspensions', brandName: 'Crystal & Co', description: 'Une cascade de cristal pur montée sur une structure en laiton doré 24 carats.', imageUrl: 'https://images.unsplash.com/photo-1542728928-1413eead4392?auto=format&fit=crop&q=80&w=800' },
            { name: 'Halo Minimaliste Noir Mat', price: 3200, stock: 12, categoryName: 'Suspensions', brandName: 'Tria Signature', description: 'Un anneau de lumière LED ultra-fin pour une architecture contemporaine.', imageUrl: 'https://images.unsplash.com/photo-1513506003901-1e6a229e2d15?auto=format&fit=crop&q=80&w=800' },
            { name: 'Pendant Goutte d\'Or', price: 4500, stock: 8, categoryName: 'Suspensions', brandName: 'Luxura Atelier', description: 'Suspension organique en verre soufflé à la bouche avec inclusions de feuilles d\'or.', imageUrl: 'https://images.unsplash.com/photo-1540932239986-30128078f3c5?auto=format&fit=crop&q=80&w=800' },
            { name: 'Cascade de Verre Venitien', price: 12000, stock: 3, categoryName: 'Suspensions', brandName: 'Crystal & Co', description: 'Chef-d\'œuvre artisanal composé de 50 pièces de verre Murano.', imageUrl: 'https://images.unsplash.com/photo-1565814329452-e1efa11c5b89?auto=format&fit=crop&q=80&w=800' },

            // Plafonniers
            { name: 'Plafonnier Orbite Solaire', price: 2800, stock: 15, categoryName: 'Plafonniers', brandName: 'Artemis Design', description: 'Éclairage indirect créant un halo doux sur le plafond.', imageUrl: 'https://images.unsplash.com/photo-1517991104123-1d56a6e81ed9?auto=format&fit=crop&q=80&w=800' },
            { name: 'Plafonnier Cubisme Bronze', price: 3900, stock: 10, categoryName: 'Plafonniers', brandName: 'L\'Atelier Lumineux', description: 'Géométrie architecturale en bronze brossé et diffuseur opale.', imageUrl: 'https://images.unsplash.com/photo-1534073828943-f801091bb18c?auto=format&fit=crop&q=80&w=800' },
            { name: 'Ciel Étoilé LED Intégré', price: 5600, stock: 6, categoryName: 'Plafonniers', brandName: 'Tria Signature', description: 'Panneau discret incrusté de points lumineux fibre optique.', imageUrl: 'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?auto=format&fit=crop&q=80&w=800' },

            // Appliques Murales
            { name: 'Applique Éclipse Marbre', price: 1950, stock: 20, categoryName: 'Appliques Murales', brandName: 'Luxura Atelier', description: 'Disque en marbre de Carrare rétro-éclairé.', imageUrl: 'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?auto=format&fit=crop&q=80&w=800' },
            { name: 'Flambeau Moderne Laiton', price: 1450, stock: 25, categoryName: 'Appliques Murales', brandName: 'L\'Atelier Lumineux', description: 'Design vertical élancé avec une finition laiton antique.', imageUrl: 'https://images.unsplash.com/photo-1513506003901-1e6a229e2d15?auto=format&fit=crop&q=80&w=800' },
            { name: 'Applique Linéaire Slim', price: 1200, stock: 30, categoryName: 'Appliques Murales', brandName: 'Tria Signature', description: 'Ligne de lumière pure pour sublimer les textures murales.', imageUrl: 'https://images.unsplash.com/photo-1540932239986-30128078f3c5?auto=format&fit=crop&q=80&w=800' },
            { name: 'Applique Sculpture Bronze', price: 3200, stock: 7, categoryName: 'Appliques Murales', brandName: 'Crystal & Co', description: 'Une pièce d\'art murale qui diffuse une lumière chaleureuse.', imageUrl: 'https://images.unsplash.com/photo-1565814329452-e1efa11c5b89?auto=format&fit=crop&q=80&w=800' },

            // Lampes à Poser
            { name: 'Lampe de Bureau Avant-Garde', price: 2200, stock: 12, categoryName: 'Lampes à Poser', brandName: 'Artemis Design', description: 'Équilibre parfait entre forme et fonction pour votre espace de travail.', imageUrl: 'https://images.unsplash.com/photo-1534073828943-f801091bb18c?auto=format&fit=crop&q=80&w=800' },
            { name: 'Lampe de Chevet Onyx', price: 1800, stock: 18, categoryName: 'Lampes à Poser', brandName: 'Luxura Atelier', description: 'Socle en onyx véritable diffusant une lueur naturelle apaisante.', imageUrl: 'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?auto=format&fit=crop&q=80&w=800' },
            { name: 'Sphère Lumineuse Nomade', price: 950, stock: 40, categoryName: 'Lampes à Poser', brandName: 'Tria Signature', description: 'Lampe sans fil rechargeable avec 3 intensités d\'éclairage.', imageUrl: 'https://images.unsplash.com/photo-1513506003901-1e6a229e2d15?auto=format&fit=crop&q=80&w=800' },
            { name: 'Lampe Colonne Verre Sablé', price: 2600, stock: 9, categoryName: 'Lampes à Poser', brandName: 'L\'Atelier Lumineux', description: 'Un pilier de lumière douce pour votre console d\'entrée.', imageUrl: 'https://images.unsplash.com/photo-1540932239986-30128078f3c5?auto=format&fit=crop&q=80&w=800' },
            { name: 'Sculpture de Table Argent', price: 4800, stock: 4, categoryName: 'Lampes à Poser', brandName: 'Artemis Design', description: 'Finition argent poli pour un reflet spectaculaire de la lumière.', imageUrl: 'https://images.unsplash.com/photo-1517991104123-1d56a6e81ed9?auto=format&fit=crop&q=80&w=800' },

            // Éclairage Extérieur
            { name: 'Borne de Jardin Sentinelle', price: 1650, stock: 20, categoryName: 'Éclairage Extérieur', brandName: 'Tria Signature', description: 'Résistante aux intempéries avec un design architectural noir anthracite.', imageUrl: 'https://images.unsplash.com/photo-1563298723-dcfebaa392e3?auto=format&fit=crop&q=80&w=800' },
            { name: 'Projecteur Façade Majestic', price: 3400, stock: 10, categoryName: 'Éclairage Extérieur', brandName: 'L\'Atelier Lumineux', description: 'Puissance et précision pour magnifier l\'architecture extérieure.', imageUrl: 'https://images.unsplash.com/photo-1513506003901-1e6a229e2d15?auto=format&fit=crop&q=80&w=800' },
            { name: 'Lanterne Contemporaine Verre', price: 2100, stock: 15, categoryName: 'Éclairage Extérieur', brandName: 'Artemis Design', description: 'Réinterprétation moderne de la lanterne classique pour votre terrasse.', imageUrl: 'https://images.unsplash.com/photo-1540932239986-30128078f3c5?auto=format&fit=crop&q=80&w=800' },
            { name: 'Guirlande LED Luxe 10m', price: 850, stock: 50, categoryName: 'Éclairage Extérieur', brandName: 'Tria Signature', description: 'Câble haute résistance avec ampoules LED blanc chaud.', imageUrl: 'https://images.unsplash.com/photo-1517991104123-1d56a6e81ed9?auto=format&fit=crop&q=80&w=800' }
        ];

        console.log('Inserting Tria products...');
        for (const prod of products) {
            const catId = categoryIds[prod.categoryName];
            const brandId = brandIds[prod.brandName];
            if (!catId) continue;

            const [existing] = await connection.execute('SELECT id FROM products WHERE name = ?', [prod.name]);
            if (existing.length === 0) {
                await connection.execute(
                    'INSERT INTO products (name, sku, price, stock, categoryId, brandId, description, imageUrl, salesCount, oldPrice, onSale, ecoFriendly, tags, createdAt, updatedAt) VALUES (?, ?, ?, ?, ?, ?, ?, ?, 0, null, false, true, ?, NOW(), NOW())',
                    [prod.name, 'TRIA-' + Math.random().toString(36).substr(2, 6).toUpperCase(), prod.price, prod.stock, catId, brandId, prod.description, prod.imageUrl, '["Signature", "Luxe"]']
                );
                console.log(`Added product: ${prod.name}`);
            } else {
                console.log(`Product exists: ${prod.name}`);
            }
        }

        console.log('Successfully seeded database with Tria Lampe luxury data!');
    } catch (err) {
        console.error('Error seeding data:', err);
    } finally {
        await connection.end();
    }
}

seed();
