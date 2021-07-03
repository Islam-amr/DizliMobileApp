import {
  ADD_TO_FAVORITE,
  FETCH_SERVICEABLE_MERCHANTS,
  IS_LOADING,
  REMOVE_FROM_FAVORITE,
} from '../actions/serviceableMerchants';

const initalState = {
  restaurants: [],
  groceries: [],
  isLoading: false,
};

export default (state = initalState, action) => {
  switch (action.type) {
    case FETCH_SERVICEABLE_MERCHANTS:
      let updatedRestaurants = action.payload.restaurant.map(item => {
        return {
          itemId: item.customerApp.merchant_id,
          itemName: item.name,
          itemLogo: item.orderApp.logo,
          itemCuisines: item.orderApp.serving_categories
            .map(i => i.content)
            .join(', '),
          itemDelveryTime: item.orderApp.delivery_time,
          itemMinValue: item.orderApp.minimum_order_value,
          itemRating: item.rating_stars,
          itemState: item.is_open,
          itemFav: item.is_favorite,
          latitude: item.teams[0].address.latitude,
          longitude: item.teams[0].address.longitude,
        };
      });
      let updatedGroceries = action.payload.grocery.map(item => {
        return {
          itemId: item.customerApp.merchant_id,
          itemName: item.name,
          itemLogo: item.orderApp.logo,
          itemCuisines: item.orderApp.serving_categories
            .map(i => i.content)
            .join(', '),
          itemCuisines: item.orderApp.serving_category,
          itemDelveryTime: item.orderApp.delivery_time,
          itemMinValue: item.orderApp.minimum_order_value,
          itemRating: item.rating_stars,
          itemState: item.is_open,
          itemFav: item.is_favorite,
          latitude: item.teams[0].address.latitude,
          longitude: item.teams[0].address.longitude,
        };
      });
      return {
        ...state,
        restaurants: updatedRestaurants,
        groceries: updatedGroceries,
      };
    case IS_LOADING:
      return {
        ...state,
        isLoading: action.payload,
      };
    case ADD_TO_FAVORITE:
      let id = action.payload;
      let merchentType = action.merchentType;
      let updatedIndex = merchentType
        ? state.restaurants.findIndex(i => i.itemId === id)
        : state.groceries.findIndex(i => i.itemId === id);

      const newState = merchentType
        ? [...state.restaurants]
        : [...state.groceries];
      newState[updatedIndex] = {...newState[updatedIndex], itemFav: true};
      return {
        ...state,
        [merchentType ? 'restaurants' : 'groceries']: newState,
      };

    case REMOVE_FROM_FAVORITE:
      let unId = action.payload;
      let unMerchentType = action.merchentType;
      let unUpdatedIndex = unMerchentType
        ? state.restaurants.findIndex(i => i.itemId === unId)
        : state.groceries.findIndex(i => i.itemId === unId);

      const unNewState = unMerchentType
        ? [...state.restaurants]
        : [...state.groceries];
      unNewState[unUpdatedIndex] = {
        ...unNewState[unUpdatedIndex],
        itemFav: false,
      };

      return {
        ...state,
        [unMerchentType ? 'restaurants' : 'groceries']: unNewState,
      };

    default:
      return state;
  }
};
