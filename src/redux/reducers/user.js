import Cart from '../../models/Cart';
import {
  SIGN_UP,
  POST_USER_LOCATION,
  VERIFY_USER,
  LOG_OUT,
  ADD_TO_CART,
  REMOVE_FROM_CART,
  REMOVE_FROM_CART_IMMEDIATE,
  SIGN_IN,
  ADD_ADDRESS,
  DELETE_ADDRESS,
  SET_DELIVERY_LOCATION,
  OFFLINE_LOGIN,
  CLEAR_CART,
} from '../actions/user';

const initalState = {
  userData: {},
  userToken: '',
  curretCartRestarunt: {},
  userCart: {
    tax: 0,
    amount: 0,
    products: [],
    team_id: null,
    merchant_id: null,
  },
  isLoggedIn: false,
  destination: {},
  currentDeliverLocation: {},
};

export default (state = initalState, action) => {
  switch (action.type) {
    case SIGN_IN:
      return {
        ...state,
        userData: action.payload,
        userToken: action.token,
        isLoggedIn: true,
      };
    // case SIGN_UP:
    //   let userData = action.payload.user;
    //   return {
    //     ...state,
    //     userData: userData,
    //   };
    case POST_USER_LOCATION:
      return {
        ...state,
        destination: action.payload,
        currentDeliverLocation: action.payload,
      };
    case VERIFY_USER:
      return {
        ...state,
        isLoggedIn: true,
        userToken: action.token,
        userData: action.payload,
      };
    case ADD_TO_CART:
      let addedItem = action.payload;
      let oldUserCart = state.userCart;
      let updateduserCart = new Cart();
      if (oldUserCart.products.length === 0) {
        updateduserCart = new Cart(
          addedItem.tax,
          addedItem.price,
          [addedItem.product],
          addedItem.teamId,
          addedItem.itemId,
        );
      } else {
        let meal = addedItem.product;
        let mealExist = oldUserCart.products.find(item => item.id === meal.id);
        let oldMeals = state.userCart.products.filter(
          item => item.id !== meal.id,
        );
        if (mealExist)
          updateduserCart = new Cart(
            state.userCart.tax + addedItem.tax,
            state.userCart.amount + addedItem.price,
            [
              ...oldMeals,
              {
                id: meal.id,
                quantity: mealExist.quantity + 1,
                name: meal.name,
                price: meal.price,
                tax: meal.tax,
              },
            ],
            addedItem.teamId,
            addedItem.itemId,
          );
        else {
          updateduserCart = new Cart(
            state.userCart.tax + addedItem.tax,
            state.userCart.amount + addedItem.price,
            [...oldMeals, meal],
            addedItem.teamId,
            addedItem.itemId,
          );
        }
      }
      return {
        ...state,
        userCart: updateduserCart,
        curretCartRestarunt: action.restaurantData,
      };
    case REMOVE_FROM_CART:
      let mealGrapper = state.userCart.products.find(
        item => item.id === action.payload.id,
      );
      let allMealsExceptThis = state.userCart.products.filter(
        item => item.id !== action.payload.id,
      );
      let updateOrRemove;
      if (mealGrapper.quantity === 1) {
        if (state.userCart.products.length === 1) {
          updateOrRemove = {
            tax: 0,
            amount: 0,
            products: [],
            team_id: null,
            merchant_id: null,
          };
        } else {
          updateOrRemove = {
            tax: state.userCart.tax - action.payload.tax,
            amount: state.userCart.amount - action.payload.price,
            products: [...allMealsExceptThis],
            team_id: state.userCart.team_id,
            merchant_id: state.userCart.merchant_id,
          };
        }
      } else {
        updateOrRemove = {
          tax: state.userCart.tax - action.payload.tax,
          amount: state.userCart.amount - action.payload.price,
          products: [
            ...allMealsExceptThis,
            {
              id: action.payload.id,
              name: action.payload.name,
              price: action.payload.price,
              quantity: mealGrapper.quantity - 1,
            },
          ],
          team_id: state.userCart.team_id,
          merchant_id: state.userCart.merchant_id,
        };
      }
      return {...state, userCart: updateOrRemove};
    case REMOVE_FROM_CART_IMMEDIATE:
      let removedItem = state.userCart.products.find(
        i => i.id === action.payload.id,
      );
      return {
        ...state,
        userCart: {
          tax: state.userCart.tax - removedItem.tax * removedItem.quantity,
          amount:
            state.userCart.amount - removedItem.price * removedItem.quantity,
          products: [
            ...state.userCart.products.filter(i => i.id !== action.payload.id),
          ],
          team_id: state.userCart.team_id,
          merchant_id: state.userCart.merchant_id,
        },
      };
    case ADD_ADDRESS:
      return {
        ...state,
        userData: action.payload,
      };
    case DELETE_ADDRESS:
      return {
        ...state,
        userData: action.payload,
      };
    case SET_DELIVERY_LOCATION:
      return {
        ...state,
        currentDeliverLocation: action.payload,
      };
    case CLEAR_CART:
      return {
        ...state,
        curretCartRestarunt: {},
        userCart: {
          tax: 0,
          amount: 0,
          products: [],
          team_id: null,
          merchant_id: null,
        },
      };
    case LOG_OUT:
      return {
        ...state,
        userData: {},
        userToken: '',
        isLoggedIn: false,
        curretCartRestarunt: {},
        userCart: {
          tax: 0,
          amount: 0,
          products: [],
          team_id: null,
          merchant_id: null,
        },
        currentDeliverLocation: {},
      };
    default:
      return state;
  }
};
