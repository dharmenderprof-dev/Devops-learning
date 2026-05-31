const express = require('express');

const app = express();

app.set('view engine', 'ejs');

app.use(express.urlencoded({ extended: true }));

app.get('/', (req,res)=>{
    res.send('Employee Review System Running');
});

app.listen(3000,()=>{
    console.log('Server Running On Port 3000');
});
