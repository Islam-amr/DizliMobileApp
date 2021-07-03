import API from '../BaseURL';
import {store} from '../store';
import {fetchServiceableMerchants} from './serviceableMerchants';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const SIGN_IN = 'SIGN_IN';
export const SIGN_UP = 'SIGN_UP';
export const GOOGLE_LOGIN = 'GOOGLE_LOGIN';
export const POST_USER_LOCATION = 'POST_USER_LOCATION';
export const VERIFY_USER = 'VERIFY_USER';
export const LOG_OUT = 'LOG_OUT';
export const ADD_TO_CART = 'ADD_TO_CART';
export const REMOVE_FROM_CART = 'REMOVE_FROM_CART';
export const REMOVE_FROM_CART_IMMEDIATE = 'REMOVE_FROM_CART_IMMEDIATE';
export const ADD_ADDRESS = 'ADD_ADDRESS';
export const DELETE_ADDRESS = 'DELETE_ADDRESS';
export const SET_DELIVERY_LOCATION = 'SET_DELIVERY_LOCATION';
export const OFFLINE_LOGIN = 'OFFLINE_LOGIN';
export const CLEAR_CART = 'CLEAR_CART';

export const signUp = (
  first_name,
  email,
  phone,
  country_id,
  type,
  password,
  password_confirmation,
) => {
  return async dispatch => {
    const response = await API.post('customer/v1/auth/sign-up/customer', {
      first_name,
      email,
      phone,
      country_id,
      type,
      password,
      password_confirmation,
    });
    // const resData = await response.data;
    // dispatch({type: SIGN_UP, payload: resData});
  };
};

export const signIn = (phone, password) => {
  return async dispatch => {
    const response = await API.post('customer/v1/auth/sign-in', {
      phone,
      password,
    });
    const resData = await response.data?.user;
    let token = response.headers.token;
    const jsonValue = JSON.stringify(resData);
    await AsyncStorage.setItem('@userToken', token);
    await AsyncStorage.setItem('@userData', jsonValue);
    dispatch({type: SIGN_IN, payload: resData, token: token});
  };
};

export const offlineLogin = (token, data) => {
  return dispatch => {
    dispatch({type: SIGN_IN, payload: JSON.parse(data), token: token});
  };
};

export const verifyUser = (token, userData) => {
  return async dispatch => {
    const jsonValue = JSON.stringify(userData);
    await AsyncStorage.setItem('@userToken', token);
    await AsyncStorage.setItem('@userData', jsonValue);
    dispatch({type: VERIFY_USER, token: token, payload: userData});
  };
};

export const setAddress = destination => {
  return {type: POST_USER_LOCATION, payload: destination};
};

export const logOut = () => {
  return async (dispatch, getState) => {
    const state = store.getState();
    await API.post('customer/v1/customer/logout', null, {
      headers: {
        Authorization: state.user.userToken,
      },
    });
    await AsyncStorage.removeItem('@userToken');
    await AsyncStorage.removeItem('@userData');
    dispatch({type: LOG_OUT});
  };
};

export const addToCart = (merchentData, product, teamId, price, tax) => {
  return dispatch => {
    const {itemId} = merchentData;
    dispatch({
      type: ADD_TO_CART,
      payload: {itemId, product, teamId, price, tax},
      restaurantData: merchentData,
    });
  };
};

export const removeFromCart = (id, price, name, tax) => {
  return dispatch => {
    dispatch({
      type: REMOVE_FROM_CART,
      payload: {id, price, name, tax},
    });
  };
};

export const removeFromCartImmediately = item => {
  return dispatch => {
    const {id, name, price} = item;
    dispatch({
      type: REMOVE_FROM_CART_IMMEDIATE,
      payload: {id, price, name},
    });
  };
};

export const addAddress = (
  title,
  address,
  latitude,
  longitude,
  door_no,
  landmark,
  edited,
  id,
) => {
  return async (dispatch, getState) => {
    const state = store.getState();
    let apiLink = edited
      ? `customer/v1/customer/address/${id}`
      : 'customer/v1/customer/address';
    try {
      const response = await API.post(
        apiLink,
        {
          title,
          address,
          latitude,
          longitude,
          door_no,
          landmark,
        },
        {
          headers: {
            Authorization: state.user.userToken,
          },
        },
      );
      let data = await response.data.user;
      const jsonValue = JSON.stringify(data);
      await AsyncStorage.setItem('@userData', jsonValue);
      dispatch({type: ADD_ADDRESS, payload: data});
    } catch (e) {
      console.log(e.response);
    }
  };
};

export const deleteAddress = id => {
  return async (dispatch, getState) => {
    const state = store.getState();
    try {
      const response = await API.delete(`customer/v1/customer/address/${id}`, {
        headers: {
          Authorization: state.user.userToken,
        },
      });
      let data = await response.data.user;
      const jsonValue = JSON.stringify(data);
      await AsyncStorage.setItem('@userData', jsonValue);
      dispatch({type: DELETE_ADDRESS, payload: data});
    } catch (e) {
      console.log(e.response);
    }
  };
};

export const setDeliveryLocation = location => {
  return async (dispatch, getState) => {
    const {latitude, longitude, address, place, title} = location;
    // await dispatch(
    //   fetchServiceableMerchants(latitude, longitude, place || address),
    // );
    dispatch({
      type: SET_DELIVERY_LOCATION,
      payload: {latitude, longitude, place: place || address, title},
    });
    dispatch(fetchServiceableMerchants(latitude, longitude, place || address));
  };
};

export const clearCart = () => {
  return {type: CLEAR_CART};
};
