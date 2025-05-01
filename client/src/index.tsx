import React from 'react';
import {createRoot, Root} from 'react-dom/client';
import App from './App';
import './index.css';

const container: HTMLElement| null = document.getElementById('root');
if (!container) throw new Error('Root element not found');

const root: Root = createRoot(container);
root.render(<App />);
