import React from 'react';
import Nav from 'react-bootstrap/Nav';

class ChatsSidebar extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            chats: props.chats
        };
    }

    render() {
        return (
            <Nav className="col-md-12 d-none d-md-block bg-dark chats-sidebar">
                <div className="sidebar-sticky"></div>
                {
                    this.state.chats.map((element, index) => {
                        return (
                                    <Nav.Item>
                                        <Nav.Link key={index} href={'/chats?uid='+element.serverUID}>{element.name}</Nav.Link>
                                    </Nav.Item>
                            )
                    })
                }
            </Nav>
        )
    }
}

export default ChatsSidebar;