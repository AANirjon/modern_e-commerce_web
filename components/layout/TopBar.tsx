import React from 'react';
import { FaFacebook, FaTwitter, FaInstagram, FaLinkedin } from 'react-icons/fa';
import './TopBar.css';

export const TopBar: React.FC = () => {
    return (
        <div className="top-bar">
            <div className="container">
                <div className="top-bar-content">
                    {/* Left: HOT Badge + Free Shipping */}
                    <div className="top-bar-left">
                        <span className="hot-badge">HOT</span>
                        <span className="shipping-text">Free Express Shipping on orders over $99</span>
                    </div>

                    {/* Right: Language Selector + Social Icons */}
                    <div className="top-bar-right">
                        {/* Language Selector */}
                        <select
                            aria-label="Select language"
                            className="language-select"
                        >
                            <option value="en">English</option>
                            <option value="es">Español</option>
                            <option value="fr">Français</option>
                            <option value="de">Deutsch</option>
                        </select>

                        {/* Social Icons */}
                        <div className="social-icons">
                            <a href="#facebook" aria-label="Follow us on Facebook" title="Facebook">
                                <FaFacebook />
                            </a>
                            <a href="#twitter" aria-label="Follow us on Twitter" title="Twitter">
                                <FaTwitter />
                            </a>
                            <a href="#instagram" aria-label="Follow us on Instagram" title="Instagram">
                                <FaInstagram />
                            </a>
                            <a href="#linkedin" aria-label="Follow us on LinkedIn" title="LinkedIn">
                                <FaLinkedin />
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TopBar;
