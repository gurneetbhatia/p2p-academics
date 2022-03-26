import React from 'react';
import Card from 'react-bootstrap/Card';

class ProfileCard extends React.component {
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
                <Card style={{ width: '18rem' }}>
                    <Card.Body>
                        <Card.Title>{this.state.name}</Card.Title>
                        <Card.Body><h3>Knowledge Domains:</h3><br></br>{this.state.knowledgeDomains}</Card.Body>
                    </Card.Body>
                </Card>
            </div>
        );
    }
}

export default ProfileCard;