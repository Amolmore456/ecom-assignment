import express from 'express'
import {
  addOrderItems,
  getMyOrder,
  getOrderById,
  updateOrderToPaid,
  getOrders,
  updateOrderToDelivered,
} from '../controllers/orderController.js'
import { isAdmin, protect } from '../middlewares/authMiddleware.js'
const router = express.Router()

router.route('/').post(protect, addOrderItems).get(protect, isAdmin, getOrders)
router.route('/myorders').get(protect, getMyOrder)
router.route('/:id').get(protect, getOrderById)
router.route('/:id/pay').put(protect, updateOrderToPaid)
router.route('/:id/delivered').put(protect, isAdmin, updateOrderToDelivered)

export default router
