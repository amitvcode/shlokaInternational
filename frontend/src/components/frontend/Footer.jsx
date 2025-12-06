import { FaInstagram, FaTwitter, FaLinkedin, FaFacebook } from "react-icons/fa";

export default function Footer() {
    return (
        <footer className="px-6 md:px-16 lg:px-24 xl:px-32 pt-12 w-full bg-white text-gray-600 border-t border-slate-500">

            {/* Main Footer */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10 border-b pb-10">

                {/* Company Info */}
                <div className="sm:col-span-2 lg:col-span-1">
                    <a href="#" className="text-2xl font-bold text-gray-800 hover:text-green-600">
                        SHLOKA <span className="hover:text-indigo-600">International</span>
                    </a>

                    <p className="text-sm mt-6 leading-6 text-slate-600">
                        SHLOKA International is a trusted supplier of high-quality
                        <span className="font-semibold text-indigo-600 capitalize"> disposable food packaging</span>,
                        <span className="font-semibold text-indigo-600 capitalize"> hotel supplies</span>, and
                        <span className="font-semibold text-indigo-600 capitalize"> kitchen essentials</span>.
                        We provide premium products for restaurants, hotels, catering services, and food businesses across the world.
                    </p>

                    {/* Social Icons */}
                    <div className="flex items-center gap-5 mt-6 text-xl">
                        <a href="#" className="hover:text-pink-600 transition">
                            <FaInstagram />
                        </a>
                        <a href="#" className="hover:text-blue-500 transition">
                            <FaTwitter />
                        </a>
                        <a href="#" className="hover:text-blue-700 transition">
                            <FaLinkedin />
                        </a>
                        <a href="#" className="hover:text-blue-600 transition">
                            <FaFacebook />
                        </a>
                    </div>
                </div>

                {/* Company Links */}
                <div>
                    <h2 className=" text-xl font-bold mb-5 text-gray-800">Company</h2>
                    <ul className="text-sm space-y-2">
                        <li><a href="/" className="hover:text-indigo-600">Home</a></li>
                        <li><a href="/about" className="hover:text-indigo-600">About Us</a></li>
                        <li><a href="/categories" className="hover:text-indigo-600">Products</a></li>
                        <li><a href="/certificate" className="hover:text-indigo-600">Certificate</a></li>
                        <li><a href="/contactpage" className="hover:text-indigo-600">Contact Us</a></li>
                        <li><a href="/admin/login" className="hover:text-indigo-600">Admin</a></li>
                    </ul>
                </div>

                {/* Contact Details */}
                <div>
                    <h2 className="font-bold text-xl text-gray-800">Contact</h2>
                    <div className="text-sm">

                        <p><span className="font-medium text-gray-900">Phone : </span> +91 8767441474 | +91 9619279818</p>

                        <p>
                            <span className="font-medium text-gray-900">Email : </span>
                            info@shlokainternational.in
                        </p>

                        <p>
                            <span className="font-medium text-gray-900">Address : </span>
                            SHLOKA International<br />
                            M-303, Gokul Village CHS Ltd.,<br />
                            Shanti Park, Mira Road (East),<br />
                            Mumbai - 401107, INDIA
                        </p>
                    </div>
                </div>
            </div>

            {/* Disclaimer */}
            <p className="text-xs text-center text-gray-500 leading-5 mt-8 px-4">
                The visual presentation of images, logos, trademarks, and brand names displayed on this website are the property 
                of their respective owners. They are used solely for illustrative and representational purposes. We do not claim 
                any ownership or rights over these brands. All rights remain with their rightful owners.
            </p>

            {/* Footer Bottom */}
            <p className="py-5 text-center mt-10 border-t border-slate-200 text-slate-600">
                © 2025 <span className="font-semibold text-indigo-700"><span className="text-green-700">SHLOKA</span>  International</span> — All Rights Reserved.
            </p>

        </footer>
    );
}
