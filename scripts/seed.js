const { faker } = require("@faker-js/faker");
const pool = require("../src/db");

const categories = [
  "Electronics",
  "Books",
  "Clothing",
  "Home",
  "Sports",
];

const TOTAL_PRODUCTS = 200000;
const BATCH_SIZE = 5000;


async function seedProducts() {
  try {
    console.log("Starting seed...");

    for (let i = 0; i < TOTAL_PRODUCTS; i += BATCH_SIZE) {
      const values = [];
      const placeholders = [];

      for (let j = 0; j < BATCH_SIZE && i + j < TOTAL_PRODUCTS; j++) {
        const productName = faker.commerce.productName();
        const category =
          categories[Math.floor(Math.random() * categories.length)];
        const price = faker.commerce.price();
        
        const createdAt = faker.date.between({
  from: "2024-01-01",
  to: "2026-06-23"
});
        
        const updatedAt = new Date(createdAt);

        const index = j * 5;

        placeholders.push(
          `($${index + 1}, $${index + 2}, $${index + 3}, $${index + 4}, $${
            index + 5
          })`
        );

        values.push(
          productName,
          category,
          price,
          createdAt,
          updatedAt
        );
      }

      const query = `
        INSERT INTO products
        (name, category, price, created_at, updated_at)
        VALUES ${placeholders.join(",")}
      `;

      await pool.query(query, values);

      console.log(
        `Inserted ${Math.min(i + BATCH_SIZE, TOTAL_PRODUCTS)} products`
      );
    }

    console.log("Seeding completed!");
    process.exit();
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
}

seedProducts();