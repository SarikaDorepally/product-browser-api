# Product Browser API

## Overview

This project is a backend service that allows users to browse a large product catalog (~200,000 products), filter by category, and paginate through results efficiently.

The system is designed to handle changing data while users are browsing, ensuring that products are not duplicated or missed between pages.

---

## Live Demo

Backend URL:

https://product-browser-api-pj2l.onrender.com/products

---

## Tech Stack

* Node.js
* Express.js
* PostgreSQL (Neon)
* Render

---

## Features

* Browse 200,000 products
* Newest products first
* Category filtering
* Cursor-based pagination
* Indexed queries for performance
* Seed script for generating large datasets

---

## Database Schema

### Products Table

| Column     | Type          |
| ---------- | ------------- |
| id         | BIGSERIAL     |
| name       | VARCHAR(255)  |
| category   | VARCHAR(100)  |
| price      | NUMERIC(10,2) |
| created_at | TIMESTAMP     |
| updated_at | TIMESTAMP     |

---

## Why Cursor Pagination?

A common approach is OFFSET/LIMIT pagination:

```sql
SELECT *
FROM products
ORDER BY updated_at DESC
LIMIT 20 OFFSET 20;
```

However, OFFSET pagination can:

* Become slower on large datasets
* Return duplicate records
* Skip records when new data is inserted while users browse

To avoid these issues, this project uses cursor-based pagination with:

```sql
(updated_at, id)
```

This provides:

* Consistent pagination
* Better scalability
* No duplicate records between pages
* No missing records when new products are added

---

## Indexes

### Pagination Index

```sql
CREATE INDEX idx_products_updated
ON products(updated_at DESC, id DESC);
```

### Category + Pagination Index

```sql
CREATE INDEX idx_products_category_updated
ON products(category, updated_at DESC, id DESC);
```

These indexes improve query performance when filtering and paginating through large datasets.

---

## API Endpoints

### Get Products

```http
GET /products
```

Example:

```http
GET /products?limit=20
```

---

### Filter By Category

```http
GET /products?category=Books
```

---

### Cursor Pagination

```http
GET /products?cursorUpdatedAt=<timestamp>&cursorId=<id>
```

Example:

```http
GET /products?cursorUpdatedAt=2026-06-23T13:39:14.616Z&cursorId=81043
```

---

## Seed Script

The project includes a seed script that generates approximately 200,000 products.

Run:

```bash
npm run seed
```

The script:

* Generates fake product data
* Inserts records in batches
* Avoids slow row-by-row inserts

---

## Running Locally

Install dependencies:

```bash
npm install
```

Create a .env file:

```env
DATABASE_URL=your_database_url
PORT=5000
```

Start the server:

```bash
npm run dev
```

---

## Future Improvements

* Product search functionality
* Redis caching
* Automated tests
* API rate limiting
* Monitoring and logging

---

## AI Usage

AI tools were used to:

* Discuss pagination approaches
* Review indexing strategies
* Assist with project structure

The final implementation was tested and verified manually.
