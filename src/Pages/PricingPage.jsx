import { Helmet } from "react-helmet";
import BreadCumb from "../Components/Common/BreadCumb";
import Faq1 from "../Components/Faq/Faq1";
import Pricng2 from "../Components/Pricing/Pricng2";

const PricingPage = () => {
    return (
        <div>
            <Helmet>
                <title>Pricing - DevMart Pro</title>
                <meta name="description" content="Explore our flexible pricing plans designed to fit businesses of all sizes. Get premium digital solutions at competitive rates." />
            </Helmet>
            <BreadCumb Title="Pricing" bgimg="/assets/img/breadcrumb.jpg" />
            <Pricng2></Pricng2>
            <Faq1 addclass="faq-section section-padding pt-0"></Faq1>
        </div>
    );
};

export default PricingPage;