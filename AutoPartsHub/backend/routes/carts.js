// In backend/routes/carts.js
// Add this route to get all carts for the current user

// GET /api/carts - Get all carts for current user
router.get('/', requireAuth, async (req, res) => {
  try {
    const { rows } = await pool.query(
      'SELECT * FROM carts WHERE user_id = $1',
      [req.user.userId]
    );
    res.json(rows);
  } catch (err) {
    console.error('Error fetching carts:', err);
    res.status(500).json({ error: 'Failed to retrieve carts' });
  }
});

// Also add a create cart endpoint
router.post('/', requireAuth, async (req, res) => {
  try {
    const { rows } = await pool.query(
      'INSERT INTO carts (user_id) VALUES ($1) RETURNING *',
      [req.user.userId]
    );
    res.status(201).json(rows[0]);
  } catch (err) {
    console.error('Error creating cart:', err);
    res.status(500).json({ error: 'Failed to create cart' });
  }
});
