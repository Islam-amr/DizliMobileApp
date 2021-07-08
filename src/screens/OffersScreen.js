import React, {useState, useEffect} from 'react';
import {View, Text, FlatList, StyleSheet, Image} from 'react-native';
import {useSelector} from 'react-redux';
import MyText from '../components/ui/MyText';
import OfferItem from '../components/ui/OfferItem';
import colors from '../constants/colors';
import commonStyles from '../constants/commonStyles';
import responsiveFont from '../constants/responsiveFont';
import API from '../redux/BaseURL';

// utils import
import Loading from '../utils/Loading';

const OffersScreen = () => {
  const userLocation = useSelector(state => state.user.destination);
  const [offersData, setOffersData] = useState([]);
  const [loading, setIsLoading] = useState(false);
  const [err, setErr] = useState(null);

  const fetchOffers = async () => {
    setIsLoading(true);
    try {
      const response = await API.post('customer/v1/merchant/offers', {
        country_id: 2,
        destination: userLocation,
      });
      let updatedRestaurants = response.data.restaurant.map(item => {
        return {
          itemId: item.customerApp.merchant_id,
          itemName: item.name,
          itemLogo: item.orderApp.logo,
          itemCuisines: item.orderApp.serving_categories
            .map(i => i.content)
            .join(', '),
          itemDelveryTime: item.orderApp.delivery_time,
          itemMinValue: item.orderApp.minimum_order_value,
          itemDisValue: item.orderApp.discount_value,
          itemRating: item.rating_stars,
          itemState: item.is_open,
          latitude: item.teams[0].address.latitude,
          longitude: item.teams[0].address.longitude,
        };
      });
      let updatedGroceries = response.data.grocery.map(item => {
        return {
          itemId: item.customerApp.merchant_id,
          itemName: item.name,
          itemLogo: item.orderApp.logo,
          itemCuisines: item.orderApp.serving_categories
            .map(i => i.content)
            .join(', '),
          itemDelveryTime: item.orderApp.delivery_time,
          itemMinValue: item.orderApp.minimum_order_value,
          itemDisValue: item.orderApp.discount_value,
          itemRating: item.rating_stars,
          itemState: item.is_open,
          latitude: item.teams[0].address.latitude,
          longitude: item.teams[0].address.longitude,
        };
      });
      console.log(response.data);
      setOffersData(updatedRestaurants.concat(updatedGroceries));
    } catch (e) {
      console.log(e.message);
    }
    setIsLoading(false);
  };
  useEffect(() => {
    fetchOffers();
  }, [userLocation]);

  if (loading) {
    return (
      <View style={commonStyles.mainView}>
        <Loading color={colors.primary} size={26} />
      </View>
    );
  }
  return (
    <View style={commonStyles.mainView}>
      <FlatList
        data={offersData}
        keyExtractor={(item, index) => index}
        contentContainerStyle={{padding: '5%'}}
        renderItem={({item, index}) => {
          return <OfferItem item={item} />;
        }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  offerItem: {
    flex: 1,
    flexDirection: 'row',
    paddingHorizontal: '2.5%',
    paddingVertical: '3%',
    marginBottom: '5%',
    borderRadius: 5,
    borderWidth: 1,
    borderColor: colors.borderColor,
    backgroundColor: colors.white,
  },
  mealName: {
    fontSize: responsiveFont(16),
    width: '65%',
  },
  mealCategories: {
    fontSize: responsiveFont(14),
    color: colors.grey,
  },
  duration: {
    fontSize: responsiveFont(14),
    color: colors.grey,
    lineHeight: 22,
    marginLeft: '2.5%',
  },
  deliveryInfo: {
    fontSize: responsiveFont(12),
    color: colors.grey,
    lineHeight: 22,
  },
  discount: {
    color: colors.white,
    fontSize: responsiveFont(14),
    lineHeight: 22,
  },
});

export default OffersScreen;
