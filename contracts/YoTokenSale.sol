pragma solidity ^0.4.23;

import "./YoToken.sol";

contract YoTokenSale {
    
    address admin;
    YoToken public tokenContract;
    uint256 public tokenPrice;

    constructor (YoToken _tokenContract, uint256 _tokenPrice) public {
        admin = msg.sender;

        tokenContract = _tokenContract;
        tokenPrice = _tokenPrice;
    }
}