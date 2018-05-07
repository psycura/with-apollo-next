import { observer, inject } from 'mobx-react';
import DeleteProductButton from './DeleteProductButton'
import PriceButton from './PriceButton'
import Router from 'next/router'

const ProductItem = ( { product, variables, appStore } ) => {
    
    const onEditClick = () => {
        appStore.setProduct ( product );
        appStore.setVariables ( variables );
        Router.push ( '/edit-product' )
    };
    
    const { userId } = appStore;
    
    
    return (
        <li className='productItem' key={product.id}>
            
            <div>
                <p>Name: {product.name}</p>
                <PriceButton product={product}/>
                <p>Seller: {product.seller.name}</p>
                {
                    userId === product.seller.id
                    &&
                    <div className='buttons'>
                        <DeleteProductButton variables={variables} productId={product.id}/>
                        <button onClick={onEditClick}>Edit</button>
                    </div>
                }
            
            </div>
            <div className='productImage'>
                <img src={`http://localhost:4000/${product.pictureUrl}`} alt='Image'/>
            </div>
        </li>
    )
};

export default inject ( 'appStore' ) ( observer ( ProductItem ) );
