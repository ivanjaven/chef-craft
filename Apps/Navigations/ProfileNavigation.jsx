import { View, Text } from "react-native";
import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import ServiceDetail from "../Screens/FoodDetail";
import ProfileScreen from "../Screens/ProfileScreen";

const Stack = createStackNavigator();

// Profile Screen
export default function ProfileNavigation() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="profile-screen"
        component={ProfileScreen}
        options={{ headerShown: false }}
      />
    </Stack.Navigator>
  );
}
