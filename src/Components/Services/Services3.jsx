import { Link } from "react-router-dom";

const Services3 = () => {

    const chooseContent = [
        {img:'/assets/img/service/icon-1.png', title:'Digital Marketing', content:'Lorem dolor amet consectetur read adipiscing any more elit.', slug:'digital-marketing'},
        {img:'/assets/img/service/icon-2.png', title:'SEO Analytics', content:'Lorem dolor amet consectetur read adipiscing any more elit.', slug:'seo-analytics'},
        {img:'/assets/img/service/icon-3.png', title:'Social Marketing', content:'Lorem dolor amet consectetur read adipiscing any more elit.', slug:'social-marketing'},
        {img:'/assets/img/service/icon-4.png', title:'Email Marketing', content:'Lorem dolor amet consectetur read adipiscing any more elit.', slug:'email-marketing'},
        {img:'/assets/img/service/icon-5.png', title:'Social Media Marketing', content:'Lorem dolor amet consectetur read adipiscing any more elit.', slug:'social-media-marketing'},
        {img:'/assets/img/service/icon-6.png', title:'Better audiences', content:'Lorem dolor amet consectetur read adipiscing any more elit.', slug:'better-audiences'},
      ];

    return (
        <section className="service-section fix section-padding">
            <div className="container">
                <div className="row g-4">

                {chooseContent.map((item, i) => (
                    <div key={i} className="col-xl-4 col-lg-6 col-md-6 wow fadeInUp" data-wow-delay=".3s">
                        <div className="service-box-items mt-0">
                            <div className="icon">
                                <img src={item.img} alt="img" />
                            </div>
                            <div className="content"> 
                                <h4><Link to={`/services/${item.slug}`}>{item.title}</Link></h4>
                                <p>{item.content}</p>
                                <Link to={`/services/${item.slug}`} className="link-btn">Read More <i className="bi bi-arrow-right"></i></Link>
                            </div>
                        </div>
                    </div>
                    ))}

                </div>
            </div>
        </section>
    );
};

export default Services3;