import { Helmet } from "react-helmet";
import Breadcrumb from "../Components/Common/Breadcrumb";
import Faq1 from "../Components/Faq/Faq1";

const FaqPage = () => {
    return (
        <div>
            <Helmet>
                <title>FAQ - DevMart Pro</title>
                <meta name="description" content="Find answers to frequently asked questions about DevMart Pro's services, processes, and solutions. Get the information you need." />
            </Helmet>
            <Breadcrumb
                title="FAQ"
                items={[{ label: 'FAQ' }]}
            />
            <Faq1 addclass="faq-section section-padding"></Faq1>        
        </div>
    );
};

export default FaqPage;