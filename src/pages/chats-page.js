import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import ChatsSidebar from '../components/chats-sidebar';

class ChatsPage extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            activeChats: [],
            availableChats: []
        }
    }

    componentWillMount() {
        window.api.receive("return-active-chats", (response) => {
            if (response) {
                console.log(response);
                this.setState({activeChats: response});
            }
        });

        window.api.receive("return-user-profiles", (response) => {
            if (response) {
                this.setState({availableChats: response});
            }
        });

        window.api.send("get-active-chats", {});
        window.api.send("get-user-profiles", {});
    }

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