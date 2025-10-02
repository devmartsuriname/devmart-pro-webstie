import { Helmet } from "react-helmet";
import About2 from "../Components/About/About2";
import BreadCumb from "../Components/Common/BreadCumb";
import Counter3 from "../Components/Counter/Counter3";
import Team2 from "../Components/Team/Team2";
import Testimonial3 from "../Components/Testimonial/Testimonial3";
import Value1 from "../Components/Value/Value1";

const AboutPage = () => {
    return (
        <div>
            <Helmet>
                <title>About Us - DevMart Pro</title>
                <meta name="description" content="Learn about DevMart Pro's mission, values, and team. We deliver innovative digital solutions with expertise and dedication." />
            </Helmet>
            <BreadCumb Title="About Us" bgimg="/assets/img/breadcrumb.jpg" />
            <About2 addclass="about-section-2 fix section-padding"></About2>
            <Counter3></Counter3>
            <Value1></Value1>
            <Team2></Team2>
            <Testimonial3></Testimonial3>
        </div>
    );
};

export default AboutPage;