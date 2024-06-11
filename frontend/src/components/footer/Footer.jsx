import React from 'react'
import { Link } from 'react-router-dom'

function Footer() {
  return (
    <footer className="bg-gray-100 text-center text-lg-start text-gray-500 mt-4">
          <section className="flex justify-center justify-betweend p-4 border-t border-gray-300">
            
          </section>

          <section>
            <div className="container text-center text-md-start mt-5  p-4  ">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mt-3">
                <div className="mb-4">
                  <h6 className="text-xl font-semibold mb-4 flex text-center justify-center items-center">
                      <img src="logo2.png" alt="" className="h-20" />
                    <Link to="/" className="text-blue-950 font-extrabold text-[25px]">
                      Evil Corp
                    </Link>
                  </h6>
                  <p>
                  Learn To Hack Like Magic
                  </p>
                </div>

                <div className="mb-4">
                  <h6 className="text-xl font-semibold mb-4">Links</h6>
                  <p>
                    <a href="#">Home</a>
                  </p>
                  <p>
                    <a href="#">Course </a>
                  </p>
                  <p>
                    <a href="#">About Us</a>
                  </p>
                  <p>
                    <a href="#">Blogs</a>
                  </p>
                </div>

                <div className="mb-4">
                  <h6 className="text-xl font-semibold mb-4">Poppular Courses</h6>
                  <p>
                    <a href="#">Osint</a>
                  </p>
                  <p>
                    <a href="#">Pentest</a>
                  </p>
                  <p>
                    <a href="#">Cyber Security</a>
                  </p>
                </div>

                <div className="mb-4">
                  <h6 className="text-xl font-semibold mb-4">Contact</h6>
                  <p>
                    <i className="me-2">Address</i>
                    Calicut, Kerala, India
                  </p>
                  <p>
                    <i className="me-3">Email</i>
                    info@evilcrop.com
                  </p>
                  <p>
                    <i className="me-3">Phone</i> + 01 234 567 88
                  </p>
                  <p>
                    <i className="me-3">Fax</i> + 01 234 567 89
                  </p>
                </div>
              </div>
            </div>
          </section>

          <div className="text-center py-4 bg-opacity-25" style={{ backgroundColor: 'rgba(0, 0, 0, 0.05)' }}>
            © 2022 Copyright:
            <a className="text-blue-500 font-semibold mx-1" href="https://medicare.com/">
             evilcorp.com
            </a>
          </div>
        </footer>

  )
}

export default Footer