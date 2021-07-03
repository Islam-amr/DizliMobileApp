import API from '../BaseURL';
import {store} from '../store';
export const ADD_TO_FAVORITE = 'ADD_TO_FAVORITE';
export const REMOVE_FROM_FAVORITE = 'REMOVE_FROM_FAVORITE';
export const FETCH_SERVICEABLE_MERCHANTS = 'FETCH_SERVICEABLE_MERCHANTS';
export const IS_LOADING = 'IS_LOADING';

export const fetchServiceableMerchants = (lat, long, locationName) => {
  return async (dispatch, getState) => {
    const state = store.getState();
    try {
      dispatch({type: IS_LOADING, payload: true});
      const response = await API.post(
        'customer/v1/serviceablemerchants',
        {
          country_id: 2,
          destination: {
            place: locationName,
            latitude: lat,
            longitude: long,
          },
        },
        {
          headers: {
            Authorization: state.user.userToken,
          },
        },
      );
      const resData = await response.data;
      dispatch({type: IS_LOADING, payload: false});
      dispatch({type: FETCH_SERVICEABLE_MERCHANTS, payload: resData});
    } catch (e) {
      dispatch({type: IS_LOADING, payload: false});
    }
  };
};

export const addToFavorite = (id, merchentType) => {
  return async (dispatch, getState) => {
    const state = store.getState();
    try {
      const response = await API.post(
        `customer/v1/customer/favorite/${id}`,
        null,
        {
          headers: {
            Authorization: state.user.userToken,
          },
        },
      );
      const resData = await response.data;
      dispatch({
        type: ADD_TO_FAVORITE,
        payload: id,
        merchentType: merchentType,
      });
    } catch (e) {
      console.log(e.response);
    }
  };
};

export const removeFromFavorite = (id, merchentType) => {
  return async (dispatch, getState) => {
    const state = store.getState();
    try {
      const response = await API.post(
        `customer/v1/customer/unfavorite/${id}`,
        null,
        {
          headers: {
            Authorization: state.user.userToken,
          },
        },
      );
      const resData = await response.data;
      dispatch({
        type: REMOVE_FROM_FAVORITE,
        payload: id,
        merchentType: merchentType,
      });
    } catch (e) {
      console.log(e.response, 'sfs');
    }
  };
};
