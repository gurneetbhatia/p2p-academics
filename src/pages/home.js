import React from 'react';
import './home.css';
import Sidebar from '../components/sidebar';
import { Container, Row, Col } from 'react-bootstrap';
import { Switch, Route } from 'react-router-dom';
import QueryPage from './query-page';
import RepositoryPage from './repository-page';
import ExplorePage from './explore-page';
import FindPeoplePage from './find-people-page';
import ChatsPage from './chats-page';

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
                            <Route path='/chats' component={ChatsPage}/>                        </Switch>
                    </Col>
                </Row>
            </Container>
        );
    }
}

export default HomePage