import React from 'react';
import ProfileCard from '../components/profile-card';

class FindPeoplePage extends React.Component {
    render() {
        return (
            <div>
                <ProfileCard name="Gurneet Bhatia" knowledgeDomains="Machine Learning"></ProfileCard>
            </div>
        );
    }
}

export default FindPeoplePage;