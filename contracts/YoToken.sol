pragma solidity ^0.4.23;

contract YoToken {
    string public name = "Yo Token";
    string public symbol = "YO";
    string public standard = "Yo Token v1.0";
    uint256 public totalSupply;

    mapping(address => uint256) public balanceOf;

    constructor (uint256 _initialSupply) public {
        balanceOf[msg.sender] = _initialSupply;
        totalSupply = _initialSupply;
    }
}