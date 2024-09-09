import React from 'react';

const Footer = () => {
  return (
    <footer className="bg-blue-900 text-white py-4 w-full sticky mt-auto">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center">
          <div>
            <img src='/assets/tesda/tesdalogo.png' alt="TESDA Logo" className="h-24 my-5" /> {/* Added alt attribute for accessibility */}
            <p className="text-base font-sf-light ml-3">Bldg 15. TESDA Gate 2 TESDA Complex East Service Rd. South Superhighway, Taguig, Metro Manila</p>
            <p className="text-base font-sf-light ml-3">contactcenter@tesda.gov.ph</p>
          </div>
          <div>
            <p className="text-base font-sf-light">© {new Date().getFullYear()} eNSAYO. All rights reserved.</p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
