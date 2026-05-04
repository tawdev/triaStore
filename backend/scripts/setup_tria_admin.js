const { DataSource } = require('typeorm');
const bcrypt = require('bcrypt');
require('dotenv').config();

const ds = new DataSource({
    type: 'mysql',
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT) || 3306,
    username: process.env.DB_USERNAME || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'tria_db',
    entities: []
});

async function setup() {
    try {
        await ds.initialize();
        console.log('Connected to database:', ds.options.database);
        
        const email = 'admin@trialampe.ma';
        const password = 'admin_tria_2026';
        const fullName = 'Tria Lampe Admin';
        const role = 'admin';
        
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);
        
        // Check if user exists
        const existing = await ds.query('SELECT * FROM users WHERE email = ?', [email]);
        
        if (existing.length > 0) {
            await ds.query('UPDATE users SET password = ?, fullName = ?, role = ? WHERE email = ?', [hashedPassword, fullName, role, email]);
            console.log(`User ${email} updated successfully.`);
        } else {
            // Note: Check table columns first. Usually it's fullName (camelCase) in TypeORM unless specified otherwise.
            // Based on earlier context, it might be fullName.
            try {
                await ds.query('INSERT INTO users (email, password, fullName, role, isActive) VALUES (?, ?, ?, ?, 1)', [email, hashedPassword, fullName, role]);
            } catch (e) {
                // Fallback to snake_case if camelCase fails
                await ds.query('INSERT INTO users (email, password, full_name, role, isActive) VALUES (?, ?, ?, ?, 1)', [email, hashedPassword, fullName, role]);
            }
            console.log(`User ${email} created successfully.`);
        }
        
        console.log('-----------------------------------');
        console.log('Admin Login Details:');
        console.log(`Email: ${email}`);
        console.log(`Password: ${password}`);
        console.log('-----------------------------------');
        
        await ds.destroy();
    } catch (error) {
        console.error('Error setting up admin:', error);
        process.exit(1);
    }
}

setup();
