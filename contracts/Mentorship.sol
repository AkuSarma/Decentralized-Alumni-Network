// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "./AlumniToken.sol";

contract Mentorship {
    struct Session {
        address mentor;
        address mentee;
        uint256 reward;
        bool completed;
    }

    Session[] public sessions;
    address public tokenAddress;

    constructor(address _tokenAddress) {
        tokenAddress = _tokenAddress;
    }

    function createSession(address _mentee, uint256 _reward) public {
        AlumniToken(tokenAddress).transferFrom(msg.sender, address(this), _reward);
        sessions.push(Session(msg.sender, _mentee, _reward, false));
    }

    function completeSession(uint256 sessionId) public {
        Session storage session = sessions[sessionId];
        require(msg.sender == session.mentee, "Only mentee can confirm completion");
        require(!session.completed, "Session already completed");

        session.completed = true;
        AlumniToken(tokenAddress).transfer(session.mentor, session.reward);
    }
}
