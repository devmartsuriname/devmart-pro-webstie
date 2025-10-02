import About2 from "../Components/About/About2";
import BreadCumb from "../Components/Common/BreadCumb";
import Counter3 from "../Components/Counter/Counter3";
import Team2 from "../Components/Team/Team2";
import Testimonial3 from "../Components/Testimonial/Testimonial3";
import Value1 from "../Components/Value/Value1";


const AboutPage = () => {
    return (
        <div>
            <BreadCumb
                bgimg="/assets/img/breadcrumb.jpg"
                Title="about us"
            ></BreadCumb>
            <About2 addclass="about-section-2 fix section-padding"></About2>
            <Counter3></Counter3>
            <Value1></Value1>
            <Team2></Team2>
            <Testimonial3></Testimonial3>
        </div>
    );
};

export default AboutPage;