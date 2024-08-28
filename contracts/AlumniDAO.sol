// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "./AlumniToken.sol";

contract AlumniDAO {
    struct Proposal {
        string description;
        uint256 amount;
        address payable recipient;
        uint256 votesFor;
        uint256 votesAgainst;
        bool executed;
        mapping(address => bool) voted;
    }

    mapping(uint256 => Proposal) public proposals;
    uint256 public proposalCount;
    address public tokenAddress;
    address public treasuryAddress;

    constructor(address _tokenAddress, address _treasuryAddress) {
        tokenAddress = _tokenAddress;
        treasuryAddress = _treasuryAddress;
    }

    function createProposal(string memory _description, uint256 _amount, address payable _recipient) public {
        proposalCount++;
        Proposal storage newProposal = proposals[proposalCount];
        newProposal.description = _description;
        newProposal.amount = _amount;
        newProposal.recipient = _recipient;
    }

    function vote(uint256 proposalId, bool support) public {
        Proposal storage proposal = proposals[proposalId];
        require(!proposal.voted[msg.sender], "Already voted");

        uint256 voterBalance = AlumniToken(tokenAddress).balanceOf(msg.sender);
        require(voterBalance > 0, "No voting power");

        proposal.voted[msg.sender] = true;

        if (support) {
            proposal.votesFor += voterBalance;
        } else {
            proposal.votesAgainst += voterBalance;
        }
    }

    function executeProposal(uint256 proposalId) public {
        Proposal storage proposal = proposals[proposalId];
        require(!proposal.executed, "Already executed");
        require(proposal.votesFor > proposal.votesAgainst, "Proposal did not pass");

        proposal.executed = true;
        payable(treasuryAddress).transfer(proposal.amount);
        proposal.recipient.transfer(proposal.amount);
    }

    receive() external payable {}
}
