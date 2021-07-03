import React, {
  useLayoutEffect,
  useEffect,
  useCallback,
  useReducer,
  useRef,
  useState,
} from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  PermissionsAndroid,
  Image,
} from 'react-native';
import MenuIcon from '../components/ui/MenuIcon';
import MyText from '../components/ui/MyText';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import SearchInput from '../components/ui/SearchInput';
import commonStyles from '../constants/commonStyles';
import responsiveFont from '../constants/responsiveFont';
import colors from '../constants/colors';
import MapView, {Marker} from 'react-native-maps';
import {useDispatch, useSelector} from 'react-redux';
import Geolocation from 'react-native-geolocation-service';
import ActionSheet from 'react-native-actions-sheet';
import * as userActions from '../redux/actions/user';
// App Api
import API from '../redux/BaseURL';

// utils import
import Loading from '../utils/Loading';
import dimensions from '../constants/dimensions';

//map inital zoom
const latitudeDelta = 0.015;
const longitudeDelta = 0.015;

const UPDATE_MAPS_STATES = 'UPDATE_MAPS_STATES';
const saveLocationReducer = (state, action) => {
  switch (action.type) {
    case UPDATE_MAPS_STATES:
      return {
        ...state,
        [action.key]: action.payload,
      };
    default:
      return state;
  }
};

const ADDRESS_UPDATE = 'ADDRESS_UPDATE';
const addressReducer = (state, action) => {
  if (action.type === ADDRESS_UPDATE) {
    const updatedInputValue = {
      ...state.inputValues,
      [action.input]: action.payload,
    }; // update inputs individullay
    const updatedinputValidities = {
      ...state.inputValidities,
      [action.input]: action.isValid,
    }; // update Validity individullay
    let updatedFormisValid = true;
    for (const key in updatedinputValidities) {
      updatedFormisValid = updatedFormisValid && updatedinputValidities[key];
    } // update form is valid
    return {
      formisValid: updatedFormisValid,
      inputValues: updatedInputValue,
      inputValidities: updatedinputValidities,
    }; // update all states
  }
};

