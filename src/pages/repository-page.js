import React from 'react';
import Button from 'react-bootstrap/Button';
import ResourceCard from '../components/ResourceCard';

let resourcesList = [];
window.api.receive("return-repo-resources", (response) => {
    if (response) {
        response.forEach(element => {
            const rescObj = {
                title: element,
                abstract: "some abstract that will be replaced here",
                authors: ["author 1", "author 2"]
            };
            resourcesList.push(rescObj);
        });
    }
});

window.api.send("get-repo-resources", {});

class RepositoryPage extends React.Component {
    uploadFileClicked() {
        window.api.send("upload-files-click");
    }

    render() {
        return (
            <div>
                <Button onClick={this.uploadFileClicked}>Upload Resources</Button>
                {/* <button id="upload-file" onClick={this.uploadFileClicked}>Upload Resources</button> */}
                {
                    resourcesList.map((element, index) => {
                        return <ResourceCard key={index} title={element.title} abstract={element.abstract} authors={element.authors}></ResourceCard>
                    })
                }
                {/* <ResourceCard title="some text" abstract="some abstract" authors={["name 1", "name 2"]}></ResourceCard> */}
            </div>
        );
    }
}

export default RepositoryPage;