# A Basic Decentralized Marketplace on Ethereum Testnet

### Objective : The goal of this project is to develop a decentralized application (DApp) that allows users to list and buy items, leveraging Ethereum smart contracts for transaction management. This project will give you hands-on experience with smart contract development, DApp interaction, and Ethereum testnets.


## Project Design

### Technology Stack:
Frontend: HTML, CSS, JavaScript
Blockchain: Ethereum
Smart Contract Language: Solidity
Development Tools: infra.io
Frontend Libraries: ethers.js 
Hosting: GitHub Pages

### Frontend Design
1. User Interface:
Header: Includes wallet connection functionality.
Main Content:
Form to list new items with fields for title, description, and price.
Display area for items available for purchase.
Interaction options for buying items.

2. Styling:
Base styles for body and html for consistent font and background.
Responsive design considerations for mobile and desktop views.
Interactive elements like buttons and form fields with hover effects for better user experience.
3. Interactions:
Connect to MetaMask wallet.
include the correct addresses and ABI (Application Binary Interface) for the deployed smart contracts.
List new items through a form submission.
Buy items using Ethereum transactions.

### Smart Contracts
1. Contracts:
Marketplace.sol:
Functions to list, buy, and cancel item listings.
Events to emit notifications upon transactions.
Security features like reentrancy guards.
2. Functions:
listItem: Allows a seller to list an item for sale.
buyItem: Allows a buyer to purchase an item.
cancelListing: Allows a seller to cancel a listing.
getItem and getAllItems: View functions to retrieve item details.
3. Security Measures:
Use of modifiers to restrict function access.
Reentrancy guard to prevent reentrancy attacks.
Backend Design
1. Ethereum Network Interaction:
Deploy smart contracts to Ethereum in Remix IDE.
Use ethers.js to interact with contracts deployed on the blockchain.
2. Data Management:
Stored all items as struct in an array within the smart contract.
Use transactional methods to alter state on the blockchain.

### Deployment :
Used GitHub Pages:
Go to your repository’s settings on GitHub.
Find the "Pages" section in the menu.
Select the branch you want to deploy (commonly main). If your files are in a folder (like docs), specify it.
Save, and GitHub will provide you with a URL where your Project is hosted.


## Working :
### NOTE: You NEED to Connect the Wallet To List or Buy items
Listing an Item:
Enter the item's title, description, and price in Ether.
Click the "List item" button to initiate the transaction through MetaMask.
After processing, a success notification will include a link to view the transaction hash as proof of the transaction. If the transaction fails, you'll receive a failure notification.
If the item is successfully Listed It will be available in the Items Available Section.

### Buying an Item:

To purchase, you can click directly on the item or input the item ID in the "Buy an Item" section.
Clicking an item automatically fills in its ID, readying it for purchase.
After Clicking on the Buy Item button, it will redirect you to MetaMask wallet to authorize the transaction.
If your purchase is successful, it comes with a successful message and also a link to view the transaction hash as proof of the transaction.
After purchasing the item the “Sold status” of that item in the Items Available will be changed to “Sold Out”
If the item has already been bought, an error message will display saying: "Sorry! This item is no longer available.”

## challenges faced :

Integrating Frontend with Smart Contracts
Solved by watching some YouTube videos 
Handling the ABI from the smart contract.
Tried copying the ABI, but for some reason It didn’t work as expected and then downloaded a .Json file from compilation Details and then imported the file to my JS code.
Handling asynchronous calls made to the blockchain and managing state updates in the user interface can lead to complexities.
While trying to Make the section displaying available items visible upon page load.
Used infura.io and then tried calling the key using its endpoint.
Ensuring the frontend securely interacts with the blockchain, managing user authentication and transactions securely through MetaMask.

