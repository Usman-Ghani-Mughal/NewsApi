const express = require('express');
const dotenv = require('dotenv');
const morgan = require('morgan');
const connectDB =  require('./config/database_con');
const app = express();
var cors = require('cors');

// Logging
if (process.env.NODE_ENV === 'development'){
    app.use(morgan('dev'));
}


// get enviorment variables
dotenv.config();

// Connect with the DataBase
connectDB();

// Import register route
const userAuthRoute = require('./Routes/Users');
const appAuthRoute  = require('./Routes/clientApp');
const newsRoute = require('./Routes/News');

// Middleware (body parser for json)
app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use(cors());

// Route Middlewares
app.use('/newsapi/user', userAuthRoute);
app.use('/newsapi/app', appAuthRoute);
app.use('/newsapi', newsRoute);

app.get('/', (req, res) => {
    res.send("<h1>working API</h1>");
});


// var server_port = process.env.MY_PORT || process.env.PORT || 3279;
var server_port = process.env.PORT;
var server_host = process.env.MY_HOST || process.env.HOST  || '0.0.0.0';

app.listen(server_port, server_host ,()=>{
    console.log(`Sever is running in ${process.env.NODE_ENV} mode on port : ${server_port}`);
});


