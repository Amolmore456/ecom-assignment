import React, { useEffect } from 'react'
import { LinkContainer } from 'react-router-bootstrap'
import { Button, Table } from 'react-bootstrap'
import { useDispatch, useSelector } from 'react-redux'
import { listAllUsers, deleteUsers } from '../store/actions/userActions'
import Message from '../components/Message'
import Loader from '../components/Loader'

const UserListScreen = ({ history }) => {
  const dispatch = useDispatch()
  const userList = useSelector((state) => state.listUsers)
  const { loading, error, users = [] } = userList

  const userLoggedIn = useSelector((state) => state.userLogin)
  const { userInfo } = userLoggedIn

  const userDelete = useSelector((state) => state.userDelete)
  const { success: successDelete } = userDelete
  const deleteUser = (id) => {
    if (window.confirm('Are you sure?')) dispatch(deleteUsers(id))
  }

  useEffect(() => {
    if (userInfo && userInfo.isAdmin) {
      dispatch(listAllUsers())
    } else {
      history.push('/login')
    }
  }, [dispatch, history, successDelete, userInfo])

  return (
    <>
      {loading ? (
        <Loader />
      ) : error ? (
        <Message variant='danger'>{error}</Message>
      ) : (
        <Table striped bordered hover responsive className='table-sm'>
          <thead>
            <tr>
              <td>ID</td>
              <td>NAME</td>
              <td>EMAIL</td>
              <td>ADMIN</td>
              <td>ACTIONS</td>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => {
              return (
                <tr key={user._id}>
                  <td>{user._id}</td>
                  <td>{user.name}</td>
                  <td>
                    <a href={`mailto: ${user.email}`}>{user.email}</a>
                  </td>
                  <td>
                    {user.isAdmin ? (
                      <i
                        className='fas fa-check'
                        style={{ color: 'green' }}
                      ></i>
                    ) : (
                      <i className='fas fa-times' style={{ color: 'red' }}></i>
                    )}
                  </td>
                  <td>
                    <LinkContainer to={`/admin/user/${user._id}/edit`}>
                      <Button variant='light' className='btn-sm'>
                        <i className='fas fa-edit'></i>
                      </Button>
                    </LinkContainer>
                    <Button
                      variant='danger'
                      className='btn-sm'
                      onClick={() => deleteUser(user._id)}
                    >
                      <i className='fas fa-trash'></i>
                    </Button>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </Table>
      )}
    </>
  )
}

export default UserListScreen
