import initWasm from 'rxd-wasm';
import { Buffer } from 'buffer';
import process from 'process';
import { useEffect, useState } from 'react';
import ReactDOM from 'react-dom/client';
import { App } from './App';
import { ThemeProvider } from './contexts/ColorThemeContext';
import { Web3Provider } from './contexts/Web3Context';
import './index.css';
import { initSignalsFromStorage } from './signals';
global.Buffer = Buffer;
global.process = process;
window.Buffer = Buffer;

const LoadApp = () => {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    (async () => {
      await initWasm();
      await initSignalsFromStorage();
      setReady(true);
    })();
  });

  if (!ready) {
    return null;
  }

  return (
    <ThemeProvider>
      <Web3Provider>
        <App />
      </Web3Provider>
    </ThemeProvider>
  );
};

const root = document.getElementById('root')!;
const rootDiv = ReactDOM.createRoot(root);
rootDiv.render(<LoadApp />);
