import React from 'react';
import { Link } from 'react-router-dom';

const Footer: React.FC = () => (
  <footer className="bg-light text-center text-muted py-4 mt-auto border-top">
    <div className="container">
      <div className="row">
        <div className="col-12">
          <nav className="mb-3">
            <Link 
              to="/about" 
              className="text-muted me-4 hover-text-dark"
              style={{ transition: 'color 0.2s' }}
            >
              About Tourgether
            </Link>
            <Link 
              to="/legal" 
              className="text-muted hover-text-dark"
              style={{ transition: 'color 0.2s' }}
            >
              Legal & Privacy
            </Link>
          </nav>
          <small className="d-block">
            &copy; {new Date().getFullYear()} Tourgether &middot; Connecting motorcycle enthusiasts worldwide
          </small>
          <small className="d-block mt-1">
            All rights reserved. Ride safe.
          </small>
        </div>
      </div>
    </div>
  </footer>
);

export default Footer;