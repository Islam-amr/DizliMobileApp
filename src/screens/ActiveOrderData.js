import React, {useLayoutEffect} from 'react';
import {View, Image, FlatList, Text} from 'react-native';
import MyText from '../components/ui/MyText';
import colors from '../constants/colors';
import responsiveFont from '../constants/responsiveFont';

const ActiveOrderData = ({route, navigation}) => {
  const orderData = route.params?.orderDetails?.order;
  console.log(orderData);
  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => null,
      headerTitle: `Order ${orderData.order_id}`,
    });
  }, []);
  return (
    <View style={{flex: 1}}>
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'center',
          marginTop: '5%',
        }}>
        <Image
          style={{
            width: 60,
            height: 35,
            resizeMode: 'contain',
          }}
          source={require('../assets/icons/eat.png')}
        />
        <MyText
          nol={1}
          fontType={4}
          text={orderData.company.name}
          style={{
            color: colors.black,
            fontSize: responsiveFont(15),
          }}
        />
      </View>
      <View style={{flex: 1, padding: '5%'}}>
        <FlatList
          data={orderData.products}
          keyExtractor={item => item.id}
          renderItem={({item, index}) => {
            return (
              <View>
                <View
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                  }}>
                  <MyText
                    text={`${item.name} x${item.quantity}`}
                    fontType={3}
                    style={{
                      color: colors.black,
                      fontSize: responsiveFont(16),
                      width: '70%',
                    }}
                  />
                  <MyText
                    fontType={3}
                    text={`₹${item.price}`}
                    style={{
                      color: colors.black,
                      fontSize: responsiveFont(16),
                    }}
                  />
                </View>
                <View style={{flexDirection: 'row'}}>
                  {orderData.products[0]?.addons.length !== 0
                    ? orderData.products[0]?.addons[0]?.addons.map(i => {
                        return (
                          <MyText
                            text={`${i.addon.name} `}
                            fontType={2}
                            style={{
                              color: colors.black,
                              fontSize: responsiveFont(12),
                            }}
                          />
                        );
                      })
                    : null}
                </View>
                {/* <MyText
                  text={`sdg`}
                  fontType={2}
                  style={{
                    color: colors.black,
                    fontSize: responsiveFont(12),
                  }}
                /> */}
              </View>
            );
          }}
        />
      </View>
      <View style={{flex: 0.8, padding: '5%'}}>
        <MyText
          nol={1}
          fontType={4}
          text={'Total'}
          style={{
            color: colors.black,
            fontSize: responsiveFont(20),
          }}
        />
        <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
          <MyText
            nol={1}
            fontType={2}
            text={'Item total'}
            style={{
              color: colors.black,
              fontSize: responsiveFont(16),
            }}
          />
          <MyText
            nol={1}
            fontType={2}
            text={`₹${orderData.amount}`}
            style={{
              color: colors.black,
              fontSize: responsiveFont(16),
            }}
          />
        </View>
        <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
          <MyText
            nol={1}
            fontType={2}
            text={'Taxs'}
            style={{
              color: colors.black,
              fontSize: responsiveFont(16),
            }}
          />
          <MyText
            nol={1}
            fontType={2}
            text={`₹${orderData.tax}`}
            style={{
              color: colors.black,
              fontSize: responsiveFont(16),
            }}
          />
        </View>
        <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
          <MyText
            nol={1}
            fontType={2}
            text={'Delivery Fee'}
            style={{
              color: colors.black,
              fontSize: responsiveFont(16),
            }}
          />
          <MyText
            nol={1}
            fontType={2}
            text={`₹${orderData.fee}`}
            style={{
              color: colors.black,
              fontSize: responsiveFont(16),
            }}
          />
        </View>
        <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
          <MyText
            nol={1}
            fontType={2}
            text={'Payment type'}
            style={{
              color: colors.black,
              fontSize: responsiveFont(16),
            }}
          />
          <MyText
            nol={1}
            fontType={2}
            text={`₹${
              orderData.payment_type === 1 ? 'Cash' : 'Online payment'
            }`}
            style={{
              color: colors.black,
              fontSize: responsiveFont(16),
            }}
          />
        </View>
        <View
          style={{
            flexDirection: 'row',
            marginTop: '10%',
            justifyContent: 'space-between',
          }}>
          <MyText
            nol={1}
            fontType={4}
            text={'To pay on delivery'}
            style={{
              color: colors.black,
              fontSize: responsiveFont(16),
            }}
          />
          <MyText
            nol={1}
            fontType={4}
            text={`₹${orderData.fee + orderData.tax + orderData.amount}`}
            style={{
              color: colors.black,
              fontSize: responsiveFont(16),
            }}
          />
        </View>
      </View>
    </View>
  );
};

export default ActiveOrderData;
