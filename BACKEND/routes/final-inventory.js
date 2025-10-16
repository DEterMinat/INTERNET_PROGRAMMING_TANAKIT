const express = require('express');
const router = express.Router();
const { executeQuery, getPool } = require('../config/database');

const TABLE_NAME = 'FinalExam_Tanakit_Siriteerapan_Inventory';
const PREFIX = '6630202261';

// Helper to map DB row to API object
function mapRow(row) {
  return {
    id: row[`${PREFIX}_ID_Product`],
    name: row[`${PREFIX}_Name_Product`],
    qty: row[`${PREFIX}_Qty_Stock`],
    price: row[`${PREFIX}_Price_Unit`],
    img: row[`${PREFIX}_Img_Path`],
    created_at: row.created_at,
    updated_at: row.updated_at
  };
}

// GET all
router.get('/', async (req, res) => {
  try {
    const rows = await executeQuery(`SELECT * FROM ${TABLE_NAME} ORDER BY ${PREFIX}_Name_Product ASC`);
    res.json({ success: true, data: rows.map(mapRow) });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Failed to fetch final inventory' });
  }
});

// GET by id
router.get('/:id', async (req, res) => {
  const id = req.params.id;
  try {
    const rows = await executeQuery(`SELECT * FROM ${TABLE_NAME} WHERE ${PREFIX}_ID_Product = ?`, [id]);
    if (rows.length === 0) return res.status(404).json({ success: false, message: 'Not found' });
    res.json({ success: true, data: mapRow(rows[0]) });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Error fetching item' });
  }
});

// POST create
router.post('/', async (req, res) => {
  try {
    const { name, qty, price, img } = req.body;
    if (!name) return res.status(400).json({ success: false, message: 'Name required' });
    const result = await executeQuery(`INSERT INTO ${TABLE_NAME} 
      (${PREFIX}_Name_Product, ${PREFIX}_Qty_Stock, ${PREFIX}_Price_Unit, ${PREFIX}_Img_Path) VALUES (?, ?, ?, ?)`,
      [name, qty || 0, price || 0, img || null]);
    const inserted = await executeQuery(`SELECT * FROM ${TABLE_NAME} WHERE ${PREFIX}_ID_Product = ?`, [result.insertId]);
    res.json({ success: true, data: mapRow(inserted[0]) });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Failed to create' });
  }
});

// PUT update
router.put('/:id', async (req, res) => {
  const id = req.params.id;
  try {
    const { name, qty, price, img } = req.body;
    const result = await executeQuery(`UPDATE ${TABLE_NAME} SET 
      ${PREFIX}_Name_Product = ?, ${PREFIX}_Qty_Stock = ?, ${PREFIX}_Price_Unit = ?, ${PREFIX}_Img_Path = ? 
      WHERE ${PREFIX}_ID_Product = ?`, [name, qty, price, img, id]);
    const updated = await executeQuery(`SELECT * FROM ${TABLE_NAME} WHERE ${PREFIX}_ID_Product = ?`, [id]);
    if (updated.length === 0) return res.status(404).json({ success: false, message: 'Not found after update' });
    res.json({ success: true, data: mapRow(updated[0]) });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Failed to update' });
  }
});

// DELETE
router.delete('/:id', async (req, res) => {
  const id = req.params.id;
  try {
    const result = await executeQuery(`DELETE FROM ${TABLE_NAME} WHERE ${PREFIX}_ID_Product = ?`, [id]);
    res.json({ success: true, deletedId: id });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Failed to delete' });
  }
});

module.exports = router;