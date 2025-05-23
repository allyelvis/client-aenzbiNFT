import React, { useState } from 'react';
import { NFTStorage, File } from 'nft.storage';
import { ethers } from 'ethers';

const contractAddress = "0x1b6F312CE04866c793177264d73cf2A0141702E3";

const contractABI = [
  "function mintNFT(address to, string memory tokenURI) public returns (uint256)"
];

const NFTUploader = () => {
  const [status, setStatus] = useState("");
  const [file, setFile] = useState(null);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");

  const handleUpload = async () => {
    if (!file || !name || !description) {
      setStatus("Please fill all fields.");
      return;
    }

    const client = new NFTStorage({ token: "YOUR_NFT_STORAGE_API_KEY" });

    const metadata = await client.store({
      name,
      description,
      image: new File([file], file.name, { type: file.type })
    });

    if (window.ethereum) {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const contract = new ethers.Contract(contractAddress, contractABI, signer);

      const tx = await contract.mintNFT(await signer.getAddress(), metadata.url);
      await tx.wait();
      setStatus("NFT minted! TX: https://sepolia.etherscan.io/tx/" + tx.hash);
    } else {
      setStatus("MetaMask not detected.");
    }
  };

  return (
    <div>
      <h2>Mint Aenzbi NFT</h2>
      <input type="text" placeholder="Name" onChange={(e) => setName(e.target.value)} /><br />
      <textarea placeholder="Description" onChange={(e) => setDescription(e.target.value)} /><br />
      <input type="file" onChange={(e) => setFile(e.target.files[0])} /><br />
      <button onClick={handleUpload}>Mint NFT</button>
      <p>{status}</p>
    </div>
  );
};

export default NFTUploader;
