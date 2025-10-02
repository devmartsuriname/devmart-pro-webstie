import { Link } from "react-router-dom";
import parse from 'html-react-parser';

const Services1 = () => {

    const chooseContent = [
        {img:'/assets/img/service/01.png', title:'Search Engine <br/> Optimizations', content:'Collaboratively formulate principle capital doing progressively evolve user'},
        {img:'/assets/img/service/02.png', title:'One Page SEO <br> Optimization', content:'Collaboratively formulate principle capital doing progressively evolve user'},
        {img:'/assets/img/service/03.png', title:'Keyword Research <br/> Strategy', content:'Collaboratively formulate principle capital doing progressively evolve user'},
      ]; 

    return (
        <section className="service-section fix section-bg section-padding pt-0">
            <div className="bg-shape-2">
                <img src="/assets/img/service/bg-shape-2.png" alt="img" />
            </div>
            <div className="container">
                <div className="section-title-area">
                    <div className="section-title">
                        <div className="sub-title bg-color-2 wow fadeInUp">
                            <span>OUR SERVICES</span>
                        </div>
                        <h2 className="wow fadeInUp" data-wow-delay=".3s">
                            Use SEO to Drive Growth <br/> at Your Business
                        </h2>
                    </div>
                    <div className="main-button wow fadeInUp" data-wow-delay=".3s">
                        <Link to="/service"> <span className="theme-btn">EXPLORE MORE </span><span className="arrow-btn"><i className="bi bi-arrow-up-right"></i></span></Link>
                    </div>
                </div>
                <div className="row">

                {chooseContent.map((item, i) => (
                    <div key={i} className="col-xl-4 col-lg-6 col-md-6 wow fadeInUp" data-wow-delay=".3s">
                        <div className="service-card-items">
                            <h3 className="title">
                                <Link to="/service/service-details">
                                {parse(item.title)}
                                </Link>
                            </h3>
                            <div className="service-thumb">
                                <img src={item.img} alt="img" />
                            </div>
                            <div className="content">
                                <p>
                                {item.content}
                                </p>
                                <Link to="/service/service-details" className="service-btn">Read more <i className="bi bi-arrow-right"></i></Link>
                            </div>
                        </div>
                    </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default Services1;