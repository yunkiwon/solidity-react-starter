import {holdingsInfo, mirrorInfo} from "./types";
import {ApolloClient, gql, InMemoryCache} from "@apollo/client";

export class MirrorProvider {
    static async getRepo(address: string | string[]): Promise<mirrorInfo[]> {

        const options = {
            method: "GET",
            headers: {Accept: "application/json"},
        };
        const response = await fetch(
            process.env.FUSE_API_URL + "ens/" + address,
            options
        );
        const result: mirrorInfo[] = [];
        try {
            const body = await response.json();
            let ree = body as mirrorInfo[]
            for (let i = 0; i < body.length; i++) {
                const obj = body[i];
                const temp: mirrorInfo = {
                    id: obj.id,
                    title: obj.title,
                    body: obj.body,
                    timestamp: obj.timestamp,
                    projectName: obj.publisher.project.displayName,
                    projectDescription: obj.publisher.project.description,
                };
                result.push(temp);
                console.log(temp)
            }
        } catch {
            //error checking here
        }
        return result;
    }
}
