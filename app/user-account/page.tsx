import Link from 'next/link';
import { TopBar } from '@/components/layout/TopBar';
import { Navbar } from '@/components/layout/Navbar';
import { FaUserCircle, FaShoppingBag, FaHeart, FaLock } from 'react-icons/fa';
import './page.css';

export default function UserAccountPage() {
    return (
        <div className="page-frame account-page">
            <TopBar />
            <Navbar />

            <main className="account-hero">
                <div className="container account-hero-grid">
                    <section className="profile-panel floating-panel">
                        <div className="profile-header">
                            <div className="profile-avatar">
                                <FaUserCircle />
                            </div>
                            <div className="profile-copy">
                                <p className="eyebrow">Hello, Jordan</p>
                                <h1>Your MobiNest home for smarter accessory shopping.</h1>
                                <p className="profile-subtitle">Track orders, refresh favorites, and discover tailored gadget upgrades with one elegant dashboard.</p>
                            </div>
                        </div>

                        <div className="profile-details two-columns">
                            <div>
                                <span>Member since</span>
                                <strong>April 2025</strong>
                            </div>
                            <div>
                                <span>Next delivery</span>
                                <strong>May 12, 2026</strong>
                            </div>
                            <div>
                                <span>Reward level</span>
                                <strong>Silver VIP</strong>
                            </div>
                        </div>
                    </section>

                    <aside className="hero-summary panel-card">
                        <div className="hero-summary-top">
                            <span className="eyebrow">New launch</span>
                            <h2>Try the sleek MobiGrip case for everyday protection.</h2>
                        </div>
                        <div className="featured-product">
                            <div className="featured-visual">
                                <span className="product-tag">MobiGrip</span>
                            </div>
                            <div className="featured-meta">
                                <p>Ultra-thin design, matte finish, and magnetic compatibility make this the perfect pocket essential.</p>
                                <div className="featured-stats">
                                    <span>4.9 ★</span>
                                    <span>Free delivery</span>
                                </div>
                            </div>
                        </div>
                        <Link href="/products" className="btn btn-primary hero-cta">Browse new arrivals</Link>
                    </aside>
                </div>
            </main>

            <section className="account-actions container">
                <div className="action-card slide-up-card">
                    <div className="action-icon bg-blue"><FaShoppingBag /></div>
                    <div>
                        <h2>Orders & returns</h2>
                        <p>See your latest purchases, track delivery updates, and manage returns instantly.</p>
                    </div>
                </div>
                <div className="action-card slide-up-card delay-1">
                    <div className="action-icon bg-pink"><FaHeart /></div>
                    <div>
                        <h2>Wishlist</h2>
                        <p>Keep your favorite accessories close and jump back to the products you love.</p>
                    </div>
                </div>
                <div className="action-card slide-up-card delay-2">
                    <div className="action-icon bg-purple"><FaLock /></div>
                    <div>
                        <h2>Account safety</h2>
                        <p>Update your password, payment details, and privacy settings instantly.</p>
                    </div>
                </div>
            </section>

            <section className="account-details container">
                <div className="account-panel fade-in-card">
                    <div className="panel-header">
                        <h3>Recent activity</h3>
                        <span>Orders, returns, and trending picks</span>
                    </div>
                    <div className="order-list">
                        <article className="order-item">
                            <div>
                                <strong>Order #4512</strong>
                                <p>Delivered • 3 items</p>
                            </div>
                            <span>$190.00</span>
                        </article>
                        <article className="order-item">
                            <div>
                                <strong>Order #4489</strong>
                                <p>Shipped • 2 items</p>
                            </div>
                            <span>$120.00</span>
                        </article>
                        <article className="order-item">
                            <div>
                                <strong>Order #4470</strong>
                                <p>Processing • 1 item</p>
                            </div>
                            <span>$45.00</span>
                        </article>
                    </div>
                </div>

                <aside className="account-sidebar fade-in-card delay-1">
                    <div className="sidebar-card">
                        <h3>Stay ready</h3>
                        <p>Unlock matching essentials, access fast reorder links, and keep your device setup feeling fresh.</p>
                    </div>
                    <div className="sidebar-action">
                        <button className="btn btn-secondary">Manage wishlist</button>
                    </div>
                    <div className="sidebar-action">
                        <button className="btn btn-secondary">Update shipping</button>
                    </div>
                    <div className="sidebar-action">
                        <button className="btn btn-secondary">Secure account</button>
                    </div>
                </aside>
            </section>
        </div>
    );
}
