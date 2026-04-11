import './Home.css';
import { useUser } from '../../../context/UserContext';
import { FaUserCircle, FaStethoscope, FaChartLine, FaBell, FaShieldAlt } from 'react-icons/fa';

function Home() {
  const { name, userRole } = useUser();

  const getRoleLabel = (role) => {
    switch(role) {
      case 'doctor': return 'Doctor';
      case 'patient': return 'Patient';
      case 'learner': return 'Learner';
      case 'personal': return 'Personal';
      default: return 'User';
    }
  };

  const quickActions = [
    { icon: <FaStethoscope />, label: 'AI Disease Analysis', desc: 'Analyze medical scans & reports with AI', color: '#2563eb' },
    { icon: <FaChartLine />, label: 'Health Dashboard', desc: 'View your health metrics & trends', color: '#10b981' },
    { icon: <FaBell />, label: 'Notifications', desc: 'Check alerts & appointment reminders', color: '#f59e0b' },
    { icon: <FaShieldAlt />, label: 'Secure Records', desc: 'Access encrypted medical records', color: '#8b5cf6' },
  ];

  return (
    <div className='homer-container'>
      <div className="welcome-icon">
        <FaUserCircle size={72} color="#2563eb" />
      </div>
      <h2 className='welcome-title'>
        Welcome{name ? `, ${name}` : ''} 👋
      </h2>
      <p className='welcome-role'>
        Logged in as <strong>{getRoleLabel(userRole)}</strong>
      </p>
      <p className='welcome-text'>
        Select any section from the sidebar to get started with your healthcare tools.
      </p>
      <div className="quick-actions">
        {quickActions.map((action, idx) => (
          <div className="quick-action-card" key={idx}>
            <div className="quick-action-icon" style={{ color: action.color }}>{action.icon}</div>
            <h4>{action.label}</h4>
            <p>{action.desc}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Home;