// Replace with your deployed contract address
const contractAddress = "0x07b760126b712AfC828c1B6c839917e28b93013e";

// Replace with your ABI (Application Binary Interface)
const abi = [
    "function depositMorePrize() external payable",
    "function setWinners(address[] memory _winners) external",
    "function distributePrize() external",
    "function withdrawLeftover() external",
    "function resetTournament() external",
    "function getWinnersCount() external view returns (uint256)",
    "function getContractBalance() external view returns (uint256)",
    "function prizeDistributed() external view returns (bool)",
    "function owner() external view returns (address)",
];

let provider;
let signer;
let contract;

async function connectWallet() {
    if (window.ethereum) {
        provider = new ethers.providers.Web3Provider(window.ethereum);
        await provider.send("eth_requestAccounts", []);
        signer = provider.getSigner();
        contract = new ethers.Contract(contractAddress, abi, signer);
        alert("Wallet Connected ✅");
    } else {
        alert("Please install MetaMask!");
    }
}

async function depositPrize() {
    const amount = document.getElementById("depositAmount").value;
    if (!amount) return alert("Enter amount to deposit!");

    const tx = await contract.depositMorePrize({ value: ethers.utils.parseEther(amount) });
    await tx.wait();
    alert("Prize Pool Updated 🎯");
}

async function setWinners() {
    const addresses = document.getElementById("winnerAddresses").value;
    if (!addresses) return alert("Enter winner addresses!");

    const winnersArray = addresses.split(",").map(addr => addr.trim());
    const tx = await contract.setWinners(winnersArray);
    await tx.wait();
    alert("Winners Set 🏆");
}

async function distributePrize() {
    try {
        const tx = await contract.distributePrize();
        await tx.wait();
        alert("Prize Distributed 🥳");
    } catch (error) {
        alert(`Distribution Failed ❌\n${error.reason || error.message}`);
    }
}

async function withdrawLeftover() {
    try {
        const tx = await contract.withdrawLeftover();
        await tx.wait();
        alert("Leftover Funds Withdrawn 💸");
    } catch (error) {
        alert(`Withdraw Failed ❌\n${error.reason || error.message}`);
    }
}

async function resetTournament() {
    try {
        const tx = await contract.resetTournament();
        await tx.wait();
        alert("Tournament Reset 🔄");
    } catch (error) {
        alert(`Reset Failed ❌\n${error.reason || error.message}`);
    }
}

async function fetchContractInfo() {
    const ownerAddress = await contract.owner();
    const balance = await contract.getContractBalance();
    const winnersCount = await contract.getWinnersCount();
    const distributed = await contract.prizeDistributed();

    document.getElementById("info").innerHTML = `
        <p><b>Owner:</b> ${ownerAddress}</p>
        <p><b>Contract Balance:</b> ${ethers.utils.formatEther(balance)} ETH</p>
        <p><b>Number of Winners:</b> ${winnersCount}</p>
        <p><b>Prize Distributed:</b> ${distributed ? '✅ Yes' : '❌ No'}</p>
    `;
}
