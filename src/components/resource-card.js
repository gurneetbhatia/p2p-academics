import React from 'react';
import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faTrash, faInfoCircle } from '@fortawesome/free-solid-svg-icons';

class ResourceCard extends React.Component {
    constructor(props) {
        super(props);
        this.handleDelete = this.handleDelete.bind(this);
    }

    launchInfoPopup() {
        console.log("launching info popup")
    }

    handleDelete() {
        window.api.send("delete-resource", this.props.filename);
    }

    render() {
        return (
            <Card bg="secondary" key={0} text="white" style={{width: '18rem'}} className="mb-2">
                {/* <Card.Header>Repository title</Card.Header> */}
                <Card.Body>
                    <Card.Title>{this.props.title ? this.props.title : this.props.filename}</Card.Title>
                    <Card.Text>{this.props.abstract ? this.props.abstract : "Please complete the details for this resource (Click on the info icon below)."}</Card.Text>
                    <Card.Footer>
                        <Button variant="info" onClick={this.launchInfoPopup}><FontAwesomeIcon icon={faInfoCircle}></FontAwesomeIcon></Button>
                        <Button variant="info"><FontAwesomeIcon icon={faEye}></FontAwesomeIcon></Button>
                        <Button variant="danger" onClick={this.handleDelete}><FontAwesomeIcon icon={faTrash}></FontAwesomeIcon></Button>
                    </Card.Footer>
                </Card.Body>
            </Card>
        )
    }
}

export default ResourceCard