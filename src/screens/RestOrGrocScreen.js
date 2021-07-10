// package import
import React, {useEffect, useState} from 'react';
import {View, Image, StyleSheet, TouchableOpacity} from 'react-native';
import {createMaterialTopTabNavigator} from '@react-navigation/material-top-tabs';
import {useDispatch, useSelector} from 'react-redux';

// constants import
import colors from '../constants/colors';
import commonStyles from '../constants/commonStyles';
import responsiveFont from '../constants/responsiveFont';
import fonts from '../constants/fonts';

// ui components
import Menu from '../components/ui/Menu';
import Reviews from '../components/ui/Reviews';
import Info from '../components/ui/Info';
import MyText from '../components/ui/MyText';
import * as serviceableMerchants from '../redux/actions/serviceableMerchants';

// App API
import API from '../redux/BaseURL';

// utils import
import Loading from '../utils/Loading';
import ErrModal from '../components/ui/ErrModal';

const RestOrGrocScreen = ({navigation, route}) => {
  const dispatch = useDispatch();
  const Tab = createMaterialTopTabNavigator(); // to declare top tab function
  const item = route.params?.item; // to get singe restaurants or grocery data
  const restOrGroc = route.params?.restaurant;
  const addItems = route.params?.addItems;
  const [categories, setCategories] = useState([]); // to save item categories
  const [info, setInfo] = useState({}); //to save item info data
  const [review, setReview] = useState({});
  const [isLoading, setIsLoading] = useState(true); // to handle waiting for api response
  const userInfo = useSelector(state => state.user); // to know if the user is logged in or not
  console.log(item.itemState);
  const itemFav = restOrGroc
    ? useSelector(
        state =>
          state.serviceableMerchants.restaurants.find(
            i => i.itemId === item.itemId,
          ).itemFav,
      )
    : useSelector(state =>
        state.serviceableMerchants.groceries.find(
          i => i.itemId === item.itemId,
        ),
      ).itemFav; // to know if the user is logged in or not

  const addToFavoriteHandler = () => {
    dispatch(serviceableMerchants.addToFavorite(item.itemId, restOrGroc));
  };
  const removeFromFavoriteHandler = () => {
    dispatch(serviceableMerchants.removeFromFavorite(item.itemId, restOrGroc));
  };

  // fetch all required data for the choosin item
  const fetchSinglemerchant = async () => {
    try {
      const response = await API.get(
        `customer/v1/merchant/productcategory/${item.itemId}`,
      );
      const infoResponse = await API.get(
        `customer/v1/merchant/orderapp/${item.itemId}`,
      );
      const reviewResponse = await API.get('customer/v1/merchant/feedback/58');
      const review = await reviewResponse.data;
      const data = await response.data?.productCategories;
      const infoData = await infoResponse.data?.orderApp;
      setInfo(infoData);
      setCategories(data);
      setReview(review);
    } catch (e) {
      console.log(e);
    }
    setIsLoading(false);
  };

  useEffect(() => {
    if (addItems) {
      return;
    }
    const subscribe = fetchSinglemerchant();

    return subscribe;
  }, [navigation]);

  // handle waiting
  if (isLoading) {
    return (
      <View style={commonStyles.mainView2}>
        <Loading color={colors.primary} size={28} />
      </View>
    );
  }
  return (
    <View style={commonStyles.mainView2}>
      <View style={styles.restCon}>
        <View
          style={{
            flex: 0.75,
            flexDirection: 'row',
          }}>
          <View
            style={{
              flex: 2.5,
              flexDirection: 'row',
              justifyContent: 'center',
              alignItems: 'center',
            }}>
            <View style={{flex: 0.35}}>
              <Image
                style={{
                  height: '80%',
                  width: '100%',
                  resizeMode: 'cover',
                  borderRadius: 5,
                }}
                source={{uri: item.itemLogo}}
              />
            </View>
            <View style={{flex: 0.65, padding: '3%'}}>
              <MyText
                nol={1}
                text={item.itemName}
                fontType={2}
                style={{color: colors.black, fontSize: responsiveFont(15)}}
              />
              <MyText
                nol={1}
                text={item.itemCuisines}
                fontType={2}
                style={{
                  color: colors.grey,
                  fontSize: responsiveFont(12),
                }}
              />
              <View style={{flexDirection: 'row'}}>
                <MyText
                  nol={1}
                  text={`Min. order : `}
                  fontType={2}
                  style={{
                    color: colors.grey,
                    fontSize: responsiveFont(12),
                  }}
                />
                <MyText
                  nol={1}
                  cur
                  text={`${item.itemMinValue}`}
                  fontType={2}
                  style={{
                    color: colors.grey,
                    fontSize: responsiveFont(12),
                  }}
                />
              </View>
            </View>
          </View>
          <View
            style={{
              flex: 1,
              padding: '3%',
              justifyContent: 'space-between',
              alignItems: 'flex-end',
            }}>
            <View style={{alignItems: 'flex-end'}}>
              <MyText
                nol={1}
                fontType={4}
                text={item.itemState ? 'OPEN' : 'CLOSED'}
                style={{
                  lineHeight: 18,
                  color: item.itemState ? colors.green : colors.primary,
                }}
              />
              <MyText
                nol={1}
                text={'Live Tracking'}
                fontType={4}
                style={{
                  lineHeight: 18,
                  color: colors.orange,
                  fontSize: responsiveFont(12),
                }}
              />
            </View>
            {userInfo.isLoggedIn ? (
              itemFav ? (
                <TouchableOpacity
                  onPress={removeFromFavoriteHandler}
                  style={{width: '30%', height: '30%'}}>
                  <Image
                    style={{
                      width: '100%',
                      height: '100%',
                      resizeMode: 'contain',
                      tintColor: colors.primary,
                    }}
                    source={require('../assets/icons/favorite.png')}
                  />
                </TouchableOpacity>
              ) : (
                <TouchableOpacity
                  onPress={addToFavoriteHandler}
                  style={{width: '30%', height: '30%'}}>
                  <Image
                    style={{
                      width: '100%',
                      height: '100%',
                      resizeMode: 'contain',
                      tintColor: colors.primary,
                    }}
                    source={require('../assets/icons/heart.png')}
                  />
                </TouchableOpacity>
              )
            ) : null}
          </View>
        </View>
        <View
          style={{
            top: '80%',
            position: 'absolute',
            width: '70%',
            height: 1,
            backgroundColor: colors.borderColor,
            alignSelf: 'center',
          }}
        />
        <View
          style={{
            flex: 0.25,
            justifyContent: 'space-evenly',
            alignItems: 'center',
            flexDirection: 'row',
          }}>
          <View
            style={{
              alignItems: 'center',
              flexDirection: 'row',
            }}>
            <Image
              style={{width: 20, height: 20, resizeMode: 'contain'}}
              source={require('../assets/icons/star.png')}
            />
            <MyText
              nol={1}
              text={`${item.itemRating} Ratings`}
              fontType={3}
              style={{
                lineHeight: 38,
                marginLeft: '5%',
                color: colors.grey,
                fontSize: responsiveFont(12),
              }}
            />
          </View>
          <MyText
            nol={1}
            text={`${item.itemDelveryTime} Minutes (Delivery time)`}
            fontType={3}
            style={{
              lineHeight: 38,
              marginLeft: '5%',
              color: colors.grey,
              fontSize: responsiveFont(12),
            }}
          />
        </View>
      </View>

      <View style={{flexGrow: 0.8}}>
        <Tab.Navigator
          lazy={true}
          tabBarOptions={{
            activeTintColor: colors.primary,
            inactiveTintColor: colors.grey,
            labelStyle: {
              fontSize: responsiveFont(15),
              lineHeight: 20,
              fontFamily: fonts.poppins_regular,
              textTransform: 'none',
            },
            tabStyle: {flex: 1},
            indicatorStyle: {
              borderColor: colors.primary,
              borderWidth: 1.5,
            },
            style: {
              width: '100%',
              alignSelf: 'center',
              overflow: 'hidden',
              elevation: 0,
              marginBottom: '2.5%',
              borderBottomWidth: 1,
              borderColor: colors.borderColor,
            },
          }}>
          <Tab.Screen
            name="Menu"
            component={Menu}
            initialParams={{
              itemCategories: categories,
              restaurantData: item,
              restaurantStatus: item.itemState,
            }}
          />
          <Tab.Screen
            name="Reviews"
            component={Reviews}
            initialParams={{review: review, id: item.itemId}}
          />
          <Tab.Screen
            name="Info"
            component={Info}
            initialParams={{info: info}}
          />
        </Tab.Navigator>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  restCon: {
    flexGrow: 0.2,
    padding: '2.5%',
  },
});

export default RestOrGrocScreen;
