import fetch from 'isomorphic-unfetch'
import { ApolloClient, InMemoryCache, ApolloLink,HttpLink, split } from 'apollo-boost'
import { setContext } from 'apollo-link-context';
import { createUploadLink } from 'apollo-upload-client'
import { WebSocketLink } from 'apollo-link-ws';
import { getMainDefinition } from 'apollo-utilities';
import { TOKEN_KEY } from './constants';

const GRAPHQL_URL = 'http://localhost:4000';
const WS_URL      = 'ws://localhost:4000';

let apolloClient = null;

// Polyfill fetch() on the server (used by apollo-client)
if ( !process.browser ) {
    global.fetch = fetch
}

function create ( initialState ) {
    
    const authLink = setContext ( async ( _, { headers } ) => {
        // get the authentication token from local storage if it exists
        const token = await localStorage.getItem ( TOKEN_KEY );
        // return the headers to the context so httpLink can read them
        return {
            headers: {
                ...headers,
                authorization: token ? `Bearer ${token}` : '',
            }
        }
    } );
    
    let link = new HttpLink({
        uri: 'https://api.graph.cool/simple/v1/cixmkt2ul01q00122mksg82pn', // Server URL (must be absolute)
        credentials: 'same-origin' // Additional fetch() options like `credentials` or `headers`
    });
    
    if ( process.browser ) {
        const wsLink = new WebSocketLink ( {
            uri:     `ws://localhost:4000/`,
            options: {
                reconnect: true
            }
        } );
        
        const httpUploadLink = createUploadLink ( { uri: 'http://localhost:4000' } );
        
        link = split (
            ( { query } ) => {
                const { kind, operation } = getMainDefinition ( query );
                return kind === 'OperationDefinition' && operation === 'subscription';
            },
            wsLink,
            ApolloLink.from ( [authLink, httpUploadLink] ),
        );
    } else {
        link = ApolloLink.from ( [authLink, link] )
    }
    
    console.log('return >>>>>>>>>>>>>>>>');
    
    return new ApolloClient ( {
        connectToDevTools: process.browser,
        ssrMode:           !process.browser, // Disables forceFetch on the server (so queries are only run once)
        link,
        cache:             new InMemoryCache ().restore ( initialState || {} )
    } )
}

export default function initApollo ( initialState ) {
    // Make sure to create a new client for every server-side request so that data
    // isn't shared between connections (which would be bad)
    if ( !process.browser ) {
        return create ( initialState )
    }
    
    // Reuse client on the client-side
    if ( !apolloClient ) {
        apolloClient = create ( initialState )
    }
    
    return apolloClient
}
