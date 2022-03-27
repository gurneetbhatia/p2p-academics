import React from 'react';
import './MessageWindow.css';

class MessageWindow extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            name: props.name,
            messages: [
                {
                    name: "gurneet",
                    isSender: true,
                    message: "some testing message",
                    timestamp: "3 minutes ago"
                },
                {
                    name: "zain",
                    isSender: false,
                    message: "test you",
                    timestamp: "1 minute ago"
                }
            ]
        }
    } 

    render() {
        return (
            <div className="message-window chatbox chat-window">
                        {
                            this.state.messages.map((element, index) => {
                                return (
                                    <article key={index} className={element.isSender ? "msg-container msg-self" : "msg-container msg-remote"}>
                                        <div className="msg-box">
                                            <div className="flr">
                                                <div className="messages">
                                                    <p className="msg">{element.message}</p>
                                                </div>
                                            </div>
                                            <span className="timestamp">
                                                <span className="username">
                                                    {element.name}&bull;<span className="posttime">{element.timestamp}</span>
                                                </span>
                                            </span>
                                        </div>
                                    </article>
                                )
                            })
                        }
                    <form className="chat-input">
                        <input type="text" autoComplete='off' placeholder='Type a message'></input>
                        <button>Send</button>
                    </form>
            </div>
        )
    }
}

export default MessageWindow