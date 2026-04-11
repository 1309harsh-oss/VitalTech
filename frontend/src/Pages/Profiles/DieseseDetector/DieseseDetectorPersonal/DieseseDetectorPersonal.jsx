import './DieseseDetectorPersonal.css';
import { useNavigate } from 'react-router-dom';
import { FaFileAlt, FaXRay, FaCamera } from 'react-icons/fa';

function DieseseDetectorPersonal() {
  const navigate = useNavigate();

  const detectionMethods = [
    {
      icon: <FaFileAlt size={40} />,
      title: 'Blood Report Analysis',
      description: 'Upload your blood test reports and let AI check for heart disease risk factors.',
      route: '/dashboard/disease-finder-reports',
      color: '#ef4444',
    },
    {
      icon: <FaXRay size={40} />,
      title: 'Medical Scan Analysis',
      description: 'Analyze your MRI, CT, or X-Ray scans for potential abnormalities.',
      route: '/dashboard/disease-finder-scans',
      color: '#3b82f6',
    },
    {
      icon: <FaCamera size={40} />,
      title: 'Skin Condition Check',
      description: 'Take a photo of any skin concern and get AI-assisted classification.',
      route: '/dashboard/skin-disease-finder',
      color: '#10b981',
    },
  ];

  return (
    <div className="disease-detector-personal">
      <div className="personal-header">
        <h1>🏥 Personal Health Check</h1>
        <p>Use our AI tools to get quick insights about your health — privately and securely</p>
      </div>
      <div className="personal-cards">
        {detectionMethods.map((method, idx) => (
          <div className="personal-card" key={idx} onClick={() => navigate(method.route)}>
            <div className="personal-card-icon" style={{ color: method.color }}>{method.icon}</div>
            <h3>{method.title}</h3>
            <p>{method.description}</p>
            <button className="personal-btn" style={{ background: method.color }}>Check Now →</button>
          </div>
        ))}
      </div>
      <div className="privacy-note">
        <p>🔒 <strong>Your data is private.</strong> All uploads are processed securely and are not stored permanently.</p>
      </div>
    </div>
  );
}

export default DieseseDetectorPersonal;