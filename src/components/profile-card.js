import React from 'react';
import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faComment } from '@fortawesome/free-solid-svg-icons';

class ProfileCard extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            name: props.name,
            knowledgeDomains: props.knowledgeDomains
        };
    }

    render() {
        return(
            <div>
                <Card bg="secondary" key={0} text="white" style={{ width: '18rem' }} className="mb-2">
                    <Card.Body>
                        <Card.Title>{this.state.name}</Card.Title>
                        <Card.Body><h3>Knowledge Domains:</h3><br></br>{this.state.knowledgeDomains}</Card.Body>
                    </Card.Body>
                    <Button variant="info"><FontAwesomeIcon icon={faComment}></FontAwesomeIcon> Chat</Button>
                </Card>
            </div>
        );
    }
}

export default ProfileCard;