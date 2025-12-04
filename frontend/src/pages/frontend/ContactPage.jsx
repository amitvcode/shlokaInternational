import React, { useState } from "react";
import productimg from "../../assets/img/contact.webp";
const ContactPage = () => {


  return (
    <>
    <h1 className="text-4xl font-extrabold text-center mx-auto pt-24 text-indigo-700">Contact Us</h1>
            <p className="text-sm text-slate-500 text-center max-w-lg mx-auto">
              Get in touch with contact details below.
            </p>
      <div className="min-h-screen">
        <div className="row max-w-6xl mx-auto px-4 ">
          <div className="max-w-2xl mx-auto border border-pink-500 rounded rounded-2">
           <img
                src={productimg}
                alt="Contact Illustration"
                className="w-full h-auto rounded-lg shadow-sm border "
              />
          </div>

          <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
            <div className="bg-green-100 p-6 rounded-lg shadow border border-green-500">
              <img
                src="https://img.icons8.com/?size=100&id=AltfLkFSP7XN&format=png&color=000000"
                alt="Phone"
                className="mx-auto mb-3 w-16 h-16"
              />
              <p className="text-sm text-gray-700">
                Want to clear your doubt. Message now{" "}
                <span className="font-medium">+91 8767441474</span>
              </p>
            </div>

            <div className="bg-orange-100 p-6 rounded-lg shadow border border-orange-500">
              <img
                src="https://img.icons8.com/color/96/place-marker--v1.png"
                alt="Location"
                className="mx-auto mb-3 w-16 h-16"
              />
              <p className="text-sm text-gray-700">
                <span className="font-semibold block">SHLOKA International</span>
                M-303, Gokul Village CHS Ltd, Shanti Park, Mira Road (E),
                Mumbai-401107, INDIA.
              </p>
            </div>

            <div className="bg-purple-100 p-6 rounded-lg shadow border border-purple-500">
              <img
                src="https://img.icons8.com/color/96/new-post.png"
                alt="Email"
                className="mx-auto mb-3 w-16 h-16"
              />
              <p className="text-sm text-gray-700">
                Mail your queries to <br />
                <span className="font-medium">info@shlokainternational.in</span>
              </p>
            </div>
          </div>

          <div className="my-10 ">
            <div className="relative w-full" style={{ paddingTop: "56.25%" }}>
              <iframe
                title="Google Map"
                src="https://www.google.com/maps/embed?pb=!1m17!1m12!1m3!1d3143.298818071737!2d72.86653617425708!3d19.279143945565654!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m2!1m1!2zMTnCsDE2JzQ0LjkiTiA3MsKwNTInMDguOCJF!5e1!3m2!1sen!2sin!4v1749886156618!5m2!1sen!2sin"
                className="absolute inset-0 w-full h-full border-0 rounded-lg"
                allowFullScreen=""
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              ></iframe>
            </div>
          </div>

       

        </div>
      </div>
    </>
  );
};

export default ContactPage;
