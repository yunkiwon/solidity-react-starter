import { useRouter } from "next/router";
import {hasEthereum} from "../utils/ethereum";
import {ethers} from "ethers";
import {useState, useRef, useEffect} from "react";
import Fuse from '../src/artifacts/contracts/Fuse.sol/Fuse.json'
import {GithubProvider} from "../utils/githubProvider.tsx";

export default function PostPage() {

    const [connectedAddressGithub, setConnectedAddressGithub] = useState('')
    const [newGithubUsername, setNewGithubUsernameState] = useState('')
    const [currentProfile, setCurrentProfile] = useState(null)
    const [hasGithub, setHasGithub] = useState(false) 
    const [newInfoMessage, setInfoMessageState] = useState('')
    const [repos, setRepos] = useState('')

    const router = useRouter();

    const clientSecret = '0fafffb3638af1cf2ef299bbe6eb61de7ef2ca96'
    const clientId = '9606c47f2e7920cd1f98'
    const redirectURL = `http://localhost:3000/api/${router.query.userAddress}/auth/`



    useEffect( () => {
        checkQuery() 
    })

    useEffect(() => {
        if(currentProfile != null){
            getGithub(currentProfile) 
        }
    }, [currentProfile])

    function checkQuery(){
        if(router.query.user !== undefined){
            setCurrentProfile(router.query.user)
            return router.query.user 
        }
    }

    async function getGithub(githubUsername){
        //this should later trigger an oauth flow so that user has to connect github rather than hardcoded user profile
        //githubprovider.getUser
        //stores to state, then on mint it's saved along with the user's ethereum address to the mainnet
        GithubProvider.getRepo(githubUsername).then(
            (res) => setRepos(res) 
        ).then(console.log(repos))
    }    

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
        // setInfoMessageState(`Github username updated to ${newGithubUsername} from ${connectedAddressGithub}.`)
        // newGithubUsernameInputRef.current.value = ''
        setNewGithubUsernameState('')
    }

    return (
        <div className="max-w-lg mt-36 mx-auto text-center px-4">
            <h1 className="text-4xl font-semibold mb-8">Welcome! #{router.query.userAddress}</h1>
            <div className="space-y-8">
                <div className="flex flex-col space-y-4">
                </div>
                <div className="space-y-8">
                  <div className="flex flex-col space-y-4">
                    {repos.length > 0 ? 
                    <div>
                        {repos.map(repos => (
                            <div key={repos.full_name}><p>{repos.full_name}: {repos.html_url}</p></div>
                        ))
                        }
                    </div>
                    : 
                    <a href={`https://github.com/login/oauth/authorize?client_id=9606c47f2e7920cd1f98&redirect_uri=${redirectURL}`}>
                    <button className="bg-blue-600 hover:bg-blue-700 text-white py-4 px-8 rounded-md">
                        Connect your GitHub
                    </button>
                </a>          
                    }

                  </div>
                </div>
                <div className="h-2">
                  { newInfoMessage && <span className="text-sm text-gray-500 italic">{newInfoMessage}</span> }
                </div>
            </div>
        </div>
    )
}
