import React, { useState } from "react";
import "./App.css";
import MetaMaskConnect from "./Components/MetaMaskConnect";

function App() {
  const [account, setAccount] = useState(""); // Example account address
  const [alumni, setAlumni] = useState({});
  const [students, setStudents] = useState({  });
  const [proposals, setProposals] = useState([]);
  const [newProposal, setNewProposal] = useState("");
  const [newProposalFundingAmount, setNewProposalFundingAmount] = useState(0);

  const handleNewProposal = () => {
    // Create a new proposal in the frontend state
    const newProposalObj = {
      id: proposals.length,
      description: newProposal,
      fundingAmount: newProposalFundingAmount,
      votesFor: 0,
      votesAgainst: 0,
      funded: false,
    };
    setProposals([...proposals, newProposalObj]);
    setNewProposal("");
    setNewProposalFundingAmount(0);
  };

  const handleVote = (proposalId, vote) => {
    // Handle voting logic in the frontend state
    const updatedProposals = proposals.map((proposal) => {
      if (proposal.id === proposalId) {
        return vote
          ? { ...proposal, votesFor: proposal.votesFor + 1 }
          : { ...proposal, votesAgainst: proposal.votesAgainst + 1 };
      }
      return proposal;
    });
    setProposals(updatedProposals);
  };

  const handleFundProposal = (proposalId) => {
    // Handle funding logic in the frontend state
    const updatedProposals = proposals.map((proposal) => {
      if (
        proposal.id === proposalId &&
        proposal.votesFor > proposal.votesAgainst
      ) {
        return { ...proposal, funded: true };
      }
      return proposal;
    });
    setProposals(updatedProposals);
  };

  return (
    <div className="App">
      <MetaMaskConnect onAccountConnected={(account) => setAccount(account)} />
      <h1>Alumni Network DAO</h1>
      <h4 className="col-yellow">Account: {account}</h4>

      <h2>Alumni:</h2>
      <ul>
        {Object.keys(alumni).map((alumnus) => (
          <li key={alumnus}>
            {alumni[alumnus].name} ({alumni[alumnus].email})
          </li>
        ))}
      </ul>

      <h2>Students:</h2>
      <ul>
        {Object.keys(students).map((student) => (
          <li key={student}>
            {students[student].name} ({students[student].email})
          </li>
        ))}
      </ul>

      <h2>Proposals:</h2>
      <ul>
        {proposals.map((proposal) => (
          <li key={proposal.id}>
            <p>{proposal.description}</p>
            <p>Funding Amount: {proposal.fundingAmount} ETH</p>
            <button onClick={() => handleVote(proposal.id, true)}>
              Vote For
            </button>
            <button onClick={() => handleVote(proposal.id, false)}>
              Vote Against
            </button>
            {proposal.funded ? (
              <p>Funded!</p>
            ) : (
              <button onClick={() => handleFundProposal(proposal.id)}>
                Fund
              </button>
            )}
          </li>
        ))}
      </ul>

      <h2>Create New Proposal:</h2>
      <input
        type="text"
        value={newProposal}
        onChange={(e) => setNewProposal(e.target.value)}
        placeholder="Proposal Description"
      />
      <input
        type="number"
        value={newProposalFundingAmount}
        onChange={(e) => setNewProposalFundingAmount(e.target.value)}
        placeholder="Funding Amount (ETH)"
      />
      <button onClick={handleNewProposal}>Create Proposal</button>
    </div>
  );
}

export default App;

// import React, { useState, useEffect } from "react";
// import { ethers } from "ethers";
// import AlumniNetworkDAO from "./contracts/AlumniNetworkDAO.json"; // Smart contract ABI
// import "./App.css";
// import MetaMaskConnect from "./Components/MetaMaskConnect";

// function App() {
//   const [account, setAccount] = useState("");
//   const [alumni, setAlumni] = useState({});
//   const [students, setStudents] = useState({});
//   const [proposals, setProposals] = useState([]);
//   const [newProposal, setNewProposal] = useState("");
//   const [newProposalFundingAmount, setNewProposalFundingAmount] = useState(0);
//   const [contract, setContract] = useState(null);
//   const [provider, setProvider] = useState(null);
//   const [signer, setSigner] = useState(null);

//   useEffect(() => {
//     const initBlockchain = async () => {
//       if (window.ethereum) {
//         try {
//           // Create provider and signer
//           const ethersProvider = new ethers.providers.Web3Provider(
//             window.ethereum
//           );
//           const ethersSigner = ethersProvider.getSigner();
//           setProvider(ethersProvider);
//           setSigner(ethersSigner);

//           // Get network ID and contract address
//           const network = await ethersProvider.getNetwork();
//           const networkId = network.chainId;
//           const deployedNetwork = AlumniNetworkDAO.networks[networkId];

//           if (deployedNetwork && deployedNetwork.address) {
//             // Create the contract instance
//             const contractInstance = new ethers.Contract(
//               deployedNetwork.address,
//               AlumniNetworkDAO.abi,
//               ethersSigner
//             );
//             setContract(contractInstance);

