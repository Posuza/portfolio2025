import React from 'react';
import './App.css';
import UserProfile from './components/UserProfile.jsx';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <h1 className="text-2xl font-bold text-white">My Portfolio</h1>
        <UserProfile />
      </header>
    </div>
  );
}

export default App;
