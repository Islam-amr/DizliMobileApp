import {useState, useEffect} from 'react';
import {PermissionsAndroid} from 'react-native';
// import Geolocation from "@react-native-community/geolocation";
import Geolocation from 'react-native-geolocation-service';

export default function useCurrentLocation() {
  const [region, setRegion] = useState();
  const [hasCurrentLocation, setHasCurrentLocation] = useState(false);
  const [currentLocationError, setCurrentLocationError] = useState(null);

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
          // console.log("You can use the location");
          Geolocation.getCurrentPosition(
            async ({coords}) => {
              // setRegion({
              //   latitude: coords.latitude,
              //   longitude: coords.longitude,
              //   latitudeDelta: 0.01,
              //   longitudeDelta: 0.01,
              // });
              setHasCurrentLocation(true);
              setRegion(coords);
            },
            error => {
              // See error code charts below.
              console.log(error.code, error.message);
              setCurrentLocationError(error.message);
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

  return {
    region,
    hasCurrentLocation,
    currentLocationError,
  };
}
