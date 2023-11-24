const { PrismaClient } = require('@prisma/client')

const database = new PrismaClient();

async function main() {
    try {
        await database.category.createMany({
            data: [
                { name: 'Computer Science' },
                { name: 'Music' },
                { name: 'Physics' },
                { name: 'Art History' },
                { name: 'Psychology' },
                { name: 'Mathematics' },
                { name: 'Biology' },
                { name: 'Literature' },
                { name: 'History' },
                { name: 'Chemistry' }
            ]
        });
        console.log('Successfully seeded the database categories');
    } catch (error) {
        console.log('Error seeding the database categories', error);
    } finally {
        await database.$disconnect();
    }
}

main();