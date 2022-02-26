import {ApolloClient, gql, InMemoryCache} from "@apollo/client";
import {ensInfo} from "./types";

export class ENSProvider {
    static async getRepo(userName: string | string[]): Promise<ensInfo> {
        const client = new ApolloClient({
            uri: 'https://api.thegraph.com/subgraphs/name/ensdomains/ens',
            cache: new InMemoryCache(),
        });

        const {data} = await client.query({
            // hardcoded to point to my real ENS for now
            query: gql`
    query GetEnsName{
      domains(first: 5,
      where: {
        id: "0x329a2a97f1dbb53dc0e473b13289d396a0d1588f093583845b2f7ae8793a597d",
      }) {
        name
      }
    }
  `
        });
        let ens: ensInfo
        if (data == null) {
            return ens
        }
        return {
            name: data.domains[0].name
        }
    }
}
