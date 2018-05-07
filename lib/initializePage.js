import { Component } from 'react';
import { Provider } from 'mobx-react';
import { initStore } from '../store/AppStore';
import withData from './withData'
import { TOKEN_KEY } from './constants';
import jwtDecode from 'jwt-decode';


const initializePage = ( UI ) => {
    
    return class PageComponent extends Component {
        static getInitialProps ( { req } ) {
            const isServer = !!req;
            const store    = initStore ( isServer );
            return { isServer }
        }
        
        constructor ( props ) {
            super ( props );
            this.store = initStore ( props.isServer, props.url.query );
            
        }
    
        async componentDidMount () {
            const token      = await localStorage.getItem ( TOKEN_KEY );
            const { userId } = jwtDecode ( token );
            this.store.addUserId ( userId )
        }
        
        render () {
            const stores = {
                appStore: this.store,
            };
            
            return (
                <Provider {...stores}>
                    <UI/>
                </Provider>
            )
        }
    }
};

export default initializePage;
