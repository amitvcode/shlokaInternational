import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useCart } from "../../context/CartContext";
import { Search, ShoppingCart } from "lucide-react";
import axios from "axios";
import logo from "../../assets/img/shloka_symbol_logo.webp";

export default function Header() {
    const { cartCount } = useCart();
    const [menuOpen, setMenuOpen] = useState(false);
    const [query, setQuery] = useState('');
    const [searchResults, setSearchResults] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();

    // Debounce search to avoid too many API calls
    useEffect(() => {
        const delayDebounceFn = setTimeout(async () => {
            if (query.trim().length > 1) { // Reduced to 1 character for better UX
                try {
                    setIsLoading(true);
                    const response = await axios.get(`https://shlokainternational-2.onrender.com/api/search?q=${encodeURIComponent(query)}`);
                    setSearchResults(response.data);
                } catch (error) {
                    console.error('Search error:', error);
                    setSearchResults([]);
                } finally {
                    setIsLoading(false);
                }
            } else {
                setSearchResults([]);
            }
        }, 300);

        return () => clearTimeout(delayDebounceFn);
    }, [query]);

    const handleResultClick = (result) => {
        setQuery('');
        setSearchResults([]);
        if (result.type === 'product') {
            navigate(`/product/${result.slug || result._id}`);
        } else if (result.type === 'category') {
            navigate(`/category/${result.slug || result._id}`);
        } else if (result.type === 'subcategory') {
            navigate(`/subcategory/${result.slug || result._id}`);
        }
    };

    return (
        <header className="bg-indigo-700 text-white shadow-md fixed w-full z-50">
            <div className="container mx-auto px-4 py-3">
                <div className="flex justify-between items-center">
                    {/* Logo */}
                    <Link to="/" className="flex items-center">
                        <img src={logo} alt="Shloka International" className="h-12" />
                    </Link>

                    {/* Desktop Navigation */}
                    <nav className="hidden md:flex items-center space-x-6">
                        <Link to="/" className="hover:text-indigo-200 transition">
                            Home
                        </Link>
                        <Link to="/about" className="hover:text-indigo-200 transition">
                            About Us
                        </Link>
                        <Link to="/categories" className="hover:text-indigo-200 transition">
                            Products
                        </Link>
                        <Link to="/certificate" className="hover:text-indigo-200 transition">
                            Certificates
                        </Link>
                        <Link to="/contact" className="hover:text-indigo-200 transition">
                            Contact Us
                        </Link>

                        {/* Search Input - Desktop */}
                        <div className="relative ml-4">
                            <input
                                type="text"
                                value={query}
                                onChange={(e) => setQuery(e.target.value)}
                                placeholder="Search products, categories..."
                                className="rounded-full placeholder-gray-500 py-2 px-4 pr-10 w-64 text-black border focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            />
                            <Search className="absolute right-4 top-1/2 -translate-y-1/2 opacity-90 pointer-events-none" />
                            
                            {/* Search Results Dropdown */}
                            {(searchResults.length > 0 || isLoading) && (
                                <div className="absolute top-12 left-0 w-96 bg-white shadow-lg rounded-lg z-50 max-h-96 overflow-y-auto">
                                    {isLoading ? (
                                        <div className="p-4 text-center text-gray-500">Searching...</div>
                                    ) : (
                                        searchResults.map((result, index) => (
                                            <div
                                                key={`${result.type}-${result._id}-${index}`}
                                                className="p-3 hover:bg-gray-100 cursor-pointer border-b last:border-b-0 flex items-center"
                                                onClick={() => handleResultClick(result)}
                                            >
                                                {result.image && (
                                                    <img 
                                                        src={result.image} 
                                                        alt={result.name} 
                                                        className="w-10 h-10 object-cover rounded mr-3"
                                                    />
                                                )}
                                                <div>
                                                    <div className="font-medium text-gray-800">{result.name}</div>
                                                    <div className="text-xs text-gray-500 capitalize">
                                                        {result.type} {result.category && `• ${result.category}`}
                                                    </div>
                                                </div>
                                            </div>
                                        ))
                                    )}
                                </div>
                            )}
                        </div>

                        {/* Cart Icon */}
                        <Link to="/cart" className="relative">
                            <ShoppingCart className="w-6 h-6" />
                            {cartCount > 0 && (
                                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                                    {cartCount > 9 ? '9+' : cartCount}
                                </span>
                            )}
                        </Link>
                    </nav>

                    {/* Mobile Menu Button */}
                    <button
                        className="md:hidden text-white focus:outline-none"
                        onClick={() => setMenuOpen(!menuOpen)}
                    >
                        <svg
                            className="w-6 h-6"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                            xmlns="http://www.w3.org/2000/svg"
                        >
                            {menuOpen ? (
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M6 18L18 6M6 6l12 12"
                                />
                            ) : (
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M4 6h16M4 12h16m-7 6h7"
                                />
                            )}
                        </svg>
                    </button>
                </div>

                {/* Mobile Menu */}
                {menuOpen && (
                    <div className="md:hidden mt-4 pb-4">
                       
                        
                        <Link
                            to="/"
                            className="block py-2 hover:bg-indigo-600 px-4 rounded"
                            onClick={() => setMenuOpen(false)}
                        >
                            Home
                        </Link>
                        <Link
                            to="/about"
                            className="block py-2 hover:bg-indigo-600 px-4 rounded"
                            onClick={() => setMenuOpen(false)}
                        >
                            About Us
                        </Link>
                        <Link
                            to="/categories"
                            className="block py-2 hover:bg-indigo-600 px-4 rounded"
                            onClick={() => setMenuOpen(false)}
                        >
                            Products
                        </Link>
                        <Link
                            to="/certificate"
                            className="block py-2 hover:bg-indigo-600 px-4 rounded"
                            onClick={() => setMenuOpen(false)}
                        >
                            Certificate
                        </Link>
                        <Link
                            to="/contact"
                            className="block py-2 hover:bg-indigo-600 px-4 rounded"
                            onClick={() => setMenuOpen(false)}
                        >
                            Contact Us
                        </Link>
                         <div className="relative mb-4">
                            <input
                                type="text"
                                value={query}
                                onChange={(e) => setQuery(e.target.value)}
                                placeholder="Search products, categories..."
                                className="rounded-full placeholder-gray-500 py-2 px-4 pr-10 w-full text-black border focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            />
                            <Search className="absolute right-4 top-1/2 -translate-y-1/2 opacity-90 pointer-events-none" />
                            
                            {/* Mobile Search Results Dropdown */}
                            {(searchResults.length > 0 || isLoading) && (
                                <div className="absolute top-12 left-0 right-0 bg-white shadow-lg rounded-lg z-50 max-h-96 overflow-y-auto">
                                    {isLoading ? (
                                        <div className="p-4 text-center text-gray-500">Searching...</div>
                                    ) : (
                                        searchResults.map((result, index) => (
                                            <div
                                                key={`mobile-${result.type}-${result._id}-${index}`}
                                                className="p-3 hover:bg-gray-100 cursor-pointer border-b last:border-b-0 flex items-center"
                                                onClick={() => {
                                                    handleResultClick(result);
                                                    setMenuOpen(false);
                                                }}
                                            >
                                                {result.image && (
                                                    <img 
                                                        src={result.image} 
                                                        alt={result.name} 
                                                        className="w-10 h-10 object-cover rounded mr-3"
                                                    />
                                                )}
                                                <div>
                                                    <div className="font-medium text-gray-800">{result.name}</div>
                                                    <div className="text-xs text-gray-500 capitalize">
                                                        {result.type} {result.category && `• ${result.category}`}
                                                    </div>
                                                </div>
                                            </div>
                                        ))
                                    )}
                                </div>
                            )}
                        </div>
                        <Link
                            to="/cart"
                            className="flex items-center py-2 hover:bg-indigo-600 px-4 rounded"
                            onClick={() => setMenuOpen(false)}
                        >
                            Cart
                            {cartCount > 0 && (
                                <span className="ml-2 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                                    {cartCount > 9 ? '9+' : cartCount}
                                </span>
                            )}
                        </Link>
                    </div>
                )}
            </div>
        </header>
    );
}