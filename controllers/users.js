const User = require('../models/User');
const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middleware/async');

//@desc     Get all users
//@route    GET /api/v1/auth/users
//@access   Private/Admin
exports.getUsers = asyncHandler(async (req, res, next) => {
  res.status(200).json(res.advancedResults);
});

//@desc     Get single user
//@route    GET /api/v1/auth/users/:id
//@access   Private/Admin
exports.getUser = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.params.id);

  if (!user) {
    return next(
      new ErrorResponse(
        `No user with the id of ${req.params.id} was found - this means that the user doesn't exist or that the ID you entered is incorrect`,
        404
      )
    );
  }

  res.status(200).json({ success: true, data: user });
});

//@desc     Create user
//@route    POST /api/v1/auth/users
//@access   Private/Admin
exports.createUser = asyncHandler(async (req, res, next) => {
  const user = await User.create(req.body);

  res.status(201).json({ success: true, data: user });
});

//@desc     Update user
//@route    PUT /api/v1/auth/users/:id
//@access   Private/Admin
exports.updateUser = asyncHandler(async (req, res, next) => {
  // Protect user password from changes by admin
  if ('password' in req.body) {
    return next(
      new ErrorResponse('Admins are not allowed to change user passwords', 404)
    );
  }

  const user = await User.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  if (!user) {
    return next(
      new ErrorResponse(
        `No user with the id of ${req.params.id} was found - this means that the user doesn't exist or that the ID you entered is incorrect`,
        404
      )
    );
  }

  res.status(200).json({ success: true, data: user });
});

//@desc     Delete user
//@route    DELETE /api/v1/auth/users/:id
//@access   Private/Admin
exports.deleteUser = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.params.id);

  if (!user) {
    return next(
      new ErrorResponse(
        `No user with the id of ${req.params.id} was found - this means that the user doesn't exist or that the ID you entered is incorrect`,
        404
      )
    );
  }

  await User.findByIdAndDelete(req.params.id);

  res.status(200).json({ success: true, data: user });
});
