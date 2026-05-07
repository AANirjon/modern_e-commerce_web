import { TopBar } from '@/components/layout/TopBar';
import { Navbar } from '@/components/layout/Navbar';
import { FaRocket, FaShieldAlt, FaStar, FaUsers } from 'react-icons/fa';
import './page.css';

export default function AboutPage() {
    return (
        <div className="page-frame about-page">
            <TopBar />
            <Navbar />

            <main className="about-hero">
                <div className="container about-hero-grid">
                    <div className="hero-copy">
                        <span className="eyebrow">About MobiNest</span>
                        <h1>We create mobile accessories that look and feel premium.</h1>
                        <p>
                            From protective cases to fast charging, every product is chosen for performance,
                            style, and everyday convenience.
                        </p>
                        <div className="hero-actions">
                            <a href="/contact" className="btn btn-primary">Contact Support</a>
                            <a href="#values" className="btn btn-secondary">Our values</a>
                        </div>
                    </div>

                    <div className="hero-visual">
                        <div className="hero-card floating-card">
                            <div className="hero-card-header">
                                <div className="hero-card-badge">01</div>
                                <span>Design-led commerce</span>
                            </div>
                            <p>
                                Clean layouts, immersive interactions, and refined motion that feels effortless.
                            </p>
                        </div>
                        <div className="hero-card accent-card">
                            <div className="hero-card-icon">
                                <FaRocket />
                            </div>
                            <h3>Fast to explore</h3>
                            <p>Speed and clarity are built in, so customers move confidently from browse to buy.</p>
                        </div>
                    </div>
                </div>
            </main>

            <section className="about-metrics container">
                <div className="metric-card gradient-card">
                    <span className="metric-value">4.9/5</span>
                    <p>Average rating for premium mobile accessories.</p>
                </div>
                <div className="metric-card glass-card">
                    <span className="metric-value">120+</span>
                    <p>Best-selling mobile accessories curated for daily use.</p>
                </div>
                <div className="metric-card glass-card">
                    <span className="metric-value">99.8%</span>
                    <p>Orders shipped on time with fast delivery service.</p>
                </div>
            </section>

            <section id="values" className="about-values container">
                <div className="section-heading">
                    <span className="eyebrow">Why we exist</span>
                    <h2>Built for clarity, trust, and fast-growing commerce.</h2>
                </div>

                <div className="values-grid">
                    <article className="value-card slide-up-card">
                        <div className="value-icon bg-blue"><FaShieldAlt /></div>
                        <h3>Trusted experiences</h3>
                        <p>Modern interactions that feel secure, polished, and reliable across devices.</p>
                    </article>
                    <article className="value-card slide-up-card delay-1">
                        <div className="value-icon bg-purple"><FaStar /></div>
                        <h3>Premium presentation</h3>
                        <p>Product stories that look beautiful, convert better, and keep customers engaged.</p>
                    </article>
                    <article className="value-card slide-up-card delay-2">
                        <div className="value-icon bg-pink"><FaUsers /></div>
                        <h3>Customer first</h3>
                        <p>Design choices centered on clarity, speed, and a seamless shopping flow.</p>
                    </article>
                </div>
            </section>

            <section className="about-story container">
                <div className="section-heading">
                    <span className="eyebrow">Our journey</span>
                    <h2>From concept to premium mobile accessories.</h2>
                </div>

                <div className="timeline">
                    <div className="timeline-item fade-in-left">
                        <div className="timeline-badge" />
                        <div>
                            <h4>Crafted for speed</h4>
                            <p>We design with performance and accessibility in mind first.</p>
                        </div>
                    </div>
                    <div className="timeline-item fade-in-right delay-1">
                        <div className="timeline-badge" />
                        <div>
                            <h4>Focused on experience</h4>
                            <p>Every section is tailored to delight and guide visitors forward.</p>
                        </div>
                    </div>
                    <div className="timeline-item fade-in-left delay-2">
                        <div className="timeline-badge" />
                        <div>
                            <h4>Designed for daily use</h4>
                            <p>Every accessory is built to enhance how people use their devices every day.</p>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}
