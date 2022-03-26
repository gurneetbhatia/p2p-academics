import React from 'react';
import ChatsSidebar from '../components/chats-sidebar';

class ChatsPage extends React.Component {
    render() {
        return (
            <div>
                <ChatsSidebar chats={[{serverUID: 'abc', name: 'gurneet'}]}></ChatsSidebar>
            </div>
        );
    }
}

export default ChatsPage;