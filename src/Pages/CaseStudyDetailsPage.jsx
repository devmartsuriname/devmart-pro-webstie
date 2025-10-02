import { useParams } from "react-router-dom";
import BreadCumb from "../Components/Common/BreadCumb";
import CaseStudyDetails from "../Components/CaseStudyDetails/CaseStudyDetails";
import { Helmet } from "react-helmet";

const CaseStudyDetailsPage = () => {
    const { slug } = useParams();
    
    // Convert slug to title
    const projectName = slug ? slug.split('-').map(word => 
        word.charAt(0).toUpperCase() + word.slice(1)
    ).join(' ') : 'Project';

    return (
        <div>
            <Helmet>
                <title>{projectName} - Projects | DevMart Pro</title>
                <meta name="description" content={`Explore our ${projectName} case study. See how we delivered exceptional results for our clients.`} />
            </Helmet>
            <BreadCumb Title={projectName} bgimg="/assets/img/breadcrumb.jpg" />
            <CaseStudyDetails slug={slug} />           
        </div>
    );
};

export default CaseStudyDetailsPage;