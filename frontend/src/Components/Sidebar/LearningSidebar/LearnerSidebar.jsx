import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { FiSettings, FiLogOut, FiMenu, FiX, FiHome } from 'react-icons/fi';
import { FaUser } from 'react-icons/fa';
import '../Sidebar.css';
import { useUser } from '../../../context/UserContext';

function LearnerSidebar() {
    const [isCollapsed, setIsCollapsed] = useState(true);
    const location = useLocation();
    const navigate = useNavigate();
    const { logout, name } = useUser();

    const handleLogout = () => {
        logout();
        navigate('/');
    };

    const toggleSidebar = () => {
        setIsCollapsed(!isCollapsed);
    };

    return (
        <>
            <button className="sb-toggle-btn" onClick={toggleSidebar}>
                {isCollapsed ? <FiMenu /> : <FiX />}
            </button>
            <div className={`sb-sidebar ${isCollapsed ? 'sb-collapsed' : ''}`}>

                <nav className="sb-nav-links">
                    <Link to="/dashboard/learnerdashboard" className={`sb-nav-link ${location.pathname === '/dashboard/learnerdashboard' ? 'active' : ''}`}>
                        <FiHome className="sb-nav-icon" />
                        {!isCollapsed && <span>Dashboard</span>}
                    </Link>
                </nav>

                <div className="sb-user-section">
                    <div className="sb-user-profile">
                        <FaUser size={24} />
                        {!isCollapsed && <span className="sb-username">{name || 'Learner'}</span>}
                    </div>
                    <div className="sb-user-actions">
                        <Link to="/dashboard/settings" className="sb-action-btn">
                            <FiSettings />
                            {!isCollapsed && <span>Settings</span>}
                        </Link>
                        <button className="sb-action-btn sb-logout-btn" onClick={handleLogout}>
                            <FiLogOut />
                            {!isCollapsed && <span>Logout</span>}
                        </button>
                    </div>
                </div>
            </div>
        </>
    );
}

export default LearnerSidebar;