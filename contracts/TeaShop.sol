// SPDX-License-Identifier: UNLICENSED

pragma solidity 0.8.0;

/**@title A Tea Shop Contract
 * @author Koffi Kumassi
 * @notice This contract is use to buy a tea in shop
 * @dev
 */
contract TeaShop {
    /*Type declarations */
    struct OrderTea {
        address giver; // The address of the user who buys me a tea.
        string message; // The message the user sent.
        string name; // The name of the user who buys me a tea.
        uint256 timestamp; // The timestamp when the user buys me a tea.
    }

    /*State variables */
    address private immutable i_owner;
    uint256 private constant COST = 0.001 ether;
    uint256 private s_totalCoffee;
    OrderTea[] private s_tea;

    /*Events */
    event NewTea(address indexed from, uint256 timestamp, string message, string name);

    /*Functions */
    constructor() payable {
        i_owner = payable(msg.sender); // or i_owner = msg.sender
    }

    /*
     * You'll notice I changed the buyTea function a little here as well and
     * now it requires a string called _message. This is the message our user
     * sends us from the front end!
     */
    function buyTea(
        string memory _message,
        string memory _name,
        uint256 _payAmount
    ) public payable {
        require(_payAmount <= COST, "Insufficient Ether provided");

        s_totalCoffee += 1;
        //console.log("%s has just sent a coffee!", msg.sender);

        /*
         * This is where I actually store the tea data in the array.
         */
        s_tea.push(OrderTea(msg.sender, _message, _name, block.timestamp));

        (bool success, ) = i_owner.call{value: _payAmount}("");
        require(success, "Failed to send money");

        emit NewTea(msg.sender, block.timestamp, _message, _name);
    }

    function getAllOrderTea() public view returns (OrderTea[] memory) {
        return s_tea;
    }

    function getTotalTea() public view returns (uint256) {
        //console.log("We have %d total tea received", totalCoffee);
        return s_totalCoffee;
    }
}
