import { observer } from 'mobx-react';
import { Mutation } from 'react-apollo'
import gql from 'graphql-tag';

const PriceButton = ( { product } ) => {
    return (
        <Mutation mutation={editPriceMutation}
                  optimisticResponse={{
                      __typename:    'Mutation',
                      updateProduct: {
                          __typename: 'Product',
                          ...product,
                          price:      product.price + 5
                      }
                  }}
                  variables={{ price: product.price + 5, id: product.id }}>
            {
                ( updateProduct, { data } ) => {
                    return (
                        <p className='price-btn' onClick={updateProduct}>
                            Price: {product.price}
                        </p>
                    )
                }
            }
        
        </Mutation>
    )
};

const editPriceMutation = gql`
    mutation ($id:ID!,$price:Float){
        updateProduct(id:$id,price:$price){
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

export default observer ( PriceButton );
