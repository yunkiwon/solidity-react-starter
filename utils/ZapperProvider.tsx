import {holdingsInfo} from "./types";

export class ZapperProvider {
    static async getRepo(address: string | string[]): Promise<holdingsInfo[]> {
        const options = {
            method: "GET",
            headers: {
                Accept: "application/json",
            },
        };
        console.log(options.headers)
        const response = await fetch(
            process.env.NEXT_PUBLIC_BACKEND_URL + "zapper/" + address,
            options
        );
        const result: holdingsInfo[] = [];
        try {
            const body = await response.json();
            let ree = body as holdingsInfo[]
            for (let i = 0; i < body.length; i++) {
                const obj = body[i];
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