//             // Load initial data
//             if (account) {
//               loadAlumni(contractInstance);
//               loadStudents(contractInstance);
//               loadProposals(contractInstance);
//             }
//           } else {
//             console.error(
//               "Smart contract not deployed on the detected network."
//             );
//           }
//         } catch (error) {
//           console.error("Error connecting to MetaMask:", error);
//         }
//       } else {
//         console.error("MetaMask is not installed!");
//       }
//     };

//     if (account) {
//       initBlockchain();
//     }
//   }, [account]);

//   const loadAlumni = async (contractInstance) => {
//     try {
//       const alumniCount = await contractInstance.getAlumniCount();
//       let alumniData = {};
//       for (let i = 0; i < alumniCount.toNumber(); i++) {
//         const alumnus = await contractInstance.getAlumni(i);
//         alumniData[alumnus.address] = {
//           name: alumnus.name,
//           email: alumnus.email,
//         };
//       }
//       setAlumni(alumniData);
//     } catch (error) {
//       console.error("Error loading alumni:", error);
//     }
//   };

//   const loadStudents = async (contractInstance) => {
//     try {
//       const studentCount = await contractInstance.getStudentCount();
//       let studentsData = {};
//       for (let i = 0; i < studentCount.toNumber(); i++) {
//         const student = await contractInstance.getStudent(i);
//         studentsData[student.address] = {
//           name: student.name,
//           email: student.email,
//         };
//       }
//       setStudents(studentsData);
//     } catch (error) {
//       console.error("Error loading students:", error);
//     }
//   };

//   const loadProposals = async (contractInstance) => {
//     try {
//       const proposalCount = await contractInstance.getProposalCount();
//       let proposalsData = [];
//       for (let i = 0; i < proposalCount.toNumber(); i++) {
//         const proposal = await contractInstance.getProposal(i);
//         proposalsData.push(proposal);
//       }
//       setProposals(proposalsData);
//     } catch (error) {
//       console.error("Error loading proposals:", error);
//     }
//   };

//   const handleNewProposal = async () => {
//     try {
//       await contract.createProposal(
//         newProposal,
//         ethers.utils.parseUnits(newProposalFundingAmount.toString(), "ether")
//       );
//       setNewProposal("");
//       setNewProposalFundingAmount(0);
//       loadProposals(contract); // Reload proposals after creating a new one
//     } catch (error) {
//       console.error("Error creating proposal:", error);
//     }
//   };

//   const handleVote = async (proposalId, vote) => {
//     try {
//       await contract.vote(proposalId, vote);
//       loadProposals(contract); // Reload proposals after voting
//     } catch (error) {
//       console.error("Error voting on proposal:", error);
//     }
//   };

//   const handleFundProposal = async (proposalId) => {
//     try {
//       await contract.fundProposal(proposalId, {
//         value: ethers.utils.parseUnits("0.1", "ether"),
//       }); // Example funding amount
//       loadProposals(contract); // Reload proposals after funding
//     } catch (error) {
//       console.error("Error funding proposal:", error);
//     }
//   };

//   return (
//     <div className="App">
//       <MetaMaskConnect onAccountConnected={(account) => setAccount(account)} />
//       <h1>Alumni Network DAO</h1>
//       <h2>Account: {account}</h2>

//       <h2>Alumni:</h2>
//       <ul>
//         {Object.keys(alumni).map((alumnus) => (
//           <li key={alumnus}>
//             {alumni[alumnus].name} ({alumni[alumnus].email})
//           </li>
//         ))}
//       </ul>

//       <h2>Students:</h2>
//       <ul>
//         {Object.keys(students).map((student) => (
//           <li key={student}>
//             {students[student].name} ({students[student].email})
//           </li>
//         ))}
//       </ul>

//       <h2>Proposals:</h2>
//       <ul>
//         {proposals.map((proposal) => (
//           <li key={proposal.id.toString()}>
//             <p>{proposal.description}</p>
//             <p>
//               Funding Amount:{" "}
//               {ethers.utils.formatUnits(proposal.fundingAmount, "ether")} ETH
//             </p>
//             <button onClick={() => handleVote(proposal.id, true)}>
//               Vote For
//             </button>
//             <button onClick={() => handleVote(proposal.id, false)}>
//               Vote Against
//             </button>
//             {proposal.funded ? (
//               <p>Funded!</p>
//             ) : (
//               <button onClick={() => handleFundProposal(proposal.id)}>
//                 Fund
//               </button>
//             )}
//           </li>
//         ))}
//       </ul>

//       <h2>Create New Proposal:</h2>
//       <input
//         type="text"
//         value={newProposal}
//         onChange={(e) => setNewProposal(e.target.value)}
//         placeholder="Proposal Description"
//       />
//       <input
//         type="number"
//         value={newProposalFundingAmount}
//         onChange={(e) => setNewProposalFundingAmount(e.target.value)}
//         placeholder="Funding Amount (ETH)"
//       />
//       <button onClick={handleNewProposal}>Create Proposal</button>
//     </div>
//   );
// }

// export default App;
