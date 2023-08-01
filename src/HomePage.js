// frontend/src/HomePage.js
import React from 'react';
import './HomePage.css';

function HomePage() {
  return (
    <div className="home-page">
      <div className="typewriter">
        <h2 className="main-title">Decentralized Achievement Registry</h2>
      </div>
      <p className="description">
        Welcome to the most advanced decentralized registry for recording and displaying your achievements!
      </p>
      <p className="description">
        Our website harnesses the power of blockchain technology to ensure your achievements are securely stored and immutable.
      </p>
      <p className="description">
        Every time you add an achievement, it will be automatically saved on the blockchain, creating an indelible record of your successes.
      </p>
      <p className="description">
        In addition to adding and viewing achievements, you can also explore a list of accomplishments shared by others and celebrate their triumphs.
      </p>
      <p className="description">
        Our user-friendly interface allows you to easily connect your wallet and start recording your achievements today.
      </p>
      <p className="description">
        Join our blockchain community and begin your journey to showcase your accomplishments to the world!
      </p>
    </div>
  );
}

export default HomePage;
