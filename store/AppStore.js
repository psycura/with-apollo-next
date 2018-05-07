import { observable, action, decorate } from 'mobx'

let store = null;

class AppStore {
    
    userId    = '';
    variables = null;
    product   = null;
    
    addUserId ( id ) {
        this.userId = id;
    }
    
    setVariables ( variables ) {
        this.variables = variables
    }
    
    resetVariables () {
        this.variables = null
    }
    
    setProduct ( product ) {
        this.product = product
    }
    
    resetProduct () {
        this.product = null
    }
    
}

decorate ( AppStore, {
    userId:         observable,
    variables:      observable,
    product:        observable,
    addUserId:      action,
    setVariables:   action,
    resetVariables: action,
    resetProduct:   action,
    setProduct:     action,
} )

export function initStore ( isServer ) {
    if ( isServer ) {
        return new AppStore ()
    } else {
        if ( store === null ) {
            store = new AppStore ()
        }
        return store
    }
}

