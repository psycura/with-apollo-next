import  { Component } from 'react';
import { graphql } from 'react-apollo'
import gql from 'graphql-tag'
import InputField from '../components/InputField';
import withData from '../lib/withData';
import { TOKEN_KEY } from '../lib/constants';
import Router from 'next/router'

const defaultState = {
    values:       {
        name:  '',
        email: '',
        pass:  ''
    },
    errors:       {},
    isSubmitting: false
};

const fields = [
    { name: 'name', type: 'text', title: 'Name' },
    { name: 'email', type: 'text', title: 'Email' },
    { name: 'pass', type: 'password', title: 'Password' }
]

class signup extends Component {
    
    render () {
        
        const { values, errors } = this.state;
        
        return (
            <div className="Signup container column">
                <h1>Signup</h1>
                <form onSubmit={this.submitHandler}>
                    {
                        fields.map ( ( { name, type, title } ) => (
                            <InputField key={name} title={title} name={name} value={values[name]} type={type}
                                        onChangeHandler={this.onChangeText} errors={errors[name]}/>
                        ) )
                    }
                    <button>Create Account</button>
                </form>
                <p style={{ textAlign: 'center' }}>Or</p>
                <button onClick={this.redirect}>Login</button>
            </div>
        );
    }
    
    state = defaultState
    
    redirect = () => {
        Router.push ( '/login' )
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
        
        const { values: { name, email, pass }, isSubmitting } = this.state;
        
        if ( !isSubmitting ) {
            this.setState ( { isSubmitting: true } )
            let response;
            try {
                response = await this.props.mutate ( {
                    variables: {
                        email, name,
                        password: pass
                    }
                } )
            } catch ( err ) {
                this.setState ( {
                    errors:       {
                        email: 'Already taken'
                    },
                    isSubmitting: false
                } )
                return;
            }
            await localStorage.setItem ( TOKEN_KEY, response.data.signup.token )
            Router.replace ( '/products' )
        }
        
    }
    
}

const signUpMutation = gql`
    mutation($name:String!,$email:String!,$password:String!){
        signup(email:$email,name:$name,password:$password){
            token
        }
    }
`;

export default withData( graphql ( signUpMutation ) ( signup ));
