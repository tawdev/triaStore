const mysql = require('mysql2/promise');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '..', '.env') });

async function seed() {
    const connection = await mysql.createConnection({
        host: process.env.DB_HOST || 'localhost',
        user: process.env.DB_USERNAME || 'root',
        password: process.env.DB_PASSWORD || '',
        database: process.env.DB_NAME || 'droguerie_db',
    });

    console.log('Connected to MySQL database!');

    try {
        const posts = [
            {
                title: 'L\'Art du Cristal : Sculpter la Lumière avec Élégance',
                slug: 'art-du-cristal-sculpter-la-lumiere',
                category: 'Savoir-Faire',
                content: `
                    <h2 class="text-2xl font-playfair italic mb-6">L'Éclat Éternel</h2>
                    <p>Le cristal n'est pas qu'un simple matériau ; c'est un prisme qui capture l'âme d'une pièce. Chez Tria, nous sélectionnons chaque pièce pour sa pureté exceptionnelle.</p>
                    <h3 class="text-xl font-bold mt-8 mb-4">La Réfraction de la Perfection</h3>
                    <p>Découvrez comment nos maîtres artisans taillent le cristal pour créer des jeux d'ombres et de lumières uniques qui dansent sur vos murs dès la nuit tombée.</p>
                    <blockquote class="border-l-4 border-[#B8860B] pl-6 my-8 italic text-slate-500">
                        "Une lampe en cristal ne se contente pas d'éclairer ; elle habite l'espace comme un bijou architectural."
                    </blockquote>
                `,
                excerpt: "Découvrez comment le cristal de haute pureté transforme la lumière en une expérience sensorielle unique pour votre intérieur.",
                imageUrl: '/tria-crystal/hero.png',
                status: 'Published'
            },
            {
                title: 'Tendances 2024 : Le Retour du Laiton Brossé et de l\'Or',
                slug: 'tendances-2024-laiton-et-or',
                category: 'Design',
                content: `
                    <h2 class="text-2xl font-playfair italic mb-6">Une Renaissance Dorée</h2>
                    <p>L'or brossé s'impose comme la finition incontournable de l'année. Plus discret que l'or brillant, il apporte une chaleur sophistiquée sans ostentation.</p>
                    <h3 class="text-xl font-bold mt-8 mb-4">Harmonie des Matières</h3>
                    <p>Marier le laiton avec des textures sombres comme l'ardoise ou le velours noir crée un contraste saisissant, signature des intérieurs les plus prestigieux.</p>
                `,
                excerpt: "L'or brossé et le laiton reviennent en force. Apprenez à intégrer ces finitions nobles dans votre décoration contemporaine.",
                imageUrl: '/tria-crystal/banner1.png',
                status: 'Published'
            },
            {
                title: 'Éclairage Résidentiel : Les Secrets des Architectes d\'Intérieur',
                slug: 'secrets-eclairage-residentiel',
                category: 'Conseils',
                content: `
                    <h2 class="text-2xl font-playfair italic mb-6">La Hiérarchie de la Lumière</h2>
                    <p>Un bon éclairage se construit en couches : ambiance, accentuation et fonction. Apprenez à jouer avec ces trois dimensions pour donner du relief à votre salon.</p>
                `,
                excerpt: "Trois couches de lumière pour une ambiance parfaite. Les experts Tria partagent leurs astuces pour un salon digne d'un hôtel 5 étoiles.",
                imageUrl: '/tria-crystal/banner2.png',
                status: 'Published'
            },
            {
                title: 'Dans les Coulisses : La Création de la Collection Tria Cristal',
                slug: 'coulisses-creation-tria-cristal',
                category: 'Héritage',
                content: `
                    <h2 class="text-2xl font-playfair italic mb-6">De l'Esquisse à l'Objet d'Art</h2>
                    <p>Chaque pièce Tria commence par un dessin à la main. C'est ce processus organique qui garantit l'exclusivité de nos designs.</p>
                `,
                excerpt: "Voyagez au cœur de nos ateliers et découvrez la passion qui anime nos artisans pour créer des luminaires d'exception.",
                imageUrl: '/tria-crystal/hero.png',
                status: 'Published'
            }
        ];

        console.log('Clearing existing blog posts...');
        await connection.execute('DELETE FROM blog_posts');

        console.log('Inserting sample blog posts...');

        for (const post of posts) {
            await connection.execute(
                'INSERT INTO blog_posts (title, slug, category, content, excerpt, imageUrl, status, createdAt, updatedAt) VALUES (?, ?, ?, ?, ?, ?, ?, NOW(), NOW())',
                [post.title, post.slug, post.category, post.content, post.excerpt, post.imageUrl, post.status]
            );
        }

        console.log(`Successfully seeded ${posts.length} blog posts!`);
    } catch (err) {
        console.error('Error seeding data:', err);
    } finally {
        await connection.end();
    }
}

seed();
