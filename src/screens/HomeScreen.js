// package import
import React, {
  useCallback,
  useEffect,
  useLayoutEffect,
  useReducer,
  useRef,
  useState,
} from 'react';
import {
  View,
  Image,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  TextInput,
} from 'react-native';

// constants import
import colors from '../constants/colors';
import commonStyles from '../constants/commonStyles';
import responsiveFont from '../constants/responsiveFont';
import ActionSheet from 'react-native-actions-sheet';
import {Rating, AirbnbRating} from 'react-native-ratings';

// screens import
import AddressHeader from '../components/ui/AddressHeader';
import MenuIcon from '../components/ui/MenuIcon';
import HeaderIcon from '../components/ui/HeaderIcon';
import MyText from '../components/ui/MyText';
import Button from '../components/ui/Button';

import API from '../redux/BaseURL';
import {useSelector} from 'react-redux';
import dimensions from '../constants/dimensions';
import ReorderModal from '../components/ui/ReorderModal';
import {useFocusEffect} from '@react-navigation/native';

const UPDATE_REVIEW = 'UPDATE_REVIEW';

const reviewReducer = (state, action) => {
  switch (action.type) {
    case UPDATE_REVIEW:
      return {
        ...state,
        [action.input]: action.payload,
      };
    default:
      return state;
  }
};

const RateItem = ({title, onRate}) => {
  return (
    <View style={{paddingHorizontal: '10%'}}>
      <MyText
        text={title}
        fontType={3}
        style={{marginVertical: '2.5%', fontSize: responsiveFont(15)}}
      />
      <Rating
        type={'star'}
        ratingCount={5}
        imageSize={30}
        onFinishRating={rate => onRate(rate)}
        // ratingImage={() => (
        //   <Image source={require('../../assets/icons/star.png')} />
        // )}
      />
      <View
        style={{
          width: '80%',
          height: 2,
          backgroundColor: colors.borderColor,
          alignSelf: 'center',
          marginTop: '5%',
        }}
      />
    </View>
  );
};

