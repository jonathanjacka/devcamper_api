const express = require('express');
const dotenv = require('dotenv');
const morgan = require('morgan');
const colors = require('colors');
const fileupload = require('express-fileupload');
const connectDB = require('./config/db');
const errorHandler = require('./middleware/error');

//Load env variables
dotenv.config({ path: './config/config.env' });

//Connect to database
connectDB();

//Route files
const bootcampRoutes = require('./routes/bootcamps');
const coursesRoutes = require('./routes/courses');

const app = express();

//Body parser
app.use(express.json());

//dev logging middleware
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// File uploading
app.use(fileupload());

//Mount routers
app.use('/api/v1/bootcamps/', bootcampRoutes);
app.use('/api/v1/courses/', coursesRoutes);

//Error Handler
app.use(errorHandler);

const PORT = process.env.PORT || 3000;

const server = app.listen(
  PORT,
  console.log(
    `Server is running in ${process.env.NODE_ENV} mode on port ${PORT}: Hello there`
      .cyan.bold
  )
);

//Global handle for unhandled promise rejections
process.on('unhandledRejection', (error, promise) => {
  console.log(`Error: ${error.message}`.red);
  server.close(() => process.exit(1));
});
