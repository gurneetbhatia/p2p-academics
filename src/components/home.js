import React from 'react';
import './home.css';
import Sidebar from './sidebar';
import { Container, Row, Col } from 'react-bootstrap';

class HomePage extends React.Component {
    render() {
        return (
            <Container fluid>
                <Row>
                    <Col xs={2} id="sidebar-wrapper">
                        <Sidebar className="sidebar"/>
                    </Col>
                    <Col xs={10} id="page-content-wrapper">
                        this is a test
                    </Col>
                </Row>
            </Container>
        );
    }
}

export default HomePage