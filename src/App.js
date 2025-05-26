import React, { useState } from 'react';
import Dashboard from './pages/Dashboard';
import Analytics from './pages/Analytics';

function App() {
  const [page, setPage] = useState('dashboard');

  return (
    <div className="min-h-screen bg-gray-100">
      <nav className="bg-green-600 text-white p-4 flex justify-between">
        <h1 className="font-bold text-xl">CareConnect</h1>
        <div className="space-x-4">
          <button
            onClick={() => setPage('dashboard')}
            className={`px-3 py-1 rounded ${page === 'dashboard' ? 'bg-green-800' : ''}`}
          >
            Dashboard
          </button>
          <button
            onClick={() => setPage('analytics')}
            className={`px-3 py-1 rounded ${page === 'analytics' ? 'bg-green-800' : ''}`}
          >
            Analytics
          </button>
        </div>
      </nav>

      <main>
        {page === 'dashboard' && <Dashboard />}
        {page === 'analytics' && <Analytics />}
      </main>
    </div>
  );
}

export default App;
