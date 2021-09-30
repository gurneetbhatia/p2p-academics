import React from 'react';
import Nav from 'react-bootstrap/Nav';
import OverlayTrigger from 'react-bootstrap/OverlayTrigger';
import Tooltip from 'react-bootstrap/Tooltip';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBook, faQuestionCircle, faCompass, faUserFriends, faComment, faCog } from '@fortawesome/free-solid-svg-icons';

class Sidebar extends React.Component {
    render() {
        return (
            <Nav className='col-md-12 d-none d-md-block bg-dark sidebar'>
                <div className="sidebar-sticky"></div>
                <Nav.Item>
                    <OverlayTrigger key="right" placement="right" overlay={<Tooltip>Run Query</Tooltip>}>
                        <Nav.Link href='/query'><FontAwesomeIcon icon={faQuestionCircle}/></Nav.Link>
                    </OverlayTrigger>
                </Nav.Item>
                <Nav.Item>
                    <OverlayTrigger key="right" placement="right" overlay={<Tooltip>My Repository</Tooltip>}>
                        <Nav.Link href='/repository'><FontAwesomeIcon icon={faBook}/></Nav.Link>
                    </OverlayTrigger>
                </Nav.Item>
                <Nav.Item>
                    <OverlayTrigger key="right" placement="right" overlay={<Tooltip>Explore Repositories</Tooltip>}>
                        <Nav.Link href='/explore'><FontAwesomeIcon icon={faCompass}/></Nav.Link>
                    </OverlayTrigger>
                </Nav.Item>
                <Nav.Item>
                    <OverlayTrigger key="right" placement="right" overlay={<Tooltip>Find people</Tooltip>}>
                        <Nav.Link href='/find-people'><FontAwesomeIcon icon={faUserFriends}/></Nav.Link>
                    </OverlayTrigger>
                </Nav.Item>
                <Nav.Item>
                    <OverlayTrigger key="right" placement="right" overlay={<Tooltip>Chats</Tooltip>}>
                        <Nav.Link href='/chats'><FontAwesomeIcon icon={faComment}/></Nav.Link>
                    </OverlayTrigger>
                </Nav.Item>
                <Nav.Item>
                    <OverlayTrigger key="right" placement="right" overlay={<Tooltip>Settings</Tooltip>}>
                        <Nav.Link href='/settings'><FontAwesomeIcon icon={faCog}/></Nav.Link>
                    </OverlayTrigger>
                </Nav.Item>
            </Nav>
        );
    }
}

export default Sidebar;