const express = require('express')
const mongoose = require('mongoose');
var morgan = require('morgan')
const cors = require('cors')
const apiRouter = require('./routes');
const config = require("./config");

const app = express()

app.use(morgan('dev'));
app.use(cors());

app.use((req, res, next)=>{
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, ContentType, Accept");
  res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, DELETE');
  res.header('Allow', 'GET, POST, OPTIONS, PUT, DELETE');  
  next();
 });

app.use(express.json())
app.use(express.urlencoded({extended : true}))

// conexion base de datos
const UrlDB = config.cfg.UrlDB;
mongoose.Promise = global.Promise;
mongoose.connect(UrlDB, { useNewUrlParser: true })
.then(mon => console.log('conectado a la base de datos'))
.catch(err => console.log(err))

app.use('/api', apiRouter)
 
app.set('PORT', process.env.PORT || 3000);

app.listen(app.get('PORT'), () => { 
  console.log(`Corriendo en el puerto : ${app.get('PORT')}`);
})