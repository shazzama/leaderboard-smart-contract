pragma solidity ^0.8.0;

import {ERC721URIStorage} from "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import {ERC721} from "@openzeppelin/contracts/token/ERC721/ERC721.sol";

contract GameTrophy is ERC721URIStorage {
    uint256 public totalMints = 0;

    constructor() ERC721 ("GameTrohpy", "TRO") {}

    function mintToken(address to, string calldata uri) public payable {
        uint256 tokenId = totalMints;
        totalMints++;
        _setTokenURI(tokenId, uri);
        _safeMint(to, tokenId);
    }
}