const SaveLocation = ({navigation, route}) => {
  const dispatch = useDispatch();
  const editAddress = route.params?.editedAddress;
  const actionSheetRef = useRef(); // to control map modal
  const [searchResult, setSearchResult] = useState('');
  const [restaurants, setRestaurants] = useState(true);
  const [location, setLocation] = useState(null);
  const [loading, setIsLoading] = useState(false);
  const mapRef = useRef(); // to control map
  const [saveLocationStates, disptachSaveLocation] = useReducer(
    saveLocationReducer,
    {
      originLatitude: '',
      originLongitude: '',
      originError: '',
      mapsLocationName: '',
      mapsLocationNameError: null,
      mapsLocationNameSearchError: null,
    },
  );

  const [addressStates, dispatchAddress] = useReducer(addressReducer, {
    inputValues: {
      title: editAddress ? editAddress.title : '',
      doorNo: editAddress ? editAddress.door_no : '',
      landmark: editAddress ? editAddress.landmark : '',
    },
    inputValidities: {
      title: editAddress ? true : false,
      doorNo: editAddress ? true : false,
      landmark: editAddress ? true : false,
    },
    formisValid: false,
  });

  const addressUpdate = (key, value, isValid) => {
    dispatchAddress({
      type: ADDRESS_UPDATE,
      input: key,
      payload: value,
      isValid: isValid,
    });
  };

  // map states dispatcher
  const updateMapsState = (key, value) => {
    disptachSaveLocation({
      type: UPDATE_MAPS_STATES,
      key: key,
      payload: value,
    });
  };

  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => null,
    });
  }, []);

  // to access current location at the beginning of the component cycle
  useEffect(() => {
    if (editAddress) {
      updateMapsState('originLatitude', editAddress.latitude);
      updateMapsState('originLongitude', editAddress.longitude);
      return;
    }
    async function requestLocationPermission() {
      try {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
          {
            title: 'Dizli',
            message:
              'Dizli uses location service for delivery ' +
              'and only while you are using the application',
          },
        );
        if (granted === PermissionsAndroid.RESULTS.GRANTED) {
          Geolocation.getCurrentPosition(
            async ({coords}) => {
              updateMapsState('originLatitude', coords.latitude);
              updateMapsState('originLongitude', coords.longitude);
            },
            error => {
              updateMapsState('originError', error.message);
            },
            {enableHighAccuracy: true, timeout: 15000, maximumAge: 10000},
          );
        } else {
          console.log('location permission denied');
        }
      } catch (err) {
        console.warn(err);
      }
    }
    requestLocationPermission();
  }, []);

  const convertLocationName = async searchProps => {
    let searchTxt = searchProps.nativeEvent?.text;
    updateMapsState('mapsLocationNameSearchError', null);
    try {
      const response = await API.post(
        `customer/v1/map/geocoding/lookup?address=${searchTxt}`,
      );
      if (response.data?.addresses.length === 0) {
        throw error;
      }
      const latitude = await response.data?.addresses[0]?.latitude;
      const longitude = await response.data?.addresses[0]?.longitude;
      updateMapsState('originLatitude', latitude);
      updateMapsState('originLongitude', longitude);
      mapRef.current.animateToRegion({
        latitude,
        longitude,
        latitudeDelta: latitudeDelta,
        longitudeDelta: longitudeDelta,
      });
    } catch (e) {
      updateMapsState('mapsLocationNameSearchError', 'No available location');
    }
  };

  const onChangeRegion = region => {
    updateMapsState('mapsLocationNameSearchError', null);
    updateMapsState('originLatitude', region.latitude);
    updateMapsState('originLongitude', region.longitude);
  };

  const getLocationName = async () => {
    updateMapsState('mapsLocationName', '');
    updateMapsState('mapsLocationNameError', null);
    try {
      const response = await API.get(
        `customer/v1/map/geocoding/reverse-lookup?latitude=${saveLocationStates.originLatitude}&longitude=${saveLocationStates.originLongitude}`,
      );
      const resData = await response.data.address.place;
      updateMapsState('mapsLocationName', resData);
    } catch (e) {
      updateMapsState('mapsLocationNameError', e.message);

      console.log(e.message);
    }
  };

  useEffect(() => {
    if (
      !saveLocationStates.originLongitude ||
      !saveLocationStates.originLatitude
    ) {
      return;
    }
    const subscribe = getLocationName();

    return subscribe;
  }, [saveLocationStates.originLatitude, saveLocationStates.originLongitude]);

  if (
    !saveLocationStates.originLatitude &&
    !saveLocationStates.originLongitude
  ) {
    return (
      <View style={commonStyles.mainView2}>
        <Loading color={colors.primary} size={26} />
      </View>
    );
  }

  const addAddressHandler = async () => {
    setIsLoading(true);
    try {
      await dispatch(
        userActions.addAddress(
          addressStates.inputValues.title,
          saveLocationStates.mapsLocationName,
          saveLocationStates.originLatitude,
          saveLocationStates.originLongitude,
          addressStates.inputValues.doorNo,
          addressStates.inputValues.landmark,
          editAddress ? true : false,
          editAddress ? editAddress.id : null,
        ),
      );
      actionSheetRef.current?.setModalVisible();
      navigation.goBack();
    } catch (e) {
      console.log(e);
    }
    setIsLoading(false);
  };

  return (
    <>
      <View style={commonStyles.mainView2}>
        <View
          style={{flex: 0.75, justifyContent: 'center', alignItems: 'center'}}>
          <MapView
            ref={mapRef}
            style={commonStyles.fullWH}
            initialRegion={{
              latitude: parseFloat(saveLocationStates.originLatitude),
              longitude: parseFloat(saveLocationStates.originLongitude),
              latitudeDelta,
              longitudeDelta,
            }}
            onRegionChangeComplete={onChangeRegion}
          />
          <View style={styles.midMapCon}>
            <Image
              style={[{resizeMode: 'contain'}, commonStyles.fullWH]}
              source={require('../assets/icons/location.png')}
            />
          </View>
          <SearchInput
            absolute
            container={styles.serachCon}
            placeholder={'Enter address'}
            value={searchResult}
            onChangeText={text => setSearchResult(text)}
            onSubmitEditing={convertLocationName}
          />
        </View>
        <View style={{flex: 0.25}}>
          <View style={styles.actionCon}>
            <View
              style={{
                flex: 1,
                justifyContent: 'center',
              }}>
              <MyText
                style={{
                  // textAlign: location ? 'left' : 'center',
                  fontSize: responsiveFont(16),
                }}
                fontType={3}
                text={
                  saveLocationStates.mapsLocationNameError ||
                  saveLocationStates.mapsLocationName ||
                  'Detecting location...'
                }
                nol={2}
              />
            </View>
            <View style={{flex: 1}}>
              <Button
                onPress={() => actionSheetRef.current?.setModalVisible()}
                disabled={!saveLocationStates.mapsLocationName}
                title={'Save Location'}
                bg={
                  saveLocationStates.mapsLocationName
                    ? colors.primary
                    : colors.grey
                }
                fontType={4}
                container={styles.dilverBtn}
                txtStyle={styles.dilverTxt}
                fontType={3}
              />
            </View>
          </View>
        </View>
      </View>
      <ActionSheet ref={actionSheetRef} containerStyle={styles.modalCon}>
        <View
          style={{
            paddingHorizontal: '7.5%',
            marginTop: '5%',
            flexDirection: 'row-reverse',
          }}>
          <TouchableOpacity
            onPress={() => actionSheetRef.current?.setModalVisible()}>
            <Image
              source={require('../assets/icons/xMark.png')}
              style={styles.xImg}
            />
          </TouchableOpacity>
        </View>
        <View style={{paddingHorizontal: '5%', marginBottom: '5%'}}>
          <View style={{marginBottom: '5%'}}>
            <Input
              id={'title'}
              label={'Title'}
              required
              notNum
              placeholder={'Please enter address title'}
              errMsg={'Title can only contain letters'}
              onInputChangeHandler={addressUpdate}
              initalValue={addressStates.inputValues.title}
              initalVaidity={addressStates.inputValidities.title}
            />
            <Input
              id={'doorNo'}
              label={'Door No.'}
              required
              number
              keyboardType="phone-pad"
              placeholder={'Please enter door number'}
              errMsg={'Door number is required'}
              onInputChangeHandler={addressUpdate}
              initalValue={addressStates.inputValues.doorNo}
              initalVaidity={addressStates.inputValidities.doorNo}
            />
            <Input
              id={'landmark'}
              label={'Landmark'}
              required
              min={2}
              placeholder={'Please enter landmark'}
              errMsg={'Landmark is required'}
              onInputChangeHandler={addressUpdate}
              initalValue={addressStates.inputValues.landmark}
              initalVaidity={addressStates.inputValidities.landmark}
            />
          </View>
          <Button
            onPress={addAddressHandler}
            title={editAddress ? 'Edit Address' : 'Add Address'}
            isLoading={loading}
            disabled={!addressStates.formisValid}
            bg={colors.primary}
            fontType={4}
            container={styles.dilverBtn}
            txtStyle={styles.dilverTxt}
            fontType={3}
            loadingColor={colors.white}
            loadingSize={34}
          />
        </View>
      </ActionSheet>
    </>
  );
};

const styles = StyleSheet.create({
  actionCon: {
    flex: 2.25,
    justifyContent: 'space-evenly',
    paddingHorizontal: '5%',
  },
  dilverBtn: {
    borderColor: colors.white,
    borderWidth: 1,
    paddingVertical: '4%',
    paddingHorizontal: '5%',
    height: dimensions.height * 0.08,
  },
  dilverTxt: {
    color: colors.white,
    textTransform: 'uppercase',
    fontSize: responsiveFont(16),
  },
  serachCon: {
    width: '95%',
    top: '2.5%',
  },
  markerImage: {
    resizeMode: 'contain',
    width: dimensions.width * 0.075,
    height: dimensions.width * 0.075,
  },
  midMapCon: {
    width: '12.5%',
    height: '12.5%',
    position: 'absolute',
  },
  serachCon: {
    width: '95%',
    top: '2.5%',
  },
  modalCon: {
    width: dimensions.width,
    backgroundColor: colors.white,
    borderTopRightRadius: 20,
    borderTopLeftRadius: 20,
  },
  xImg: {
    width: dimensions.width * 0.05,
    height: dimensions.width * 0.05,
    resizeMode: 'contain',
  },
});

export default SaveLocation;
