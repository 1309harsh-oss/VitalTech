import './Style.css';
import { useState } from 'react';

function ContactUs() {
    const [formData, setFormData] = useState({
        name: '', email: '', phone: '', subject: '', message: ''
    });
    const [submitted, setSubmitted] = useState(false);
    const [sending, setSending] = useState(false);

    const handleChange = (e) => {
        setFormData(prev => ({ ...prev, [e.target.id]: e.target.value }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        setSending(true);
        // Simulate sending
        setTimeout(() => {
            setSending(false);
            setSubmitted(true);
            setFormData({ name: '', email: '', phone: '', subject: '', message: '' });
            setTimeout(() => setSubmitted(false), 4000);
        }, 1500);
    };

    return (
        <div className="contact-page">
            <section className="contact-header">
                <h1>Get in Touch</h1>
                <p>We're here to help with your healthcare needs</p>
            </section>

            <div className="contact-container">
                <section className="contact-form">
                    <h2>Send us a Message</h2>
                    {submitted && (
                        <div className="contact-success-msg">
                            ✅ Your message has been sent successfully! We'll get back to you within 24 hours.
                        </div>
                    )}
                    <form className="form-grid" onSubmit={handleSubmit}>
                        <div className="form-group">
                            <label htmlFor="name">Full Name</label>
                            <input type="text" id="name" placeholder="Enter your name" required value={formData.name} onChange={handleChange} />
                        </div>
                        <div className="form-group">
                            <label htmlFor="email">Email Address</label>
                            <input type="email" id="email" placeholder="Enter your email" required value={formData.email} onChange={handleChange} />
                        </div>
                        <div className="form-group">
                            <label htmlFor="phone">Phone Number</label>
                            <input type="tel" id="phone" placeholder="Enter your phone number" value={formData.phone} onChange={handleChange} />
                        </div>
                        <div className="form-group">
                            <label htmlFor="subject">Subject</label>
                            <input type="text" id="subject" placeholder="How can we help?" required value={formData.subject} onChange={handleChange} />
                        </div>
                        <div className="form-group full-width">
                            <label htmlFor="message">Message</label>
                            <textarea id="message" rows="5" placeholder="Your message here..." required value={formData.message} onChange={handleChange}></textarea>
                        </div>
                        <button type="submit" className="submit-btn" disabled={sending}>
                            {sending ? 'Sending...' : 'Send Message'}
                        </button>
                    </form>
                </section>

                <section className="contact-info">
                    <h2>Contact Information</h2>
                    <div className="info-grid">
                        <div className="info-item">
                            <div className="info-icon">📍</div>
                            <h3>Address</h3>
                            <p>Jabalpur, Madhya Pradesh</p>
                        </div>
                        <div className="info-item">
                            <div className="info-icon">📞</div>
                            <h3>Phone</h3>
                            <p>+91 9301459291</p>
                        </div>
                        <div className="info-item">
                            <div className="info-icon">✉️</div>
                            <h3>Email</h3>
                            <p>70001933arin@gmail.com</p>
                        </div>
                        <div className="info-item">
                            <div className="info-icon">⏰</div>
                            <h3>Hours</h3>
                            <p>Monday - Friday: 9AM - 6PM</p>
                        </div>
                    </div>
                </section>
            </div>
        </div>
    )
}

export default ContactUs;