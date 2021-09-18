import React from 'react';
import Carousel from 'react-bootstrap/Carousel';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import './register.css';


class RegisterPage extends React.Component {
    constructor(props) {
        super(props);
        this.state = {value: ''};

        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    handleChange(event) {
        this.setState({value: event.target.value});
    }

    handleSubmit(event) {
        window.api.send("register", this.state.value);
    }

    render() {
        return (
            <div className="register-container">
                <Carousel>
                    <Carousel.Item height="500" interval={5000}>
                        <img
                            id="carousel-img"
                            className="d-block w-100"
                            src={"https://via.placeholder.com/"+window.innerWidth+"x"+window.innerHeight+".png/252728/FFFFFF?text=Welcome"}
                            alt="Welcome"/>
                        <Carousel.Caption>
                            <h3>Some welcome text</h3>
                        </Carousel.Caption>
                    </Carousel.Item>

                    <Carousel.Item interval={15000}>
                        <img
                            id="carousel-img"
                            className="d-block w-100"
                            src={"https://via.placeholder.com/"+window.innerWidth+"x"+window.innerHeight+".png/252728/FFFFFF?text=About"}
                            alt="About"/>
                        <Carousel.Caption>
                            <h3>Some about text</h3>
                        </Carousel.Caption>
                    </Carousel.Item>

                    <Carousel.Item interval={null}>
                        <h1>Register</h1>
                        <Form onSubmit={this.handleSubmit}>
                            <Form.Group className="mb-3" controlId="name">
                                <Form.Label>Name</Form.Label>
                                <Form.Control value={this.state.value} onChange={this.handleChange} placeholder="John Doe"></Form.Control>
                            </Form.Group>
                            <Button type="submit" variant="info">Submit</Button>
                        </Form>
                        <img
                            id="carousel-img"
                            className="d-block w-100"
                            src={"https://via.placeholder.com/"+window.innerWidth+"x"+window.innerHeight+".png/252728/FFFFFF?text=%20"}
                            alt="About"/>
                    </Carousel.Item>
                </Carousel>
            </div>
        )
    }
}

export default RegisterPage


{/* <Carousel.Item interval={null}>
                        <img
                            id="carousel-img"
                            className="d-block w-100"
                            src={"https://via.placeholder.com/"+window.innerWidth+"x"+window.innerHeight+".png/252728/FFFFFF?text=Register by entering your name"}
                            alt=""/>
                        <Carousel.Caption>
                            <Form>
                                <Form.Group className="mb-3" controlId="name">
                                    <Form.Label></Form.Label>
                                </Form.Group>
                            </Form>
                        </Carousel.Caption>
                    </Carousel.Item> */}