import { TopBar } from '@/components/layout/TopBar';
import { Navbar } from '@/components/layout/Navbar';
import { FaEnvelope, FaPhone, FaMapMarkerAlt, FaHeadset, FaShieldAlt } from 'react-icons/fa';
import './page.css';

export default function ContactPage() {
    return (
        <div className="page-frame contact-page">
            <TopBar />
            <Navbar />

            <main className="contact-hero">
                <div className="container contact-hero-grid">
                    <div className="hero-copy">
                        <span className="eyebrow">Get in touch</span>
                        <h1>Need help with your mobile accessories order?</h1>
                        <p>
                            Contact our support team for fast answers about orders, returns, or product recommendations.
                        </p>
                    </div>

                    <div className="contact-card hero-card">
                        <div className="contact-card-title">
                            <h2>Contact details</h2>
                            <p>Choose the best way to connect with our specialists.</p>
                        </div>

                        <div className="contact-list">
                            <div className="contact-list-item">
                                <FaPhone className="contact-icon" />
                                <div>
                                    <strong>Call us</strong>
                                    <p>+1 (234) 567-890</p>
                                </div>
                            </div>
                            <div className="contact-list-item">
                                <FaEnvelope className="contact-icon" />
                                <div>
                                    <strong>Email</strong>
                                    <p>support@mobinest.com</p>
                                </div>
                            </div>
                            <div className="contact-list-item">
                                <FaMapMarkerAlt className="contact-icon" />
                                <div>
                                    <strong>Office</strong>
                                    <p>245 Market Street, San Francisco, CA</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </main>

            <section className="contact-layout container">
                <div className="contact-info-panel">
                    <div className="info-card fade-up-card">
                        <span className="info-pill">Support</span>
                        <h3>Customer care when you need it</h3>
                        <p>Fast replies, friendly support, and guidance for every stage of your store setup.</p>
                        <div className="info-row">
                            <FaHeadset className="info-icon" />
                            <p>Response time under 2 hours on business days.</p>
                        </div>
                    </div>

                    <div className="info-card fade-up-card delay-1">
                        <span className="info-pill">Strategy</span>
                        <h3>Launch with confidence</h3>
                        <p>We help shape your product story, checkout flow, and brand presentation.</p>
                        <div className="info-row">
                            <FaShieldAlt className="info-icon" />
                            <p>Secure interactions across every order.</p>
                        </div>
                    </div>
                </div>

                <form className="contact-form fade-up-card delay-2" action="#">
                    <h2>Send us a message</h2>
                    <label>
                        Name
                        <input type="text" placeholder="Your full name" />
                    </label>
                    <label>
                        Email
                        <input type="email" placeholder="you@example.com" />
                    </label>
                    <label>
                        Topic
                        <select>
                            <option>General inquiry</option>
                            <option>Product support</option>
                            <option>Design request</option>
                            <option>Partnership</option>
                        </select>
                    </label>
                    <label>
                        Message
                        <textarea rows={6} placeholder="Tell us what you need"></textarea>
                    </label>
                    <button type="submit" className="btn btn-primary">Send message</button>
                </form>
            </section>
        </div>
    );
}
