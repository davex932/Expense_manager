import React, { useState } from 'react';
import Sidebar from './Sidebar';
import Navbar from './Navbar';

const Layout = ({ children }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div className="app-shell" style={{ display: 'flex', minHeight: '100vh', overflow: 'hidden', fontFamily: "'Inter', system-ui, sans-serif" }}>
      <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />

      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
        <Navbar onMenuClick={() => setIsSidebarOpen(true)} />

        <main className="app-main" style={{ flex: 1, overflowY: 'auto', overflowX: 'hidden', padding: '36px 42px' }}>
          <div className="page-container" style={{ maxWidth: '1220px', margin: '0 auto' }}>
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};

export default Layout;
