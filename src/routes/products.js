const express = require("express");
const router = express.Router();
const pool = require("../db");

router.get("/", async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 20;
    const category = req.query.category;
    const cursorUpdatedAt = req.query.cursorUpdatedAt;
    const cursorId = req.query.cursorId;

    let query = `
      SELECT *
      FROM products
    `;

    const values = [];
    const conditions = [];

    if (category) {
      values.push(category);
      conditions.push(`category = $${values.length}`);
    }

    if (cursorUpdatedAt && cursorId) {
      values.push(cursorUpdatedAt);
      values.push(cursorId);

      conditions.push(`
        (updated_at, id) <
        ($${values.length - 1}, $${values.length})
      `);
    }

    if (conditions.length > 0) {
      query += ` WHERE ${conditions.join(" AND ")}`;
    }

    query += `
      ORDER BY updated_at DESC, id DESC
      LIMIT ${limit}
    `;

    const result = await pool.query(query, values);

    let nextCursor = null;

    if (result.rows.length > 0) {
      const last = result.rows[result.rows.length - 1];

      nextCursor = {
        updated_at: last.updated_at,
        id: last.id,
      };
    }

    res.json({
      count: result.rows.length,
      nextCursor,
      data: result.rows,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      error: error.message,
    });
  }
});

module.exports = router;