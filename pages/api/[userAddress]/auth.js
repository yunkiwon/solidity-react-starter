
export default async function auth(req, res) {
  const GITHUB_CLIENT_SECRET = '0fafffb3638af1cf2ef299bbe6eb61de7ef2ca96'
  const GITHUB_CLIENT_ID = '9606c47f2e7920cd1f98'


  async function getGitHubUser({code}){
    {
      const options = {
        method: "POST",
        headers: { Accept: "application/json" },
      };

      let requestUrl = `https://github.com/login/oauth/access_token?client_id=${GITHUB_CLIENT_ID}&client_secret=${GITHUB_CLIENT_SECRET}&code=${code}`

      var response = await fetch(
        requestUrl, options
      )
    }

    const body = await response.json()
    console.log(body.access_token) 
    let accessToken = body.access_token 

    const options = {
      method: 'GET', 
      headers: { Authorization: `Bearer ${accessToken}`}
    }

    const userInfo = await fetch(
      "https://api.github.com/user", options
    )

    const user = await userInfo.json() 
    console.log(user) 
    return user 
    // const decoded = querystring.parse(githubToken);
  
    // const accessToken = decoded.access_token;
  
    // return axios
    //   .get("https://api.github.com/user", {
    //     headers: { Authorization: `Bearer ${accessToken}` },
    //   })
    //   .then((res) => res.data)
    //   .catch((error) => {
    //     console.error(`Error getting user from GitHub`);
    //     throw error;
    //   });
  }

  const { code, userAddress } = req.query 
  

  console.log(code) 
  console.log(userAddress) 
  
  if (!code) {
    throw new Error("No code!");
  }

  try{
    const githubUser = await getGitHubUser({code});
    console.log(githubUser)
    res.redirect(`http://localhost:3000/${userAddress}?user=${githubUser.login}`);
  } catch{
    //error logging here 
  }
  return 
}
  