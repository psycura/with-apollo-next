import { observer, inject } from 'mobx-react';
import React, { Component } from 'react';
import ProductItem from './ProductItem'
import InfiniteScroll from 'react-infinite-scroller';
import gql from 'graphql-tag';
import { Subscription } from 'react-apollo'

class ProductsList extends Component {
    render () {
        const { productsConnection, fetchMore, variables } = this.props;
        
        return (
            <Subscription subscription={productSubscription}>
                {
                    ( { data } ) => {
                        return (
                            <InfiniteScroll
                                pageStart={0}
                                threshold={10}
                                loadMore={() => fetchMore ( {
                                    variables:   {
                                        after: productsConnection.pageInfo.endCursor
                                    },
                                    updateQuery: ( previousResult, { fetchMoreResult } ) => {
                                        if ( !fetchMoreResult ) {return previousResult}
                                        return {
                                            productsConnection: {
                                                __typename: 'ProductConnection',
                                                pageInfo:   fetchMoreResult.productsConnection.pageInfo,
                                                edges:      [
                                                    ...previousResult.productsConnection.edges,
                                                    ...fetchMoreResult.productsConnection.edges
                                                ]
                                            }
                                            
                                        }
                                    }
                                } )}
                                hasMore={productsConnection.pageInfo.hasNextPage}
                                loader={<div className="loader" key={0}>Loading ...</div>}
                                useWindow={true}
                            >
                                <ul className='productsList'>
                                    {
                                        productsConnection.edges.map ( product => (
                                            <ProductItem product={product.node}
                                                         key={product.node.id} variables={variables}/>
                                        ) )
                                    }
                                </ul>
                            </InfiniteScroll>
                        )
                    }
                }
            
            </Subscription>
        );
    }
    
}

const productSubscription = gql`
    subscription{
        product(where:{mutation_in:UPDATED}){
            node{
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
    }
`

export default inject ( 'appStore' ) ( observer ( ProductsList ) );
