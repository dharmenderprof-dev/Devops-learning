require('dotenv').config();
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
  secret: process.env.SESSION_SECRET,
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

app.get('/employee', async (req, res) => {

  if (!req.session.user) {
    return res.redirect('/');
  }

  const submissions = await pool.query(
    'SELECT * FROM submissions ORDER BY id DESC'
  );

  res.render('employee', {
    submissions: submissions.rows
  });
  });

app.get('/reviewer', async (req, res) => {

  if (!req.session.user) {
    return res.redirect('/');
  }

  const submissions = await pool.query(
    'SELECT * FROM submissions ORDER BY id DESC'
  );

  res.render('reviewer', {
    submissions: submissions.rows
  });

});

app.post('/upload', upload.single('file'), async (req, res) => {

  try {

    console.log("STEP 1: Route reached");

    console.log("BODY:", req.body);
    console.log("FILE:", req.file);

    const title = req.body.title;
    const filename = req.file.filename;

    console.log("STEP 2: File extracted");

    const dbname = await pool.query('SELECT current_database()');
    console.log("DATABASE NAME:", dbname.rows[0]);

    console.log("STEP 3: Before INSERT");

    await pool.query(
  `INSERT INTO submissions
   (uploaded_by, title, filename, status)
   VALUES ($1,$2,$3,$4)`,
  [uploadedBy, title, filename, 'Pending']
);

    console.log("STEP 4: INSERT SUCCESS");

    res.send('File Uploaded Successfully');

  } catch (err) {

    console.log("========= UPLOAD ERROR =========");
    console.log(err);
    console.log("========= END ERROR =========");

    res.send('Upload Failed');
  }
});
app.post('/approve/:id', async (req, res) => {

  const id = req.params.id;

  await pool.query(
    'UPDATE submissions SET status=$1 WHERE id=$2',
    ['Approved', id]
  );

  res.redirect('/reviewer');

});
app.post('/reject/:id', async (req, res) => {

  const id = req.params.id;

  await pool.query(
    'UPDATE submissions SET status=$1 WHERE id=$2',
    ['Rejected', id]
  );

  res.redirect('/reviewer');

});
app.post('/comment/:id', async (req, res) => {

  const id = req.params.id;

  const comment = req.body.comment;

  await pool.query(
    'UPDATE submissions SET comments=$1 WHERE id=$2',
    [comment, id]
  );

  res.redirect('/reviewer');
});
app.get('/logout', (req, res) => {
  req.session.destroy();
  res.redirect('/');
});

app.listen(5000, () => {
  console.log('Server Running On Port 5000');
});

