import React, { useState, useEffect } from "react";

const MetaMaskConnect = ({ onAccountConnected }) => {
  const [account, setAccount] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  // Function to connect to MetaMask
  const connectMetaMask = async () => {
    if (window.ethereum) {
      try {
        const accounts = await window.ethereum.request({
          method: "eth_requestAccounts",
        });
        setAccount(accounts[0]); // Set the first account from MetaMask
        setErrorMessage(""); // Clear any previous errors
        if (onAccountConnected) {
          onAccountConnected(accounts[0]); // Notify parent component
        }
      } catch (error) {
        setErrorMessage("Failed to connect MetaMask. Please try again.");
      }
    } else {
      setErrorMessage("MetaMask not found. Please install MetaMask.");
    }
  };

  useEffect(() => {
    // Auto-connect to MetaMask if already authorized
    const checkIfConnected = async () => {
      if (window.ethereum) {
        const accounts = await window.ethereum.request({
          method: "eth_accounts",
        });
        if (accounts.length > 0) {
          setAccount(accounts[0]); // Set the first account from MetaMask
          if (onAccountConnected) {
            onAccountConnected(accounts[0]); // Notify parent component
          }
        }
      }
    };
    checkIfConnected();
  }, [onAccountConnected]);

  return (
    <div>
      {account ? (
        <h2></h2>
      ) : (
        <button onClick={connectMetaMask}>Connect to MetaMask</button>
      )}

      {errorMessage && <p style={{ color: "red" }}>{errorMessage}</p>}
    </div>
  );
};

export default MetaMaskConnect;
