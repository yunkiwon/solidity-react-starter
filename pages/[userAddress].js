import {useRouter} from "next/router";
import {hasEthereum} from "../utils/ethereum";
import {ethers} from "ethers";
import {Card, Text, Heading, Tag} from 'degen'
import {useState, useRef, useEffect} from "react";
import Fuse from '../src/artifacts/contracts/Fuse.sol/Fuse.json'
import {GithubProvider} from "../utils/githubProvider.tsx";
import {ENSProvider} from "../utils/ENSProvider.tsx";
import {MirrorProvider} from "../utils/MirrorProvider.tsx";
import {ZapperProvider} from "../utils/ZapperProvider.tsx";

export default function PostPage() {

    const [connectedAddressGithub, setConnectedAddressGithub] = useState('')
    const [newGithubUsername, setNewGithubUsernameState] = useState('')
    const [currentProfile, setCurrentProfile] = useState(null)
    const [hasGithub, setHasGithub] = useState(false)
    const [newInfoMessage, setInfoMessageState] = useState('')
    const [repos, setRepos] = useState('')
    const [ens, setEns] = useState('')
    const [mirrorEntries, setMirrorEntries] = useState('')
    const [tokenHoldings, setTokenHoldings] = useState('')

    const router = useRouter();

    const clientSecret = '0fafffb3638af1cf2ef299bbe6eb61de7ef2ca96'
    const clientId = '9606c47f2e7920cd1f98'
    const redirectURL = `http://localhost:3000/api/${router.query.userAddress}/auth/`


    useEffect(() => {
        checkQuery()
    })

    useEffect(() => {
        if (currentProfile != null) {
            getGithub(currentProfile)
        }
    }, [currentProfile])

    function checkQuery() {
        if (router.query.user !== undefined) {
            setCurrentProfile(router.query.user)
            return router.query.user
        }
    }

    async function getGithub(githubUsername) {
        //this should later trigger an oauth flow so that user has to connect github rather than hardcoded user profile
        //githubprovider.getUser
        //stores to state, then on mint it's saved along with the user's ethereum address to the mainnet
        GithubProvider.getRepo(githubUsername).then(
            (res) => setRepos(res)
        ).then(() => {
            console.log(repos)
        })
    }

    async function getEns() {
        ENSProvider.getRepo(router.query.userAddress).then(
            (res) => setEns(res)
        ).then(() => {
            console.log(ens)
        })
    }

    async function getTokenHoldings() {
        ZapperProvider.getRepo(router.query.userAddress).then(
            (res) => setTokenHoldings(res)
        ).then(() => {
            console.log(tokenHoldings)
        })
    }

    async function getMirror() {
        MirrorProvider.getRepo(router.query.userAddress).then(
            (res) => setMirrorEntries(res)
        ).then(() => {
            console.log(mirrorEntries)
        })
    }

    async function fetchConnectedWalletProfile() {
        if (!hasEthereum()) {
            setConnectedWalletAddressState(`MetaMask unavailable`)
            return
        }
        const provider = new ethers.providers.Web3Provider(window.ethereum)
        const contract = new ethers.Contract(process.env.NEXT_PUBLIC_FUSE_ADDRESS, Fuse.abi, provider)
        try {
            const data = await contract.profiles(router.query.userAddress)
            console.log(data)
            setCurrentProfile(data)

        } catch (error) {
            console.log(error)
        }
    }


    // Call smart contract, fetch current value
    async function fetchConnectedAddressGithub() {
        if (!hasEthereum()) {
            setConnectedWalletAddressState(`MetaMask unavailable`)
            return
        }
        const provider = new ethers.providers.Web3Provider(window.ethereum)
        const contract = new ethers.Contract(process.env.NEXT_PUBLIC_FUSE_ADDRESS, Fuse.abi, provider)
        try {
            const data = await contract.getUserGithub(router.query.userAddress)
            setConnectedAddressGithub(data)
        } catch (error) {
            console.log(error)
        }
    }

    // Call smart contract, set new value
    async function setGithubUsername() {
        if (!hasEthereum()) {
            setConnectedWalletAddressState(`MetaMask unavailable`)
            return
        }
        if (!newGithubUsername) {
            setInfoMessageState('Input something first!')
            return
        }
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const signer = provider.getSigner()
        const contract = new ethers.Contract(process.env.NEXT_PUBLIC_FUSE_ADDRESS, Fuse.abi, signer)
        const transaction = await contract.setUserProfileGithub(router.query.userAddress, newGithubUsername)
        await transaction.wait()
        setNewGithubUsernameState('')
    }

    return (
        <div className="max-w-lg mt-36 mx-auto text-center px-4">
            <h1 className="text-4xl font-semibold mb-8">Welcome! #{router.query.userAddress}</h1>
            <div className="space-y-8">
                <div className="flex flex-col space-y-4">
                </div>
                <h4 className="text-2xl font-semibold mb-8">GitHub</h4>
                {/*<a href={`https://medium.com/m/oauth/authorize?client_id=233be20762be1e3667488ce221bdd40804aac3aaba091048b5c526236fe5f07bc&scope=basicProfile,listPublications&state=authenticate&response_type=code&redirect_uri=${redirectURL}`}>*/}
                {/*    <button className="bg-blue-600 hover:bg-blue-700 text-white py-4 px-8 rounded-md">*/}
                {/*        Connect your Medium*/}
                {/*    </button>*/}
                {/*</a>*/}
                <div className="space-y-8">
                    <div className="flex flex-col space-y-4">
                        {repos.length > 0 ?
                            <div>
                                {repos.map(repo => (
                                    <div key={repo.full_name}><p>{repo.full_name}: {repo.html_url}</p></div>
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
                    <h4 className="text-2xl font-semibold mb-8">ENS</h4>
                    <div className="flex flex-col space-y-4">
                        {ens.name != null ?
                            <div>
                                <div><p>ENS for {router.query.userAddress} : {ens.name}</p></div>
                            </div>
                            :
                            <button onClick={getEns}
                                    className="bg-blue-600 hover:bg-blue-700 text-white py-4 px-8 rounded-md">
                                No ENS connected. Click to display your ENS!
                            </button>
                        }
                    </div>
                    <h4 className="text-2xl font-semibold mb-8">Mirror</h4>
                    <div className="flex flex-col space-y-4">
                        {mirrorEntries.length > 0 ?
                            <div>
                                <div><p>Project Name: {mirrorEntries[0].projectName}</p></div>
                                <div><p>Project Description: {mirrorEntries[0].projectDescription}</p></div>
                                <br/>
                                {mirrorEntries.map(mirrorEntry => (
                                    <div key={mirrorEntry.id}>
                                        <Card padding="6" shadow>
                                            <Heading>{mirrorEntry.title}</Heading>
                                            <Text>{mirrorEntry.body}</Text>
                                            <Tag>{mirrorEntry.timestamp} days ago</Tag>
                                        </Card>
                                    </div>
                                ))
                                }
                            </div>
                            :
                            <button onClick={getMirror}
                                    className="bg-blue-600 hover:bg-blue-700 text-white py-4 px-8 rounded-md">
                                Show us your Mirror
                            </button>
                        }
                    </div>
                    <h4 className="text-2xl font-semibold mb-8">Holdings</h4>
                    <div className="flex flex-col space-y-4">
                        {tokenHoldings.length > 0 ?
                            <div>
                                {tokenHoldings.map(t => (
                                    <div key={t.symbol}><p>{t.symbol}: {t.balance} @ ${t.price} / {t.symbol}</p></div>
                                ))
                                }
                            </div>
                            :
                            <button onClick={getTokenHoldings}
                                    className="bg-blue-600 hover:bg-blue-700 text-white py-4 px-8 rounded-md">
                                Click to display token holdings!
                            </button>
                        }
                    </div>
                </div>
                <div className="h-2">
                    {newInfoMessage && <span className="text-sm text-gray-500 italic">{newInfoMessage}</span>}
                </div>
            </div>
        </div>
    )
}
