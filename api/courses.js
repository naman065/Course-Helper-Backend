const express = require('express');
const router = express.Router();
const pool = require('./db'); // Assuming `db.js` is where your PostgreSQL connection is set up
const authenticateToken = require('./authMiddleware');


// Create a course
router.post('/',authenticateToken, async (req, res) => {
  try {
    const { name, code, credit, description, image } = req.body;
    const newCourse = await pool.query(
      'INSERT INTO myschema.courses (name, code, credit, description, image) VALUES ($1, $2, $3, $4, $5) RETURNING *',
      [name, code, credit, description, image]
    );
    res.status(201).json(newCourse.rows[0]);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// Read all courses
router.get('/',authenticateToken, async (req, res) => {
  try {
    const allCourses = await pool.query('SELECT * FROM myschema.courses');
    res.json(allCourses.rows);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// Read a single course by ID
router.get('/:id',authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const course = await pool.query('SELECT * FROM myschema.courses WHERE id = $1', [id]);
    if (course.rows.length === 0) {
      return res.status(404).json({ message: 'Course not found' });
    }
    res.json(course.rows[0]);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// Update a course
router.put('/:id',authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const { name, code, credit, description, image } = req.body;
    const updatedCourse = await pool.query(
      'UPDATE myschema.courses SET name = $1, code = $2, credit = $3, description = $4, image = $5 WHERE id = $6 RETURNING *',
      [name, code, credit, description, image, id]
    );
    if (updatedCourse.rows.length === 0) {
      return res.status(404).json({ message: 'Course not found' });
    }
    res.json(updatedCourse.rows[0]);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// Delete a course
router.delete('/:id',authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const deletedCourse = await pool.query('DELETE FROM myschema.courses WHERE id = $1 RETURNING *', [id]);
    if (deletedCourse.rows.length === 0) {
      return res.status(404).json({ message: 'Course not found' });
    }
    res.json({ message: 'Course deleted successfully' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

module.exports = router;
