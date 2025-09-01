import React from 'react';
import { AppRouter } from './router';
import { ToastProvider } from './components/providers/ToastProvider';

function App() {
  return (
    <ToastProvider>
      <AppRouter />
    </ToastProvider>
  );
}

export default App;