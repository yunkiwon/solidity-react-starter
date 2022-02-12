import { useEffect, useState, useRef } from 'react'
import { ethers } from 'ethers'
import { hasEthereum } from '../utils/ethereum'
import { GithubProvider } from "../utils/githubProvider.tsx"


// user is directed to this page for minting, and setting initial username etc before official mint 
// if user has minted already, we redirect them to a different profile page that has their shit on it 
// 
export default function makeProfile() {
    const [connectedWalletAddress, setConnectedWalletAddressState] = useState('')
    const [githubAddress, setGithubAddress] = useState('')

    useEffect( () => {
        if(! hasEthereum()) {
          setConnectedWalletAddressState(`MetaMask unavailable`)
          //redirect here 
          return
        }
        async function setConnectedWalletAddress() {
          const provider = new ethers.providers.Web3Provider(window.ethereum);
          const signer = provider.getSigner()
          try {
            const signerAddress = await signer.getAddress()
            setConnectedWalletAddressState(signerAddress)
          } catch {
            // if no wallet here, or not connected we need to redirect back to index
            // 
            setConnectedWalletAddressState('No wallet connected')
            return;
          }
        }
        setConnectedWalletAddress();
      },[])

async function getGithub(){
    //this should later trigger an oauth flow so that user has to connect github rather than hardcoded user profile 
    //githubprovider.getUser 
    //stores to state, then on mint it's saved along with the user's ethereum address to the mainnet 
    GithubProvider.getRepo("yunkiwon").then(
        (res) => console.log(res)
    )
}


  return (
    <div>
        <div className="h-4">
            { connectedWalletAddress && <p className="text-md">Connected Wallet: {connectedWalletAddress}</p> }
        </div>
        <div className="m-8">
            <button onClick={getGithub} className="bg-blue-600 hover:bg-blue-700 text-white py-4 px-8 rounded-md">
                Connect your GitHub
            </button>
        </div>
    </div>
  )
}
