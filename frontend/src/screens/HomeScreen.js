import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { listProducts } from '../store/actions/productActions'
import Products from '../components/Products'
import Message from '../components/Message'
import Loader from '../components/Loader'
import Paginate from '../components/Paginate'

import { Row, Col } from 'react-bootstrap'

const HomeScreen = ({ match }) => {
  const keyword = match.params.keyword
  const pageNumber = match.params.pageNumber || 1
  const dispath = useDispatch()
  const productList = useSelector((state) => state.productList)
  const { loading, error, products = [], page, pages } = productList
  useEffect(() => {
    dispath(listProducts(keyword, pageNumber))
  }, [dispath, keyword, pageNumber])
  return (
    <>
      <h1>Grab Your Swag Stickers</h1>
      {loading ? (
        <Loader />
      ) : error ? (
        <Message variant='danger'> {error} </Message>
      ) : (
        <Row>
          {products.map((product) => {
            return (
              <Col key={product._id} sm={12} md={6} lg={4} xl={3}>
                <Products products={product} />
              </Col>
            )
          })}
        </Row>
      )}
      <Paginate
        page={page}
        pages={pages}
        keyword={keyword ? keyword : ''}
      ></Paginate>
    </>
  )
}

export default HomeScreen
