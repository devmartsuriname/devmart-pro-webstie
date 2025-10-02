import {
    createBrowserRouter,
    Navigate,
  } from "react-router-dom";
import Home2 from "../Pages/Home2";
import Main from "../Layout/Main";
import AboutPage from "../Pages/AboutPage";
import PricingPage from "../Pages/PricingPage";
import FaqPage from "../Pages/FaqPage";
import ContactPage from "../Pages/ContactPage";
import ServicesPage from "../Pages/ServicesPage";
import ServiceDetailsPage from "../Pages/ServiceDetailsPage";
import CaseStudyPage from "../Pages/CaseStudyPage";
import CaseStudyDetailsPage from "../Pages/CaseStudyDetailsPage";
import BlogRightSidebar from "../Pages/BlogRightSidebar";
import BlogDetailsPage from "../Pages/BlogDetailsPage";
import { adminRoutes } from "./AdminRoutes";

export const router = createBrowserRouter([
    ...adminRoutes,
    {
      path: "/",
      element: <Main></Main>,
      children: [       
        {
          index: true,
          element: <Home2></Home2>,
        },
        {
          path: "about",
          element: <AboutPage></AboutPage>,
        },  
        {
          path: "services",
          element: <ServicesPage></ServicesPage>,
        }, 
        {
          path: "services/:slug",
          element: <ServiceDetailsPage></ServiceDetailsPage>,
        }, 
        {
          path: "projects",
          element: <CaseStudyPage></CaseStudyPage>,
        }, 
        {
          path: "projects/:slug",
          element: <CaseStudyDetailsPage></CaseStudyDetailsPage>,
        },   
        {
          path: "blog",
          element: <BlogRightSidebar></BlogRightSidebar>,
        }, 
        {
          path: "blog/:slug",
          element: <BlogDetailsPage></BlogDetailsPage>,
        },  
        {
          path: "pricing",
          element: <PricingPage></PricingPage>,
        }, 
        {
          path: "faq",
          element: <FaqPage></FaqPage>,
        },  
        {
          path: "contact",
          element: <ContactPage></ContactPage>,
        },
        // Redirects for old home routes
        {
          path: "home",
          element: <Navigate to="/" replace />,
        },
        {
          path: "home1",
          element: <Navigate to="/" replace />,
        },
        {
          path: "home2",
          element: <Navigate to="/" replace />,
        },
        {
          path: "home3",
          element: <Navigate to="/" replace />,
        },
      ],
    },
  ]);