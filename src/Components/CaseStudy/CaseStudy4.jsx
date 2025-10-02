import { Link } from "react-router-dom";

const CaseStudy4 = () => {

    const chooseContent = [
        {subtitle:'Marketing', title:'Digital Marketing', img:'/assets/img/case-studies/02.jpg'},
        {subtitle:'Seo Design', title:'PPC Advertising', img:'/assets/img/case-studies/03.jpg'},
        {subtitle:'Designer', title:'Construction Planning', img:'/assets/img/case-studies/04.jpg'},
        {subtitle:'Marketing', title:'Digital Marketing', img:'/assets/img/case-studies/06.jpg'},
        {subtitle:'Seo Design', title:'PPC Advertising', img:'/assets/img/case-studies/07.jpg'},
        {subtitle:'Designer', title:'Construction Planning', img:'/assets/img/case-studies/08.jpg'},        
      ]; 

    return (
        <section className="case-studies-section-4 fix section-padding">
        <div className="container">
            <div className="row g-4">
            {chooseContent.map((item, i) => (
                <div key={i} className="col-xl-6 col-lg-6 col-md-6">
                    <div className="case-studies-card-items mt-0">
                        <div className="thumb">
                            <img src={item.img} alt="img" />
                        </div>
                        <div className="content">
                            <div className="title">
                                <h3><Link to="/project/project-details">{item.title}</Link></h3>
                                <p>{item.subtitle}</p>
                            </div>
                            <Link to="/project/project-details" className="icon"><i className="bi bi-arrow-up-right"></i></Link>
                        </div>
                    </div>
                </div>
                ))}
            </div>
        </div>
    </section>
    );
};

export default CaseStudy4;