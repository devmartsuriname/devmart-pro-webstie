import { Helmet } from "react-helmet";
import BreadCumb from "../Components/Common/BreadCumb";
import ContactInfo2 from "../Components/ContactInfo/ContactInfo2";

const ContactPage = () => {
    return (
        <div>
            <Helmet>
                <title>Contact Us - DevMart Pro</title>
                <meta name="description" content="Get in touch with DevMart Pro. Contact our team for inquiries, quotes, or to discuss how we can help your business grow." />
            </Helmet>
            <BreadCumb Title="Contact Us" bgimg="/assets/img/breadcrumb.jpg" />
            <ContactInfo2></ContactInfo2>            
        </div>
    );
};

export default ContactPage;