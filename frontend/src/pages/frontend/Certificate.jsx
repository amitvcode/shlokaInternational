import React from "react";
import certificate1 from "../../assets/img/shloka(1).jpeg";
import certificate2 from "../../assets/img/shloka(2).webp";
import certificate3 from "../../assets/img/shloka(3).jpeg";
import certificate4 from "../../assets/img/shloka(4).jpeg";
import certificate5 from "../../assets/img/shloka(5).jpeg";

const Certificate = () => {
    return (
        <>
            <h1 className="text-4xl font-bold text-center mx-auto pt-24 text-indigo-700">Certification</h1>
            <p className="text-sm text-slate-500 text-center mt-2 max-w-lg mx-auto">
                We are committed to providing you with the highest quality of products and services. 
                Our certificates are a testament to our commitment to excellence.
            </p>

            <div className="flex flex-wrap items-center justify-center mt-10 mx-auto gap-4 pb-20">
                {[certificate1, certificate2, certificate3, certificate4, certificate5].map((cert, i) => (
                    <img
                        key={i}
                        className="max-w-56 h-40 object-contain rounded-lg
                                   hover:-translate-y-1 transition-all duration-300"
                        src={cert}
                        alt={`certificate-${i + 1}`}
                    />
                ))}
            </div>
        </>
    );
};

export default Certificate;
