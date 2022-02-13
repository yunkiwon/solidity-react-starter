import Head from 'next/head'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import { ethers } from 'ethers'
import { hasEthereum } from '../utils/ethereum'
import Fuse from '../src/artifacts/contracts/Fuse.sol/Fuse.json'

export default function Home() {
  const [connectedWalletAddress, setConnectedWalletAddressState] = useState('')
  const router = useRouter()
  const [profiles, setProfiles] = useState('')

  // If wallet is already connected...
  useEffect( () => {
    if(! hasEthereum()) {
      setConnectedWalletAddressState(`MetaMask unavailable`)
      return
    }
    async function setConnectedWalletAddress() {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner()
      try {
        const signerAddress = await signer.getAddress()
        setConnectedWalletAddressState(signerAddress)
      } catch {
        setConnectedWalletAddressState('No wallet connected')
      }
    }
    setConnectedWalletAddress();
    fetchRegisteredProfiles();
  },[])

  // Request access to MetaMask account
  async function requestAccount() {
    await window.ethereum.request({ method: 'eth_requestAccounts' } )
  }

  async function connectWallet() {
    if ( ! hasEthereum() ) {
      setConnectedWalletAddressState(`MetaMask unavailable`)
      return
    }

    await requestAccount()
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner()
    const signerAddress = await signer.getAddress()
    router.push('/' + signerAddress)
  }

  async function fetchRegisteredProfiles() {
    if ( ! hasEthereum() ) {
      setConnectedWalletAddressState(`MetaMask unavailable`)
      return
    }
    const provider = new ethers.providers.Web3Provider(window.ethereum)
    const contract = new ethers.Contract(process.env.NEXT_PUBLIC_FUSE_ADDRESS, Fuse.abi, provider)
    try {
      const data = await contract.getRegisteredAccounts()
      console.log(data)
      setProfiles(data)
    } catch(error) {
      console.log(error)
    }
  }

  return (
    <div className="max-w-lg mt-36 mx-auto text-center px-4">
      <Head>
        <title>Fuse Pass</title>
        <meta name="description" content="Interact with a simple smart contract from the client-side." />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className="space-y-8">
        { ! process.env.NEXT_PUBLIC_FUSE_ADDRESS ? (
            <p className="text-md">
              Please add a value to the <pre>NEXT_PUBLIC_FUSE_ADDRESS</pre> environment variable.
            </p>
        ) : (
          <>
            <h1 className="text-4xl font-semibold mb-8">
              Fuse Pass
            </h1>
            <p>Profiles: {profiles}</p>
            <div className="space-y-8">
                {/*<div className="flex flex-col space-y-4">*/}
                {/*  <input*/}
                {/*    className="border p-4 w-100 text-center"*/}
                {/*    placeholder="A fetched github username will show here"*/}
                {/*    value={connectedAddressGithub}*/}
                {/*    disabled*/}
                {/*  />*/}
                {/*  <button*/}
                {/*      className="bg-blue-600 hover:bg-blue-700 text-white py-4 px-8 rounded-md w-full"*/}
                {/*      onClick={fetchConnectedWalletProfile}*/}
                {/*    >*/}
                {/*      Fetch github username from the blockchain*/}
                {/*    </button>*/}
                {/*</div>*/}
                {/*<div className="space-y-8">*/}
                {/*  <div className="flex flex-col space-y-4">*/}
                {/*    <input*/}
                {/*      className="border p-4 text-center"*/}
                {/*      onChange={ e => setNewGithubUsernameState(e.target.value)}*/}
                {/*      placeholder="Write a new github username"*/}
                {/*      ref={newGithubUsernameInputRef}*/}
                {/*    />*/}
                {/*    <button*/}
                {/*      className="bg-blue-600 hover:bg-blue-700 text-white py-4 px-8 rounded-md"*/}
                {/*      onClick={setGithubUsername}*/}
                {/*    >*/}
                {/*      Set new github username on the blockchain*/}
                {/*    </button>*/}
                {/*    <div className="h-2">*/}
                {/*      { newInfoMessage && <span className="text-sm text-gray-500 italic">{newInfoMessage}</span> }*/}
                {/*    </div>*/}
                {/*  </div>*/}
                {/*</div>*/}
                <div>
                  <button
                  className="bg-blue-600 hover:bg-blue-700 text-white py-4 px-8 rounded-md"
                  onClick={connectWallet}
                  >
                    Connect wallet
                  </button>
                </div>
                <div className="h-4">
                  { connectedWalletAddress && <p className="text-md">{connectedWalletAddress}</p> }
                </div>
            </div>
          </>
        ) }
      </main>
    </div>
  )
}
