import React, { useEffect } from 'react'
import { LinkContainer } from 'react-router-bootstrap'
import { Button, Table, Row, Col } from 'react-bootstrap'
import { useDispatch, useSelector } from 'react-redux'
import {
  listProducts,
  deleteProduct,
  createProduct,
} from '../store/actions/productActions'
import { PRODUCT_CREATE_RESET } from '../store/allActionsConstants'
import Message from '../components/Message'
import Loader from '../components/Loader'
import Paginate from '../components/Paginate'

const ProductListScreen = ({ history, match }) => {
  const dispatch = useDispatch()
  const productList = useSelector((state) => state.productList)
  const { loading, error, products = [], pages, page } = productList
  const pageNumber = match.params.pageNumber || 1

  const productDelete = useSelector((state) => state.productDelete)
  const {
    loading: loadingDelete,
    error: errorDelete,
    success: successDelete,
  } = productDelete

  const productCreate = useSelector((state) => state.productCreate)
  const {
    loading: loadingCreate,
    error: errorCreate,
    success: successCreate,
    product: createdProduct,
  } = productCreate

  const userLoggedIn = useSelector((state) => state.userLogin)
  const { userInfo } = userLoggedIn

  useEffect(() => {
    dispatch({ type: PRODUCT_CREATE_RESET })

    if (!userInfo.isAdmin) {
      history.push('/login')
    }
    if (successCreate) {
      console.log(createdProduct)
      history.push(`/admin/product/${createdProduct._id}/edit`)
    } else {
      dispatch(listProducts('', pageNumber))
    }
    if (successDelete) {
      dispatch(listProducts('', pageNumber))
    }
  }, [
    dispatch,
    history,
    userInfo,
    successCreate,
    successDelete,
    createdProduct,
    pageNumber,
  ])

  const deleteProductHandler = (id) => {
    console.log(id)
    dispatch(deleteProduct(id))
  }

  const createProductHandler = () => {
    // console.log(product)
    dispatch(createProduct())
  }
  return (
    <>
      <Row className='align-items-center'>
        <Col>
          <h1>Products</h1>
        </Col>
        <Col className='text-right'>
          <Button className='my-3' onClick={createProductHandler}>
            <i className='fas fa-plus'></i> Create Product
          </Button>
        </Col>
      </Row>
      {loadingDelete && <Loader />}
      {errorDelete && <Message variant='danger'>{errorDelete}</Message>}

      {loadingCreate && <Loader />}
      {errorCreate && <Message variant='danger'>{errorDelete}</Message>}

      {loading ? (
        <Loader />
      ) : error ? (
        <Message variant='danger'>{error}</Message>
      ) : (
        <>
          <Table striped bordered hover responsive className='table-sm'>
            <thead>
              <tr>
                <td>ID</td>
                <td>NAME</td>
                <td>PRICE</td>
                <td>CATEGORY</td>
                <td>BRAND</td>
                <td>ACTION</td>
              </tr>
            </thead>
            <tbody>
              {products.map((product) => {
                return (
                  <tr key={product._id}>
                    <td>{product._id}</td>
                    <td>{product.name}</td>
                    <td>$ {product.price}</td>
                    <td>{product.category}</td>
                    <td>{product.brand}</td>
                    <td>
                      <LinkContainer to={`/admin/product/${product._id}/edit`}>
                        <Button variant='light' className='btn-sm'>
                          <i className='fas fa-edit'></i>
                        </Button>
                      </LinkContainer>
                      <Button
                        variant='danger'
                        className='btn-sm'
                        onClick={() => deleteProductHandler(product._id)}
                      >
                        <i className='fas fa-trash'></i>
                      </Button>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </Table>
          <Paginate pages={pages} page={page} isAdmin={true}></Paginate>
        </>
      )}
    </>
  )
}

export default ProductListScreen
