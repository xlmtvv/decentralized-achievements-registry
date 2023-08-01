import React from 'react';
import { HashRouter, Route, NavLink, Routes } from 'react-router-dom';
import HomePage from './HomePage';
import AddAchievementPage from './AddAchievementPage';
import AchievementsPage from './AchievementsPage';
import './App.css';
import './Footer.css';
import './Navbar.css';
import Footer from './Footer'
import Web3 from 'web3';

import { useState, useEffect } from 'react';


const contractABI = 'EXAMPLE'; //put your contractAbi 
const CONTRACT_ADDRESS = 'EXAMPLE'; // put your contract address

function formatWalletAddress(address) {
  if (!address) return ''; // Если address равен null или undefined, вернуть пустую строку
  return `${address.substring(0, 6)}...${address.substring(address.length - 4)}`;
}


function Navbar({ connected, accountAddress }) {

  return (

    <nav>
      <ul>
        <li>
          <NavLink to="/" className={({ isActive }) => (isActive ? 'active' : null)}>
            Home
          </NavLink>
        </li>
        <li>
          <NavLink to="/add-achievement" className={({ isActive }) => (isActive ? 'active' : null)}>
            Add achievement
          </NavLink>
        </li>
        <li>
          <NavLink to="/achievements" className={({ isActive }) => (isActive ? 'active' : null)}>
            My achievements
          </NavLink>
        </li>
        <li className="wallet">
        <span>{accountAddress ? formatWalletAddress(accountAddress) : 'Not Connected'}</span>
        </li>
      </ul>
    </nav>

  );
}

function App() {

  const [connected, setConnected] = useState(false);
  const [accountAddress, setAccountAddress] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [web3, setWeb3] = useState(null);
  const [contract, setContract] = useState(null);
  const loadWeb3 = async () => {
    if (window.ethereum) {
      try {
        await window.ethereum.request({ method: 'eth_requestAccounts' });
        if (window.ethereum.selectedAddress) {
          setConnected(true);
          setAccountAddress(window.ethereum.selectedAddress);
          const web3Instance = new Web3(window.ethereum);
          setWeb3(web3Instance);
          const contractInstance = new web3Instance.eth.Contract(contractABI, CONTRACT_ADDRESS);
          setContract(contractInstance);
          // Оставьте эту строку без изменений
        } else {
          // Handle the case when the user denies the connection request
          console.error('Пользователь отменил запрос на подключение кошелька');
        }
      } catch (error) {
        console.error('Ошибка при подключении кошелька:', error.message);
      }
    } else if (window.web3) {
      setConnected(true);
      const web3Instance = new Web3(window.web3.currentProvider);
      setWeb3(web3Instance);
      const contractInstance = new web3Instance.eth.Contract(contractABI, CONTRACT_ADDRESS);
      setContract(contractInstance);
      const accounts = await web3Instance.eth.getAccounts();
      if (accounts.length > 0) {
        setAccountAddress(accounts[0]);
        // Оставьте эту строку без изменений
      }
    } else {
      alert('Non-Ethereum browser detected. You should consider trying MetaMask!');
    }
  };
  useEffect(() => {
    loadWeb3();
  }, []);
  return (
    <HashRouter >
      <div className="app">
      <Navbar connected={connected} accountAddress={accountAddress} />
        <div className="content">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/add-achievement" element={<AddAchievementPage />} />
            <Route path="/achievements" element={<AchievementsPage />} />
          </Routes>
        </div>
        <Footer />
      </div>
    </HashRouter>

  );
}

export default App;
