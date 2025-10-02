import { Outlet, useLocation } from 'react-router-dom';
import Header1 from '../Components/Header/Header1';
import Header2 from '../Components/Header/Header2';
import Footer1 from '../Components/Footer/Footer1';

const Main = () => {
    const location = useLocation();
    const isHomePage = location.pathname === '/';

    return (
        <div className='main-page-area'>
            {isHomePage ? <Header1 /> : <Header2 />}
            <Outlet />
            <Footer1 />
        </div>
    );
};

export default Main;