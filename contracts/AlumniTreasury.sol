// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract AlumniTreasury {
    address public daoAddress;

    constructor(address _daoAddress) {
        daoAddress = _daoAddress;
    }

    function fundDAO() external payable {
        payable(daoAddress).transfer(msg.value);
    }
}
