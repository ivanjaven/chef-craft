import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import SavesScreen from "../Screens/SavesScreen";
import FoodDetail from "../Screens/FoodDetail";

const Stack = createStackNavigator();

// Navigation that stack users saved recipes and details about it
export default function SavesNavigation() {
  return (
    <Stack.Navigator>
      <Stack.Screen // Initial screen loaded to show the saved recipe
        name="saves-screen"
        component={SavesScreen}
        options={{ headerShown: false }}
      /> 
      <Stack.Screen // Show the details of the food (Opening the FoodDetail)
        name="food-detail"
        component={FoodDetail}
        options={({ route }) => ({
          headerShown: false,
        })}
      />
    </Stack.Navigator>
  );
}
