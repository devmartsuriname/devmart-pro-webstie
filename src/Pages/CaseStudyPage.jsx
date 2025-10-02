import { Helmet } from "react-helmet";
import CaseStudy4 from "../Components/CaseStudy/CaseStudy4";
import Breadcrumb from "../Components/Common/Breadcrumb";

const CaseStudyPage = () => {
    return (
        <div>
            <Helmet>
                <title>Projects - DevMart Pro</title>
                <meta name="description" content="View our portfolio of successful projects. See how we've helped businesses achieve their digital goals with innovative solutions." />
            </Helmet>
            <Breadcrumb
                title="Projects"
                items={[{ label: 'Projects' }]}
            />
            <CaseStudy4></CaseStudy4>      
        </div>
    );
};

export default CaseStudyPage;