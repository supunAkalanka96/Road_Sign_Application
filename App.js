import React, { useState, useEffect, useRef } from "react";
import { StyleSheet, Text, View, Button, Alert } from "react-native";
import * as Location from "expo-location";
import axios from "axios";
import { locationData } from "./locationData";
import { Dropdown } from "react-native-element-dropdown";

export default function App()
{
  const [locationDescription, setLocationDescription] = useState("ABCDEFG");
  const [location, setLocation] = useState();
  const [errorMsg, setErrorMsg] = useState(null);
  const [processing, setProcessing] = useState(false);

  const getLocation = async () =>
  {
    setProcessing(true);
    try
    {
      const { status } = await Location.requestForegroundPermissionsAsync();

      if (status !== "granted")
      {
        Alert.alert(
          "Permission Denied",
          "Location permission is required to get your location."
        );
        return;
      }

      const locationData = await Location.getCurrentPositionAsync({});
      const { latitude, longitude } = locationData.coords;

      // Replace 'YOUR_BACKEND_URL' with your actual backend URL
      const apiUrl =
        "https://9253-2402-4000-b280-6332-5931-8d31-da9b-fd8e.ngrok-free.app/location/save";

      const requestBody = {
        latitude: latitude,
        longitude: longitude,
        description: locationDescription,
      };

      // Send location data to the backend
      await axios
        .post(apiUrl, requestBody)
        .then((res) =>
        {
          console.log("RES::>>>", res);
          setProcessing(false);
        })
        .catch((err) =>
        {
          console.error(err);
          setProcessing(false);
        });

      // Alert.alert('Location Sent', 'Location data sent to the backend successfully.');

      setLocation(locationData);
    } catch (error)
    {
      setProcessing(false);
      console.error("Error getting location:", error);
      Alert.alert("Error", "An error occurred while getting your location.");
    }
  };

  console.log("HGHAFDHA", locationDescription);
  return (
    <View style={styles.container}>
      <Text>Current Location:</Text>
      {errorMsg ? <Text>{errorMsg}</Text> : null}
      {location ? (
        <Text>
          Latitude: {location.coords.latitude}, Longitude:{" "}
          {location.coords.longitude}
        </Text>
      ) : null}

      <Text style={{ marginVertical: 20 }}>Select a Description:</Text>
      <Dropdown
        style={{ width: 250 }}
        placeholderStyle={styles.placeholderStyle}
        selectedTextStyle={{ color: "red", fontSize: 20 }}
        inputSearchStyle={styles.inputSearchStyle}
        itemContainerStyle={{ marginVertical: 5 }}
        data={locationData}
        search
        maxHeight={300}
        labelField="label"
        valueField="value"
        placeholder="Select item"
        searchPlaceholder="Search..."
        value={locationDescription}
        onChange={(item) =>
        {
          setLocationDescription(item?.value);
        }}
        renderItem={(item) =>
        {
          return <Text style={styles.textItem}>{item.label}</Text>;
        }}
      />

      <View style={{ marginTop: 40 }}>
        <Button
          title="Send Location"
          onPress={getLocation}
          disabled={processing}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
});
