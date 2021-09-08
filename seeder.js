const fs = require('fs');
const mongoose = require('mongoose');
colors = require('colors');
const dotenv = require('dotenv');

//load env variables
dotenv.config({ path: './config/config.env' });

//load models
const Bootcamp = require('./models/Bootcamp');

//Connect to DB
try {
  mongoose.connect(process.env.MONGO_URI);
} catch (error) {
  console.log(`Something went wrong - Error: ${error}`.red);
  process.exit(1);
}

//Read Json files
const bootcamps = JSON.parse(
  fs.readFileSync(`${__dirname}/_data/bootcamps.json`, 'utf-8')
);

//import into DB
const importData = async () => {
  try {
    await Bootcamp.create(bootcamps);

    console.log(`Data imported...`.cyan.inverse);
    process.exit();
  } catch (error) {
    console.error(error);
  }
};

//Delete data
const deleteData = async () => {
  try {
    await Bootcamp.deleteMany();

    console.log(`All data has been removed`.yellow.inverse);
    process.exit();
  } catch (error) {
    console.error(error);
  }
};

if (process.argv[2] === '-import') {
  importData();
} else if (process.argv[2] === '-delete') {
  deleteData();
}