import  { Component } from 'react';
import { observer, inject } from 'mobx-react';
import InputField from './InputField'
import Router from 'next/router'

const defaultState = {
    query:        '',
    errors:       {},
    isSubmitting: false
};

class Search extends Component {
    
    render () {
        
        const { refetch, variables: { orderBy }, loading } = this.props;
        
        return (
            <div className="Search">
                <InputField title='Search for products' name='text' value={this.state.query}
                            onChangeHandler={this.changeTextHandler}/>
                <button
                    onClick={() => !loading && refetch ( {
                        orderBy: orderBy === 'name_ASC' ? 'name_DESC' : 'name_ASC',
                        after:   null
                    } )}>
                    Name
                </button>
                <button
                    onClick={() => !loading && refetch ( {
                        orderBy: orderBy === 'price_ASC' ? 'price_DESC' : 'price_ASC',
                        after:   null
                    } )}>
                    Price
                </button>
                <button onClick={this.resetHandler}>
                    Reset
                </button>
            </div>
        );
    }
    
    state = defaultState
    
    redirect = () => {
        Router.push ( '/login' )
    }
    
    resetHandler = async () => {
        await this.setState ( { query: '' } )
        if(!this.props.loading){
            this.props.refetch ( {
                where: { name_contains: '' },
                after: null
            } )
        }
        
    }
    
    changeTextHandler = async ( field, value ) => {
        this.setState ( { query: value } );
        this.props.refetch ( {
            where: {
                name_contains: this.state.query
            },
            after: null
        } )
        
    }
}

export default inject ( 'appStore' ) ( observer ( Search ) );
