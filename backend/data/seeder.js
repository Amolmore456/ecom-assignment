import dotenv from 'dotenv'
import users from './users.js'
import products from './products.js'
import User from '../models/userModel.js'
import Products from '../models/productsModel.js'
import Order from '../models/orderModel.js'
import connectDB from '../config/db.js'

dotenv.config()
connectDB()

const importData = async () => {
  try {
    await Order.deleteMany()
    await Products.deleteMany()
    await User.deleteMany()

    const createdUsers = await User.insertMany(users)
    const adminUser = createdUsers[0]._id

    const sampleProducts = products.map((products) => {
      return { ...products, user: adminUser }
    })
    await Products.insertMany(sampleProducts)

    console.log('Data imported successfully')
    process.exit()
  } catch (error) {
    console.error(`Error on seeding: ${error}`)
    process.exit(1)
  }
}

const destroyData = async () => {
  try {
    await Order.deleteMany()
    await Products.deleteMany()
    await User.deleteMany()

    console.log('Data destroyed successfully')
    process.exit()
  } catch (error) {
    console.error(`Error on seeding: ${error}`)
    process.exit(1)
  }
}

if (process.argv[2] == '-d') {
  destroyData()
} else {
  importData()
}
