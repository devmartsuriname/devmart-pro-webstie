import { Helmet } from "react-helmet";
import BreadCumb from "../Components/Common/BreadCumb";
import Cta2 from "../Components/Cta/Cta2";
import Pricing1 from "../Components/Pricing/Pricing1";
import Services3 from "../Components/Services/Services3";
import Testimonial2 from "../Components/Testimonial/Testimonial2";
import WhyChoose4 from "../Components/WhyChoose/WhyChoose4";

const ServicesPage = () => {
    return (
        <div>
            <Helmet>
                <title>Our Services - DevMart Pro</title>
                <meta name="description" content="Explore our comprehensive digital services including SEO, web development, digital marketing, and automation solutions tailored for your business." />
            </Helmet>
            <BreadCumb Title="Our Services" bgimg="/assets/img/breadcrumb.jpg" />
            <Services3></Services3> 
            <WhyChoose4></WhyChoose4>
            <Pricing1 CoulmnClass="pricing-section section-padding"></Pricing1>      
            <Cta2></Cta2>
            <Testimonial2></Testimonial2>  
        </div>
    );
};

export default ServicesPage;