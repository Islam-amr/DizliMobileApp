import React, {useEffect, useState} from 'react';
import {
  View,
  TouchableOpacity,
  StyleSheet,
  FlatList,
  Image,
  Text,
} from 'react-native';
import colors from '../../constants/colors';
import dimensions from '../../constants/dimensions';
import responsiveFont from '../../constants/responsiveFont';
import Button from './Button';
import MyText from '../ui/MyText';
import API from '../../redux/BaseURL';
import {useDispatch, useSelector} from 'react-redux';
import * as userActions from '../../redux/actions/user';
const Item = props => {
  const dispatch = useDispatch();
  const onRemove = item => {
    dispatch(userActions.removeFromCartImmediately(item));
  };
  return (
    <View
      style={{
        marginVertical: '2.5%',
        flexDirection: 'row',
        alignItems: 'center',
      }}>
      <View style={{flex: 0.6}}>
        <MyText
          nol={2}
          text={`${props.item.name} X${props.item.quantity}`}
          fontType={3}
          style={{
            color: colors.black,
            fontSize: responsiveFont(14),
            marginLeft: '10%',
          }}
        />
        {props.extra && (
          <>
            <MyText
              nol={1}
              text={'Coca-Cola X 2'}
              fontType={2}
              style={{
                color: colors.grey,
                fontSize: responsiveFont(14),
                marginLeft: '20%',
              }}
            />
            <MyText
              nol={1}
              text={'Mushrooms'}
              fontType={2}
              style={{
                color: colors.grey,
                fontSize: responsiveFont(14),
                marginLeft: '20%',
              }}
            />
          </>
        )}
      </View>
      <View
        style={{
          flex: props.noRemove ? 0.35 : 0.25,
          alignItems: props.noRemove ? 'flex-end' : 'flex-end',
        }}>
        <MyText
          cur
          nol={1}
          text={`${props.item.price}`}
          fontType={3}
          style={{
            color: colors.grey,
            fontSize: responsiveFont(14),
          }}
        />
        {props.extra && (
          <>
            <MyText
              nol={1}
              cur
              text={'150.20'}
              fontType={2}
              style={{
                color: colors.grey,
                fontSize: responsiveFont(14),
              }}
            />
            <MyText
              cur
              nol={1}
              text={'150.20'}
              fontType={2}
              style={{
                color: colors.grey,
                fontSize: responsiveFont(14),
              }}
            />
          </>
        )}
      </View>
      {!props.noRemove && (
        <View
          style={{
            flex: 0.15,
            alignItems: 'center',
          }}>
          <TouchableOpacity
            activeOpacity={0.6}
            onPress={() => onRemove({...props.item})}>
            <Image
              source={require('../../assets/icons/deletee.png')}
              style={{width: 25, height: 25, resizeMode: 'contain'}}
            />
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
};

const CommonList = ({
  userCurrentRest,
  userCart,
  scrollEnabled,
  noRemove,
  setTotal,
}) => {
  const [deliveryCharge, setDeliveryCharge] = useState(null);
  const userDestnation = useSelector(
    state => state.user.currentDeliverLocation,
  );
  const fetchDeliveryCharge = async () => {
    try {
      const response = await API.post('customer/v1/merchant/deliverycharge', {
        team_id: userCart.team_id,
        destination: userDestnation,
      });
      setDeliveryCharge(response.data?.deliveryCharge);
      let total =
        response.data?.deliveryCharge + userCart.amount + userCart.tax;
      setTotal(total);
    } catch (e) {
      console.log(e.message);
    }
  };

  console.log(setTotal);

  useEffect(() => {
    fetchDeliveryCharge();
  }, [userCart]);
  // useEffect(() => {
  //   // let total = userCart.amount + userCart.tax + deliveryCharge;
  //   setTotal(123);
  // }, []);

  return (
    <View
      style={{
        flex: 0.85,
        justifyContent: 'space-between',
      }}>
      <View
        style={{
          flexDirection: 'row',
          height: dimensions.height * 0.15,
          paddingHorizontal: '5%',
          paddingVertical: '2.5%',
          justifyContent: 'center',
          alignItems: 'center',
        }}>
        <View style={{flex: 0.25}}>
          <Image
            source={{uri: userCurrentRest.itemLogo}}
            style={{
              width: '100%',
              height: '80%',
              resizeMode: 'cover',
              borderRadius: 5,
            }}
          />
        </View>
        <View
          style={{
            flex: 0.75,
            paddingHorizontal: '2.5%',
          }}>
          <MyText
            nol={1}
            text={userCurrentRest.itemName}
            fontType={4}
            style={{color: colors.black, fontSize: responsiveFont(15)}}
          />
          <MyText
            nol={1}
            text={'Indian, Arabic, Burgers'}
            fontType={2}
            style={{
              color: colors.grey,
              fontSize: responsiveFont(12),
            }}
          />
          <MyText
            nol={1}
            text={'Min. order : ₹ 150'}
            fontType={2}
            style={{
              color: colors.grey,
              fontSize: responsiveFont(12),
            }}
          />
        </View>
      </View>
      <View
        style={{
          width: '70%',
          alignSelf: 'center',
          height: 1,
          backgroundColor: colors.borderColor,
        }}
      />
      <View style={{flex: 1}}>
        <FlatList
          scrollEnabled={scrollEnabled}
          data={userCart.products}
          keyExtractor={item => item.id}
          renderItem={({item}) => {
            return <Item item={item} noRemove={noRemove} />;
          }}
        />
      </View>
      <View
        style={{
          padding: '5%',
          borderTopColor: colors.borderColor,
          borderTopWidth: 2,
        }}>
        <MyText
          nol={1}
          text={'Total'}
          fontType={4}
          style={{color: colors.black, fontSize: responsiveFont(20)}}
        />
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            marginTop: '2.5%',
          }}>
          <MyText
            nol={1}
            text={'Items total'}
            fontType={2}
            style={{
              color: colors.black,
              fontSize: responsiveFont(14),
            }}
          />
          <MyText
            cur
            nol={1}
            text={`${userCart.amount}`}
            fontType={3}
            style={{
              color: colors.black,
              fontSize: responsiveFont(14),
            }}
          />
        </View>
        <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
          <MyText
            nol={1}
            text={'Taxes'}
            fontType={2}
            style={{
              color: colors.black,
              fontSize: responsiveFont(14),
            }}
          />
          <MyText
            cur
            nol={1}
            text={`${userCart.tax}`}
            fontType={3}
            style={{
              color: colors.black,
              fontSize: responsiveFont(14),
            }}
          />
        </View>
        <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
          <MyText
            nol={1}
            text={'Delivery fee'}
            fontType={2}
            style={{
              color: colors.black,
              fontSize: responsiveFont(14),
            }}
          />
          <MyText
            nol={1}
            cur
            text={`${deliveryCharge}` || '0'}
            fontType={3}
            style={{
              color: colors.black,
              fontSize: responsiveFont(14),
            }}
          />
        </View>
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            marginTop: '2.5%',
          }}>
          <MyText text={'To Pay'} fontType={4} style={styles.toPay} />
          <MyText
            cur
            text={`${userCart.amount + userCart.tax + deliveryCharge}`}
            fontType={4}
            style={styles.toPay}
          />
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  toPay: {
    fontSize: responsiveFont(18),
    color: colors.black,
  },
  weAccept: {
    paddingHorizontal: '5%',
    borderBottomColor: colors.borderColor,
    borderBottomWidth: 1,
    paddingBottom: '2.5%',
  },
  btnCon: {
    width: '100%',
    padding: '3%',
    height: dimensions.height * 0.08,
  },
  btnTxt: {
    color: colors.white,
    fontSize: responsiveFont(18),
    textTransform: 'uppercase',
  },
});

export default CommonList;
