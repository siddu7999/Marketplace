// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

// Define a contract named Marketplace
contract Marketplace {
    // A struct named Item to hold details about an item
    struct Item {
        uint id;
        address payable seller;
        string title;
        string description;
        uint price;
        bool sold;
    }

    // Array to store all items in the marketplace
    Item[] public items;
    // Variable to keep track of the next item ID
    uint public nextItemId;

    // Events to log actions on the blockchain
    event ItemListed(
        uint id,
        address indexed seller,
        string title,
        string description,
        uint price
    );

    event ItemPurchased(
        uint id,
        address indexed buyer,
        uint price
    );

    event ItemCancelled(
        uint id,
        address indexed seller
    );

    // Modifier to check that the message sender is the seller of the item
    modifier onlySeller(uint _itemId) {
        require(items[_itemId].seller == msg.sender, "Only the seller can perform this action");
        _;
    }

    // Modifier to prevent reentrancy attacks
    modifier noReentrancy() {
        require(!locked, "No reentrancy allowed!");
        locked = true;
        _;
        locked = false;
    }

    // Boolean variable to lock state transitions to prevent reentrancy
    bool private locked;

    // Function to list a new item for sale
    function listItem(string memory _title, string memory _description, uint _price) public {
        require(_price > 0, "Price must be greater than zero"); // Ensure the price is greater than zero

        // Add the new item to the items array
        items.push(Item({
            id: nextItemId,
            seller: payable(msg.sender),
            title: _title,
            description: _description,
            price: _price,
            sold: false
        }));

        // Emit an event for the listed item
        emit ItemListed(nextItemId, msg.sender, _title, _description, _price);
        nextItemId++; // Increment the item ID for the next item
    }

    // Function to buy an item
    function buyItem(uint _id) public payable noReentrancy {
        require(_id < items.length && items[_id].id == _id, "Item does not exist"); // Check if the item exists
        Item storage item = items[_id];
        require(!item.sold, "Item already sold"); // Check if the item is not already sold
        require(msg.value >= item.price, "Not enough ether sent"); // Check if enough Ether was sent

        item.seller.transfer(item.price); // Transfer the item price to the seller
        item.sold = true; // Mark the item as sold

        if (msg.value > item.price) {
            payable(msg.sender).transfer(msg.value - item.price); // Refund any excess Ether
        }

        emit ItemPurchased(_id, msg.sender, item.price); // Emit an event for the purchase
    }

    // Function to cancel an item listing
    function cancelListing(uint _id) public onlySeller(_id) {
        require(!items[_id].sold, "Cannot cancel, item already sold"); // Check if the item is not sold
        items[_id].sold = true; // Mark the item as sold
        emit ItemCancelled(_id, msg.sender); // Emit an event for the cancellation
    }

    // Function to retrieve details about a specific item
    function getItem(uint _id) public view returns (uint, string memory, string memory, uint, bool) {
        require(_id < items.length && items[_id].id == _id, "Item does not exist"); // Check if the item exists
        Item storage item = items[_id];
        return (item.id, item.title, item.description, item.price, item.sold); // Return item details
    }

    // Function to retrieve all items
    function getAllItems() public view returns (Item[] memory) {
        return items; // Return the array of all items
    }
}
