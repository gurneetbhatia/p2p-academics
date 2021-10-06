import React from 'react';
import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faTrash } from '@fortawesome/free-solid-svg-icons';

class ResourceCard extends React.Component {
    render() {
        return (
            <Card bg="secondary" key={0} text="white" style={{width: '18rem'}} className="mb-2">
                {/* <Card.Header>Repository title</Card.Header> */}
                <Card.Body>
                    <Card.Title>{this.props.title}</Card.Title>
                    <Card.Text>{this.props.abstract}</Card.Text>
                    <Card.Footer>
                        <Button variant="info"><FontAwesomeIcon icon={faEye}></FontAwesomeIcon></Button>
                        <Button variant="danger"><FontAwesomeIcon icon={faTrash}></FontAwesomeIcon></Button>
                    </Card.Footer>
                </Card.Body>
            </Card>
        )
    }
}

export default ResourceCard