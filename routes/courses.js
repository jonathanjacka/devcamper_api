const express = require('express');
const router = express.Router({ mergeParams: true });

const { getCourses } = require('../controllers/courses');

router.route('/').get(getCourses);
//router.route('/bootcamps/:bootcampId/courses').get(getCourses);

module.exports = router;
