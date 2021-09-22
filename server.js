const express = require('express');
const path = require('path');
const dotenv = require('dotenv');
const morgan = require('morgan');
const colors = require('colors');
const fileupload = require('express-fileupload');
const cookieParser = require('cookie-parser');
const connectDB = require('./config/db');
const errorHandler = require('./middleware/error');

//Load env variables
dotenv.config({ path: './config/config.env' });

//Connect to database
connectDB();

//Route files
const bootcampRoutes = require('./routes/bootcamps');
const coursesRoutes = require('./routes/courses');
const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/users');
const reviewRoutes = require('./routes/reviews');

const app = express();

//Body parser
app.use(express.json());

// Cookie parser
app.use(cookieParser());

//dev logging middleware
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// File uploading
app.use(fileupload());

// Set static folder
app.use(express.static(path.join(__dirname, 'public')));

//Mount routers
app.use('/api/v1/bootcamps/', bootcampRoutes);
app.use('/api/v1/courses/', coursesRoutes);
app.use('/api/v1/auth/', authRoutes);
app.use('/api/v1/users/', userRoutes);
app.use('/api/v1/reviews/', reviewRoutes);

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
