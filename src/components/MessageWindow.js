import React from 'react';

class MessageWindow extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            name: props.name,
            messages: []
        }
    } 

    render() {
        return (
            <div>
                {this.state.name}
            </div>
        )
    }
}

export default MessageWindow