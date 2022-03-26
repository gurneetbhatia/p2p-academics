import React from 'react';
import ProfileCard from '../components/profile-card';

class FindPeoplePage extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            profiles: []
        };
    }

    componentWillMount() {
        window.api.receive("return-user-profiles", (response) => {
            if (response) {
                this.setState({profiles: response});
                console.log(response);
            }
        });

        window.api.send("get-user-profiles", {});
    }

    render() {
        return (
            <div>
                {/* <ProfileCard name="Gurneet Bhatia" knowledgeDomains="Machine Learning"></ProfileCard> */}
                {
                    this.state.profiles.map((element, index) => {
                        return <ProfileCard key={index} name={element.name} knowledgeDomains={element.knowledgeDomains}></ProfileCard>
                    })
                }
            </div>
        );
    }
}

export default FindPeoplePage;