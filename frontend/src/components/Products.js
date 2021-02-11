import React from 'react'
import { Link } from 'react-router-dom'
import { Card } from 'react-bootstrap'
import Rating from './Rating'

export const Products = ({ products }) => {
  return (
    <>
      <Card className='my-3 p-2 rounded'>
        <Link to={`/product/${products._id}`}>
          <Card.Img src={products.image} variant='top' />
        </Link>
        <Card.Body>
          <Link to={`/product/${products._id}`}>
            <Card.Title as='div'>
              <strong> {products.name}</strong>
            </Card.Title>
          </Link>
          <Card.Text as='div'>
            <Rating
              values={products.rating}
              text={`${products.numReviews} reviews`}
            />
          </Card.Text>
          <Card.Text as='h3'>${products.price}</Card.Text>
        </Card.Body>
      </Card>
    </>
  )
}
export default Products
