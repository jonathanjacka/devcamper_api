const express = require('express');
const dotenv = require('dotenv');
const morgan = require('morgan');

//Route files
const bootcampRoutes = require('./routes/bootcamps');
//Load env variables
dotenv.config({ path: './config/config.env' });

const app = express();

//dev logging middleware
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

//Mount routers
app.use('/api/v1/bootcamps/', bootcampRoutes);

const PORT = process.env.PORT || 5000;

app.listen(
  PORT,
  console.log(
    `Server is running in ${process.env.NODE_ENV} mode on port ${PORT}: Hello there`
  )
);
