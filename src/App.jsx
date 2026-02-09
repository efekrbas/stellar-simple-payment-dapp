
import { useState } from 'react';
import './App.css';
import WalletConnect from './components/WalletConnect';
import AccountInfo from './components/AccountInfo';
import PaymentForm from './components/PaymentForm';

function App() {
  const [publicKey, setPublicKey] = useState("");

  return (
    <div className="App">
      <h1>Stellar Payment dApp</h1>
      <div className="card">
        <WalletConnect setPublicKey={setPublicKey} />

        {publicKey && (
          <AccountInfo publicKey={publicKey} />
        )}

        {/* PaymentForm is always visible but handles its own disabled state */}
        <div className="payment-section">
          <PaymentForm publicKey={publicKey} />
        </div>

      </div>
      <p className="read-the-docs">
        Build on Stellar with React & Vite
      </p>
    </div>
  );
}

export default App;
