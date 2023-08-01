// frontend/src/WalletConnectButton.js
import React, { useState, useEffect } from 'react';
import Web3 from 'web3';

const WalletConnectButton = () => {
  const [connected, setConnected] = useState(false);
  const [accountAddress, setAccountAddress] = useState('');

  const loadWeb3 = async () => {
    if (window.ethereum) {
      try {
        await window.ethereum.request({ method: 'eth_requestAccounts' });
        if (window.ethereum.selectedAddress) {
          setConnected(true);
          setAccountAddress(window.ethereum.selectedAddress);
          localStorage.setItem('connected', 'true');
          localStorage.setItem('accountAddress', window.ethereum.selectedAddress);
        }
      } catch (error) {
        console.error('Ошибка при подключении кошелька:', error.message);
      }
    } else if (window.web3) {
      setConnected(true);
      const web3Instance = new Web3(window.web3.currentProvider);
      const accounts = await web3Instance.eth.getAccounts();
      if (accounts.length > 0) {
        setAccountAddress(accounts[0]);
        localStorage.setItem('connected', 'true');
        localStorage.setItem('accountAddress', accounts[0]);
      }
    } else {
      console.log('Non-Ethereum browser detected.');
    }
  };

  const connectWallet = async () => {
    if (!connected) {
      await loadWeb3();
    }
  };

  const disconnectWallet = () => {
    setConnected(false);
    setAccountAddress('');
    localStorage.removeItem('connected');
    localStorage.removeItem('accountAddress');
  };

  useEffect(() => {
    const isConnected = localStorage.getItem('connected');
    const address = localStorage.getItem('accountAddress');
    if (isConnected === 'true' && address) {
      setConnected(true);
      setAccountAddress(address);
    } else {
      loadWeb3();
    }
  }, []);

  return (
    <div>
      {connected ? (
        <div>
          <p>Connected: {accountAddress}</p>
        </div>
      ) : (
        <button onClick={connectWallet}>Connect Wallet</button>
      )}
    </div>
  );
};

export default WalletConnectButton;
