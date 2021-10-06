import React from 'react';


let resourcesList;

window.api.receive("return-repo-resources", (response) => {
  resourcesList = response;
});

window.api.send("get-repo-resources", {});
console.log(resourcesList);

class RepositoryPage extends React.Component {
    render() {
        return (
            <div>Repository Page</div>
        );
    }
}

export default RepositoryPage;