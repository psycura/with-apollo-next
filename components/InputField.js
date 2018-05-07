import  { PureComponent } from 'react';
import PropTypes from 'prop-types'

class InputField extends PureComponent {
    render () {
        const { title, name, value, errors = '', type = 'text' } = this.props;
        
        return (
            <div className='column field'>
                <label htmlFor={name}>
                    {title} &nbsp;{errors && <span className='error'>{errors}</span>}
                </label>
                <input onChange={this._onChangeText} value={value} type={type}
                       id={name}/>
            </div>);
    }
    
    _onChangeText = ( e ) => {
        switch ( this.props.type ) {
            case 'file':
                this.props.onChangeHandler ( this.props.name, e.target.files[0] )
                break;
            default:
                this.props.onChangeHandler ( this.props.name, e.target.value )
                break;
        }
    }
}

InputField.propTypes = {
    title:           PropTypes.string.isRequired,
    name:            PropTypes.string.isRequired,
    errors:          PropTypes.oneOfType ( [
        PropTypes.string,
        PropTypes.array,
    ] ),
    value:           PropTypes.oneOfType ( [
        PropTypes.string,
        PropTypes.number,
    ] ),
    onChangeHandler: PropTypes.func.isRequired,
    type:            PropTypes.string,
};

export default InputField;
