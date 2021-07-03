import React from 'react';
import {StyleSheet, Image, View} from 'react-native';
import Modal from 'react-native-modal';
import colors from '../../constants/colors';
import responsiveFont from '../../constants/responsiveFont';
import Button from './Button';
import MyText from './MyText';

const ReorderModal = props => {
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
        <MyText
          text={props.msg}
          style={[styles.errMsg, {fontSize: props.txtSize}]}
        />
        {/* <View>
          <Button
            onPress={props.onClose}
            title={props.btnTitleleft}
            bg={colors.white}
            fontType={4}
            container={styles.okBtn}
            txtStyle={styles.okTxt}
          />
          <Button
            onPress={props.onClose}
            title={props.btnTitle}
            bg={colors.primary}
            fontType={4}
            container={styles.okBtn}
            txtStyle={styles.okTxt}
          />
        </View> */}
        <View style={{flexDirection: 'row', marginTop: '5%'}}>
          <Button
            onPress={props.onCanel}
            title={props.leftBtn}
            bg={colors.white}
            fontType={4}
            container={[
              styles.okBtn,
              {
                marginEnd: '5%',
                borderWidth: 1,
                borderColor: colors.grey,
              },
            ]}
            txtStyle={[styles.okTxt, {color: colors.black}]}
          />
          <Button
            onPress={props.onOk}
            title={props.rightBtn}
            bg={colors.primary}
            fontType={4}
            container={styles.okBtn}
            txtStyle={styles.okTxt}
          />
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalCon: {
    alignSelf: 'center',
    width: '90%',
    backgroundColor: colors.white,
    padding: '5%',
    justifyContent: 'space-around',
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
    flex: 1,
    padding: '2.5%',
    alignSelf: 'center',
  },
  okTxt: {
    color: colors.white,
    fontSize: responsiveFont(16),
  },
});

export default ReorderModal;
