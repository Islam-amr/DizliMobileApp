import React from 'react';
import {View, StyleSheet, Image, TouchableOpacity} from 'react-native';
import colors from '../../constants/colors';
import dimensions from '../../constants/dimensions';
import responsiveFont from '../../constants/responsiveFont';
import MyText from './MyText';
import {useDispatch, useSelector} from 'react-redux';
import * as globalModalActions from '../../redux/actions/globalModal';

const AddressHeader = props => {
  const dispatch = useDispatch();
  const userDeliveryLocation = useSelector(
    state => state.user.currentDeliverLocation?.title,
  );
  const toggleModal = () => {
    dispatch(globalModalActions.toggleModal());
  };
  return (
    <>
      <View style={{alignItems: 'center', justifyContent: 'center'}}>
        <MyText text={'Delivering to'} style={styles.deliver} />
        <TouchableOpacity
          onPress={props.noTouch ? null : toggleModal}
          activeOpacity={props.noTouch ? 1 : 0.6}
          style={{flexDirection: 'row', alignItems: 'center'}}>
          <MyText
            text={userDeliveryLocation || 'Current Location'}
            fontType={4}
            style={styles.address}
          />
          <Image
            source={require('../../assets/icons/arrowDown.png')}
            style={styles.icon}
          />
        </TouchableOpacity>
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  deliver: {
    fontSize: responsiveFont(12),
    lineHeight: 20,
    color: colors.white,
  },
  address: {
    color: colors.white,
    fontSize: responsiveFont(16),
    marginHorizontal: '7.5%',
  },
  icon: {
    width: dimensions.width * 0.03,
    height: dimensions.width * 0.03,
    resizeMode: 'contain',
  },
});

export default AddressHeader;
