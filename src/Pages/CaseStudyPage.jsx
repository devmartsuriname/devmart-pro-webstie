import { Helmet } from "react-helmet";
import CaseStudy4 from "../Components/CaseStudy/CaseStudy4";
import BreadCumb from "../Components/Common/BreadCumb";

const CaseStudyPage = () => {
    return (
        <div>
            <Helmet>
                <title>Projects - DevMart Pro</title>
                <meta name="description" content="View our portfolio of successful projects. See how we've helped businesses achieve their digital goals with innovative solutions." />
            </Helmet>
            <BreadCumb Title="Projects" bgimg="/assets/img/breadcrumb.jpg" />
            <CaseStudy4></CaseStudy4>      
        </div>
    );
};

export default CaseStudyPage;