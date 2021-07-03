import React from 'react';
import {StyleSheet, Image, View} from 'react-native';
import Modal from 'react-native-modal';
import colors from '../../constants/colors';
import responsiveFont from '../../constants/responsiveFont';
import Button from './Button';
import MyText from './MyText';

const ErrModal = props => {
  return (
    <Modal
      backdropColor={'rgba(0,0,0,0.5)'}
      isVisible={props.visible}
      onBackdropPress={props.onClose}
      style={{flex: 1}}
      animationIn={'zoomIn'}
      animationOut={'zoomOut'}
      animationInTiming={400}
      animationOutTiming={400}>
      <View style={styles.modalCon}>
        <Image
          source={require('../../assets/icons/error.png')}
          style={styles.errImage}
        />
        <MyText text={props.errMsg} style={styles.errMsg} />
        <Button
          onPress={props.onClose}
          title={props.btnTitle}
          bg={colors.primary}
          fontType={4}
          container={styles.okBtn}
          txtStyle={styles.okTxt}
        />
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalCon: {
    alignSelf: 'center',
    width: '90%',
    backgroundColor: colors.white,
    padding: '2.5%',
    justifyContent: 'space-evenly',
    alignItems: 'center',
    borderRadius: 20,
  },
  errMsg: {
    fontSize: responsiveFont(18),
    color: colors.black,
    textAlign: 'center',
  },
  errImage: {
    width: '25%',
    height: '25%',
    resizeMode: 'contain',
  },
  okBtn: {
    width: '90%',
    padding: '5%',
    alignSelf: 'center',
  },
  okTxt: {
    color: colors.white,
    fontSize: responsiveFont(16),
  },
});

export default ErrModal;
