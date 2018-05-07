import React, { Component } from 'react';
import { graphql, compose } from 'react-apollo'
import gql from 'graphql-tag'
import { TOKEN_KEY } from '../lib/constants';
import { observer, inject } from 'mobx-react'
import Router from 'next/router'
import withData from '../lib/withData'

class CheckToken extends Component {
    
    async componentDidMount () {
        const token = await localStorage.getItem ( TOKEN_KEY );
        if ( !token ) {
            Router.replace ( '/signup' );
            return;
        }
        
        let response;
        
        try {
            response = await this.props.mutate ();
        } catch ( err ) {
            Router.replace ( '/signup' );
            return;
        }
        const { refreshToken: { token: newToken } } = response.data;
        await localStorage.setItem ( TOKEN_KEY, newToken );
        Router.replace ( '/products' );
        
    }
    
    render () {
        return (
            <div className="CheckToken">
                loading...
            </div>
        );
    }
}

const refreshTokenMutation = gql`
    mutation {
        refreshToken{
            token
        }
    }
`;

export default withData ( compose (
    graphql ( refreshTokenMutation ),
)
( inject ( 'appStore' ) ( observer ( CheckToken ) ) ) );




