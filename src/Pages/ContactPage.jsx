import BreadCumb from "../Components/Common/BreadCumb";
import ContactInfo2 from "../Components/ContactInfo/ContactInfo2";

const ContactPage = () => {
    return (
        <div>
             <BreadCumb
                bgimg="/assets/img/breadcrumb.jpg"
                Title="Contact Us"
            ></BreadCumb>  
            <ContactInfo2></ContactInfo2>            
        </div>
    );
};

export default ContactPage;