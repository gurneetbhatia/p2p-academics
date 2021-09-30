import React from 'react';
import './home.css';
import Sidebar from './sidebar';
import { Container, Row, Col } from 'react-bootstrap';
import { Switch, Route } from 'react-router-dom';
import QueryPage from '../pages/query-page';
import RepositoryPage from '../pages/repository-page';
import ExplorePage from '../pages/explore-page';
import FindPeoplePage from '../pages/find-people-page';
import ChatsPage from '../pages/chats-page';
import SettingsPage from '../pages/settings-page';

class HomePage extends React.Component {
    render() {
        return (
            <Container fluid>
                <Row>
                    <Col xs={2} id="sidebar-wrapper">
                        <Sidebar className="sidebar"/>
                    </Col>
                    <Col xs={10} id="page-content-wrapper">
                        <Switch>
                            <Route path='/query' component={QueryPage}/>
                            <Route path='/repository' component={RepositoryPage}/>
                            <Route path='/explore' component={ExplorePage}/>
                            <Route path='/find-people' component={FindPeoplePage}/>
                            <Route path='/chats' component={ChatsPage}/>
                            <Route path='/settings' component={SettingsPage}/>
                        </Switch>
                    </Col>
                </Row>
            </Container>
        );
    }
}

export default HomePage