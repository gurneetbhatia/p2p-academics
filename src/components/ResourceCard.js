import React from 'react';
import Card from 'react-bootstrap/Card';

class ResourceCard extends React.Component {
    render() {
        return (
            <Card bg="secondary" key={0} text="white" style={{width: '18rem'}} className="mb-2">
                {/* <Card.Header>Repository title</Card.Header> */}
                <Card.Body>
                    <Card.Title>{this.props.title}</Card.Title>
                    <Card.Text>{this.props.abstract}</Card.Text>
                    <Card.Footer>{this.props.authors.join(' ')}</Card.Footer>
                </Card.Body>
            </Card>
        )
    }
}

export default ResourceCard