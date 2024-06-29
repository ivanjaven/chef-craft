import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import Home from "../Screens/Home";
import AddRecipe from "../Screens/AddRecipe";
import FoodDetail from "../Screens/FoodDetail";

const Stack = createStackNavigator();

// Home Navigation that stack multiple screen for smoother app use
export default function HomeNavigation() {
  return (
    <Stack.Navigator>
      <Stack.Screen // Screen for initial home screen
        name="home-nav"
        component={Home}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="add-recipe" // Screen for adding recipe (chef side)
        component={AddRecipe}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="food-detail" // Screen for showing the details of the food
        component={FoodDetail}
        options={({ route }) => ({
          headerShown: false,
        })}
      />
    </Stack.Navigator>
  );
}
