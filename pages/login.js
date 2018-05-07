import { Component } from 'react';
import { graphql } from 'react-apollo'
import gql from 'graphql-tag'
import InputField from '../components/InputField';
import withData from '../lib/withData';
import { TOKEN_KEY } from '../lib/constants';
import Router from 'next/router'

const defaultState = {
    values:       {
        email: '',
        pass:  ''
    },
    errors:       {},
    isSubmitting: false
};

const fields = [
    { name: 'email', type: 'text', title: 'Email' },
    { name: 'pass', type: 'password', title: 'Password' }
]

class login extends Component {
    
    render () {
        
        const { values, errors } = this.state;
        
        return (
            <div className="Login container column">
                <h1>Login</h1>
                <form onSubmit={this.submitHandler}>
                    {
                        fields.map ( ( { name, type, title } ) => (
                            <InputField key={name} title={title} name={name} value={values[name]} type={type}
                                        onChangeHandler={this.onChangeText} errors={errors[name]}/>
                        ) )
                    }
                    <button>Login</button>
                </form>
                <p style={{ textAlign: 'center' }}>Or</p>
                <button onClick={this.redirect}>Create Account</button>
            </div>
        );
    }
    
    state = defaultState
    
    redirect = () => {
        Router.push ( '/signup' )
    }
    
    onChangeText = ( field, value ) => {
        this.setState ( state => ({
            values: {
                ...state.values,
                [field]: value
            }
        }) )
    }
    
    submitHandler = async ( e ) => {
        e.preventDefault ();
        
        const { values: { email, pass }, isSubmitting } = this.state;
        
        if ( !isSubmitting ) {
            this.setState ( { isSubmitting: true } )
            
            const response = await this.props.mutate ( {
                variables: {
                    email,
                    password: pass
                }
            } )
            
            const { payload, error } = response.data.login;
            
            if ( error ) {
                this.setState ( {
                    errors:       {
                        [error.field]: [error.message]
                    },
                    isSubmitting: false
                } )
            } else {
                await localStorage.setItem ( TOKEN_KEY, payload.token )
                Router.replace ( '/products' )
            }
            
        }
        
    }
    
}

const loginMutation = gql`
    mutation($email:String!,$password:String!){
        login(email:$email,password:$password){
            payload{
                token
            }
            error{
                field
                message
            }
        }
    }
`;

export default withData ( graphql ( loginMutation ) ( login ) );
