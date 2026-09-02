const express = require("express");
const cors = require("cors");
const pool = require("./db");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

app.get("/health", (req, res) => {
  res.json({
    status: "ok",
    version: "1.0.0",
  });
});

app.get("/api/computers", async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT * FROM computers ORDER BY id"
    );

    res.json(result.rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({
      error: "Database error",
    });
  }
});

app.get("/api/computers/:id", async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT * FROM computers WHERE id = $1",
      [req.params.id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        error: "Computer not found",
      });
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({
      error: "Database error",
    });
  }
});

app.post("/api/computers", async (req, res) => {
  try {
    const {
      asset_code,
      brand_model,
      cpu,
      ram_gb,
      room,
      status,
    } = req.body;

    if (
      !asset_code ||
      !brand_model ||
      !cpu ||
      !ram_gb ||
      !room ||
      !status
    ) {
      return res.status(400).json({
        error: "All fields are required",
      });
    }

    const result = await pool.query(
      `INSERT INTO computers
      (asset_code, brand_model, cpu, ram_gb, room, status)
      VALUES ($1, $2, $3, $4, $5, $6)
      RETURNING *`,
      [
        asset_code,
        brand_model,
        cpu,
        ram_gb,
        room,
        status,
      ]
    );

    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error(error);

    if (error.code === "23505") {
      return res.status(409).json({
        error: "Asset code already exists",
      });
    }

    res.status(500).json({
      error: "Database error",
    });
  }
});

app.put("/api/computers/:id", async (req, res) => {
  try {
    const {
      asset_code,
      brand_model,
      cpu,
      ram_gb,
      room,
      status,
    } = req.body;

    if (
      !asset_code ||
      !brand_model ||
      !cpu ||
      !ram_gb ||
      !room ||
      !status
    ) {
      return res.status(400).json({
        error: "All fields are required",
      });
    }

    const result = await pool.query(
      `UPDATE computers
       SET asset_code = $1,
           brand_model = $2,
           cpu = $3,
           ram_gb = $4,
           room = $5,
           status = $6
       WHERE id = $7
       RETURNING *`,
      [
        asset_code,
        brand_model,
        cpu,
        ram_gb,
        room,
        status,
        req.params.id,
      ]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        error: "Computer not found",
      });
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error(error);

    if (error.code === "23505") {
      return res.status(409).json({
        error: "Asset code already exists",
      });
    }

    res.status(500).json({
      error: "Database error",
    });
  }
});

app.delete("/api/computers/:id", async (req, res) => {
  try {
    const result = await pool.query(
      "DELETE FROM computers WHERE id = $1 RETURNING *",
      [req.params.id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        error: "Computer not found",
      });
    }

    res.json({
      message: "Computer deleted successfully",
      computer: result.rows[0],
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      error: "Database error",
    });
  }
});

if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
  });
}

module.exports = app;