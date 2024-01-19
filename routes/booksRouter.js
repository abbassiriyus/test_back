const express = require('express');
const db = require('../db.js');
const router = express.Router();

// POST endpoint for inserting book data
router.post('/books', (req, res) => {
    try {
      // Read the JSON data from the file
      const jsonData = fs.readFileSync(req.files.file.path, 'utf-8');
  
      // Parse the JSON data
      const booksData = JSON.parse(jsonData);
  
      // Iterate over the books data and insert into the database
      booksData.forEach(async (book) => {
        const {
          title,
          cover,
          pages,
          published,
          isbn,
          creator,
          type,
        } = book;
        const insertQuery ='INSERT INTO books (title, cover, pages, published, isbn, creator, type) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *';
        const values = [
          title,
          cover,
          pages,
          published,
          isbn,
          creator,
          type,
        ];
        const result = await db.query(insertQuery, values);
        console.log('Inserted book:', result.rows[0]);
      });
  
      return res.status(200).json({ message: 'Books inserted successfully' });
    } catch (error) {
      console.error('Error inserting books:', error);
      return res.status(500).json({ error: 'Internal server error' });
    }
  });
  
// GET endpoint for fetching all books
router.get('/books', async (req, res) => {
    try {
      const query = 'SELECT * FROM books';
      const result = await db.query(query);
  
      return res.status(200).json(result.rows);
    } catch (error) {
      console.error('Error fetching books:', error);
      return res.status(500).json({ error: 'Internal server error' });
    }
  });
  
  // GET endpoint for fetching a single book by ID
router.get('/books/:id', async (req, res) => {
    const bookId = req.params.id;
  
    try {
      const query = 'SELECT * FROM books WHERE id = $1';
      const result = await db.query(query, [bookId]);
  
      if (result.rows.length === 0) {
        return res.status(404).json({ error: 'Book not found' });
      }
  
      return res.status(200).json(result.rows[0]);
    } catch (error) {
      console.error('Error fetching book:', error);
      return res.status(500).json({ error: 'Internal server error' });
    }
  });
  
  // PUT endpoint for updating a book
router.put('/books/:id', async (req, res) => {
    const bookId = req.params.id;
    const updatedBook = req.body;
  
    try {
      const query =
        'UPDATE books SET title = $1, cover = $2, pages = $3, published = $4, isbn = $5, creator = $6, type = $7 WHERE id = $8';
      const values = [
        updatedBook.title,
        updatedBook.cover,
        updatedBook.pages,
        updatedBook.published,
        updatedBook.isbn,
        updatedBook.creator,
        updatedBook.type,
        bookId,
      ];
  
      const result = await db.query(query, values);
  
      if (result.rowCount === 0) {
        return res.status(404).json({ error: 'Book not found' });
      }
  
      return res.status(200).json({ message: 'Book updated successfully' });
    } catch (error) {
      console.error('Error updating book:', error);
      return res.status(500).json({ error: 'Internal server error' });
    }
  });
  
  // DELETE endpoint for deleting a book
  router.delete('/books/:id', async (req, res) => {
    const bookId = req.params.id;
  
    try {
      const query = 'DELETE FROM books WHERE id = $1';
      const result = await db.query(query, [bookId]);
  
      if (result.rowCount === 0) {
        return res.status(404).json({ error: 'Book not found' });
      }
  
      return res.status(200).json({ message: 'Book deleted successfully' });
    } catch (error) {
      console.error('Error deleting book:', error);
      return res.status(500).json({ error: 'Internal server error' });
    }
  });
 


module.exports = router;