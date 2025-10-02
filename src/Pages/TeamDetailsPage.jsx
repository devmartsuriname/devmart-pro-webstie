import { Helmet } from "react-helmet";
import BreadCumb from "../Components/Common/BreadCumb";
import TeamDetails from "../Components/TeamDetails/TeamDetails";

const TeamDetailsPage = () => {
    return (
        <div>
            <Helmet>
                <title>Team Member - DevMart Pro</title>
                <meta name="description" content="Learn more about our team member and their expertise in delivering exceptional digital solutions." />
            </Helmet>
            <BreadCumb Title="Team Details" bgimg="/assets/img/breadcrumb.jpg" />
            <TeamDetails></TeamDetails>           
        </div>
    );
};

export default TeamDetailsPage;