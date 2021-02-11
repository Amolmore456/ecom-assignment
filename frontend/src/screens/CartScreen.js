import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
import { Row, Col, ListGroup, Image, Form, Button, Card } from 'react-bootstrap'
import { addToCart, removeFromCart } from '../store/actions/cartActions'
import Message from '../components/Message'

const CartScreen = ({ match, location, history }) => {
  const productId = match.params.id
  const qty = location.search ? Number(location.search.split('=')[1]) : 1
  const dispatch = useDispatch()
  const cart = useSelector((state) => state.cart)
  const { cartItems } = cart

  useEffect(() => {
    if (productId) {
      dispatch(addToCart(productId, qty))
    }
  }, [dispatch, productId, qty])

  const removeFromCartHandler = (id) => {
    dispatch(removeFromCart(id))
    console.log('Removed', id)
  }
  const checkoutHandler = () => {
    console.log('CheckoutClick')
    history.push('/login?redirect=shipping')
  }
  return (
    <>
      <Row>
        <Col md={8}>
          <h1>Shoppping Cart</h1>
          {cartItems.length === 0 ? (
            <Message variant='warning'>
              Your Cart is empty! <Link to='/'>Go Back</Link>
            </Message>
          ) : (
            <ListGroup>
              {cartItems.map((item) => {
                return (
                  <ListGroup.Item key={item.product} variant='flush'>
                    <Row>
                      <Col md={2}>
                        <Image
                          src={item.image}
                          alt={item.name}
                          style={{
                            height: '100px',
                            width: '100px',
                            display: 'flex',
                          }}
                        ></Image>
                      </Col>
                      <Col md={3}>
                        <Link to={`/product/${item.product}`}>{item.name}</Link>
                      </Col>
                      <Col md={2}>${item.price}</Col>
                      <Col md={2}>
                        <Form.Control
                          as='select'
                          value={item.qty}
                          onChange={(e) => {
                            dispatch(
                              addToCart(item.product, Number(e.target.value))
                            )
                          }}
                        >
                          {[...Array(item.countInStock).keys()].map((x) => (
                            <option key={x + 1} value={x + 1}>
                              {x + 1}
                            </option>
                          ))}
                        </Form.Control>
                      </Col>
                      <Col md={2}>
                        <Button
                          type='button'
                          variant='danger'
                          onClick={() => removeFromCartHandler(item.product)}
                        >
                          <i className='fas fa-trash'></i>
                        </Button>
                      </Col>
                    </Row>
                  </ListGroup.Item>
                )
              })}
            </ListGroup>
          )}
        </Col>
        <Col md={4}>
          <h1>
            Subtotal:(
            {cartItems.reduce((acc, items) => acc + items.qty, 0)}) items
          </h1>
          <Card>
            <ListGroup variant='flush'>
              <ListGroup.Item>
                $
                {cartItems
                  .reduce((acc, items) => acc + items.price * items.qty, 0)
                  .toFixed(2)}
              </ListGroup.Item>
              <ListGroup.Item>
                <Button
                  type='button'
                  className='btn-block'
                  disabled={cartItems.length === 0}
                  onClick={checkoutHandler}
                >
                  Proceed To Checkout
                </Button>
              </ListGroup.Item>
            </ListGroup>
          </Card>
        </Col>
      </Row>
    </>
  )
}

export default CartScreen
