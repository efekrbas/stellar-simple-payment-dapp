
import { useState, useEffect } from "react";
import {
    checkConnection,
    retrievePublicKey
} from "../../services/freighter";
import { shortenAddress } from "../../utils/format";
import "./styles.css";

const WalletConnect = ({ setPublicKey }) => {
    const [isAvailable, setIsAvailable] = useState(false);
    const [walletPublicKey, setWalletPublicKey] = useState("");
    const [error, setError] = useState(null);

    useEffect(() => {
        async function init() {
            const available = await checkConnection();
            setIsAvailable(available);
            if (available) {
                // Attempt to fetch if already installed & authorized
                const { publicKey } = await retrievePublicKey();
                if (publicKey) {
                    setWalletPublicKey(publicKey);
                    setPublicKey(publicKey);
                }
            }
        }
        init();
    }, [setPublicKey]);

    const handleConnect = async () => {
        setError(null);
        if (!isAvailable) {
            setError("Freighter not detected. Please install the extension.");
            return;
        }

        try {
            const { publicKey, error } = await retrievePublicKey();
            if (error) {
                setError(typeof error === 'string' ? error : error.message || "Connection failed");
            } else if (publicKey) {
                setWalletPublicKey(publicKey);
                setPublicKey(publicKey);
            } else {
                setError("Connection cancelled or no key received.");
            }
        } catch (err) {
            setError(err.message);
        }
    };

    const handleDisconnect = () => {
        // Note: Freighter doesn't support forcing a disconnect from the dApp side 
        // in the same way authentication works, but we can clear local state.
        setWalletPublicKey("");
        setPublicKey("");
    };

    return (
        <div className="wallet-connect">
            <div style={{ fontSize: '10px', color: '#888', textAlign: 'right', marginBottom: '5px' }}>vDebug-1.0</div>
            {walletPublicKey ? (
                <div className="connected-status">
                    <p>Connected: {shortenAddress(walletPublicKey)}</p>
                    <button className="disconnect-btn" onClick={handleDisconnect}>Disconnect</button>
                </div>
            ) : (
                <button onClick={handleConnect}>Connect Freighter Wallet</button>
            )}
            {error && <p className="error-message">{error}</p>}
            {!isAvailable && (
                <p className="install-message">
                    <a href="https://www.freighter.app/" target="_blank" rel="noreferrer">
                        Install Freighter
                    </a>
                </p>
            )}
        </div>
    );
};

export default WalletConnect;
