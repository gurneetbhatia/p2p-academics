import React from 'react';
import Nav from 'react-bootstrap/Nav';

class Sidebar extends React.Component {
    render() {
        return (
            <Nav className='col-md-12 d-none d-md-block bg-dark sidebar'>
                <div className="sidebar-sticky"></div>
                <Nav.Item>
                    <Nav.Link href='/'>Query</Nav.Link>
                </Nav.Item>
                <Nav.Item>
                    <Nav.Link href='/'>My Repository</Nav.Link>
                </Nav.Item>
                <Nav.Item>
                    <Nav.Link href='/'>Network</Nav.Link>
                </Nav.Item>
                <Nav.Item>
                    <Nav.Link href='/'>Find people</Nav.Link>
                </Nav.Item>
                <Nav.Item>
                    <Nav.Link href='/'>Chats</Nav.Link>
                </Nav.Item>
                <Nav.Item>
                    <Nav.Link href='/'>Settings</Nav.Link>
                </Nav.Item>
            </Nav>
        );
    }
}

export default Sidebar;