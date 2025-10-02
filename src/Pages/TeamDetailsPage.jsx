import { Helmet } from "react-helmet";
import Breadcrumb from "../Components/Common/Breadcrumb";
import TeamDetails from "../Components/TeamDetails/TeamDetails";

const TeamDetailsPage = () => {
    return (
        <div>
            <Helmet>
                <title>Team Member - DevMart Pro</title>
                <meta name="description" content="Learn more about our team member and their expertise in delivering exceptional digital solutions." />
            </Helmet>
            <Breadcrumb
                title="Team Details"
                items={[
                    { label: 'Team', url: '/team' },
                    { label: 'Team Details' }
                ]}
            />
            <TeamDetails></TeamDetails>           
        </div>
    );
};

export default TeamDetailsPage;