import {githubInfo} from "./types";

export class GithubProvider {
    static async getRepo(userName: RequestInfo): Promise<githubInfo[]> {
        const options = {
            method: "GET",
            headers: {Accept: "application/json"},
        };
        const response = await fetch(
            process.env.FUSE_API_URL + "github/" + userName,
            options
        );
        const result: githubInfo[] = [];
        try {
            const body = await response.json();
            for (let i = 0; i < body.length; i++) {
                const obj = body[i];

                const temp: githubInfo = {
                    full_name: obj.full_name,
                    html_url: obj.html_url,
                    description: obj.description,
                    size: obj.size,
                };
                result.push(temp);
            }
        } catch {
            //error checking here
        }
        return result;
    }

}
