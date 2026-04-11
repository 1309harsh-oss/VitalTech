import './Style.css';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';

function Services() {
    const navigate = useNavigate();
    const [expandedCard, setExpandedCard] = useState(null);

    const services = [
        {
            title: 'Disease Screening',
            icon: '🩺',
            description: 'Early detection of potential health issues using advanced AI algorithms',
            details: 'Our AI models analyze blood test reports and medical scans to detect diseases like heart disease, diabetes, cancer, and more at their earliest stages. Upload your reports and get instant AI-powered insights.',
            action: () => navigate('/login'),
        },
        {
            title: 'Health Monitoring',
            icon: '📊',
            description: 'Continuous tracking and analysis of vital health parameters',
            details: 'Track your health metrics over time with personalized dashboards. Monitor blood pressure, cholesterol, blood sugar, and other vital signs. Get AI-generated trend analysis and early warning alerts.',
            action: () => navigate('/login'),
        },
        {
            title: 'Risk Assessment',
            icon: '⚕️',
            description: 'Personalized health risk evaluation and recommendations',
            details: 'Our machine learning models evaluate your complete health profile to assess risk levels for various conditions. Receive personalized exercise routines, diet plans, and lifestyle recommendations.',
            action: () => navigate('/login'),
        },
        {
            title: 'AI Consultation',
            icon: '🤖',
            description: '24/7 AI-powered preliminary health consultations',
            details: 'Get instant answers to your health questions through our AI chatbot. Receive preliminary assessments, learn about symptoms, and get guidance on whether you need to see a specialist.',
            action: () => navigate('/login'),
        },
    ];

    return (
        <div className="services-page">
            <section className="services-hero">
                <h1>Our AI-Powered Health Services</h1>
                <p>Cutting-edge technology for better healthcare outcomes</p>
            </section>

            <section className="services-grid">
                {services.map((service, idx) => (
                    <div className={`service-card ${expandedCard === idx ? 'expanded' : ''}`} key={idx}>
                        <h3>{service.title}</h3>
                        <div className="service-icon">{service.icon}</div>
                        <p>{service.description}</p>
                        {expandedCard === idx && (
                            <div className="service-details">
                                <p>{service.details}</p>
                                <button className="try-service-btn" onClick={service.action}>Try This Service →</button>
                            </div>
                        )}
                        <button
                            className="learn-more"
                            onClick={() => setExpandedCard(expandedCard === idx ? null : idx)}
                        >
                            {expandedCard === idx ? 'Show Less' : 'Learn More'}
                        </button>
                    </div>
                ))}
            </section>

            <section className="why-choose-us">
                <h2>Why Choose Our Services?</h2>
                <div className="benefits-grid">
                    <div className="benefit-item">
                        <span>✓</span>
                        <p>99.9% Accuracy Rate</p>
                    </div>
                    <div className="benefit-item">
                        <span>✓</span>
                        <p>24/7 Availability</p>
                    </div>
                    <div className="benefit-item">
                        <span>✓</span>
                        <p>Instant Results</p>
                    </div>
                    <div className="benefit-item">
                        <span>✓</span>
                        <p>Secure & Private</p>
                    </div>
                </div>
            </section>
        </div>
    )
}

export default Services;