import {ensInfo} from "./types";

export class ENSProvider {
    static async getRepo(address: string[]): Promise<ensInfo> {

        const options = {
            method: "GET",
            headers: {Accept: "application/json"},
        };
        const response = await fetch(
            process.env.FUSE_API_URL + "ens/" + address,
            options
        );
        let ens: ensInfo
        try {
            const body = await response.json();
            return {
                name: body.domains[0].name
            }
        } catch {
            //error checking here
        }
    }
}
