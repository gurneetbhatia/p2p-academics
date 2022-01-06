import React from 'react';
import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import ButtonGroup from 'react-bootstrap/ButtonGroup';
import ButtonToolbar from 'react-bootstrap/ButtonToolbar';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faTrash, faInfoCircle } from '@fortawesome/free-solid-svg-icons';
import Modal from 'react-bootstrap/Modal';
import './resource-card.css';

class ResourceCard extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            showModal: false,
            filename: props.filename,
            title: props.title,
            abstract: props.abstract,
            authors: props.authors,
            knowledgeDomains: props.knowledgeDomains
        };

        this.handleModalClose = this.handleModalClose.bind(this);
        this.handleModalShow = this.handleModalShow.bind(this);
        this.handleDelete = this.handleDelete.bind(this);
        this.handleInfoModalSubmit = this.handleInfoModalSubmit.bind(this);
        this.handleInfoModalChange = this.handleInfoModalChange.bind(this);
    }

    handleModalClose() {
        this.setState({showModal: false});
    }

    handleModalShow() {
        this.setState({showModal: true});
    }

    handleDelete() {
        window.api.send("delete-resource", this.state.filename);
        window.location.reload(false);
    }

    handleInfoModalSubmit(event) {
        console.log(event);
        event.preventDefault();
    }

    handleInfoModalChange(event) {
        if (event.target.id === 'title') {
            this.setState({title: event.target.value});
        }
        else if (event.target.id === "authors") {
            console.log(event);
            console.log(event.target.value);
        }
    }

    render() {
        return (
            <>
                <Card bg="secondary" key={0} text="white" style={{width: '18rem'}} className="mb-2">
                    {/* <Card.Header>Repository title</Card.Header> */}
                    <Card.Body>
                        <Card.Title>{this.state.title ? this.state.title : this.state.filename}</Card.Title>
                        <Card.Text>{this.state.abstract ? this.state.abstract : "Please complete the details for this resource (Click on the info icon below)."}</Card.Text>
                        <Card.Footer>
                            <Button variant="info" onClick={this.handleModalShow}><FontAwesomeIcon icon={faInfoCircle}></FontAwesomeIcon></Button>
                            <Button variant="info"><FontAwesomeIcon icon={faEye}></FontAwesomeIcon></Button>
                            <Button variant="danger" onClick={this.handleDelete}><FontAwesomeIcon icon={faTrash}></FontAwesomeIcon></Button>
                        </Card.Footer>
                    </Card.Body>
                </Card>

                <Modal className="info-modal" show={this.state.showModal} onHide={this.handleModalClose}>
                    <Modal.Header closeButton>
                        <Modal.Title>{this.state.title ? this.state.title : this.state.filename}</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <Form onSubmit={this.handleInfoModalSubmit}>
                            <Form.Group controlId="title" className="mb-3">
                                <Form.Label>Title</Form.Label>
                                <Form.Control onChange={this.handleInfoModalChange} type="text" placeholder="Enter title of paper" value={this.state.title}></Form.Control>
                            </Form.Group>

                            <Form.Group controlId="abstract" className="mb-3">
                                <Form.Label>Abstract</Form.Label>
                                <Form.Control onChange={this.handleInfoModalChange} as="textarea" type="text" rows={3} placeholder="Enter abstract of paper" value={this.state.abstract}></Form.Control>
                            </Form.Group>

                            <Form.Group controlId="authors" className="mb-3">
                                <Form.Label>Authors</Form.Label>
                                {
                                    this.state.authors?.map((author, index) => {
                                        return <Form.Control onChange={this.handleInfoModalChange} type="text" key={index} value={author} placeholder="Enter name of author"></Form.Control>
                                    })
                                }
                                <Form.Control onChange={this.handleInfoModalChange} type="text" placeholder="Enter name of author"></Form.Control>
                            </Form.Group>

                            <Form.Group controlId="knowledge-domains">
                                <Form.Label>Knowledge Domains</Form.Label>
                                {
                                    this.state.knowledgeDomains?.map((author, index) => {
                                        return <Form.Control onChange={this.handleInfoModalChange} type="text" key={index} value={author} placeholder="Enter name of author"></Form.Control>
                                    })
                                }
                                <Form.Control onChange={this.handleInfoModalChange} type="text" placeholder="Enter knowledge domain"></Form.Control>
                            </Form.Group>
                            
                            <ButtonToolbar>
                                <ButtonGroup>
                                    <Button variant="danger">Cancel</Button>
                                </ButtonGroup>

                                <ButtonGroup>
                                <Button variant="primary" type="submit">Submit</Button>
                                </ButtonGroup>
                            </ButtonToolbar>
                            {/* <Button variant="danger">Cancel</Button> */}
                            {/* <Button variant="primary" type="submit">Submit</Button> */}
                        </Form>
                    </Modal.Body>
                </Modal>
            </>
        )
    }
}

export default ResourceCard