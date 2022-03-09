import React from 'react';
import Button from 'react-bootstrap/Button';
import ResourceCard from '../components/resource-card';

// let resourcesList = [];
// window.api.receive("return-repo-resources", (response) => {
//     console.log("[REACT repository-page]")
//     console.log(response);
//     if (response) {
//         resourcesList = response;
//     }
// });

// window.api.send("get-repo-resources", {});

class RepositoryPage extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            resourcesList: []
        };
    }

    componentWillMount() {
        window.api.receive("return-repo-resources", (response) => {
            if (response) {
                this.setState({resourcesList: response});
            }
        });

        window.api.send("get-repo-resources", {});
    }

    uploadFileClicked() {
        window.api.send("upload-files-click");
    }

    render() {
        return (
            <div>
                {/* {document.write(resourcesList)} */}
                <Button onClick={this.uploadFileClicked}>Upload Resources</Button>
                {/* <button id="upload-file" onClick={this.uploadFileClicked}>Upload Resources</button> */}
                {
                    this.state.resourcesList.map((element, index) => {
                        return <ResourceCard isOwner={true} key={index} fileid={element.fileid} filename={element.filename} title={element.title} abstract={element.abstract} authors={element.authors} knowledgeDomains={element.knowledgeDomains}></ResourceCard>
                    })
                }
                {/* <ResourceCard title="some text" abstract="some abstract" authors={["name 1", "name 2"]}></ResourceCard> */}
            </div>
        );
    }
}

export default RepositoryPage;

/**
 * NEED TO UPDATE THE VIEW AFTER THE DELETE ACTION
 */