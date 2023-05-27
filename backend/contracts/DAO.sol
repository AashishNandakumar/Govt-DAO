// SPDX-License-Identifier: SEE LICENSE IN LICENSE
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/access/Ownable.sol";

interface GDTokenContract {
    function balanceOf(address account) external returns (uint256);

    function tokenOfOwnerByIndex(
        address owner,
        uint256 index
    ) external view returns (uint256);
}

contract DAO is Ownable {
    GDTokenContract obj;

    constructor(address _GDTokenAddress) payable {
        obj = GDTokenContract(_GDTokenAddress);
    }

    struct Proposal {
        uint256 id;
        // ! warning heavy gas
        string title;
        string description;
        // !
        uint256 yesVotes;
        uint256 noVotes;
        bool executed;
        uint256 deadline;
        mapping(uint256 => bool) voters;
    }

    //  count the no of proposals created
    uint256 public numProposals;
    // Map proposal Ids to proposals
    mapping(uint256 => Proposal) public proposals;

    // making sure only the owners of tokens can participate in proposals
    modifier onlyTokenHolders() {
        require(
            obj.balanceOf(msg.sender) > 0,
            "You do not own any GD Tokens to participate!! "
        );
        _;
    }

    // Create proposals
    function createProposal(
        string memory _title,
        string memory _description
    ) external onlyTokenHolders returns (uint256) {
        Proposal storage proposal = proposals[numProposals];
        proposal.id = numProposals;
        proposal.title = _title;
        proposal.description = _description;
        numProposals++;
        // set the deadline
        proposal.deadline = block.timestamp + 10 minutes;
        return numProposals - 1;
    }

    // A modifer to make sure dedaline is not exceeded:
    modifier activeProposalOnly(uint256 proposalIndex) {
        require(
            proposals[proposalIndex].deadline > block.timestamp,
            "Deadline exceeded!!"
        );
        _;
    }

    // A vote has two possible values so make them enum
    enum Vote {
        YES,
        NO
    }

    // Enable token holders to cast their vote on an active proposal
    function voteOnProposal(
        uint256 proposalIndex,
        Vote vote
    ) external onlyTokenHolders activeProposalOnly(proposalIndex) {
        Proposal storage proposal = proposals[proposalIndex];

        uint256 voterTokenBalance = obj.balanceOf(msg.sender);
        uint256 numVotes;

        for (uint256 i = 0; i < voterTokenBalance; i++) {
            uint256 tokenId = obj.tokenOfOwnerByIndex(msg.sender, i);
            if (proposal.voters[tokenId] == false) {
                numVotes++;
                proposal.voters[tokenId] = true;
            }
        }

        require(numVotes > 0, "Already voted!");
        if (vote == Vote.YES) {
            proposal.yesVotes++;
        } else {
            proposal.noVotes++;
        }
    }

    // execute the proposal whenever deadline gets executed
    modifier inactiveProposalOnly(uint256 proposalIndex) {
        require(
            proposals[proposalIndex].deadline <= block.timestamp,
            "Deadline has not exceeded proposal is still active"
        );

        require(
            proposals[proposalIndex].executed == false,
            "Proposal already accepted"
        );
        _;
    }

    // execute the proposal if it is voted for only
    function executeProposal(
        uint256 proposalIndex
    ) external onlyTokenHolders inactiveProposalOnly(proposalIndex) {
        Proposal storage proposal = proposals[proposalIndex];

        if (proposal.yesVotes > proposal.noVotes) {
            // !
        }
        proposal.executed = true;
    }

    // withdraw ETH from DAO
    function withdrawETHFromDAO() external onlyOwner {
        uint256 amount = address(this).balance;
        require(amount > 0, "No ETH currently in DAO!");
        (bool sent, ) = payable(owner()).call{value: amount}("");
        require(sent, "Withdraw of ETHER Unsuccessfull!!!");
    }

    // Supply eth to this contract
    receive() external payable {}

    fallback() external payable {}
}
