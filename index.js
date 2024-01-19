const express = require('express')
const app = express()
const usersRouter = require('./routes/usersRouter.js');
const booksRouter =require('./routes/booksRouter.js')
const cors = require('cors')
const bodyParser = require('body-parser');
const fileUpload = require("express-fileupload");
const fs=require('fs')
app.use(fileUpload())
// Body parser middleware
app.use(bodyParser.json());
app.use(express.static('./upload'))
app.use(bodyParser.urlencoded({ extended: true }));
app.use(function (req, res, next) {

    // Website you wish to allow to connect
    res.setHeader('Access-Control-Allow-Origin', '*');

    // Request methods you wish to allow
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');

    // Request headers you wish to allow
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');

    // Set to true if you need the website to include cookies in the requests sent
    // to the API (e.g. in case you use sessions)
    res.setHeader('Access-Control-Allow-Credentials', true);

    // Pass to next layer of middleware
    next();
});
app.use(cors({origin: '*'}))
// Главная
app.get('/', (_req, res) => {
  res.status(200).json({
    message: 'ping',
  })
})
app.get('/doc', (_req, res) => {
  const data = fs.readFileSync('./upload/index.html',
  { encoding: 'utf8', flag: 'r' });
res.status(200).send(data)
})


// Routes
app.use('/auth/v1', usersRouter);
app.use('/api/v1', booksRouter);




app.listen(4003, () => {
    console.log('Сервер запущен')
    console.log('server started')
  })
  




