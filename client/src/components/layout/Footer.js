// import React from 'react'
// import { Link } from 'react-router-dom'

// const Footer = () => {
//   return (
//     <div className='footer'>
//       <h1 className='text-center'>All Right Reserved &copy; TechShubham</h1>
//       <p className='text-center mt-3'>
//         <Link to='/about'>About</Link> 
//         <Link to='/contact'>Contact</Link>  
//         <Link to='/policy'>Privacy policy </Link>
//       </p>
//     </div>
//   )
// }

// export default Footer

import React from 'react';
import { Link } from 'react-router-dom';
// import 'bootstrap/dist/css/bootstrap.min.css';

const Footer = () => {
  return (
    <footer className='footer bg-light py-4'>
      <div className='container'>
        {/* <h1 className='text-center mb-3'>All Rights Reserved &copy; TechShubham</h1> */}
        <p className='text-center'>
          <Link to='/about' className='text-decoration-none mx-2'>
            About
          </Link>
          <Link to='/contact' className='text-decoration-none mx-2'>
            Contact
          </Link>
          <Link to='/policy' className='text-decoration-none mx-2'>
            Privacy Policy
          </Link>
        </p>
      </div>
    </footer>
  );
}

export default Footer;