const HomeScreen = ({navigation}) => {
  const actionSheetRef = useRef(); // to control map modal
  const userToken = useSelector(state => state.user.userToken);
  const [userOrder, setUserOrder] = useState([]);
  const [reorderModal, setReorderModal] = useState(false);
  const [orderId, setOrderId] = useState(null);
  useLayoutEffect(() => {
    navigation.setOptions({
      headerTitle: () => <AddressHeader />,
      headerLeft: () => <MenuIcon />,
      headerRight: () => (
        <HeaderIcon
          icon={require('../assets/icons/searchhh.png')}
          onPress={() => navigation.navigate('Search')}
        />
      ),
    });
  }, []);

  const fetchUserOrder = async () => {
    console.log(userToken);
    try {
      const response = await API.get('customer/v1/customer/myorders', {
        headers: {Authorization: userToken},
      });
      setUserOrder(response.data.orders);
    } catch (e) {
      console.log(e.response);
    }
  };

  useFocusEffect(
    useCallback(() => {
      const unsubscribe = fetchUserOrder();

      return () => unsubscribe;
    }, [navigation]),
  );

  useEffect(() => {
    const unsubscribe = fetchUserOrder();

    return () => unsubscribe;
  }, [userToken]);

  const [reviewStates, dispatchReview] = useReducer(reviewReducer, {
    order_packing_stars: 3,
    food_quality_stars: 3,
    value_for_money_stars: 3,
    delivery_time_stars: 3,
    description: '',
  });

  const reorderHandler = async () => {
    try {
      const response = await API.get(`customer/v1/orders/reorder/${orderId}`, {
        headers: {
          Authorization: userToken,
        },
      });
      console.log(response.data);
      setReorderModal(false);
    } catch (e) {
      console.log(e.response);
    }
  };
  const submitReview = async merchentId => {
    try {
      const response = await API.post(
        'customer/v1/orders/2cxt/feedback',
        {
          order_packing_stars: reviewStates.order_packing_stars || 3,
          food_quality_stars: reviewStates.food_quality_stars || 3,
          value_for_money_stars: reviewStates.value_for_money_stars || 3,
          delivery_time_stars: reviewStates.delivery_time_stars || 3,
          description: reviewStates.description,
        },
        {
          headers: {
            Authorization: userToken,
          },
        },
      );
      actionSheetRef.current?.setModalVisible();
    } catch (e) {
      console.log(e.response);
      actionSheetRef.current?.setModalVisible();
    }
  };

  return (
    <>
      <View style={commonStyles.mainView}>
        <View style={styles.rowCon}>
          <MyText
            text={'ORDER FOOD ONLINE IN TIRUVALLUR'}
            fontType={4}
            style={styles.titleTxt}
          />
          <View style={styles.imgsCon}>
            <TouchableOpacity
              activeOpacity={0.6}
              style={{flex: 1}}
              onPress={() => navigation.navigate('Restaurants')}>
              <Image
                source={require('../assets/images/food.png')}
                style={styles.categoryImg}
              />
              <MyText fontType={3} text={'Restaurants'} style={styles.imgTxt} />
            </TouchableOpacity>
            <TouchableOpacity
              activeOpacity={0.6}
              style={{flex: 1}}
              onPress={() => navigation.navigate('Groceries')}>
              <Image
                source={require('../assets/images/gre.png')}
                style={styles.categoryImg}
              />
              <MyText fontType={3} text={'Groceries'} style={styles.imgTxt} />
            </TouchableOpacity>
          </View>
        </View>
        {!userToken ? (
          <View style={[styles.rowCon, {paddingHorizontal: '5%'}]}>
            <MyText
              text={'Welcome to Dilzi'}
              fontType={4}
              style={[styles.titleTxt, {textAlign: 'left'}]}
            />
            <View style={styles.curretOrderCon2}>
              <MyText
                text={
                  'Order food from restaurants & grocery stores to be delivered to your doorstep or ready to for pick up.'
                }
                fontType={3}
                style={[
                  styles.imgTxt,
                  {textAlign: 'left', fontSize: responsiveFont(14)},
                ]}
              />
              <MyText
                text={'Now available in Tiruvallur'}
                fontType={3}
                style={[styles.imgTxt, {fontSize: responsiveFont(14)}]}
              />
            </View>
          </View>
        ) : userOrder.length === 0 ? (
          <View style={[styles.rowCon, {paddingHorizontal: '5%'}]}>
            <MyText
              text={'Welcome to Dilzi'}
              fontType={4}
              style={[styles.titleTxt, {textAlign: 'left'}]}
            />
            <View style={styles.curretOrderCon2}>
              <MyText
                text={
                  'Order food from restaurants & grocery stores to be delivered to your doorstep or ready to for pick up.'
                }
                fontType={3}
                style={[
                  styles.imgTxt,
                  {textAlign: 'left', fontSize: responsiveFont(14)},
                ]}
              />
              <MyText
                text={'Now available in Tiruvallur'}
                fontType={3}
                style={[styles.imgTxt, {fontSize: responsiveFont(14)}]}
              />
            </View>
          </View>
        ) : (
          <View style={styles.rowCon}>
            <MyText
              text={'My Orders'}
              fontType={4}
              style={[
                styles.titleTxt,
                {textAlign: 'left', marginLeft: '5%', marginVertical: '1.5%'},
              ]}
            />
            <FlatList
              showsHorizontalScrollIndicator={false}
              pagingEnabled
              horizontal
              data={userOrder}
              keyExtractor={item => item.id}
              renderItem={({item}) => {
                console.log(item);
                return (
                  <TouchableOpacity
                    style={styles.curretOrderCon}
                    onPress={() =>
                      navigation.navigate('Order Details', {hash: item.hash})
                    }>
                    <View
                      style={{
                        flex: 1,
                        flexDirection: 'row',
                        alignItems: 'center',
                      }}>
                      <Image
                        style={{width: 35, height: 35, resizeMode: 'contain'}}
                        source={require('../assets/icons/eat.png')}
                      />
                      <MyText
                        nol={1}
                        fontType={4}
                        text={item.merchant_name}
                        style={{
                          color: colors.black,
                          fontSize: responsiveFont(15),
                          width: '75%',
                          marginLeft: '5%',
                        }}
                      />
                    </View>
                    {
                      <View
                        style={{
                          flex: 1.5,
                          flexDirection: 'row',
                          justifyContent: 'space-evenly',
                          alignItems: 'center',
                        }}>
                        <View
                          style={{
                            justifyContent: 'center',
                            alignItems: 'center',
                          }}>
                          <TouchableOpacity
                            style={styles.orderTab}
                            onPress={() =>
                              navigation.navigate('ActiveOrderData', {
                                orderDetails: {
                                  order: {
                                    order_id: item.id,
                                    company: {
                                      name: item.merchant_name,
                                    },
                                    products: item.products,
                                    amount: item.amount,
                                    tax: item.tax || 0,
                                    fee: 0,
                                    payment_type: item.payment_type,
                                  },
                                },
                              })
                            }>
                            <Image
                              style={{
                                width: '60%',
                                height: '60%',
                                resizeMode: 'contain',
                              }}
                              source={require('../assets/icons/rec.png')}
                            />
                          </TouchableOpacity>
                          <MyText
                            text={'Receipt'}
                            style={{color: colors.primary}}
                          />
                        </View>
                        <View
                          style={{
                            justifyContent: 'center',
                            alignItems: 'center',
                          }}>
                          <TouchableOpacity
                            style={[
                              styles.orderTab,
                              {opacity: item.status !== 6 ? 0.6 : 1},
                            ]}
                            onPress={
                              item.status !== 6
                                ? null
                                : () =>
                                    actionSheetRef.current?.setModalVisible()
                            }>
                            <Image
                              style={{
                                width: '60%',
                                height: '60%',
                                resizeMode: 'contain',
                              }}
                              source={require('../assets/icons/starr.png')}
                            />
                          </TouchableOpacity>
                          <MyText
                            text={'Rate'}
                            style={{
                              color: colors.primary,
                              opacity: item.status !== 6 ? 0.6 : 1,
                            }}
                          />
                        </View>
                        <View
                          style={{
                            justifyContent: 'center',
                            alignItems: 'center',
                          }}>
                          <TouchableOpacity
                            style={[
                              styles.orderTab,
                              {opacity: item.status !== 6 ? 0.6 : 1},
                            ]}
                            onPress={
                              item.status !== 6
                                ? null
                                : () => {
                                    setOrderId(item.id);
                                    setReorderModal(true);
                                  }
                            }>
                            <Image
                              style={{
                                width: '60%',
                                height: '60%',
                                resizeMode: 'contain',
                              }}
                              source={require('../assets/icons/re.png')}
                            />
                          </TouchableOpacity>
                          <MyText
                            text={'Re-order'}
                            style={{
                              color: colors.primary,
                              opacity: item.status !== 6 ? 0.6 : 1,
                            }}
                          />
                        </View>
                      </View>
                    }
                    <ActionSheet
                      ref={actionSheetRef}
                      containerStyle={styles.modalCon}>
                      <View
                        style={{
                          height: dimensions.height * 0.95,
                          justifyContent: 'center',
                        }}>
                        <View
                          style={{
                            paddingHorizontal: '5%',
                            flexDirection: 'row-reverse',
                          }}>
                          <TouchableOpacity
                            onPress={() =>
                              actionSheetRef.current?.setModalVisible()
                            }>
                            <Image
                              source={require('../assets/icons/xMark.png')}
                              style={styles.xImg}
                            />
                          </TouchableOpacity>
                        </View>
                        <View style={commonStyles.mainView2}>
                          <RateItem
                            title={'Order packaging'}
                            onRate={rate =>
                              dispatchReview({
                                type: UPDATE_REVIEW,
                                input: 'order_packing_stars',
                                payload: rate,
                              })
                            }
                          />
                          <RateItem
                            title={'Quality of food'}
                            onRate={rate =>
                              dispatchReview({
                                type: UPDATE_REVIEW,
                                input: 'food_quality_stars',
                                payload: rate,
                              })
                            }
                          />
                          <RateItem
                            title={'Value for money'}
                            onRate={rate =>
                              dispatchReview({
                                type: UPDATE_REVIEW,
                                input: 'value_for_money_stars',
                                payload: rate,
                              })
                            }
                          />
                          <RateItem
                            title={'Delivery time'}
                            onRate={rate =>
                              dispatchReview({
                                type: UPDATE_REVIEW,
                                input: 'delivery_time_stars',
                                payload: rate,
                              })
                            }
                          />
                          <View
                            style={{
                              width: '90%',
                              alignSelf: 'center',
                              marginBottom: '5%',
                            }}>
                            <View
                              style={{
                                flexDirection: 'row',
                                marginVertical: '2.5%',
                                justifyContent: 'space-between',
                              }}>
                              <MyText
                                text={'Notes'}
                                fontType={3}
                                style={{fontSize: responsiveFont(18)}}
                              />
                              <Image
                                style={{
                                  width: 20,
                                  height: 20,
                                  resizeMode: 'contain',
                                }}
                                source={require('../assets/icons/note.png')}
                              />
                            </View>
                            <View
                              style={{
                                borderColor: colors.grey,
                                borderWidth: 1,
                                height: dimensions.height * 0.15,
                              }}>
                              <TextInput
                                style={{fontSize: responsiveFont(16)}}
                                multiline={true}
                                value={reviewStates.description}
                                onChangeText={text =>
                                  dispatchReview({
                                    type: UPDATE_REVIEW,
                                    input: 'description',
                                    payload: text,
                                  })
                                }
                              />
                            </View>
                          </View>
                          {false ? (
                            <View
                              style={{
                                flexDirection: 'row',
                                justifyContent: 'center',
                                alignItems: 'center',
                                marginBottom: '7.5%',
                              }}>
                              <Image
                                source={require('../assets/icons/check.png')}
                                style={{
                                  tintColor: colors.green,
                                  width: 25,
                                  height: 20,
                                  marginHorizontal: '2%',
                                }}
                              />
                              <MyText
                                text={'YOUR REVIEW HAS BEEN POSTED'}
                                fontType={4}
                                style={{
                                  fontSize: responsiveFont(15),
                                  lineHeight: 36,
                                  textAlign: 'center',
                                }}
                              />
                            </View>
                          ) : (
                            <Button
                              onPress={() => submitReview(item.hash)}
                              title={'SUBMIT REVIEW'}
                              container={{
                                backgroundColor: colors.primary,
                                padding: '4%',
                                marginHorizontal: '5%',
                                marginBottom: '5%',
                              }}
                              fontType={4}
                              txtStyle={{
                                color: colors.white,
                                fontSize: responsiveFont(16),
                              }}
                            />
                          )}
                        </View>
                      </View>
                    </ActionSheet>
                  </TouchableOpacity>
                );
              }}
            />
          </View>
        )}
        <View style={[styles.rowCon, {paddingHorizontal: '5%'}]}>
          <MyText
            text={'OFFERS & SPECIALS'}
            fontType={4}
            style={[styles.titleTxt, {textAlign: 'left'}]}
          />
          <TouchableOpacity
            style={{flex: 0.8}}
            activeOpacity={0.6}
            onPress={() => navigation.navigate('Offers')}>
            <Image
              style={styles.offerImage}
              source={require('../assets/images/discount.png')}
            />
          </TouchableOpacity>
        </View>
      </View>
      <ReorderModal
        visible={reorderModal}
        onOk={reorderHandler}
        msg={'Are you sure you want to re-order ?'}
        leftBtn={'cancel'}
        rightBtn={'Order'}
        onCanel={() => setReorderModal(false)}
      />
    </>
  );
};

