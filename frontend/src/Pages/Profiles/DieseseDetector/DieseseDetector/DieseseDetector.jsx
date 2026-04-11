import './DieseseDetector.css';
import { useNavigate } from 'react-router-dom';
import { FaFileAlt, FaXRay, FaCamera } from 'react-icons/fa';

function DieseseDetector() {
  const navigate = useNavigate();

  const detectionMethods = [
    {
      icon: <FaFileAlt size={40} />,
      title: 'Blood Report Analysis',
      description: 'Upload blood test reports for AI-powered heart disease detection and risk assessment.',
      route: '/dashboard/disease-finder-reports',
      color: '#ef4444',
      available: true,
    },
    {
      icon: <FaXRay size={40} />,
      title: 'Medical Scan Analysis',
      description: 'Analyze MRI, CT, and X-Ray scans for brain tumors, lung diseases, and chest conditions.',
      route: '/dashboard/disease-finder-scans',
      color: '#3b82f6',
      available: true,
    },
    {
      icon: <FaCamera size={40} />,
      title: 'Skin Disease Detection',
      description: 'Upload skin images for AI-powered dermatological condition classification.',
      route: '/dashboard/skin-disease-finder',
      color: '#10b981',
      available: true,
    },
  ];

  return (
    <div className="disease-detector-container">
      <div className="detector-header">
        <h1>🩺 AI Disease Detection</h1>
        <p>Choose a detection method to analyze your medical data with advanced AI models</p>
      </div>
      <div className="detector-cards">
        {detectionMethods.map((method, idx) => (
          <div className="detector-card" key={idx} onClick={() => navigate(method.route)}>
            <div className="detector-card-icon" style={{ color: method.color }}>{method.icon}</div>
            <h3>{method.title}</h3>
            <p>{method.description}</p>
            <button className="detector-btn" style={{ background: method.color }}>
              {method.available ? 'Start Analysis →' : 'Coming Soon'}
            </button>
          </div>
        ))}
      </div>
      <div className="detector-info">
        <h3>How It Works</h3>
        <div className="info-steps">
          <div className="info-step"><span>1</span><p>Select the type of analysis</p></div>
          <div className="info-step"><span>2</span><p>Upload your medical data</p></div>
          <div className="info-step"><span>3</span><p>AI processes and analyzes</p></div>
          <div className="info-step"><span>4</span><p>Get instant results & PDF report</p></div>
        </div>
      </div>
    </div>
  );
}

export default DieseseDetector;