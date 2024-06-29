import { View, Text, FlatList } from "react-native";
import React from "react";
import FoodCard from "./FoodCard";

//This will return a list of list passed to it along with the heading (title)
export default function DisplayList({ displayList, heading }) {
  return (
    <View className="m-4">
      <Text className=" text-xl pb-3 font-pbold">{heading}</Text>
      <FlatList
        data={displayList}
        renderItem={({ item }) => <FoodCard item={item} />}
      />
    </View>
  );
}
