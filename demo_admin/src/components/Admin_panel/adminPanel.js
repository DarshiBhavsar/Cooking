import React, { useState } from 'react';
import { Container, Row, Col, Navbar, Nav, Table, Dropdown } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';

const AdminPanel = () => {
    const [activeSection, setActiveSection] = useState('dashboard');

    const renderContent = () => {
        switch (activeSection) {
            case 'dashboard':
                return <h2>Dashboard Content</h2>;
            case 'orders':
                return <h2>Orders Content</h2>;
            case 'products':
                return <h2>Products Content</h2>;
            case 'customers':
                return <h2>Customers Content</h2>;
            case 'reports':
                return <h2>Reports Content</h2>;
            case 'integrations':
                return <h2>Integrations Content</h2>;
            default:
                return <h2>Dashboard Content</h2>;
        }
    };

    return (
        <Container fluid>
            <Row>
                <Col md={2} className="d-none d-md-block bg-light sidebar">
                    <div className="sidebar-sticky">
                        <Nav className="flex-column">
                            <Nav.Item>
                                <Nav.Link href="#" active={activeSection === 'dashboard'} onClick={() => setActiveSection('dashboard')}>Dashboard</Nav.Link>
                            </Nav.Item>
                            <Nav.Item>
                                <Nav.Link href="#" active={activeSection === 'orders'} onClick={() => setActiveSection('orders')}>Orders</Nav.Link>
                            </Nav.Item>
                            <Nav.Item>
                                <Nav.Link href="#" active={activeSection === 'products'} onClick={() => setActiveSection('products')}>Products</Nav.Link>
                            </Nav.Item>
                            <Nav.Item>
                                <Nav.Link href="#" active={activeSection === 'customers'} onClick={() => setActiveSection('customers')}>Customers</Nav.Link>
                            </Nav.Item>
                            <Nav.Item>
                                <Nav.Link href="#" active={activeSection === 'reports'} onClick={() => setActiveSection('reports')}>Reports</Nav.Link>
                            </Nav.Item>
                            <Nav.Item>
                                <Nav.Link href="#" active={activeSection === 'integrations'} onClick={() => setActiveSection('integrations')}>Integrations</Nav.Link>
                            </Nav.Item>
                        </Nav>
                    </div>
                </Col>

                <Col md={9} className="ml-sm-auto col-lg-10 px-4">
                    <Navbar bg="light" expand="lg" className="border-bottom">
                        <Navbar.Brand href="#">Admin Panel</Navbar.Brand>
                        <Navbar.Toggle aria-controls="basic-navbar-nav" />
                        <Navbar.Collapse id="basic-navbar-nav">
                            <Nav className="mr-auto">
                                <Nav.Link href="#">Share</Nav.Link>
                                <Nav.Link href="#">Export</Nav.Link>
                            </Nav>
                            <Dropdown>
                                <Dropdown.Toggle variant="outline-secondary" id="dropdown-basic">
                                    This week
                                </Dropdown.Toggle>
                                <Dropdown.Menu>
                                    <Dropdown.Item href="#">Action</Dropdown.Item>
                                    <Dropdown.Item href="#">Another action</Dropdown.Item>
                                    <Dropdown.Item href="#">Something else here</Dropdown.Item>
                                </Dropdown.Menu>
                            </Dropdown>
                        </Navbar.Collapse>
                    </Navbar>

                    <div className="mt-4">
                        {renderContent()}
                    </div>

                    <Table striped bordered hover size="sm" responsive className="mt-4">
                        <thead>
                            <tr>
                                <th>#</th>
                                <th>Header</th>
                                <th>Header</th>
                                <th>Header</th>
                                <th>Header</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td>1,001</td>
                                <td>Lorem</td>
                                <td>ipsum</td>
                                <td>dolor</td>
                                <td>sit</td>
                            </tr>
                            <tr>
                                <td>1,002</td>
                                <td>amet</td>
                                <td>consectetur</td>
                                <td>adipiscing</td>
                                <td>elit</td>
                            </tr>
                            <tr>
                                <td>1,003</td>
                                <td>Integer</td>
                                <td>nec</td>
                                <td>odio</td>
                                <td>Praesent</td>
                            </tr>
                            <tr>
                                <td>1,004</td>
                                <td>libero</td>
                                <td>Sed</td>
                                <td>cursus</td>
                                <td>ante</td>
                            </tr>
                            <tr>
                                <td>1,005</td>
                                <td>dapibus</td>
                                <td>diam</td>
                                <td>Sed</td>
                                <td>nisi</td>
                            </tr>
                        </tbody>
                    </Table>
                </Col>
            </Row>
        </Container>
    );
};

export default AdminPanel;
