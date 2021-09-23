import React from 'react';
import './home.css';
import Sidebar from './sidebar';

class HomePage extends React.Component {
    render() {
        return (
            <div className="home-container">
                <Sidebar/>
            </div>
        );
    }
}

export default HomePage