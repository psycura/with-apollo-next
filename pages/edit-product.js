import { observer, inject } from 'mobx-react';
import Form from '../components/Form'
import {  Mutation } from 'react-apollo'
import gql from 'graphql-tag'
import { productsQuery } from './products';
import withData from '../lib/withData'
import Router from 'next/router'

const editProduct = ( { appStore } ) => {
    const { product, variables } = appStore;
    
    return (
        <div className="EditProduct">
            <h1>Edit Product</h1>
            <Mutation mutation={editProductMutation}
                      update={( store, { data: { updateProduct } } ) => {
                          const data = store.readQuery ( { query: productsQuery, variables } );
                
                          data.productsConnection.edges = data.productsConnection.edges
                          .map ( x => x.node.id === updateProduct.id ? ({
                                  __typename: 'Node',
                                  cursor:     updateProduct.id,
                                  node:       updateProduct
                              })
                              : x );
                          store.writeQuery ( { query: productsQuery, variables, data } )
                      }}>
                {
                    ( updateProduct, { data } ) => (
                        <Form initialValues={{ ...product, }}
                              submit={async ( values ) => {
                                  const { name, price, pictureUrl } = values;
                                  try {
                                      await updateProduct ( {
                                          variables: {
                                              id:      product.id,
                                              price, name,
                                              picture: pictureUrl,
                                          }
                                      } )
                                  } catch ( err ) {
                                      console.log ( 'Error', err );
                                      return;
                                  }
                                  appStore.resetVariables ();
                                  appStore.resetProduct ();
                                  Router.replace ( '/products' )
                              }}/>
                    )
                }
            </Mutation>
        </div>
    )
};

const editProductMutation = gql`
    mutation ($id:ID!,$name:String,$price:Float,$picture:Upload){
        updateProduct(id:$id,name:$name,price:$price,picture:$picture){
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

export default withData ( inject ( 'appStore' ) ( observer ( editProduct ) ) );
