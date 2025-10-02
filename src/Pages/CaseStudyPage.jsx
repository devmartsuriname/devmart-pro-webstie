import CaseStudy4 from "../Components/CaseStudy/CaseStudy4";
import BreadCumb from "../Components/Common/BreadCumb";

const CaseStudyPage = () => {
    return (
        <div>
             <BreadCumb
                bgimg="/assets/img/breadcrumb.jpg"
                Title="Case studies"
            ></BreadCumb>       
            <CaseStudy4></CaseStudy4>      
        </div>
    );
};

export default CaseStudyPage;