import React from 'react';
import './home.css';

class HomePage extends React.Component {
    render() {
        return (
            <div className="home-container" height={window.innerHeight.toString()}>Home page</div>
        );
    }
}

export default HomePage