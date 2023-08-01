// frontend/src/AddAchievementPage.js
import React, { useState, useEffect } from 'react';
import Web3 from 'web3';
import { toBigInt } from 'web3-utils';
import './AddAchievementPage.css';
import './App.css';


const contractABI = 'EXAMPLE'; //put your contractAbi 
const CONTRACT_ADDRESS = 'EXAMPLE'; // put your contract address

function AddAchievementPage() {
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

  const handleAddAchievement = async () => {
    try {
      if (!connected) {
        alert('Пожалуйста, подключите ваш кошелек (MetaMask или другой)');
        return;
      }

      const web3 = new Web3(window.ethereum);
      const contract = new web3.eth.Contract(contractABI, CONTRACT_ADDRESS);

      const unixTimestamp = new Date(date).getTime() / 1000;
      const dateUint256 = toBigInt(unixTimestamp);

      await contract.methods.addAchievement(achievementType, description, dateUint256).send({
        from: accountAddress
      });

      alert('Достижение успешно добавлено');
      setAchievementType('');
      setDescription('');
      setDate('');
      loadAchievements(accountAddress);
    } catch (error) {
      console.error('Ошибка при добавлении достижения:', error.message);
      alert('Ошибка при добавлении достижения');
    }
  };


  useEffect(() => {
    loadWeb3();
  }, []);
  

  return (
    <div className="add-achievement-page">
      <h2 className="section-title">Add Achievement</h2>

      <div className="add-achievement-form">
        <input
          type="text"
          placeholder="Achievement Type"
          value={achievementType}
          onChange={(e) => setAchievementType(e.target.value)}
        />
        <input
          type="text"
          placeholder="Achievement Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
        <input
          type="date"
          placeholder="Achievement Date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
        />
        <button className="add-button" onClick={handleAddAchievement}>
          Add
        </button>
      </div>
      <div className="how-it-works-section">
        <h3 className="section-title">How it Works</h3>
        <p>
          Here you can add your achievements to the blockchain using our application. Your achievements will be saved
          forever and cannot be changed or deleted. To add an achievement, follow these steps:
        </p>
        <ol>
          <li>Connect your wallet (e.g., MetaMask).</li>
          <li>Enter the achievement type, description, and date in the input fields.</li>
          <li>Click the "Add" button to save the achievement to the blockchain.</li>
          <li>Your achievement will now be visible in the "My Achievements" section.</li>
        </ol>
        <p>This way, your achievement becomes part of an immutable and transparent history on the blockchain.</p>
      </div>
    </div>
  );
}

export default AddAchievementPage;
