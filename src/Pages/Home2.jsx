import About2 from "../Components/About/About2";
import Blog1 from "../Components/Blog/Blog1";
import Brand1 from "../Components/Brand/Brand1";
import CaseStudy2 from "../Components/CaseStudy/CaseStudy2";
import Counter1 from "../Components/Counter/Counter1";
import Cta1 from "../Components/Cta/Cta1";
import Cta2 from "../Components/Cta/Cta2";
import Faq1 from "../Components/Faq/Faq1";
import HeroBanner2 from "../Components/HeroBanner/HeroBanner2";
import Services1 from "../Components/Services/Services1";
import Testimonial2 from "../Components/Testimonial/Testimonial2";
import WhatWeDo2 from "../Components/WhatWeDo/WhatWeDo2";

const Home2 = () => {
    return (
        <div>
            <HeroBanner2></HeroBanner2>
            <Brand1></Brand1>
            <WhatWeDo2></WhatWeDo2>
            <Counter1></Counter1>
            <Services1></Services1>
            <Cta1></Cta1>
            <About2 addclass="about-section-2 fix section-padding pt-0"></About2>
            <CaseStudy2></CaseStudy2>
            <Faq1 addclass="faq-section section-padding pb-0"></Faq1>
            <Cta2></Cta2>
            <Testimonial2></Testimonial2>
            <Blog1></Blog1>
        </div>
    );
};

export default Home2;