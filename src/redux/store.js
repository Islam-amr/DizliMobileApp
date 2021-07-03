import {createStore, combineReducers, applyMiddleware} from 'redux';
import thunk from 'redux-thunk';

// Reducers
import globalModal from './reducers/globalModal';
import serviceableMerchants from './reducers/serviceableMerchants';
import user from './reducers/user';

const rootReducer = combineReducers({
  globalModal: globalModal,
  serviceableMerchants: serviceableMerchants,
  user: user,
});

const store = createStore(rootReducer, applyMiddleware(thunk));

export {store};
