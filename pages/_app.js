import App, { Container } from 'next/app'
import './_app.scss';

export default class MyApp extends App {
    static async getInitialProps ( { Component, router, ctx } ) {
        let pageProps = {};
        
        if ( Component.getInitialProps ) {
            pageProps = await Component.getInitialProps ( ctx )
        }
        const isServer = !!ctx.req
        
        return { pageProps }
    }
    
    constructor ( props ) {
        super ( props );
    }
    
    
    
    render () {
        
        const { Component, pageProps } = this.props;
        return (
            <Container>
                <Component {...pageProps} />
            </Container>
        )
    }
}
