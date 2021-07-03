import React from 'react';
import {View, Image, TouchableOpacity, StyleSheet, Text} from 'react-native';
import {pure} from 'react-recompose';
import {useNavigation} from '@react-navigation/native';
import colors from '../../constants/colors';
import responsiveFont from '../../constants/responsiveFont';
import MyText from './MyText';
const OfferItem = ({item}) => {
  const navigation = useNavigation();
  return (
    <TouchableOpacity
      activeOpacity={0.6}
      style={styles.offerItem}
      onPress={() => navigation.navigate('RestOrGroc', {item: item})}>
      <View
        style={{
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center',
        }}>
        <Image
          source={{uri: item.itemLogo}}
          style={{
            width: '85%',
            height: '85%',
            resizeMode: 'cover',
          }}
        />
      </View>
      <View style={{flex: 2}}>
        {/* <Text>MealBox</Text>
          <Text>italian,Chinese,indian</Text> */}
        <View style={{flexGrow: 1}}>
          <MyText
            nol={1}
            text={item.itemName}
            fontType={4}
            style={styles.mealName}
          />
          <MyText
            text={item.itemCuisines}
            fontType={2}
            style={styles.mealCategories}
          />
          <View
            style={{
              width: '20%',
              height: 1,
              backgroundColor: colors.borderColor,
              marginVertical: '2.5%',
            }}
          />
          <View
            style={{
              position: 'absolute',
              //   width: '30%',
              //   height: '40%',
              right: 0,
              top: 0,
              backgroundColor: colors.primary,
              borderRadius: 5,
              justifyContent: 'center',
              alignItems: 'center',
              paddingHorizontal: '2.5%',
            }}>
            <MyText
              text={`${item.itemDisValue}% OFF`}
              fontType={2}
              style={styles.discount}
            />
          </View>
        </View>
        <View style={{flexGrow: 1}}>
          <View
            style={{
              flex: 1,
              flexDirection: 'row',
              alignItems: 'center',
            }}>
            <Image
              source={require('../../assets/images/star.png')}
              style={{}}
            />
            <MyText
              text={`${item.itemRating} • ${item.itemDelveryTime} mins`}
              fontType={2}
              style={styles.duration}
            />
          </View>
          <MyText
            text={'Free Delivery • INR 300.0 for two'}
            fontType={2}
            style={styles.deliveryInfo}
            nol={1}
          />
        </View>
      </View>
    </TouchableOpacity>
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

export default pure(OfferItem);
