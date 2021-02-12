import {
  Navbar,
  Nav,
  NavDropdown,
  Badge,
  Button,
  Container,
} from 'react-bootstrap'
import { useDispatch, useSelector } from 'react-redux'
import { Route } from 'react-router-dom'
import { LinkContainer } from 'react-router-bootstrap'
import { logout } from '../store/actions/userActions'

import SearchBox from './SearchBox'

const Header = () => {
  const dispatch = useDispatch()
  const userLogin = useSelector((state) => state.userLogin)
  const { cartItems } = useSelector((state) => state.cart)

  const { userInfo } = userLogin
  const logoutHandler = () => {
    dispatch(logout())
    console.log('Logout')
  }

  return (
    <>
      <Navbar
        style={{ height: '80px' }}
        bg='light'
        expand='lg'
        collapseOnSelect
      >
        <Container>
          <LinkContainer to='/'>
            <Navbar.Brand>Dev Swag</Navbar.Brand>
          </LinkContainer>
          <Navbar.Toggle aria-controls='basic-navbar-nav' />
          <Navbar.Collapse id='basic-navbar-nav'>
            <Route render={({ history }) => <SearchBox history={history} />} />
            <Nav className='ml-auto'>
              <LinkContainer to='/cart'>
                <Nav.Link>
                  <i className='fas fa-shopping-cart'></i>
                  <span className='ml-1'>Cart</span>
                </Nav.Link>
              </LinkContainer>
              <span
                style={{
                  width: '25px',
                  height: '25px',
                  backgroundColor: '#CC0000',
                  color: '#ffffff',
                  borderRadius: '50%',
                  textAlign: 'center',
                }}
              >
                {cartItems.length}
              </span>
              {userInfo ? (
                <NavDropdown title={userInfo.name} id='username'>
                  <LinkContainer to='/profile'>
                    <NavDropdown.Item>Profile</NavDropdown.Item>
                  </LinkContainer>
                  <NavDropdown.Item onClick={logoutHandler}>
                    Logout
                  </NavDropdown.Item>
                </NavDropdown>
              ) : (
                <LinkContainer to='/login'>
                  <Nav.Link>
                    <i className='fas fa-user'></i> Sign In
                  </Nav.Link>
                </LinkContainer>
              )}
            </Nav>
            {userInfo && userInfo.isAdmin ? (
              <NavDropdown title='Admin' id='adminmenu'>
                <LinkContainer to='/admin/userlist'>
                  <NavDropdown.Item>Users</NavDropdown.Item>
                </LinkContainer>
                <LinkContainer to='/admin/productlist'>
                  <NavDropdown.Item>Product</NavDropdown.Item>
                </LinkContainer>
                <LinkContainer to='/admin/orderlist'>
                  <NavDropdown.Item>Orders</NavDropdown.Item>
                </LinkContainer>
              </NavDropdown>
            ) : (
              <></>
            )}
          </Navbar.Collapse>
        </Container>
      </Navbar>
    </>
  )
}

export default Header
