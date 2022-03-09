import React from 'react';
import ResourceCard from '../components/resource-card';

class ExplorePage extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            activeResources: []
        }
    }

    componentWillMount() {
        // let activeResources = [];
        window.api.receive("return-active-resources", (response) => {
            if (response) {
                this.setState({activeResources: response});
            }
        });

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