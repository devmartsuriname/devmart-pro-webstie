import BreadCumb from "../Components/Common/BreadCumb";
import TeamDetails from "../Components/TeamDetails/TeamDetails";

const TeamDetailsPage = () => {
    return (
        <div>
             <BreadCumb
                bgimg="/assets/img/breadcrumb.jpg"
                Title="Team Details"
            ></BreadCumb>
            <TeamDetails></TeamDetails>           
        </div>
    );
};

export default TeamDetailsPage;