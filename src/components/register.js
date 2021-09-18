import React from 'react';
import Carousel from 'react-bootstrap/Carousel';
import Button from 'react-bootstrap/Button';
import './register.css';

class RegisterPage extends React.Component {
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
                        <img
                            id="carousel-img"
                            className="d-block w-100"
                            src={"https://via.placeholder.com/"+window.innerWidth+"x"+window.innerHeight+".png/252728/FFFFFF?text=Register by entering your name"}
                            alt=""/>
                        <Carousel.Caption>
                            <h3>Some about text</h3>
                        </Carousel.Caption>
                    </Carousel.Item>
                </Carousel>
            </div>
        )
    }
}

export default RegisterPage