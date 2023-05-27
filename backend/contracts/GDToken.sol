// SPDX-License-Identifier: SEE LICENSE IN LICENSE
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract GDToken is ERC721Enumerable, Ownable {
    // setting the max supply of the GD Tokens:
    uint256 public maxSupply = 100000;
    // setting the const of Token
    uint256 public costPerUnit = 0.00001 ether;

    // keep track of tokenids minted
    uint256 public tokenIds;

    constructor() ERC721("Govt-DAO token", "GD") {}

    // function mintTokens(uint256 noOfTokens) public payable {
    //     uint256 requiredAmount = noOfTokens * costPerUnit;
    //     require(
    //         msg.value >= requiredAmount,
    //         "Less than required Amount to purchase tokens"
    //     );
    //     require(
    //         (totalSupply() + noOfTokens) <= maxSupply,
    //         "Already minted maximum tokens!!!"
    //     );
    //     // function of ERC721
    //     _safeMint(msg.sender, noOfTokens);
    // }

    function mint() public payable {
        require(tokenIds < maxSupply, "Exceeded max crypto devs supply");
        require(msg.value >= costPerUnit, "Ether sent is not correct");
        tokenIds += 1;
        _safeMint(msg.sender, tokenIds);
    }

    // Withdraw all the ether in the contract:
    function wihdrawByOwner() public onlyOwner {
        uint256 amount = address(this).balance;
        require(amount > 0, "No ETHER associated with this contract");
        (bool spent, ) = payable(owner()).call{value: amount}("");
        require(spent, "Transfer Failed");
    }

    // Makes the contract to accept ETHER
    receive() external payable {}

    fallback() external payable {}
}
