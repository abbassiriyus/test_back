const express = require('express');
const db = require('../db.js');
const bcrypt=require("bcrypt")
const router = express.Router();
router.post('/register', async (req, res) => {
    const { username, password } = req.body;

    try {
      // Check if the username already exists
      const checkQuery = 'SELECT * FROM users WHERE username = $1';
      const checkResult = await db.query(checkQuery, [username]);
  
      if (checkResult.rows.length > 0) {
        return res.status(400).json({ error: 'Username already taken' });
      }
  
      // Hash the password
      const saltRounds = 10;
      const hashedPassword = await bcrypt.hash(password, saltRounds);
  
      // Insert the new user into the database
      const insertQuery = 'INSERT INTO users (username, password) VALUES ($1, $2)';
      await db.query(insertQuery, [username, hashedPassword]);
  
      return res.status(201).json({ message: 'User registered successfully' });
    } catch (error) {
      console.error('Error during registration:', error);
      return res.status(500).json({ error: 'Internal server error' });
    }
  });
  
  // Login a user and generate a JWT token
router.post('/login', async (req, res) => {
    const { username, password } = req.body;
  
    try {
      // Retrieve the user from the database
      const selectQuery = 'SELECT * FROM users WHERE username = $1';
      const selectResult = await db.query(selectQuery, [username]);
  
      if (selectResult.rows.length === 0) {
        return res.status(401).json({ error: 'Invalid username or password' });
      }
  
      const user = selectResult.rows[0];
  
      // Compare the provided password with the stored hashed password
      const passwordMatch = await bcrypt.compare(password, user.password);
  
      if (!passwordMatch) {
        return res.status(401).json({ error: 'Invalid username or password' });
      }
  
      // Generate a JWT token
      const token = jwt.sign({ username: user.username, id: user.id }, 'your_secret_key');
  
      return res.status(200).json({ token });
    } catch (error) {
      console.error('Error during login:', error);
      return res.status(500).json({ error: 'Internal server error' });
    }
  });
  
  // Middleware to validate the JWT token
  const authenticateToken = (req, res, next) => {
    const token = req.headers['authorization'];
  
    if (!token) {
      return res.status(403).json({ error: 'No token provided' });
    }
  
    jwt.verify(token, 'your_secret_key', (err, user) => {
      if (err) {
        return res.status(403).json({ error: 'Invalid token' });
      }
      req.user = user;
      next();
    });
  };
  
// DELETE /users/:id - Delete a user by ID
router.delete('/:id', async (req, res) => {
  const userId = req.params.id;
  try {
    const deleted = await db.deleteUserById(userId);
    if (deleted) {
      return res.status(200).json({ message: 'User deleted successfully' });
    } else {
      return res.status(404).json({ error: 'User not found' });
    }
  } catch (error) {
    console.error('Error deleting user:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;