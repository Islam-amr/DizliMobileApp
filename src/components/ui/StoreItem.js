import React from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  Image,
} from 'react-native';
import {pure} from 'react-recompose';
import {useNavigation} from '@react-navigation/native';
import * as serviceableMerchants from '../../redux/actions/serviceableMerchants';

import colors from '../../constants/colors';
import responsiveFont from '../../constants/responsiveFont';
import dimensions from '../../constants/dimensions';
import MyText from './MyText';
import {AirbnbRating, Rating} from 'react-native-ratings';
import {useSelector, useDispatch} from 'react-redux';

const StoreItem = props => {
  const navigation = useNavigation();
  const userInfo = useSelector(state => state.user);
  const dispatch = useDispatch();
  const addToFavoriteHandler = () => {
    dispatch(
      serviceableMerchants.addToFavorite(props.item.itemId, props.restaurant),
    );
  };
  const removeFromFavoriteHandler = () => {
    dispatch(
      serviceableMerchants.removeFromFavorite(
        props.item.itemId,
        props.restaurant,
      ),
    );
  };
  return (
    <TouchableOpacity
      activeOpacity={0.6}
      style={styles.restItem}
      onPress={() =>
        navigation.navigate('RestOrGroc', {
          item: props.item,
          restaurant: props.restaurant,
        })
      }>
      <View
        style={{
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center',
        }}>
        <Image
          source={{uri: props.item.itemLogo}}
          style={{
            borderRadius: 5,
            resizeMode: 'cover',
            width: '100%',
            height: '100%',
          }}
        />
      </View>
      <View
        style={{
          flex: 2,
          paddingHorizontal: '2.5%',
        }}>
        <View style={{flexGrow: 1}}>
          <MyText
            text={props.item.itemName}
            nol={1}
            fontType={3}
            style={styles.mealName}
          />
          <MyText
            text={props.item.itemCuisines}
            fontType={2}
            style={styles.mealCategories}
            nol={1}
          />
        </View>
        <View style={{flexGrow: 2}}>
          <MyText
            text={`Within ${props.item.itemDelveryTime} min`}
            fontType={2}
            style={styles.deliveryInfo}
          />
          <MyText
            text={`Min: ₹${props.item.itemMinValue}`}
            fontType={2}
            style={styles.deliveryInfo}
          />
          <View style={{flexDirection: 'row'}}>
            <Rating
              type={'star'}
              ratingCount={5}
              readonly
              imageSize={20}
              startingValue={props.item.itemRating}
            />
          </View>
        </View>
        {userInfo.isLoggedIn && props.item.itemFav ? (
          <TouchableOpacity
            onPress={removeFromFavoriteHandler}
            style={{
              position: 'absolute',
              width: '10%',
              height: '20%',
              right: '5%',
            }}>
            <Image
              style={{
                width: '100%',
                height: '100%',
                resizeMode: 'contain',
                tintColor: colors.primary,
              }}
              source={require('../../assets/icons/favorite.png')}
            />
          </TouchableOpacity>
        ) : (
          <TouchableOpacity
            onPress={addToFavoriteHandler}
            style={{
              position: 'absolute',
              width: '10%',
              height: '20%',
              right: '5%',
            }}>
            <Image
              style={{
                width: '100%',
                height: '100%',
                resizeMode: 'contain',
                tintColor: colors.primary,
              }}
              source={require('../../assets/icons/heart.png')}
            />
          </TouchableOpacity>
        )}
      </View>
    </TouchableOpacity>
  );
};
const styles = StyleSheet.create({
  restItem: {
    flex: 1,
    flexDirection: 'row',
    paddingHorizontal: '2.5%',
    paddingVertical: '3%',
    marginBottom: '5%',
    borderBottomWidth: 1,
    borderBottomColor: colors.borderColor,
  },
  mealName: {
    fontSize: responsiveFont(18),
    width: '80%',
  },
  mealCategories: {
    fontSize: responsiveFont(14),
    color: colors.grey,
    width: '75%',
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

export default pure(StoreItem);
