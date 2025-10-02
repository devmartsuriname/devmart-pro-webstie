import { useParams } from "react-router-dom";
import Breadcrumb from "../Components/Common/Breadcrumb";
import ServiceDetails from "../Components/ServiceDetails/ServiceDetails";
import { Helmet } from "react-helmet";

const ServiceDetailsPage = () => {
    const { slug } = useParams();
    
    // Convert slug to title (e.g., "search-engine-optimizations" -> "Search Engine Optimizations")
    const serviceName = slug ? slug.split('-').map(word => 
        word.charAt(0).toUpperCase() + word.slice(1)
    ).join(' ') : 'Service';

    return (
        <div>
            <Helmet>
                <title>{serviceName} - Services | DevMart Pro</title>
                <meta name="description" content={`Learn more about our ${serviceName} service. Professional solutions tailored to your business needs.`} />
            </Helmet>
            <Breadcrumb
                title={serviceName}
                items={[
                    { label: 'Services', url: '/services' },
                    { label: serviceName }
                ]}
            />
            <ServiceDetails slug={slug} />       
        </div>
    );
};

export default ServiceDetailsPage;