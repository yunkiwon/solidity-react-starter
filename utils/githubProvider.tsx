import { githubInfo } from "./types";

export class GithubProvider {
  static async getRepo(userName: RequestInfo): Promise<githubInfo[]> {
    const options = {
      method: "GET",
      headers: { Accept: "application/json" },
    };
    const response = await fetch(
      "https://api.github.com/users/" + userName + "/repos",
      options
    );
    const result: githubInfo[] = [];
    try {
      const body = await response.json();
      for (var i = 0; i < body.length; i++) {
        var obj = body[i];

        const temp: githubInfo = {
          full_name: obj.full_name,
          html_url: obj.html_url,
          description: obj.description,
          size: obj.size,
        };
        result.push(temp);
        // console.log(temp);
      }
    } catch {
      //error checking here
    }
    return result;
  }

}
