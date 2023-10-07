import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, Button } from 'react-native';
import * as Location from 'expo-location';
import axios from 'axios';

export default function App()
{
  const [location, setLocation] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);

  useEffect(() =>
  {
    (async () =>
    {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted')
      {
        setErrorMsg('Permission to access location was denied');
        return;
      }

      let location = await Location.getCurrentPositionAsync({});
      setLocation(location);
    })();
  }, []);

  const sendLocationDataToServer = async (locationData) =>
  {
    try
    {
      const response = await axios.post(' https://b3c6-2402-4000-b280-6332-8845-de9b-6c81-ac47.ngrok-free.app /location/save', locationData);
      console.log('Location data sent successfully:', response.data);
    } catch (error)
    {
      console.error('Error sending location data:', error);
    }
  };

  return (
    <View style={styles.container}>
      <Text>Current Location:</Text>
      {errorMsg ? <Text>{errorMsg}</Text> : null}
      {location ? (
        <Text>
          Latitude: {location.coords.latitude}, Longitude: {location.coords.longitude}
        </Text>
      ) : null}
      <Button
        title="Get Location"
        onPress={() =>
        {
          setLocation(null);
          setErrorMsg(null);
          (async () =>
          {
            let { status } = await Location.requestForegroundPermissionsAsync();
            if (status !== 'granted')
            {
              setErrorMsg('Permission to access location was denied');
              return;
            }

            let location = await Location.getCurrentPositionAsync({});
            setLocation(location);

            if (location)
            {
              const locationData = {
                latitude: location.coords.latitude,
                longitude: location.coords.longitude,
              };
              sendLocationDataToServer(locationData);
            }
          })();
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
