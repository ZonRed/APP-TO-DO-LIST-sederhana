// Mengimpor modul Express.js untuk membangun aplikasi web
const express = require('express');

// Mengimpor modul Mongoose untuk berinteraksi dengan MongoDB
const mongoose = require('mongoose');

// Mengimpor modul Body Parser untuk mengurai data permintaan HTTP
const bodyParser = require('body-parser');

// Mengimpor modul EJS untuk merender templat HTML
const ejs = require('ejs');

// Membuat objek aplikasi Express
const app = express();

// Menetapkan PORT untuk server, menggunakan 3000 jika tidak ditentukan dalam lingkungan
const PORT = process.env.PORT || 3000;

// Menghubungkan ke MongoDB menggunakan Mongoose
mongoose.connect('mongodb://localhost/todo-list-db');


// Mendapatkan objek koneksi MongoDB
const db = mongoose.connection;

// Mencatat kesalahan koneksi MongoDB
db.on('error', console.error.bind(console, 'Kesalahan koneksi MongoDB:'));

// Mengatur EJS sebagai mesin tampilan untuk merender templat
app.set('view engine', 'ejs');

// Menggunakan middleware Body Parser untuk mengurai data yang dikodekan URL
app.use(bodyParser.urlencoded({ extended: true }));

// Menyediakan file statis dari direktori 'public'
app.use(express.static('public'));

// Mendefinisikan skema untuk item daftar tugas
const todoSchema = new mongoose.Schema({
  task: {
    type: String,
    required: true,
  },
});

// Membuat model Mongoose berdasarkan skema
const Todo = mongoose.model('Todo', todoSchema);

// Mendefinisikan rute untuk menangani permintaan GET ke '/'
app.get('/', async (req, res) => {
  try {
    // Mengambil semua item Tugas dari basis data
    const todos = await Todo.find();

    // Merender templat 'index' dengan item Tugas yang diambil
    res.render('index', { todos: todos });
  } catch (error) {
    // Menangani kesalahan dengan mengirim respons 500 Internal Server Error
    res.status(500).json({ error: error.message });
  }
});

// Mendefinisikan rute untuk menangani permintaan POST ke '/add'
app.post('/add', async (req, res) => {
  try {
    // Membuat item Tugas baru berdasarkan data permintaan yang diterima
    const newTodo = new Todo({
      task: req.body.task,
    });

    // Menyimpan item Tugas baru ke basis data
    await newTodo.save();

    // Mengalihkan pengguna kembali ke halaman utama
    res.redirect('/');
  } catch (error) {
    // Menangani kesalahan dengan mengirim respons 500 Internal Server Error
    res.status(500).json({ error: error.message });
  }
});

// Memulai server dan mendengarkan permintaan masuk pada PORT yang ditentukan
app.listen(PORT, () => {
  console.log(`Server berjalan di http://localhost:${PORT}`);
});
