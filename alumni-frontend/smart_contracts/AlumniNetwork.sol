// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract AlumniNetworkDAO {
    struct Alumni {
        string name;
        string email;
        bool exists;
    }

    struct Student {
        string name;
        string email;
        bool exists;
    }

    struct Proposal {
        uint id;
        string description;
        uint fundingAmount;
        uint votesFor;
        uint votesAgainst;
        bool funded;
    }

    mapping(address => Alumni) public alumni;
    mapping(address => Student) public students;
    Proposal[] public proposals;
    address public owner;

    uint public alumniCount;
    uint public studentCount;

    constructor() {
        owner = msg.sender; // Set the contract deployer as the owner
    }

    modifier onlyAlumni() {
        require(alumni[msg.sender].exists, "Only alumni can perform this action");
        _;
    }

    modifier onlyOwner() {
        require(msg.sender == owner, "Only the owner can perform this action");
        _;
    }

    // Add a new alumni
    function addAlumni(address _alumniAddress, string memory _name, string memory _email) public onlyOwner {
        if (!alumni[_alumniAddress].exists) {
            alumni[_alumniAddress] = Alumni(_name, _email, true);
            alumniCount++;
        }
    }

    // Add a new student
    function addStudent(address _studentAddress, string memory _name, string memory _email) public onlyOwner {
        if (!students[_studentAddress].exists) {
            students[_studentAddress] = Student(_name, _email, true);
            studentCount++;
        }
    }

    // Create a new proposal
    function createProposal(string memory _description, uint _fundingAmount) public onlyAlumni {
        proposals.push(Proposal({
            id: proposals.length,
            description: _description,
            fundingAmount: _fundingAmount,
            votesFor: 0,
            votesAgainst: 0,
            funded: false
        }));
    }

    // Vote on a proposal
    function vote(uint _proposalId, bool _support) public onlyAlumni {
        Proposal storage proposal = proposals[_proposalId];
        if (_support) {
            proposal.votesFor++;
        } else {
            proposal.votesAgainst++;
        }
    }

    // Fund a proposal if it has more votes in favor
    function fundProposal(uint _proposalId) public payable onlyAlumni {
        Proposal storage proposal = proposals[_proposalId];
        require(proposal.votesFor > proposal.votesAgainst, "Proposal does not have enough support");
        require(!proposal.funded, "Proposal has already been funded");
        require(msg.value >= proposal.fundingAmount, "Insufficient funds to fund this proposal");

        proposal.funded = true;
    }

    // Get the count of proposals
    function getProposalCount() public view returns (uint) {
        return proposals.length;
    }

    // Get alumni count
    function getAlumniCount() public view returns (uint) {
        return alumniCount;
    }

    // Get student count
    function getStudentCount() public view returns (uint) {
        return studentCount;
    }
}
