import { Link } from 'react-router-dom';
import { useEffect } from 'react';
import loadBackgroudImages from './loadBackgroudImages';

const Breadcrumb = ({ title, items }) => {
  useEffect(() => {
    loadBackgroudImages();
  }, []);

  return (
    <div className="breadcrumb-wrapper section-padding bg-cover" data-background="/assets/img/breadcrumb.jpg">
      <div className="breadcrumb-shape">
        <img src="/assets/img/breadcrumb-shape.png" alt="shape" />
      </div>
      <div className="breadcrumb-shape-2">
        <img src="/assets/img/breadcrumb-shape-2.png" alt="shape" />
      </div>
      <div className="container">
        <div className="page-heading">
          <h1 className="wow fadeInUp" data-wow-delay=".3s">{title}</h1>
          <ul className="breadcrumb-items wow fadeInUp" data-wow-delay=".5s">
            <li>
              <Link to="/">Home</Link>
            </li>
            {items && items.map((item, index) => (
              <li key={index}>
                {item.url ? (
                  <Link to={item.url}>{item.label}</Link>
                ) : (
                  <span>{item.label}</span>
                )}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Breadcrumb;
