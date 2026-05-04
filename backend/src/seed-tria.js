const mysql = require('mysql2/promise');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../.env') });

async function seed() {
    const connection = await mysql.createConnection({
        host: process.env.DB_HOST || 'localhost',
        user: process.env.DB_USERNAME || 'root',
        password: process.env.DB_PASSWORD || '',
        database: process.env.DB_NAME || 'tria_db',
    });

    console.log('Connected to tria_db!');

    try {
        // Clear existing data
        console.log('Clearing old data...');
        await connection.execute('SET FOREIGN_KEY_CHECKS = 0');
        await connection.execute('TRUNCATE TABLE products');
        await connection.execute('TRUNCATE TABLE categories');
        await connection.execute('SET FOREIGN_KEY_CHECKS = 1');

        // Insert Categories
        console.log('Inserting categories...');
        const categories = [
            ['Lampes de Table', 'Lampes élégantes pour bureaux et chevets', 'https://images.unsplash.com/photo-1534073828943-f801091bb18c?auto=format&fit=crop&q=80'],
            ['Suspensions', 'Luminaires suspendus pour salons et salles à manger', 'https://images.unsplash.com/photo-1513506003901-1e6a229e2d15?auto=format&fit=crop&q=80'],
            ['Appliques Murales', 'Éclairage mural design et discret', 'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?auto=format&fit=crop&q=80'],
            ['Lampadaires', 'Lampes sur pied pour ambiances tamisées', 'https://images.unsplash.com/photo-1513506003901-1e6a229e2d15?auto=format&fit=crop&q=80'],
            ['Éclairage Extérieur', 'Solutions robustes pour jardins et terrasses', 'https://images.unsplash.com/photo-1565814636199-ae8133055c1c?auto=format&fit=crop&q=80'],
            ['Ampoules & Accessoires', 'Tout pour optimiser votre éclairage', 'https://images.unsplash.com/photo-1550684848-fac1c5b4e853?auto=format&fit=crop&q=80']
        ];

        const catIds = [];
        for (const [name, desc, img] of categories) {
            const [result] = await connection.execute(
                'INSERT INTO categories (name, description, imageUrl, isActive) VALUES (?, ?, ?, true)',
                [name, desc, img]
            );
            catIds.push(result.insertId);
        }

        // Insert Products
        console.log('Inserting products...');
        const products = [
            // Lampes de Table
            [catIds[0], 'Lampe Gold Luxe', 'Luxe-001', 'Lampe de table en laiton brossé avec abat-jour en soie.', 1250, 20, 'https://images.unsplash.com/photo-1534073828943-f801091bb18c?auto=format&fit=crop&q=80'],
            [catIds[0], 'Lampe Minimaliste Noire', 'Min-002', 'Design épuré en métal noir mat.', 850, 15, 'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?auto=format&fit=crop&q=80'],
            
            // Suspensions
            [catIds[1], 'Suspension Cristal', 'Susp-001', 'Magnifique lustre en cristal pour salon.', 3500, 5, 'https://images.unsplash.com/photo-1513506003901-1e6a229e2d15?auto=format&fit=crop&q=80'],
            [catIds[1], 'Duo Nordique', 'Susp-002', 'Ensemble de deux suspensions en bois et métal.', 1800, 10, 'https://images.unsplash.com/photo-1513506003901-1e6a229e2d15?auto=format&fit=crop&q=80'],

            // Appliques
            [catIds[2], 'Applique Art Déco', 'App-001', 'Style années 20 revisité.', 650, 25, 'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?auto=format&fit=crop&q=80'],

            // Lampadaires
            [catIds[3], 'Lampadaire Arc', 'Floor-001', 'Grand lampadaire arc pour lecture.', 2200, 8, 'https://images.unsplash.com/photo-1513506003901-1e6a229e2d15?auto=format&fit=crop&q=80']
        ];

        for (const [catId, name, sku, desc, price, stock, img] of products) {
            await connection.execute(
                'INSERT INTO products (categoryId, name, sku, description, price, stock, imageUrl) VALUES (?, ?, ?, ?, ?, ?, ?)',
                [catId, name, sku, desc, price, stock, img]
            );
        }

        await connection.execute('TRUNCATE TABLE settings');
        console.log('Inserting settings...');
        await connection.execute(
            'INSERT INTO settings (storeName, supportEmail, phoneNumber, address, logoUrl, description) VALUES (?, ?, ?, ?, ?, ?)',
            ['Tria Lampe', 'contact@triastor.ma', '+212 5 22 92 36 24', 'Avenue Mohamed V, Marrakech, Maroc', '/logo.png', 'Luxe et élégance du luminaire au Maroc.']
        );

        console.log('Seeding completed successfully!');
    } catch (err) {
        console.error('Error seeding tria_db:', err);
    } finally {
        await connection.end();
    }
}

seed();
