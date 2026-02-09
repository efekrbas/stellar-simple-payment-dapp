
import { useState, useEffect } from 'react';
import { getAccountDetails, getXLMBalance, fundAccount } from '../../services/stellar';
import { shortenAddress } from '../../utils/format';
import './styles.css';

const AccountInfo = ({ publicKey }) => {
    const [balance, setBalance] = useState('0');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [needsFunding, setNeedsFunding] = useState(false);

    const fetchData = async () => {
        setLoading(true);
        setError(null);
        try {
            const account = await getAccountDetails(publicKey);
            if (account) {
                setBalance(getXLMBalance(account));
                setNeedsFunding(false);
            } else {
                setNeedsFunding(true);
                setBalance('0');
            }
        } catch (err) {
            setError(`Failed to fetch account info: ${err.message || err.toString()}`);
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (publicKey) {
            fetchData();
        }
    }, [publicKey]);

    const handleFund = async () => {
        setLoading(true);
        const success = await fundAccount(publicKey);
        if (success) {
            await fetchData();
        } else {
            setError("Friendbot failed. Please try again later.");
            setLoading(false);
        }
    };

    if (loading) return <div className="account-info loading">Loading account data...</div>;

    return (
        <div className="account-info">
            <h3>Your Account</h3>
            <div className="info-row">
                <span className="label">Public Key:</span>
                <span className="value code" title={publicKey}>{shortenAddress(publicKey)}</span>
            </div>

            {needsFunding ? (
                <div className="funding-needed">
                    <p className="warning">Account not found on Testnet.</p>
                    <button onClick={handleFund} disabled={loading}>Fund with Friendbot</button>
                </div>
            ) : (
                <div className="info-row">
                    <span className="label">Balance:</span>
                    <span className="value highlight">{balance} XLM</span>
                </div>
            )}

            {error && <p className="error">{error}</p>}
        </div>
    );
};

export default AccountInfo;
