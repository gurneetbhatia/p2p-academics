import React from 'react';
import ResourceCard from '../components/resource-card';

// let activeResources = [];
// window.api.receive("return-active-resources", (response) => {
//     console.log("received active resources [REACT]");
//     console.log(response);
//     if (response) {
//         activeResources = response;
//     }
// });

// window.api.send("get-active-resources", {});

class ExplorePage extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            activeResources: []
        }

        this.handleReturnedResources = this.handleReturnedResources.bind(this);
    }

    handleReturnedResources(resources) {
        console.log("received active resources [REACT]");
        console.log(resources);
        if (resources) {
            this.setState({activeResources: resources});
        }
    }

    componentWillMount() {
        // let activeResources = [];
        window.api.receive("return-active-resources", (response) => {
            if (response) {
                this.setState({activeResources: response});
            }
        });

        console.log("here");
        window.api.send("get-active-resources", {});
    }

    render() {
        return (
            <div>
                {
                    this.state.activeResources.map((element, index) => {
                        return <ResourceCard isOwner={false} key={index} fileid={element.fileid} filename={element.filename} title={element.title} abstract={element.abstract} authors={element.authors} knowledgeDomains={element.knowledgeDomains}></ResourceCard>
                    })
                }
            </div>
        );
    }
}

export default ExplorePage;