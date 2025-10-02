import { Helmet } from "react-helmet";
import Blog3 from "../Components/Blog/Blog3";
import Breadcrumb from "../Components/Common/Breadcrumb";

const BlogRightSidebar = () => {
    return (
        <div>
            <Helmet>
                <title>Blog - DevMart Pro</title>
                <meta name="description" content="Stay updated with the latest industry insights, tips, and trends from DevMart Pro's expert team. Read our blog for valuable knowledge." />
            </Helmet>
            <Breadcrumb
                title="Blog"
                items={[{ label: 'Blog' }]}
            />
            <Blog3></Blog3>           
        </div>
    );
};

export default BlogRightSidebar;