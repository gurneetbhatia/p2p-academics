import React from 'react';
import ResourceCard from '../components/ResourceCard'


window.api.receive("return-repo-resources", (response) => {
    console.log("handle response here");
    console.log(response);
});

window.api.send("get-repo-resources", {});
// console.log(resourcesList);
let resourcesList = [
    {
        title: "title 1",
        abstract: "abstract 1",
        authors: ["author 1", "author 2"]
    },
    {
        title: "title 2",
        abstract: "abstract 1",
        authors: ["author 1", "author 2"]
    },
    {
        title: "title 3",
        abstract: "abstract 1",
        authors: ["author 1", "author 2"]
    },
]

class RepositoryPage extends React.Component {
    render() {
        return (
            <div>
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