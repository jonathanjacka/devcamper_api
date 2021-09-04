//@desc     Get all bootcamps
//@route    GET /api/v1/bootcamps
//@access   Public
exports.getBootcamps = (req, res, next) => {
  res.status(200).send({ success: true, msg: 'Show all bootcamps' });
};

//@desc     Get single bootcamp
//@route    GET /api/v1/bootcamps/:id
//@access   Public
exports.getBootcamp = (req, res, next) => {
  res
    .status(200)
    .send({ success: true, msg: `Show bootcamp: ${req.params.id}` });
};

const Bootcamp = require('../models/Bootcamp');

//@desc     Create new bootcamp
//@route    POST /api/v1/bootcamps
//@access   Private
exports.createBootcamp = (req, res, next) => {
  res.status(200).send({ success: true, msg: 'Create a new bootcamp' });
};

//@desc     Update a bootcamp
//@route    PUT /api/v1/bootcamps/:id
//@access   Private
exports.updateBootcamp = (req, res, next) => {
  res
    .status(200)
    .send({ success: true, msg: `Update bootcamp: ${req.params.id}` });
};

//@desc     Remove a bootcamp
//@route    DELETE /api/v1/bootcamps/:id
//@access   Private
exports.deleteBootcamp = (req, res, next) => {
  res
    .status(200)
    .send({ success: true, msg: `Remove bootcamp: ${req.params.id}` });
};
