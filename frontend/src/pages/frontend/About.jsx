import React from "react";
import about from "../../assets/img/about1.webp";
const About = () => {
  return (
    <div className="min-h-screen bg-gray-50 pt-24">
      {/* Hero Section */}
      <section className=" mx-6 rounded-lg p-8 text-white bg-gradient-to-br from-[#345cc9] to-[#2F50AB]">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl font-extrabold ">About Shloka</h1>
          <p className="mt-3 text-lg">
            We are a leading Exporter of Disposable food Packaging and Hotel Ware Products.</p>
        </div>
      </section>

      {/* Company Story */}
      <section className="py-8">
        <div className="max-w-4xl mx-auto px-4">

          <p className="mb-4 text-base font-medium text-slate-600">
            <strong>SHLOKA International</strong> is a dynamic company providing wide range of quality
             Disposable Food Packaging Products & Hotel ware products. Whether it's about
              Disposable Packing or Tableware products, professional Chef Tools or Buffet products,
               Barware products or Serving Tongs - SHLOKA is committed for providing client satisfaction
                & receiving positive feedback.
            Our working strategy has surely & steadily added to International coverage through an exciting
             range of Disposable Food Packaging & Hotel/Restaurant products, matched by an equally efficient
              worldwide service. Our efforts to go the extra mile have earned us an outstanding reputation amongst
               our clients.

          </p>
          <p className="mb-4 text-base font-medium text-slate-600">
            <strong>SHLOKA</strong>  is a specializing in Exporting and distribution of Disposable Food packaging & Hotel ware, having office in Mumbai, setting new standards in quality and design with our extensive range of Products. We are dedicated to providing professional chefs and restaurateurs with quality products and flawless services. All our products are pleasing to the eye, high in utility, practical in maintenance, and long lasting to the highest quality to ensure durability.
          </p>
          
         
        </div>
      </section>

     {/* WHY CHOOSE US – LIST FORMAT */}
<section className="py-2 bg-gray-50">
  
            <h1 className="text-3xl font-bold text-center mx-auto text-indigo-800">Why Choose Us?</h1>
            <p className="text-sm text-slate-500 text-center mt-2 max-w-md mx-auto">
          Owing to the following features, we have gained a competitive edge over other exporters of Hotel & Restaurant Equipment Supplies:            </p>
            <div className="max-w-4xl mx-auto flex flex-col md:flex-row items-center justify-center gap-8 px-4 md:px-0 py-10">
                <img className="max-w-sm w-full rounded-xl h-auto"
                    src={about}
                    alt="About Image" />
                <div>
            
                    <div className="flex flex-col mt-1">
                      <div className="flex items-center">
                            <div>
                               <p className="text-sm text-slate-500"> <span className="text-base font-medium text-slate-600">Extensive Product Range </span>
                                covering all categories of hotel, restaurant, and catering equipment.</p>
                            </div>
                        </div>
                        <div className="flex items-center">
                            <div>
                                <p className="text-sm text-slate-500"> <span className="text-base font-medium text-slate-600">International Quality Standards  </span>
                               Products.</p>
                            </div>
                        </div>
                        <div className="flex items-center">
                            <div>
                                <p className="text-sm text-slate-500"> <span className="text-base font-medium text-slate-600">Competitive & Transparent Pricing </span>
                                ensuring the best value for your investment.</p>
                            </div>
                        </div>
                        <div className="flex items-center">
                            <div>
                                <p className="text-sm text-slate-500"> <span className="text-base font-medium text-slate-600">Timely Delivery & Strong Logistics Network  </span>
                                for smooth and reliable export shipments.</p>
                            </div>
                        </div>
                        <div className="flex items-center">
                            <div>
                                <p className="text-sm text-slate-500"> <span className="text-base font-medium text-slate-600">Customization Options  </span>
                                tailored to meet specific client requirements.</p>
                            </div>
                        </div>
                        <div className="flex items-center">
                            <div>
                                <p className="text-sm text-slate-500"> <span className="text-base font-medium text-slate-600">Dedicated Customer Support  </span>
                                for pre-sales and post-sales assistance.</p>
                            </div>
                        </div>
                        <div className="flex items-center">
                            <div>
                                <p className="text-sm text-slate-500"> <span className="text-base font-medium text-slate-600">Professional Procurement Process  </span>
                                ensuring accuracy, consistency, and quality checks.</p>
                            </div>
                        </div>
                        <div className="flex items-center">
                            <div>
                                <p className="text-sm text-slate-500"> <span className="text-base font-medium text-slate-600">Experience in International Trade Compliance   </span>
                                with proper documentation and export handling.</p>
                            </div>
                        </div>
                        <div className="flex items-center">
                            <div>
                                <p className="text-sm text-slate-500"> <span className="text-base font-medium text-slate-600">Ethical Business Practices </span>
                                focusing on trust, transparency, and long-term relationships.</p>
                            </div>
                        </div>
                        <div className="flex items-center">
                            <div>
                                <p className="text-sm text-slate-500"> <span className="text-base font-medium text-slate-600">Trusted by Global Clients </span>
                                due to our reliability and service standards.</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        
</section>
    </div>
  );
};

export default About;
