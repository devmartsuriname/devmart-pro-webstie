import { Link } from 'react-router-dom';

export default function Nav({ setMobileToggle }) {
  return (
    <ul className="cs_nav_list fw-medium">
      <li>
        <Link to="/" onClick={() => setMobileToggle(false)}>
          Home
        </Link>
      </li>
      <li>
        <Link to="/about" onClick={() => setMobileToggle(false)}>
          About Us
        </Link>
      </li>
      <li>
        <Link to="/services" onClick={() => setMobileToggle(false)}>
          Services
        </Link>
      </li>
      <li>
        <Link to="/projects" onClick={() => setMobileToggle(false)}>
          Projects
        </Link>
      </li>
      <li>
        <Link to="/blog" onClick={() => setMobileToggle(false)}>
          Blog
        </Link>
      </li>
      <li>
        <Link to="/pricing" onClick={() => setMobileToggle(false)}>
          Pricing
        </Link>
      </li>
      <li>
        <Link to="/faq" onClick={() => setMobileToggle(false)}>
          FAQ
        </Link>
      </li>
      <li>
        <Link to="/contact" onClick={() => setMobileToggle(false)}>
          Contact Us
        </Link>
      </li>
    </ul>
  );
}
