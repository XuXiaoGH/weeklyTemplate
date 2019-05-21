import React from 'react';

export default function App({ children }) {
  if (window.location.pathname === '/full') {
    return (
      <div className="app-root">{ children }</div>
    );
  }

  return (
    <div className="app-root">
      <div className="app-body">
        <div className="view-wrap">{ children }</div>
      </div>
    </div>
  );
}
