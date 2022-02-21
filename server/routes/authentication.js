module.exports = app => {
    async function getGitHubUser(code){
        const githubToken = await axios
          .post(
            `https://github.com/login/oauth/access_token?client_id=${GITHUB_CLIENT_ID}&client_secret=${GITHUB_CLIENT_SECRET}&code=${code}`
          )
          .then((res) => res.data)
      
          .catch((error) => {
            throw error;
          });
      
        const decoded = querystring.parse(githubToken);
      
        const accessToken = decoded.access_token;
      
        return axios
          .get("https://api.github.com/user", {
            headers: { Authorization: `Bearer ${accessToken}` },
          })
          .then((res) => res.data)
          .catch((error) => {
            console.error(`Error getting user from GitHub`);
            throw error;
          });
      }
      
      app.get("/auth/github", async (req, res) => {
          console.log("triggered") 
        const code = get(req, "query.code");
        const path = get(req, "query.path", "/");
      
        if (!code) {
          throw new Error("No code!");
        }
      
        const gitHubUser = await getGitHubUser({ code });
      
        console.log(gitHubUser)
    
      
        res.redirect(`http://localhost:3000${path}`);
      });
  };
  