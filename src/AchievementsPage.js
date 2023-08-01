// frontend/src/AchievementsPage.js
import React, { useState, useEffect } from 'react';
import Web3 from 'web3';
import './AchievementsPage.css';
import './App.css';



const contractABI = 'EXAMPLE'; //put your contractAbi 
const CONTRACT_ADDRESS = 'EXAMPLE'; // put your contract address

function AchievementsPage() {
    const [connected, setConnected] = useState(false);
    const [accountAddress, setAccountAddress] = useState('');
    const [achievements, setAchievements] = useState([]);
    const [achievementType, setAchievementType] = useState('');
    const [description, setDescription] = useState('');
    const [date, setDate] = useState('');
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
          loadAchievements(window.ethereum.selectedAddress, contractInstance);
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
        loadAchievements(accounts[0], contractInstance);
      }
    } else {
      alert('Non-Ethereum browser detected. You should consider trying MetaMask!');
    }
  };

  const loadAchievements = async (account, contractInstance) => {
    try {
      setLoading(true);
      setError(''); // Сбрасываем предыдущую ошибку
      const count = await contractInstance.methods.getAchievementCount().call({ from: account });
      const achievementsData = [];
      for (let i = 0; i < count; i++) {
        const achievement = await contractInstance.methods.getAchievementByIndex(i).call({ from: account });
        const achievementAddress = achievement[3];
        if (achievementAddress && achievementAddress.toLowerCase() === account.toLowerCase()) {
          achievementsData.push({
            achievementType: achievement[0],
            description: achievement[1],
            date: parseInt(achievement[2]),
            owner: achievement.owner
          });
        }
      }
      setAchievements(achievementsData);
      setLoading(false);
    } catch (error) {
      console.error('Ошибка при загрузке списка достижений:', error.message);
      setError('Не удалось загрузить достижения');
      setLoading(false);
    }
  };


  useEffect(() => {
    const fetchData = async () => {
      await loadWeb3();
      // Проверяем, что Web3 загружен успешно
      if (window.ethereum || window.web3) {
        setConnected(true);
      }
      // Загружаем достижения, если пользователь подключен к кошельку
      if (connected) {
        setLoading(true);
        const web3Instance = new Web3(window.ethereum || window.web3.currentProvider);
        const contractInstance = new web3Instance.eth.Contract(contractABI, CONTRACT_ADDRESS);
        const accounts = await web3Instance.eth.getAccounts();
        if (accounts.length > 0) {
          setAccountAddress(accounts[0]);
          await loadAchievements(accounts[0], contractInstance);
        }
        setLoading(false);
      }
    };

    fetchData();
  }, [connected]);


  return (
    <div className="achievements-page">
      <h2 className="section-title">My achievements:</h2>
      <ul>
        {achievements.map((achievement, index) => (
          <li key={index}>
            <p>Achievement type: {achievement.achievementType}</p>
            <p>Description: {achievement.description}</p>
            <p>Date: {new Date(achievement.date * 1000).toLocaleDateString()}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default AchievementsPage;
