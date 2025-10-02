import { useParams } from "react-router-dom";
import BreadCumb from "../Components/Common/BreadCumb";
import BlogDetails from "../Components/BlogDetails/BlogDetails";
import { Helmet } from "react-helmet";

const BlogDetailsPage = () => {
    const { slug } = useParams();
    
    // Convert slug to title
    const postTitle = slug ? slug.split('-').map(word => 
        word.charAt(0).toUpperCase() + word.slice(1)
    ).join(' ') : 'Blog Post';

    return (
        <div>
            <Helmet>
                <title>{postTitle} - Blog | DevMart Pro</title>
                <meta name="description" content={`Read our latest insights: ${postTitle}. Expert tips and industry knowledge from DevMart Pro.`} />
            </Helmet>
            <BreadCumb Title={postTitle} bgimg="/assets/img/breadcrumb.jpg" />
            <BlogDetails slug={slug} />         
        </div>
    );
};

export default BlogDetailsPage;