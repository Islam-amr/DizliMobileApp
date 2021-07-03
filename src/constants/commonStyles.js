import {StyleSheet} from 'react-native';
import colors from './colors';

export default StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  fullWH: {
    width: '100%',
    height: '100%',
  },
  mainView: {
    flex: 1,
    backgroundColor: colors.backgroundColor,
  },
  mainView2: {
    flex: 1,
    backgroundColor: colors.white,
  },
  globalModal: {
    backgroundColor: 'transparent',
    shadowColor: 'transparent',
    shadowOpacity: 1,
    elevation: 0,
    borderRadius: 50,
  },
});
