import React from 'react';
import Button from 'react-bootstrap/Button';
import Container from 'react-bootstrap/Container';
import Form from 'react-bootstrap/Form';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import NavDropdown from 'react-bootstrap/NavDropdown';
import 'bootstrap-icons/font/bootstrap-icons.css';
import '../navbar/navbar.css';

function NavbarExample({ Toggle }) {
    return (
        <Navbar expand="lg" className="navbar1 sticky-top">
            <Container fluid>
                <Navbar.Brand href="#" className='d-none d-md-block text-white navbar-brand'>Recipes</Navbar.Brand>
                <Navbar.Brand href="#" className='d-block d-md-none navbar-brand' onClick={() => {
                    console.log('Toggle icon clicked');
                    Toggle();
                }}>
                    <i className='bi bi-justify'></i>
                </Navbar.Brand>
                <Navbar.Toggle aria-controls="navbarScroll" />
                <Navbar.Collapse id="navbarScroll">
                    <Nav
                        className="me-auto my-2 my-lg-0 "
                        style={{ maxHeight: '100px' }}
                        navbarScroll
                    >
                        {/* <Nav.Link href="#action1" className='nav-link'>Home</Nav.Link>
                        <Nav.Link href="#action2" className='nav-link'>Link</Nav.Link>
                        <NavDropdown title="Link" id="navbarScrollingDropdown">
                            <NavDropdown.Item href="#action3" className='dropdown-item'>Action</NavDropdown.Item>
                            <NavDropdown.Item href="#action4" className='dropdown-item'>
                                Another action
                            </NavDropdown.Item>
                            <NavDropdown.Divider />
                            <NavDropdown.Item href="#action5" className='dropdown-item'>
                                Something else here
                            </NavDropdown.Item>
                        </NavDropdown>
                        <Nav.Link href="#" className='nav-link' disabled>
                            Link
                        </Nav.Link> */}
                    </Nav>
                    <Form className="d-flex">
                        <Form.Control
                            type="search"
                            placeholder="Search"
                            className="me-2 form-control"
                            aria-label="Search"
                        />
                        <Button variant="outline-success" className="btn-outline-success">Search</Button>
                    </Form>
                </Navbar.Collapse>
            </Container>
        </Navbar>
    );
}

export default NavbarExample;
