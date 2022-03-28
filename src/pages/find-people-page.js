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
                // this.setState({profiles: response});
                console.log("in return user profiles");
                console.log(response);
                const found = this.state.profiles.some(el => el.serverUID === response.serverUID);
                if (!found) {
                    console.log("new profile received");
                    let newProfiles = this.state.profiles;
                    newProfiles.push(response);
                    this.setState({profiles: newProfiles});
                }
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