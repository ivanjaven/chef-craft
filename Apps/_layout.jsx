import { View, Text } from "react-native";
import React from "react";
import { Slot, Stack } from "expo-router";
import { useFonts } from "expo-font";

const RootLayout = () => {
  const [fontsLoaded, error] = useFonts({
    "Poppins-Black": require("../assets/fonts/Poppins-Black.ttf"),
  });
  return <></>;
};
