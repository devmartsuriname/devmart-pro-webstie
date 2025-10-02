import { Helmet } from "react-helmet";
import Breadcrumb from "../Components/Common/Breadcrumb";
import Faq1 from "../Components/Faq/Faq1";
import Pricng2 from "../Components/Pricing/Pricng2";

const PricingPage = () => {
    return (
        <div>
            <Helmet>
                <title>Pricing - DevMart Pro</title>
                <meta name="description" content="Explore our flexible pricing plans designed to fit businesses of all sizes. Get premium digital solutions at competitive rates." />
            </Helmet>
            <Breadcrumb
                title="Pricing"
                items={[{ label: 'Pricing' }]}
            />
            <Pricng2></Pricng2>
            <Faq1 addclass="faq-section section-padding pt-0"></Faq1>
        </div>
    );
};

export default PricingPage;