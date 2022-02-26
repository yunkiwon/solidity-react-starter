import {mirrorInfo} from "./types";
import {ApolloClient, gql, InMemoryCache} from "@apollo/client";

export class MirrorProvider {
    static async getRepo(userName: string | string[]): Promise<mirrorInfo[]> {
        const client = new ApolloClient({
            uri: 'https://mirror-api.com/graphql',
            cache: new InMemoryCache(),
        });

        const { data } = await client.query({
            // hardcoded to point to my real ENS for now
            variables: {
                projectAddress: "0x8E907c51f07DFdc02C32835768DE73091A2078B0"
            },
            query: gql`
    query Entries($projectAddress: String!) {
      entries(projectAddress: $projectAddress) {
        ...entryDetails
        publisher {
          ...publisherDetails
          __typename
        }
        editions {
          ...entryEdition
          __typename
        }
        __typename
      }
    }

    fragment entryDetails on entry {
      _id
      id
      body
      hideTitleInEntry
      publishStatus
      publishedAtTimestamp
      originalDigest
      timestamp
      title
      arweaveTransactionRequest {
        transactionId
        __typename
      }
      featuredImageId
      featuredImage {
        mimetype
        sizes {
          og {
            ...mediaAssetSize
            __typename
          }
          __typename
        }
        __typename
      }
      publisher {
        ...publisherDetails
        __typename
      }
      latestBlockData {
        timestamp
        number
        __typename
      }
      __typename
    }
    
    fragment mediaAssetSize on MediaAssetSizeType {
      src
      height
      width
      __typename
    }
    
    fragment publisherDetails on PublisherType {
      project {
        ...projectDetails
        __typename
      }
      member {
        ...projectDetails
        __typename
      }
      __typename
    }
    
    fragment projectDetails on ProjectType {
      _id
      address
      avatarURL
      description
      displayName
      domain
      ens
      gaTrackingID
      mailingListURL
      headerImage {
        ...mediaAsset
        __typename
      }
      theme {
        ...themeDetails
        __typename
      }
      navigation {
        ...navigationDetails
        __typename
      }
      featureFlags {
        ...featureFlagStatusDetails
        __typename
      }
      __typename
    }
    
    fragment mediaAsset on MediaAssetType {
      id
      mimetype
      url
      sizes {
        ...mediaAssetSizes
        __typename
      }
      __typename
    }
    
    fragment mediaAssetSizes on MediaAssetSizesType {
      og {
        ...mediaAssetSize
        __typename
      }
      lg {
        ...mediaAssetSize
        __typename
      }
      md {
        ...mediaAssetSize
        __typename
      }
      sm {
        ...mediaAssetSize
        __typename
      }
      __typename
    }
    
    fragment themeDetails on UserProfileThemeType {
      accent
      colorMode
      __typename
    }
    
    fragment navigationDetails on NavigationType {
      section {
        isFundingEnabled
        isNFTsEnabled
        isGovernanceEnabled
        __typename
      }
      content {
        isCrowdfundsEnabled
        isSplitsEnabled
        isTokensEnabled
        isEditionsEnabled
        isTokenRaceEnabled
        isAuctionsEnabled
        __typename
      }
      __typename
    }
    
    fragment featureFlagStatusDetails on FeatureFlagStatusType {
      isPluginsTabEnabled
      __typename
    }
    
    fragment entryEdition on edition {
      title
      price
      quantity
      description
      editionId
      mediaURL
      editionContractAddress
      events {
        event
        transactionHash
        numSold
        avatarURL
        twitterUsername
        serialNumber
        collectorAddress
        amountPaid
        blockNumber
        __typename
      }
      attributes {
        trait_type
        value
        __typename
      }
      primaryMedia {
        mimetype
        sizes {
          og {
            ...mediaAssetSize
            __typename
          }
          __typename
        }
        __typename
      }
      thumbnailMedia {
        mimetype
        sizes {
          og {
            ...mediaAssetSize
            __typename
          }
          __typename
        }
        __typename
      }
      __typename
    }
  `
        });
        const result: mirrorInfo[] = [];
        if (data != null) {
            data.entries.forEach(e => {
                result.push({
                    id: e._id,
                    title: e.title,
                    body: e.body,
                    timestamp: e.timestamp,
                    projectName: e.publisher.project.displayName,
                    projectDescription: e.publisher.project.description,
                })
            })
        }
        console.log(data);
        return result
    }
}
