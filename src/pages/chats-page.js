import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import ChatsSidebar from '../components/chats-sidebar';

class ChatsPage extends React.Component {
    render() {
        return (
            <div>
                <Container fluid>
                    <Row>
                        <Col xs={2} id="chats-sidebar-wrapper">
                            <ChatsSidebar chats={[{serverUID: 'abc', name: 'gurneet'}]}></ChatsSidebar>
                        </Col>
                        <Col xs={10} id="chats-page-content-wrapper">
                            the main text chat goes here
                        </Col>
                    </Row>
                </Container>
                {/* <ChatsSidebar chats={[{serverUID: 'abc', name: 'gurneet'}]}></ChatsSidebar> */}
            </div>
        );
    }
}

export default ChatsPage;