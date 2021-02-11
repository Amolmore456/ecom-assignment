import asyncHandler from 'express-async-handler'
import User from '../models/userModel.js'
import genrateToken from '../utils/generateToken.js'

const authUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body
  const user = await User.findOne({ email })

  if (user && (await user.matchPassword(password))) {
    return res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      isAdmin: user.isAdmin,
      token: genrateToken(user.id),
    })
  } else {
    res.status(401)
    throw new Error('Invalid email and password.')
  }
})

const registerUser = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body
  const userExist = await User.findOne({ email })

  if (userExist) {
    res.status(400)
    throw new Error('User already exist.')
  }

  const user = await User.create({ name, email, password })

  if (user) {
    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      isAdmin: user.isAdmin,
      token: genrateToken(user.id),
    })
  } else {
    res.status(400)
    throw new Error('Invalid user data.')
  }
})

const getUserProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id)
  // console.log('%cuserController.js line:26 user', 'color: #007acc;', user);
  if (user) {
    return res.status(200).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      isAdmin: user.isAdmin,
    })
  } else {
    res.status(404)
    throw new Error('User not found!')
  }
})

const updateUserProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id)
  // console.log('%cuserController.js line:26 user', 'color: #007acc;', user);
  if (user) {
    user.name = req.body.name || user.name
    user.email = req.body.email || user.email
    if (req.body.password) {
      user.password = req.body.password
    }
    const updatedUser = await user.save()
    res.json({
      _id: updatedUser._id,
      name: updatedUser.name,
      email: updatedUser.email,
      isAdmin: updatedUser.isAdmin,
      token: genrateToken(updatedUser.id),
    })
  } else {
    res.status(404)
    throw new Error('User not found!')
  }
})

const getAllUsers = asyncHandler(async (req, res) => {
  const users = await User.find()
  if (users) {
    res.json(users)
  } else {
    res.status(404)
    throw new Error('User not found!')
  }
})

const deleteUser = asyncHandler(async (req, res) => {
  console.log(req.params.id)
  const user = await User.findById(req.params.id)
  if (user) {
    await user.remove()
    res.json({
      message: 'User removed',
    })
    res.json(user)
  } else {
    res.status(404)
    throw new Error('User not found!')
  }
})

const getUserById = asyncHandler(async (req, res) => {
  console.log(req.params.id)
  const user = await User.findById(req.params.id).select('-password')
  if (user) {
    res.json(user)
  } else {
    res.status(404)
    throw new Error('User not found!')
  }
})

const updateUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id)
  // console.log('%cuserController.js line:26 user', 'color: #007acc;', user);
  if (user) {
    user.name = req.body.name || user.name
    user.email = req.body.email || user.email
    user.isAdmin = req.body.isAdmin

    const updatedUser = await user.save()

    res.json({
      _id: updatedUser._id,
      name: updatedUser.name,
      email: updatedUser.email,
      isAdmin: updatedUser.isAdmin,
    })
  } else {
    res.status(404)
    throw new Error('User not found!')
  }
})

export {
  authUser,
  getUserProfile,
  updateUserProfile,
  registerUser,
  getAllUsers,
  deleteUser,
  getUserById,
  updateUser,
}
