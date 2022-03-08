import React from 'react';
import ResourceCard from '../components/resource-card';

let activeResources = [];
window.api.receive("return-active-resources", (response) => {
    console.log("received active resources [REACT]");
    console.log(response);
    if (response) {
        activeResources = response;
    }
});

window.api.send("get-active-resources", {});

class ExplorePage extends React.Component {
    render() {
        return (
            <div>
                {/* <h1></h1> */}
                {
                    activeResources.map((element, index) => {
                        return <ResourceCard isOwner={false} key={index} fileid={element.fileid} filename={element.filename} title={element.title} abstract={element.abstract} authors={element.authors} knowledgeDomains={element.knowledgeDomains}></ResourceCard>
                    })
                }
            </div>
        );
    }
}

export default ExplorePage;