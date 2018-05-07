import  { Component } from 'react';
import InputField from '../components/InputField';
import { observer } from 'mobx-react';

const defaultState = {
    values:       {
        name:       '',
        price:      0.0,
        pictureUrl: null
    },
    errors:       {},
    isSubmitting: false
};

class Form extends Component {
    
    render () {
        
        const { values: { name, price, pictureUrl }, errors } = this.state;
        
        return (
            
            <div className="NewProduct container column">
                <h1>NewProduct</h1>
                <form onSubmit={this.submitHandler}>
                    <InputField key='name' title='Name' name='name' value={name}
                                onChangeHandler={this.onChangeText}/>
                    <InputField key='price' title='Price' name='price' value={price} type='number'
                                onChangeHandler={this.onChangeText}/>
                    <InputField key='pictureUrl' title='Picture' name='pictureUrl'
                                type='file'
                                onChangeHandler={this.onChangeText}/>
                    {
                        pictureUrl
                        &&
                        <img style={{ width: '100%' }}
                             src={typeof pictureUrl === 'string' ?
                                 `http://localhost:4000/${pictureUrl}` : URL.createObjectURL ( pictureUrl )}
                             alt='Image'/>
                        
                    }
                    
                    <button>Create Product</button>
                </form>
                <p style={{ textAlign: 'center' }}>Or</p>
                <button onClick={this.redirect}>Back To Products Page</button>
            </div>
        
        );
    }
    
    constructor ( props ) {
        super ( props );
        this.appStore                = props.appStore
        const { initialValues = {} } = props;
        this.state                   = {
            ...defaultState,
            values: {
                ...defaultState.values,
                ...initialValues
            }
        }
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
        
        const { isSubmitting, values } = this.state;
        
        if ( !isSubmitting ) {
            const errors = this.props.submit ( values )
            if ( errors ) {
                this.setState ( { errors } )
            }
        }
        
    }
}

export default observer ( Form );
