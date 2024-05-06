// When the entire HTML document has finished loading, execute the function below
document.addEventListener('DOMContentLoaded', async function () {
    // Get elements from the page that we'll interact with
    const connectButton = document.getElementById('connectWallet');
    const walletInfoDisplay = document.getElementById('walletInfo');
    
    // Connect to the Ethereum network using a provider URL from Infura
    const defaultProvider = new ethers.providers.JsonRpcProvider("https://sepolia.infura.io/v3/90c62110648e48148dfaeadaa3d95636");

    // Variables to store contract information and user's connection status
    let contract;
    let userConnected = false;

    // Function to set up the contract for viewing without transaction capabilities
    async function initContract() {
        const contractAddress = '0x6f9da00Eb1b831bD23fcd4DFf9F3cFD329493d23'; // Address of our smart contract
        const response = await fetch('Marketplace_compData.json'); // Fetch the contract ABI from a local file
        const data = await response.json(); // Parse the JSON file
        const abi = data.abi; // Get the ABI
        contract = new ethers.Contract(contractAddress, abi, defaultProvider); // Create a contract object
        console.log('Contract initialized for viewing:', contract);
        displayItems(); // Display all items on the page
    }

    // Function to update the contract object with transaction capabilities
    async function initContractWithSigner() {
        const web3Provider = new ethers.providers.Web3Provider(window.ethereum); // Connect to MetaMask
        const signer = web3Provider.getSigner(); // Get the signer from MetaMask
        contract = new ethers.Contract(contract.address, contract.interface, signer); // Update contract object with signer
        console.log('Contract initialized with signer:', contract);
    }

    // Function to connect to the user's wallet
    async function connectWallet() {
        if (!window.ethereum) {
            alert('MetaMask is not installed. Please install MetaMask to use this app.'); // Checking if MetaMask is installed
            return;
        }

        try {
            await window.ethereum.request({ method: 'eth_requestAccounts' }); // Requesting account access
            const web3Provider = new ethers.providers.Web3Provider(window.ethereum);
            const signer = web3Provider.getSigner();
            const address = await signer.getAddress(); // Get the connected wallet address
            await initContractWithSigner(); // Initialize contract with signer for transactions
            userConnected = true;
            console.log('Wallet connected! Address:', address);
            connectButton.textContent = 'Wallet Connected';
            connectButton.disabled = true;
            walletInfoDisplay.innerText = `Wallet Address: ${address}`; // Show wallet address on page
        } catch (error) {
            console.error('Error connecting to wallet:', error);
            alert('Failed to connect wallet. ' + error.message);
        }
    }

    connectButton.addEventListener('click', connectWallet); // Add click event to the connect wallet button

    // Function to list a new item on the blockchain
    async function listItem() {
        if (!userConnected) {
            alert('Please connect your wallet to list items.'); // Ensure the user is connected
            return;
        }

        const title = document.getElementById('title').value;
        const description = document.getElementById('description').value;
        const price = document.getElementById('price').value;

        if (!title || !description || !price) {
            alert('Please fill in all fields.'); // Check all fields are filled
            return;
        }

        try {
            const transaction = await contract.listItem(title, description, ethers.utils.parseUnits(price, "ether")); // Send transaction to list the item
            const receipt = await transaction.wait(); // Wait for the transaction to be mined
            document.getElementById('transactionStatus').innerHTML = `Item listed successfully! View the transaction <a href="https://sepolia.etherscan.io/tx/${receipt.transactionHash}" target="_blank">here on Etherscan</a>.`;
            displayItems(); // Refresh the list of items
        } catch (error) {
            console.error('Failed to list item:', error);
            alert(`Failed to list item: ${error.message}`);
            document.getElementById('transactionStatus').innerHTML = 'Failed to list item.';
        }
    }

    // Function to buy an item
    async function buyItem() {
        if (!userConnected) {
            alert('Please connect your wallet to buy items.'); // Ensure the user is connected
            return;
        }
    
        const itemId = document.getElementById('itemId').value;
    
        if (!itemId) {
            alert('Please enter a valid item ID.'); // Check if item ID is entered
            return;
        }
    
        try {
            const item = await contract.items(itemId); // Fetch the item details from the contract
    
            if (item.sold) {
                alert('Sorry! This item is no longer available.'); // Check if the item is already sold
                document.getElementById('purchaseStatus').innerHTML = 'Sorry! Item is not available.';
                return;
            }
    
            const transaction = await contract.buyItem(itemId, { value: item.price }); // Send transaction to buy the item
            const receipt = await transaction.wait(); // Wait for the transaction to be mined
            alert('Congratulations! Item purchased successfully.');
            document.getElementById('purchaseStatus').innerHTML = `Item purchased successfully! View the transaction <a href="https://sepolia.etherscan.io/tx/${receipt.transactionHash}" target="_blank">here on Etherscan</a>.`;
            displayItems(); // Refresh the list of items
        } catch (error) {
            console.error('Failed to purchase item:', error);
            alert(`Failed to purchase item: ${error.message}`);
            document.getElementById('purchaseStatus').innerHTML = 'Failed to purchase item.';
        }
    }

    // Function to display items on the page
    async function displayItems() {
        const itemList = document.getElementById('itemsList');
        itemList.innerHTML = ''; // Clear the list first
    
        try {
            const allItems = await contract.getAllItems(); // Fetch all items from the contract
            allItems.forEach(item => createListItem(item, itemList)); // Create a list item for each item
        } catch (error) {
            console.error('Failed to retrieve items:', error);
            alert('Failed to retrieve items. Check console for details.');
        }
    }
    
    // Function to create a list item element and add it to the page
    function createListItem(item, itemList) {
        const listItem = document.createElement('li');
        listItem.innerHTML = `
            <div>ID: ${item.id}, Title: ${item.title}, Description: ${item.description}, Price: ${ethers.utils.formatEther(item.price)} ETH, Sold: ${item.sold ? 'Sold Out' : 'Available'}</div>
        `;
        listItem.classList.add('item-entry');
        listItem.dataset.itemId = item.id;
        itemList.appendChild(listItem);
        listItem.addEventListener('click', () => fillItemIdForPurchase(item.id)); // Add click event to pre-fill the buy form
    }
    
    // Function to fill the item ID in the purchase form when an item is clicked
    function fillItemIdForPurchase(itemId) {
        const itemIdInput = document.getElementById('itemId');
        itemIdInput.value = itemId; // Set the value of item ID input to the selected item's ID
    }
    
    // Add event listeners for listing and buying items
    document.getElementById('listItemButton').addEventListener('click', listItem);
    document.getElementById('buyItemButton').addEventListener('click', buyItem);

    // Initialize the contract when the page loads
    initContract();
});