const styles = StyleSheet.create({
  modalCon: {
    width: dimensions.width,
    backgroundColor: colors.white,
    borderTopRightRadius: 20,
    borderTopLeftRadius: 20,
  },
  rowCon: {
    flex: 1,
    borderBottomColor: colors.borderColor,
    borderBottomWidth: 1,
    justifyContent: 'center',
  },
  titleTxt: {
    textAlign: 'center',
    fontSize: responsiveFont(17),
    marginVertical: '3%',
  },
  imgsCon: {
    flex: 0.8,
    flexDirection: 'row',
    padding: '2.5%',
  },
  imgTxt: {
    textAlign: 'center',
    fontSize: responsiveFont(16),
  },
  categoryImg: {
    width: '100%',
    height: '90%',
    resizeMode: 'contain',
  },
  curretOrderCon: {
    // flex: 0.5,
    width: dimensions.width * 0.9,
    backgroundColor: colors.white,
    borderRadius: 5,
    // padding: '4%',
    marginHorizontal: 20,
    marginVertical: 10,
    paddingHorizontal: 10,
    paddingVertical: 10,
    justifyContent: 'space-evenly',
  },
  curretOrderCon2: {
    width: dimensions.width * 0.9,
    alignSelf: 'center',
    backgroundColor: colors.white,
    borderRadius: 5,
    // padding: '4%',
    marginHorizontal: 20,
    marginVertical: 10,
    paddingHorizontal: 10,
    paddingVertical: 10,
    justifyContent: 'space-evenly',
  },
  offerImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'contain',
  },
  orderTab: {
    width: dimensions.width * 0.12,
    height: dimensions.width * 0.12,
    backgroundColor: colors.primary,
    borderRadius: (dimensions.width * 0.12) / 2,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 5,
  },
  xImg: {
    width: dimensions.width * 0.04,
    height: dimensions.width * 0.04,
    resizeMode: 'contain',
  },
});

export default HomeScreen;
