import { Container } from 'react-bootstrap'
import { Row, Col } from 'react-bootstrap'

const Footer = () => {
  return (
    <>
      <Container>
        <Row>
          <Col className='text-center py-3'>
            <span>Copyrights &copy; devswag.com</span>
          </Col>
        </Row>
      </Container>
    </>
  )
}

export default Footer
