import React from 'react';

const Footer: React.FC = () => (
  <footer className="bg-light text-center text-muted py-3 mt-auto border-top">
    <div className="container">
      <small>
        &copy; {new Date().getFullYear()} Tourgether &middot; All rights reserved.
      </small>
    </div>
  </footer>
);

export default Footer;
