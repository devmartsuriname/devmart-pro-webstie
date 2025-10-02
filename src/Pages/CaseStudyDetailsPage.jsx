import { useParams } from "react-router-dom";
import Breadcrumb from "../Components/Common/Breadcrumb";
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
            <Breadcrumb
                title={projectName}
                items={[
                    { label: 'Projects', url: '/projects' },
                    { label: projectName }
                ]}
            />
            <CaseStudyDetails slug={slug} />           
        </div>
    );
};

export default CaseStudyDetailsPage;