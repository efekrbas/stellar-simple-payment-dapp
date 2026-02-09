
import { useState } from 'react';
import { buildPaymentTransaction, submitTransaction } from '../../services/stellar';
import { signTransaction } from '../../services/freighter';
import { isValidAddress } from '../../utils/format';
import './styles.css';

const PaymentForm = ({ publicKey }) => {
    const [destination, setDestination] = useState('');
    const [amount, setAmount] = useState('');
    const [loading, setLoading] = useState(false);
    const [status, setStatus] = useState(null);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setStatus(null);

        // Validation
        if (!publicKey) {
            setStatus({ type: 'error', message: 'Please connect your wallet first.' });
            return;
        }
        if (!isValidAddress(destination)) {
            setStatus({ type: 'error', message: 'Invalid Stellar address' });
            return;
        }
        if (!amount || parseFloat(amount) <= 0) {
            setStatus({ type: 'error', message: 'Amount must be positive' });
            return;
        }

        setLoading(true);

        try {
            // 1. Build Transaction
            const xdr = await buildPaymentTransaction(publicKey, destination, amount);

            // 2. Sign with Freighter
            const signedXdr = await signTransaction(xdr);
            if (!signedXdr) {
                setLoading(false);
                setStatus({ type: 'warning', message: 'Transaction rejected by user' });
                return;
            }

            // 3. Submit to Stellar
            const result = await submitTransaction(signedXdr);

            setStatus({
                type: 'success',
                message: `Payment sent successfully!`,
                hash: result.hash
            });

            setDestination('');
            setAmount('');

        } catch (err) {
            console.error(err);
            let errorMessage = 'Transaction failed.';

            // Better Error Parsing
            if (err.response && err.response.data && err.response.data.extras && err.response.data.extras.result_codes) {
                const codes = err.response.data.extras.result_codes;
                if (codes.operations && codes.operations.includes('op_no_destination')) {
                    errorMessage = 'Destination account does not exist. (Use create account for new addresses)';
                } else if (codes.operations && codes.operations.includes('op_underfunded')) {
                    errorMessage = 'Insufficient balance to cover amount + fees.';
                } else {
                    errorMessage += ` Code: ${codes.transaction}`;
                }
            } else if (err.message) {
                errorMessage = err.message;
            }

            setStatus({ type: 'error', message: errorMessage });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="payment-form-container">
            <h3>Send XLM</h3>
            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label>Destination Address</label>
                    <input
                        type="text"
                        placeholder="G..."
                        value={destination}
                        onChange={(e) => setDestination(e.target.value)}
                        disabled={loading}
                    />
                </div>

                <div className="form-group">
                    <label>Amount (XLM)</label>
                    <input
                        type="number"
                        placeholder="0.0"
                        step="0.0000001"
                        min="0"
                        value={amount}
                        onChange={(e) => setAmount(e.target.value)}
                        disabled={loading}
                    />
                </div>

                <button
                    type="submit"
                    disabled={!publicKey || loading || !destination || !amount}
                    className={!publicKey ? 'disabled-connect' : ''}
                    style={{ cursor: (!publicKey || loading || !destination || !amount) ? 'not-allowed' : 'pointer', opacity: (!publicKey) ? 0.6 : 1 }}
                >
                    {!publicKey ? 'Connect Wallet to Send' : loading ? 'Processing...' : 'Send Payment'}
                </button>
            </form>

            {status && (
                <div className={`status-message ${status.type}`}>
                    {status.message}
                    {status.hash && (
                        <div className="explorer-link">
                            <a
                                href={`https://stellar.expert/explorer/testnet/tx/${status.hash}`}
                                target="_blank"
                                rel="noreferrer"
                            >
                                View on Explorer
                            </a>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default PaymentForm;
