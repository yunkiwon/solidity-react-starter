import {githubInfo, holdingsInfo} from "./types";

export class ZapperProvider {
    static async getRepo(address: string | string[]): Promise<holdingsInfo[]> {
        const options = {
            method: "GET",
            headers: {Accept: "application/json"},
        };
        const response = await fetch(
            "https://api.zapper.fi/v1/protocols/tokens/balances?addresses%5B%5D=" + address + "&api_key=96e0cc51-a62e-42ca-acee-910ea7d2a241",
            options
        );
        const result: holdingsInfo[] = [];
        try {
            const body = await response.json();
            const list = body[Object.keys(body)[0]]['products'][0]['assets']
            for (let i = 0; i < list.length; i++) {
                const obj = list[i];

                const temp: holdingsInfo = {
                    symbol: obj.symbol,
                    price: obj.price,
                    balance: obj.balance,
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
