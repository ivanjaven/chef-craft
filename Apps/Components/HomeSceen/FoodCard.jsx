import { View, Text, TouchableOpacity, Image } from "react-native";
import React from "react";
import { useNavigation } from "@react-navigation/native";

// Use for rendering recipe/food cards
export default function FoodCard({ item }) {
  const navigation = useNavigation();

  // Helper class to format the upload date
  const formatDate = (timestamp) => {
    const dateObject = new Date(timestamp.toDate());
    return dateObject.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    });
  };

  // Use to get the average of all the rating of a certain recipe
  const getRatingAverage = () => {
    if (item.rating && Object.keys(item.rating).length > 0) {
      const ratings = Object.values(item.rating); // Extract ratings from the object
      const totalRatings = ratings.reduce((acc, curr) => acc + curr, 0); // Sum up all ratings
      const averageRating = totalRatings / ratings.length; // Calculate the average
      return averageRating.toFixed(2); // Return the average rounded to 2 decimal places
    } else {
      return 0; // Return 0 if there are no ratings or if item.rating is null/undefined
    }
  };

  // This will return a clickable UI that will show details of the food
  return (
    <TouchableOpacity
      className=" flex flex-row my-[5px] bg-bgColor py-6 px-4 rounded-3xl w-full h-40 mt-2"
      onPress={() =>
        navigation.push("food-detail", {
          item: item,
        })
      }
    >
      <Image
        source={{ uri: item?.imageUrl }}
        className="w-28 h-28 rounded-full mr-3"
      />

      <View className="flex gap-0 mt-1">
        <View className="flex flex-row">
          <Text className="  text-primary mr-2 font-psemibold text-[14px]">
            {item.ingredients.length} ingredients
          </Text>
          <Text className=" font-pregular text-[14px] text-primary">
            - {formatDate(item.createdAt)}
          </Text>
        </View>

        <Text className="text-xl font-pextrabold pt-2">{item.title}</Text>
        <View className="flex flex-row pt-3">
          <Text className="text-[16px] font-plight mr-1">
            {getRatingAverage() < 1 ? "No ratings Yet" : getRatingAverage()}
          </Text>
          <Image
            source={require("./../../../assets/images/star.png")}
            className="h-4 w-4 translate-y-[1px]"
          />
        </View>
      </View>
    </TouchableOpacity>
  );
}
