// package import
import React, {
  useState,
  useEffect,
  useReducer,
  useRef,
  useCallback,
} from 'react';
import {
  View,
  Image,
  TouchableWithoutFeedback,
  TouchableOpacity,
  StyleSheet,
  Keyboard,
  PermissionsAndroid,
} from 'react-native';
import MapView, {Marker} from 'react-native-maps';
import {useDispatch, useSelector} from 'react-redux';
import Geolocation from 'react-native-geolocation-service';

// redux actions
import * as serviceableMerchants from '../redux/actions/serviceableMerchants';

// ui components import
import Button from '../components/ui/Button';
import MyText from '../components/ui/MyText';
import SearchInput from '../components/ui/SearchInput';

// constants import
import colors from '../constants/colors';
import commonStyles from '../constants/commonStyles';
import responsiveFont from '../constants/responsiveFont';
import dimensions from '../constants/dimensions';

// App Api
import API from '../redux/BaseURL';

// utils import
import Loading from '../utils/Loading';

//map inital zoom
const latitudeDelta = 0.015;
const longitudeDelta = 0.015;

const UPDATE_MAPS_STATES = 'UPDATE_MAPS_STATES'; // action constat variable

// map states reducer
const mapRedcuer = (state, action) => {
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

const LocateAddressScreen = ({onClose}) => {
  const [searchResult, setSearchResult] = useState('');
  const [restaurants, setRestaurants] = useState(true);
  const [location, setLocation] = useState(null);
  const mapRef = useRef(); // to control map
  const disptach = useDispatch(); // to dispatch redux actions

  // to specify nearby restuarnt or groceries according user opinion
  let restaurantsOrGroceries = restaurants
    ? useSelector(state => state.serviceableMerchants.restaurants)
    : useSelector(state => state.serviceableMerchants.groceries);

  // maps inital states
  const [mapStates, dispatchMapStates] = useReducer(mapRedcuer, {
    originLatitude: '',
    originLongitude: '',
    originLoading: '',
    originError: '',
    mapsLocationName: '',
    mapsLocationNameError: null,
    mapsLocationNameSearchError: null,
  });

  // map states dispatcher
  const updateMapsState = (key, value) => {
    dispatchMapStates({
      type: UPDATE_MAPS_STATES,
      key: key,
      payload: value,
    });
  };

  // to access current location at the beginning of the component cycle
  useEffect(() => {
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

  // to get locatin name whenever coords changes
  useEffect(() => {
    if (!mapStates.originLongitude || !mapStates.originLatitude) {
      return;
    }
    const subscribe = getLocationName();

    return subscribe;
  }, [mapStates.originLatitude, mapStates.originLongitude]);

  // to disptach redux servieable merchent action which is responible for fetching nearby restautrants and gerocry
  useEffect(() => {
    if (
      !mapStates.originLongitude ||
      !mapStates.originLatitude ||
      !mapStates.mapsLocationName
    ) {
      return;
    }

    disptach(
      serviceableMerchants.fetchServiceableMerchants(
        mapStates.originLatitude,
        mapStates.originLongitude,
        mapStates.mapsLocationName,
      ),
    );
  }, [mapStates.mapsLocationName]);

  // to get address name by log and lat
  const getLocationName = async () => {
    updateMapsState('mapsLocationName', '');
    updateMapsState('mapsLocationNameError', null);
    try {
      const response = await API.get(
        `customer/v1/map/geocoding/reverse-lookup?latitude=${mapStates.originLatitude}&longitude=${mapStates.originLongitude}`,
      );
      const resData = await response.data.address.place;
      updateMapsState('mapsLocationName', resData);
    } catch (e) {
      updateMapsState('mapsLocationNameError', e.message);

      console.log(e.message);
    }
  };

  // to detect map movment and get location
  const onChangeRegion = region => {
    updateMapsState('mapsLocationNameSearchError', null);
    updateMapsState('originLatitude', region.latitude);
    updateMapsState('originLongitude', region.longitude);
  };

  // to swap between restaurants and Groceries
  const onSwap = useCallback(
    type => {
      restaurants === type ? null : setRestaurants(prev => !prev);
    },
    [restaurants],
  );

  // to convert location name to latitude and longitude
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

  // to handle current location loading
  if (!mapStates.originLatitude && !mapStates.originLongitude) {
    return (
      <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
        <Loading color={colors.primary} size={26} />
      </View>
    );
  }

  if (
    !mapStates.originLatitude &&
    !mapStates.originLongitude &&
    mapStates.originError
  ) {
    return (
      <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
        <MyText text={'error'} />
      </View>
    );
  }

  return (
    <TouchableWithoutFeedback
      onPress={() => Keyboard.dismiss()}
      style={styles.mainView}>
      <View style={styles.mainView}>
        <View style={styles.headerCon}>
          <MyText
            onPress={() => onSwap(true)}
            style={restaurants ? styles.activeTextTab : styles.textTab}
            fontType={3}
            text={'Restaurants'}
          />
          <MyText
            onPress={() => onSwap(false)}
            style={restaurants ? styles.textTab : styles.activeTextTab}
            fontType={3}
            text={'Groceries'}
          />
          <TouchableOpacity
            activeOpacity={0.6}
            style={styles.xCon}
            onPress={() =>
              onClose({
                latitude: mapStates.originLatitude,
                longitude: mapStates.originLongitude,
                place: mapStates.mapsLocationName,
              })
            }>
            <Image
              source={require('../assets/icons/xMark.png')}
              style={styles.xImg}
            />
          </TouchableOpacity>
        </View>
        <View style={[commonStyles.centeredView, {flex: 6}]}>
          <MapView
            ref={mapRef}
            style={commonStyles.fullWH}
            initialRegion={{
              latitude: parseFloat(mapStates.originLatitude),
              longitude: parseFloat(mapStates.originLongitude),
              latitudeDelta,
              longitudeDelta,
            }}
            onRegionChangeComplete={onChangeRegion}>
            {restaurantsOrGroceries.map((item, index) => {
              return (
                <Marker
                  key={index}
                  coordinate={{
                    latitude: item.latitude,
                    longitude: item.longitude,
                  }}>
                  <Image
                    style={styles.markerImage}
                    source={
                      restaurants
                        ? require(`../assets/icons/restaurant.png`)
                        : require(`../assets/icons/grocery.png`)
                    }
                  />
                </Marker>
              );
            })}
          </MapView>
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
        <View style={styles.actionCon}>
          <View
            style={{
              flex: 0.8,
              justifyContent: 'center',
            }}>
            <MyText
              style={{
                textAlign: location ? 'left' : 'center',
                fontSize: responsiveFont(16),
              }}
              fontType={3}
              text={
                mapStates.mapsLocationNameError ||
                mapStates.mapsLocationName ||
                'Detecting location...'
              }
              nol={2}
            />
          </View>
          <View style={{flex: 1}}>
            <Button
              onPress={() =>
                onClose({
                  latitude: mapStates.originLatitude,
                  longitude: mapStates.originLongitude,
                  place: mapStates.mapsLocationName,
                })
              }
              disabled={!mapStates.mapsLocationName}
              title={'Deliver here'}
              bg={mapStates.mapsLocationName ? colors.primary : colors.grey}
              fontType={3}
              container={styles.dilverBtn}
              txtStyle={styles.dilverTxt}
              fontType={3}
              icon={require('../assets/icons/rightArrow.png')}
              iconColor={colors.white}
            />
          </View>
        </View>
      </View>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  mainView: {
    flex: 1,
    backgroundColor: colors.white,
  },
  headerCon: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    alignItems: 'center',
    paddingHorizontal: '10%',
  },
  textTab: {
    fontSize: responsiveFont(18),
    color: colors.grey,
  },
  activeTextTab: {
    fontSize: responsiveFont(18),
    color: colors.black,
    borderBottomWidth: 2,
    borderBottomColor: colors.primary,
    paddingVertical: '1.25%',
  },
  xCon: {
    width: '10%',
    height: '30%',
    top: '20%',
    right: '5%',
    position: 'absolute',
    justifyContent: 'center',
    alignItems: 'center',
  },
  xImg: {
    width: '50%',
    height: '50%',
    resizeMode: 'contain',
  },
  midMapCon: {
    width: '12.5%',
    height: '12.5%',
    position: 'absolute',
  },
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
});

export default LocateAddressScreen;
