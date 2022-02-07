import React from 'react';

let activeResources = [];
window.api.receive("return-active-resources", (response) => {
    if (response) {
        activeResources = response;
    }
});

window.api.send("get-active-resources", {});

class ExplorePage extends React.Component {
    render() {
        return (
            <div>Explore Page</div>
        );
    }
}

export default ExplorePage;