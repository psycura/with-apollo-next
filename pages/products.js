import React, { Fragment, Component } from 'react';
import gql from 'graphql-tag'
import { observer, inject } from 'mobx-react'
import { Query } from 'react-apollo'
import Search from '../components/Search'
import ProductsList from '../components/ProductsList'
import Router from 'next/router'
import withData from '../lib/withData';

class Products extends Component {
    
    render () {
        
        return (
            <div className="Products" id='products'>
                <h1>Products</h1>
                <Query query={productsQuery} variables={{ orderBy: 'createdAt_DESC' }}>
                    {
                        ( {
                            loading, variables, fetchMore, client, networkStatus, error, refetch,
                            data: { productsConnection }
                        } ) => {
                            
                            return (
                                <Fragment>
                                    <Search variables={variables} loading={loading} client={client} refetch={refetch}/>
                                    <button onClick={() => {
                                        this.props.appStore.setVariables ( variables );
                                        Router.push ( '/new-product' )
                                    }}>
                                        Create Product
                                    </button>
                                    
                                    {
                                        networkStatus > 1 &&
                                        <ProductsList productsConnection={productsConnection} fetchMore={fetchMore}
                                                      variables={variables}/>
                                    }
                                
                                </Fragment>
                            )
                        }
                    }
                </Query>
            </div>
        );
    }
    
    componentDidMount () {
        window.scrollTo ( 0, 0 )
    }
    
}

export const productsQuery = gql`
    query ($after:String,$orderBy:ProductOrderByInput,$where:ProductWhereInput){
        productsConnection(after:$after,first:5,orderBy:$orderBy,where:$where){
            pageInfo{
                hasNextPage
                endCursor
            }
            edges{
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
    }
`;

export default withData ( inject ( 'appStore' ) ( observer ( Products ) ) );
