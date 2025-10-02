import { useEffect } from "react";
import { Link } from "react-router-dom";

const CaseStudy1 = () => {

    useEffect(() => {
        document.querySelectorAll('.box').forEach(box => {
            box.addEventListener('mouseenter', function () {
                document.querySelectorAll('.box').forEach(b => b.classList.remove('active'));
                this.classList.add('active');
            });
        });
    }, []);

    return (
        <section className="case-study-section fix section-padding">
            <div className="overlay-shape">
                <img src="/assets/img/case-studies/overlay-shape.png" alt="img" />
            </div>
            <div className="left-shape float-bob-x">
                <img src="/assets/img/case-studies/left-shape.png" alt="img" />
            </div>
            <div className="right-shape float-bob-x">
                <img src="/assets/img/case-studies/right-shaape.png" alt="img" />
            </div>
            <div className="container">
                <div className="section-title-area">
                    <div className="section-title">
                        <div className="sub-title wow fadeInUp">
                            <span>Case Studies</span>
                        </div>
                        <h2 className="wow fadeInUp" data-wow-delay=".3s">
                            We Are A Creative Digital <br/>
                            Marketing Agency
                        </h2>
                    </div>
                    <div className="main-button wow fadeInUp" data-wow-delay=".5s">
                        <Link to="/about"> <span className="theme-btn"> EXPLORE MORE </span><span className="arrow-btn"><i className="bi bi-arrow-right"></i></span></Link>

                    </div>
                </div>
                <div className="case-study-wrapper">
                    <div className="row">
                        <div className="col-xxl-6 wow fadeInUp">
                            <div className="case-study-box-items">
                                <div className="thumb">
                                    <img src="/assets/img/case-studies/01.jpg" alt="img" />
                                    <div className="post-box-items">
                                        <ul>
                                            <li>
                                                <Link to="/project/project-details">Real-time Analytics <i className="bi bi-arrow-up-right"></i></Link>
                                            </li>
                                            <li>
                                                <Link to="/project/project-details">Social <i className="bi bi-arrow-up-right"></i></Link>
                                            </li>
                                        </ul>
                                        <ul>
                                            <li>
                                                <Link to="/project/project-details">Agile Advance <i className="bi bi-arrow-up-right"></i></Link>
                                            </li>
                                            <li>
                                                <Link to="/project/project-details">Advance <i className="bi bi-arrow-up-right"></i></Link>
                                            </li>
                                        </ul>
                                    </div>
                                    <h3 className="project-title">
                                        <Link to="/project/project-details">
                                            <img src="/assets/img/case-studies/icon.png" alt="img" />
                                            Rising Stars Obscure
                                        </Link>
                                    </h3>
                                    <span className="number">01</span>
                                </div>
                            </div>
                        </div>
                        <div className="col-xxl-6">
                            <div className="main-box">

                                <div className="box wow fadeInUp">
                                    <div className="title-items">
                                        <h3><Link to="/project/project-details">Digital Marketing</Link></h3>
                                        <span className="number">02</span>
                                    </div>
                                    <span className="number-hover">02</span>
                                    <div className="project-content">
                                        <h3><Link to="/project/project-details">Digital Marketing</Link></h3>
                                        <p>
                                            Reprehendeirure  irit in volut
                                            ate velit esse cillum dolDuis aute irure dolor in ore
                                        </p>
                                        <Link href="/project/project-details" className="link-btn">Read More <i className="bi bi-arrow-right"></i></Link>
                                    </div>
                                </div>

                                <div className="box bg-1 wow fadeInUp" data-wow-delay=".2s">
                                    <div className="title-items">
                                        <h3><Link to="/project/project-details">Instantly Analyze</Link></h3>
                                        <span className="number">03</span>
                                    </div>
                                    <span className="number-hover">03</span>
                                    <div className="project-content">
                                        <h3><Link to="/project/project-details">Instantly Analyze</Link></h3>
                                        <p>
                                            Reprehendeirure  irit in volut
                                            ate velit esse cillum dolDuis aute irure dolor in ore
                                        </p>
                                        <Link to="/project/project-details" className="link-btn">Read More <i className="bi bi-arrow-right"></i></Link>
                                    </div>
                                </div>

                                <div className="box bg-2 active wow fadeInUp wow" data-wow-delay=".4s">
                                    <div className="title-items">
                                        <h3><Link to="/project/project-details">Web & Mobile</Link></h3>
                                        <span className="number">04</span>
                                    </div>
                                    <span className="number-hover">04</span>
                                    <div className="project-content">
                                        <h3><Link to="/project/project-details">Web & Mobile</Link></h3>
                                        <p>
                                            Reprehendeirure  irit in volut
                                            ate velit esse cillum dolDuis aute irure dolor in ore
                                        </p>
                                        <Link to="/project/project-details" className="link-btn">Read More <i className="bi bi-arrow-right"></i></Link>
                                    </div>
                                </div>

                                <div className="box bg-3 wow fadeInUp wow" data-wow-delay=".6s">
                                    <div className="title-items">
                                        <h3><Link to="/project/project-details">Email marketing</Link></h3>
                                        <span className="number">05</span>
                                    </div>
                                    <span className="number-hover">05</span>
                                    <div className="project-content">
                                        <h3><Link to="/project/project-details">Email marketing</Link></h3>
                                        <p>
                                            Reprehendeirure  irit in volut
                                            ate velit esse cillum dolDuis aute irure dolor in ore
                                        </p>
                                        <Link to="/project/project-details" className="link-btn">Read More <i className="bi bi-arrow-right"></i></Link>
                                    </div>
                                </div>

                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default CaseStudy1;