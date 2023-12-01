const { PrismaClient } = require("@prisma/client");

const database = new PrismaClient();

async function main() {
  try {
    await database.category.createMany({
      data: [
        { name: "NextJS" },
        { name: "JavaScript" },
        { name: "Java" },
        { name: "NodeJs" },
        { name: "HTML" },
        { name: "Css" },
      ],
    });
    console.log("Successfully seeded the database categories");
  } catch (error) {
    console.log("Error seeding the database categories", error);
  } finally {
    await database.$disconnect();
  }
}

main();
