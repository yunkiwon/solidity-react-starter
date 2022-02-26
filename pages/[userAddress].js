import { useRouter } from "next/router";
import {hasEthereum} from "../utils/ethereum";
import {ethers} from "ethers";
import {useState, useRef, useEffect} from "react";
import Fuse from '../src/artifacts/contracts/Fuse.sol/Fuse.json'
import {GithubProvider} from "../utils/githubProvider.tsx";
import {ENSProvider} from "../utils/ENSProvider.tsx";
import {MirrorProvider} from "../utils/MirrorProvider.tsx";

export default function PostPage() {

    const [connectedAddressGithub, setConnectedAddressGithub] = useState('')
    const [newGithubUsername, setNewGithubUsernameState] = useState('')
    const [currentProfile, setCurrentProfile] = useState('')
    const [newInfoMessage, setInfoMessageState] = useState('')
    const newGithubUsernameInputRef = useRef();
    const router = useRouter();

    useEffect( () => {
    },[connectedAddressGithub])

    async function fetchConnectedWalletProfile() {
        if ( ! hasEthereum() ) {
            setConnectedWalletAddressState(`MetaMask unavailable`)
            return
        }
        const provider = new ethers.providers.Web3Provider(window.ethereum)
        const contract = new ethers.Contract(process.env.NEXT_PUBLIC_FUSE_ADDRESS, Fuse.abi, provider)
        try {
            const data = await contract.profiles(router.query.userAddress)
            console.log(data)
            setCurrentProfile(data)

        } catch(error) {
            console.log(error)
        }
    }

    // Call smart contract, fetch current value
    async function fetchConnectedAddressGithub() {
        if ( ! hasEthereum() ) {
            setConnectedWalletAddressState(`MetaMask unavailable`)
            return
        }
        const provider = new ethers.providers.Web3Provider(window.ethereum)
        const contract = new ethers.Contract(process.env.NEXT_PUBLIC_FUSE_ADDRESS, Fuse.abi, provider)
        try {
            const data = await contract.getUserGithub(router.query.userAddress)
            setConnectedAddressGithub(data)
        } catch(error) {
            console.log(error)
        }
    }

    // Call smart contract, set new value
    async function setGithubUsername() {
        if ( ! hasEthereum() ) {
            setConnectedWalletAddressState(`MetaMask unavailable`)
            return
        }
        if(! newGithubUsername ) {
            setInfoMessageState('Input something first!')
            return
        }
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const signer = provider.getSigner()
        const contract = new ethers.Contract(process.env.NEXT_PUBLIC_FUSE_ADDRESS, Fuse.abi, signer)
        const transaction = await contract.setUserProfileGithub(router.query.userAddress, newGithubUsername)
        await transaction.wait()
        setInfoMessageState(`Github username updated to ${newGithubUsername} from ${connectedAddressGithub}.`)
        newGithubUsernameInputRef.current.value = ''
        setNewGithubUsernameState('')
    }

    async function getGithub(){
        //this should later trigger an oauth flow so that user has to connect github rather than hardcoded user profile
        //githubprovider.getUser
        //stores to state, then on mint it's saved along with the user's ethereum address to the mainnet
        GithubProvider.getRepo(connectedAddressGithub).then(
            (res) => {
                console.log(res)
            }
        )
    }

    async function getEns(){
        ENSProvider.getRepo(router.query.userAddress).then(
            (res) => {
                console.log(res)
            }
        )
    }

    async function getMirror(){
        MirrorProvider.getRepo(router.query.userAddress).then(
            (res) => {
                console.log(res)
            }
        )
    }

    return (
        <div className="max-w-lg mt-36 mx-auto text-center px-4">
            <h1 className="text-4xl font-semibold mb-8">Welcome! #{router.query.userAddress}</h1>
            <div className="space-y-8">
                <div className="flex flex-col space-y-4">
                  <input
                    className="border p-4 w-100 text-center"
                    placeholder="A fetched github username will show here"
                    value={connectedAddressGithub}
                    disabled
                  />
                  <button
                      className="bg-blue-600 hover:bg-blue-700 text-white py-4 px-8 rounded-md w-full"
                      onClick={fetchConnectedAddressGithub}
                    >
                      Fetch github username from the blockchain
                    </button>
                </div>
                <div className="space-y-8">
                  <div className="flex flex-col space-y-4">
                      <input
                          className="border p-4 text-center"
                          onChange={ e => setNewGithubUsernameState(e.target.value)}
                          placeholder="Write a new github username"
                          ref={newGithubUsernameInputRef}
                      />
                      <button
                          className="bg-blue-600 hover:bg-blue-700 text-white py-4 px-8 rounded-md"
                          onClick={setGithubUsername}
                      >
                          Set new github username on the blockchain
                      </button>
                      <button onClick={getGithub} className="bg-blue-600 hover:bg-blue-700 text-white py-4 px-8 rounded-md">
                          Connect your GitHub
                      </button>
                      <button onClick={getEns} className="bg-blue-600 hover:bg-blue-700 text-white py-4 px-8 rounded-md">
                          Show us your ENS name
                      </button>
                  </div>
                </div>
                <div className="h-2">
                  { newInfoMessage && <span className="text-sm text-gray-500 italic">{newInfoMessage}</span> }
                </div>
            </div>
        </div>
    )
}
