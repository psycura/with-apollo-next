import { observer } from 'mobx-react';
import { Mutation } from 'react-apollo'
import gql from 'graphql-tag'
import { productsQuery } from '../pages/products';

const DeleteProductButton = ( { productId, variables } ) => {
    
    return (
        <Mutation mutation={deleteProductMutation} variables={{ id: productId }}
                  optimisticResponse={{
                      __typename:    'Mutation',
                      deleteProduct: {
                          __typename: 'Product',
                          id:         productId
                      }
                  }}
                  update={( cache ) => {
                      const data = cache.readQuery ( { query: productsQuery, variables } );
            
                      data.productsConnection.edges = data.productsConnection.edges.filter ( p => {
                          return p.node.id !== productId
                      } );
                      cache.writeQuery ( {
                          query: productsQuery,
                          data, variables
                      } );
            
                  }}>
            {
                ( deleteProduct, { data } ) => (
                    <button onClick={deleteProduct}>Delete</button>
                )
            }
        </Mutation>
    )
};

const deleteProductMutation = gql`
    mutation deleteProduct($id:ID!){
        deleteProduct(where:{id:$id}){
            id
        }
    }
`;

export default observer ( DeleteProductButton );
