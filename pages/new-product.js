import { Mutation } from 'react-apollo'
import gql from 'graphql-tag'
import Form from '../components/Form'
import { observer, inject } from 'mobx-react';
import withData from '../lib/withData'
import Router from 'next/router'
import { productsQuery } from './products';

const NewProduct = ( { appStore } ) => {
    
    const { variables } = appStore;
    
    return (
        <Mutation mutation={createProductMutation}
                  update={( store, { data: { createProduct } } ) => {
                      const data = store.readQuery ( { query: productsQuery, variables } );
                      data.productsConnection.edges.unshift ( {
                          __typename: 'Node',
                          node:       createProduct
                      } );
                      store.writeQuery ( { query: productsQuery, variables, data } )
                  }}>
            {
                ( createProduct, { data } ) => (
                    <Form submit={async ( values ) => {
                        const { name, price, pictureUrl } = values;
                        try {
                            await createProduct ( {
                                variables: {
                                    price, name,
                                    picture: pictureUrl,
                                }
                            } )
                        } catch ( err ) {
                            console.log ( 'Error', err );
                            return;
                        }
                        appStore.resetVariables ();
                        Router.replace ( '/products' )
                    }}/>
                )
            }
        </Mutation>
    )
};

const createProductMutation = gql`
    mutation ($name:String!,$price:Float!,$picture:Upload!){
        createProduct(name:$name,price:$price,picture:$picture){
            __typename
            id
            name
            price
            pictureUrl
            seller{
                id
                name
            }
        }
    }
`;

export default withData ( inject ( 'appStore' ) ( observer ( NewProduct ) ) );
