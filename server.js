// Import Express.js framework
const express = require('express');

// Import Mongoose for MongoDB interaction
const mongoose = require('mongoose');

// Import Body Parser for handling HTTP request data
const bodyParser = require('body-parser');

// Import EJS for rendering HTML templates
const ejs = require('ejs');

// Create an Express application
const app = express();

// Set the PORT for the server, use 3000 if not specified in the environment
const PORT = process.env.PORT || 3000;

// Connect to MongoDB using Mongoose
mongoose.connect('mongodb://localhost/todo-list-db', { useNewUrlParser: true, useUnifiedTopology: true });

// Get the MongoDB connection
const db = mongoose.connection;

// Log MongoDB connection errors
db.on('error', console.error.bind(console, 'MongoDB connection error:'));

// Set EJS as the view engine for rendering templates
app.set('view engine', 'ejs');

// Use Body Parser middleware to parse URL-encoded data
app.use(bodyParser.urlencoded({ extended: true }));

// Serve static files from the 'public' directory
app.use(express.static('public'));

// Define the schema for the To-Do list items
const todoSchema = new mongoose.Schema({
  task: {
    type: String,
    required: true,
  },
});

// Create a Mongoose model based on the schema
const Todo = mongoose.model('Todo', todoSchema);

// Define a route to handle GET requests to '/'
app.get('/', async (req, res) => {
  try {
    // Fetch all To-Do items from the database
    const todos = await Todo.find();

    // Render the 'index' template with the fetched To-Do items
    res.render('index', { todos: todos });
  } catch (error) {
    // Handle errors by sending a 500 Internal Server Error response
    res.status(500).json({ error: error.message });
  }
});

// Define a route to handle POST requests to '/add'
app.post('/add', async (req, res) => {
  try {
    // Create a new To-Do item based on the incoming request data
    const newTodo = new Todo({
      task: req.body.task,
    });

    // Save the new To-Do item to the database
    await newTodo.save();

    // Redirect the user back to the home page
    res.redirect('/');
  } catch (error) {
    // Handle errors by sending a 500 Internal Server Error response
    res.status(500).json({ error: error.message });
  }
});

// Start the server and listen for incoming requests on the specified PORT
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
