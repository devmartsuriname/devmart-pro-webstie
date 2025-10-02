import { Helmet } from "react-helmet";
import BreadCumb from "../Components/Common/BreadCumb";
import Team3 from "../Components/Team/Team3";

const TeamPage = () => {
    return (
        <div>
            <Helmet>
                <title>Our Team - DevMart Pro</title>
                <meta name="description" content="Meet the talented team behind DevMart Pro. Our experts are dedicated to delivering innovative digital solutions." />
            </Helmet>
            <BreadCumb Title="Our Team" bgimg="/assets/img/breadcrumb.jpg" />
            <Team3></Team3>       
        </div>
    );
};

export default TeamPage;