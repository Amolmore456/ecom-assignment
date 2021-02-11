import React, { useEffect } from 'react'
import { Row, Col, Button, ListGroup, Image, Card } from 'react-bootstrap'
import { useDispatch, useSelector } from 'react-redux'
import {
  getOrderDetails,
  payOrder,
  deliveredOrder,
} from '../store/actions/orderActions'
import { ORDER_DELIVERED_RESET } from '../store/allActionsConstants'
import { Link } from 'react-router-dom'
import Loader from '../components/Loader'
import Message from '../components/Message'

const OrderScreen = ({ match, history }) => {
  const orderId = match.params.id

  const dispatch = useDispatch()

  const userLogin = useSelector((state) => state.userLogin)
  const { userInfo } = userLogin

  const orderDetails = useSelector((state) => state.orderDetails)
  const { order, loading, error } = orderDetails

  const orderPay = useSelector((state) => state.orderPay)
  const { success } = orderPay

  const orderDelivered = useSelector((state) => state.orderDelivered)
  const {
    loading: loadingDelivered,
    success: successDelivered,
  } = orderDelivered

  if (!loading) {
    // Calc Price
    const addDecimal = (num) => {
      return (Math.round(num * 100) / 100).toFixed(2)
    }

    order.itemsPrice = addDecimal(
      order.orderItems.reduce((acc, item) => {
        return acc + item.price * item.qty
      }, 0)
    )
  }
  const payHandler = () => {
    console.log(orderId)
    dispatch(payOrder(orderId))
  }
  const deliveredHandler = () => {
    dispatch(deliveredOrder(order))
  }
  useEffect(() => {
    console.log('orderId')
    if (!userInfo) {
      history.push('/login')
    }
    dispatch(getOrderDetails(orderId))
    if (success || successDelivered) {
      dispatch(getOrderDetails(orderId))
      dispatch({ type: ORDER_DELIVERED_RESET })
    }
  }, [dispatch, orderId, success, successDelivered, history, userInfo])

  return (
    <>
      {loading ? (
        <Loader />
      ) : error ? (
        <Message variant='danger'> {error}</Message>
      ) : (
        <>
          <h1> Order {order._id}</h1>
          <Row>
            <Col md={8}>
              <ListGroup variant='flush'>
                <ListGroup.Item>
                  <h2>Shipping</h2>
                  <div>
                    <strong>Address: </strong>
                    {order.shippingAddress.address},{order.shippingAddress.city}
                    ,{order.shippingAddress.postalCode},
                    {order.shippingAddress.country}
                  </div>
                  <span>
                    {order.isDelivered ? (
                      <Message variant='success'>
                        Delivered on {order.deliveredAt}
                      </Message>
                    ) : (
                      <Message variant='danger'>Not Delivered</Message>
                    )}
                  </span>
                </ListGroup.Item>
                <ListGroup.Item>
                  <h2>Payment Method: </h2>
                  <span>
                    <strong>Payment Method: </strong>
                    {order.paymentMethod}
                  </span>
                  <span>
                    {order.isPaid ? (
                      <Message variant='success'>
                        Paid on {order.paidAt}
                      </Message>
                    ) : (
                      <Message variant='danger'>Not Paid</Message>
                    )}
                  </span>
                </ListGroup.Item>
                <ListGroup.Item>
                  <h2>Order Items</h2>
                  <span>
                    <strong>Cart Items:</strong>
                    {order.orderItems.length === 0 ? (
                      <Message>Your cart is empty.</Message>
                    ) : (
                      <ListGroup variant='flush'>
                        {order.orderItems.map((item, idx) => {
                          return (
                            <ListGroup.Item key={idx}>
                              <Row>
                                <Col lg={1} md={2} sm={3}>
                                  <Image
                                    src={item.image}
                                    alt={item.name}
                                    fluid
                                    rounded
                                  ></Image>
                                </Col>
                                <Col>
                                  <Link to={`/product/${item.product}`}>
                                    {item.name}
                                  </Link>
                                </Col>
                                <Col md={4}>
                                  {item.qty} x $ {item.price} ={'$ '}
                                  {item.qty * item.price}
                                </Col>
                              </Row>
                            </ListGroup.Item>
                          )
                        })}
                      </ListGroup>
                    )}
                  </span>
                </ListGroup.Item>
              </ListGroup>
            </Col>
            <Col md={4}>
              <Card>
                <ListGroup>
                  <ListGroup.Item>
                    <h2>Order Summery</h2>
                  </ListGroup.Item>
                  <ListGroup.Item>
                    <Row>
                      <Col>Items</Col>
                      <Col>$ {order.itemsPrice}</Col>
                    </Row>
                  </ListGroup.Item>
                  <ListGroup.Item>
                    <Row>
                      <Col>Shipping</Col>
                      <Col>$ {order.shippingPrice}</Col>
                    </Row>
                  </ListGroup.Item>
                  <ListGroup.Item>
                    <Row>
                      <Col>Tax</Col>
                      <Col>$ {order.taxPrice}</Col>
                    </Row>
                  </ListGroup.Item>
                  <ListGroup.Item>
                    <Row>
                      <Col>Total</Col>
                      <Col>$ {order.totalPrice}</Col>
                    </Row>
                  </ListGroup.Item>
                </ListGroup>
                <ListGroup.Item>
                  <Button
                    type='button'
                    className='btn-block'
                    onClick={payHandler}
                  >
                    Pay
                  </Button>
                </ListGroup.Item>
                {loadingDelivered && <Loader />}
                {userInfo &&
                  userInfo.isAdmin &&
                  order.isPaid &&
                  !order.isDelivered && (
                    <ListGroup.Item>
                      <Button
                        type='button'
                        className='btn btn-block'
                        onClick={deliveredHandler}
                      >
                        Mark as Delivered
                      </Button>
                    </ListGroup.Item>
                  )}
              </Card>
            </Col>
          </Row>
        </>
      )}
    </>
  )
}

export default OrderScreen
