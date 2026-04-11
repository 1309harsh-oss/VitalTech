import './LearnerDashboard.css';
import { useUser } from '../../../../context/UserContext';
import { FaBookMedical, FaGraduationCap, FaMicroscope, FaHeartbeat, FaBrain, FaLungs, FaBone, FaVirus } from 'react-icons/fa';
import { useState } from 'react';

const learningModules = [
  {
    id: 1,
    title: 'Heart Disease Detection',
    icon: <FaHeartbeat />,
    color: '#ef4444',
    progress: 65,
    lessons: 12,
    completed: 8,
    description: 'Learn how AI models detect cardiovascular diseases from blood tests and ECG data.',
    topics: ['ECG interpretation', 'Blood pressure analysis', 'Cholesterol levels', 'Risk factor assessment']
  },
  {
    id: 2,
    title: 'Brain Tumor Classification',
    icon: <FaBrain />,
    color: '#8b5cf6',
    progress: 40,
    lessons: 10,
    completed: 4,
    description: 'Understand MRI-based brain tumor detection using deep learning models.',
    topics: ['MRI basics', 'Tumor types', 'CNN architecture', 'Image preprocessing']
  },
  {
    id: 3,
    title: 'Lung Disease Analysis',
    icon: <FaLungs />,
    color: '#3b82f6',
    progress: 20,
    lessons: 8,
    completed: 2,
    description: 'Explore CT scan analysis for detecting lung diseases including TB and cancer.',
    topics: ['CT scan reading', 'Lung anatomy', 'Disease markers', 'AI prediction models']
  },
  {
    id: 4,
    title: 'Skin Disease Recognition',
    icon: <FaVirus />,
    color: '#10b981',
    progress: 0,
    lessons: 9,
    completed: 0,
    description: 'Study dermatological conditions and how AI classifies skin lesions from images.',
    topics: ['Dermatology basics', 'Lesion classification', 'Image augmentation', 'Model training']
  },
  {
    id: 5,
    title: 'Bone Fracture Detection',
    icon: <FaBone />,
    color: '#f59e0b',
    progress: 0,
    lessons: 7,
    completed: 0,
    description: 'Learn X-ray analysis techniques for detecting and classifying bone fractures.',
    topics: ['X-ray imaging', 'Fracture types', 'Object detection', 'YOLO models']
  },
  {
    id: 6,
    title: 'Medical Data Science',
    icon: <FaMicroscope />,
    color: '#ec4899',
    progress: 10,
    lessons: 15,
    completed: 2,
    description: 'Master data preprocessing, feature engineering, and model evaluation in healthcare.',
    topics: ['Data cleaning', 'Feature selection', 'Model metrics', 'Cross-validation']
  }
];

function LearnerDashboard() {
  const { name } = useUser();
  const [expandedModule, setExpandedModule] = useState(null);

  const totalLessons = learningModules.reduce((acc, m) => acc + m.lessons, 0);
  const completedLessons = learningModules.reduce((acc, m) => acc + m.completed, 0);
  const overallProgress = Math.round((completedLessons / totalLessons) * 100);

  return (
    <div className="learner-dashboard">
      <div className="learner-header">
        <div className="learner-welcome">
          <FaGraduationCap size={42} color="#2563eb" />
          <div>
            <h2>Welcome, {name || 'Learner'} 👨‍🎓</h2>
            <p>Continue your AI Healthcare learning journey</p>
          </div>
        </div>
        <div className="learner-stats">
          <div className="stat-card">
            <span className="stat-value">{learningModules.length}</span>
            <span className="stat-label">Modules</span>
          </div>
          <div className="stat-card">
            <span className="stat-value">{completedLessons}/{totalLessons}</span>
            <span className="stat-label">Lessons Done</span>
          </div>
          <div className="stat-card">
            <span className="stat-value">{overallProgress}%</span>
            <span className="stat-label">Overall Progress</span>
          </div>
        </div>
      </div>

      <div className="overall-progress-bar">
        <div className="progress-track">
          <div className="progress-fill" style={{ width: `${overallProgress}%` }}></div>
        </div>
        <span>{overallProgress}% Complete</span>
      </div>

      <h3 className="section-title"><FaBookMedical /> Learning Modules</h3>
      <div className="modules-grid">
        {learningModules.map((mod) => (
          <div
            className={`module-card ${expandedModule === mod.id ? 'expanded' : ''}`}
            key={mod.id}
            onClick={() => setExpandedModule(expandedModule === mod.id ? null : mod.id)}
          >
            <div className="module-header">
              <div className="module-icon" style={{ color: mod.color }}>{mod.icon}</div>
              <div className="module-info">
                <h4>{mod.title}</h4>
                <span className="module-meta">{mod.completed}/{mod.lessons} lessons</span>
              </div>
            </div>
            <div className="module-progress-bar">
              <div className="module-progress-fill" style={{ width: `${mod.progress}%`, background: mod.color }}></div>
            </div>
            <span className="module-progress-text">{mod.progress}% complete</span>
            {expandedModule === mod.id && (
              <div className="module-details">
                <p>{mod.description}</p>
                <ul>
                  {mod.topics.map((topic, i) => (
                    <li key={i}>{topic}</li>
                  ))}
                </ul>
                <button className="start-btn" style={{ background: mod.color }}>
                  {mod.progress > 0 ? 'Continue Learning' : 'Start Module'}
                </button>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export default LearnerDashboard;