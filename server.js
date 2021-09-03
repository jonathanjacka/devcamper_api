const express = require('express');
const dotenv = require('dotenv');
const morgan = require('morgan');
const connectDB = require('./config/db');

//Load env variables
dotenv.config({ path: './config/config.env' });

//Connect to database
connectDB();

//Route files
const bootcampRoutes = require('./routes/bootcamps');

const app = express();

//dev logging middleware
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

//Mount routers
app.use('/api/v1/bootcamps/', bootcampRoutes);

const PORT = process.env.PORT || 3000;

const server = app.listen(
  PORT,
  console.log(
    `Server is running in ${process.env.NODE_ENV} mode on port ${PORT}: Hello there`
  )
);

//Global handle for unhandled promise rejections
process.on('unhandledRejection', (error, promise) => {
  console.log(`Error: ${error.message}`);
  server.close(() => process.exit(1));
});
