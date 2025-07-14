import React, { useState } from 'react';
import Layout from './components/Layout';
import Dashboard from './components/Dashboard';
import EmailInbox from './components/EmailInbox';
import ConsultantManagement from './components/ConsultantManagement';
import AIMatching from './components/AIMatching';
import JobRequirements from './components/JobRequirements';

function App() {
  const [currentPage, setCurrentPage] = useState('dashboard');

  const renderPage = () => {
    switch (currentPage) {
      case 'dashboard':
        return <Dashboard />;
      case 'emails':
        return <EmailInbox />;
      case 'consultants':
        return <ConsultantManagement />;
      case 'matching':
        return <AIMatching />;
      case 'jobs':
        return <JobRequirements />;
      case 'submissions':
        return <div className="p-6"><h1 className="text-2xl font-bold">Submissions Dashboard - Coming Soon</h1></div>;
      case 'notifications':
        return <div className="p-6"><h1 className="text-2xl font-bold">Notifications - Coming Soon</h1></div>;
      case 'settings':
        return <div className="p-6"><h1 className="text-2xl font-bold">Settings - Coming Soon</h1></div>;
      default:
        return <Dashboard />;
    }
  };

  return (
    <Layout currentPage={currentPage} onPageChange={setCurrentPage}>
      {renderPage()}
    </Layout>
  );
}

export default App;