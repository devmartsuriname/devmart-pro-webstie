import { Helmet } from "react-helmet";
import Breadcrumb from "../Components/Common/Breadcrumb";
import ContactInfo2 from "../Components/ContactInfo/ContactInfo2";

const ContactPage = () => {
    return (
        <div>
            <Helmet>
                <title>Contact Us - DevMart Pro</title>
                <meta name="description" content="Get in touch with DevMart Pro. Contact our team for inquiries, quotes, or to discuss how we can help your business grow." />
            </Helmet>
            <Breadcrumb
                title="Contact Us"
                items={[{ label: 'Contact Us' }]}
            />
            <ContactInfo2></ContactInfo2>            
        </div>
    );
};

export default ContactPage;