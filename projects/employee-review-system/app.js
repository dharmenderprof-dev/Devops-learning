const express = require('express');
const session = require('express-session');
const pool = require('./database/db');
const multer = require('multer');

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/');
  },

  filename: function (req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname);
  }
});

const upload = multer({
  storage: storage
});

const app = express();

app.set('view engine', 'ejs');

app.use(express.urlencoded({ extended: true }));

app.use(
  session({
    secret: 'mysecret',
    resave: false,
    saveUninitialized: false,
  })
);

app.get('/', (req, res) => {
  res.render('login');
});

app.post('/login', async (req, res) => {
  const { username, password } = req.body;

  console.log("USERNAME:", username);
  console.log("PASSWORD:", password);

  const result = await pool.query(
    'SELECT * FROM users WHERE username=$1 AND password=$2',
    [username, password]
  );

  console.log("RESULT:", result.rows);

  if (result.rows.length === 0) {
    return res.send('Invalid Credentials');
  }

  const user = result.rows[0];

  req.session.user = user;

  if (user.role === 'employee') {
    return res.redirect('/employee');
  }

  if (user.role === 'reviewer') {
    return res.redirect('/reviewer');
  }
});

app.get('/employee', (req, res) => {
  if (!req.session.user) {
    return res.redirect('/');
  }

  res.render('employee');
});

app.get('/reviewer', (req, res) => {
  if (!req.session.user) {
    return res.redirect('/');
  }

  res.render('reviewer');
});

app.post(
  '/upload',
  upload.single('file'),
  async (req, res) => {

    try {

      const title = req.body.title;
      const filename = req.file.filename;

      const dbname = await pool.query('SELECT current_database()');
      console.log("DATABASE:", dbname.rows[0]);

      await pool.query(
        `INSERT INTO submissions
         (title, filename, status)
         VALUES ($1,$2,$3)`,
        [title, filename, 'Pending']
      );

      res.send('File Uploaded Successfully');

    } catch (err) {
  console.log("UPLOAD ERROR:");
  console.log(err);
  res.send('Upload Failed');

    }
  }
);

app.get('/logout', (req, res) => {
  req.session.destroy();
  res.redirect('/');
});

app.listen(5000, () => {
  console.log('Server Running On Port 3000');
});

