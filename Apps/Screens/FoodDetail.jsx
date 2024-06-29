import { View, Text, Image, TouchableOpacity, ScrollView } from "react-native";
import { firebase } from "../Utils/firebase";
import { getDoc, updateDoc, arrayRemove, arrayUnion } from "firebase/firestore";
import React, { useEffect, useId, useState } from "react";
import { useRoute } from "@react-navigation/native";

export default function FoodDetail() {
  const currentUser = firebase.auth().currentUser.uid; //get current user id
  const { params } = useRoute(); // get the parameter passed by the previous page

  // set all the use state
  const [services, setService] = useState([]);
  const [star, setStar] = useState(0);
  const [isSaved, setIsSaved] = useState(false);
  const item = params.item;

  // function that will trigger when item changes
  useEffect(() => {
    setService(item);
    checkIsSaved();
  }, [item]);

  //initial useEffect or function that will run when FoodDetail is called
  useEffect(() => {
    setStar(
      item.rating && item.rating[currentUser] ? item.rating[currentUser] : 0
    );
  }, []);

  // Functions to handle actions based on its names
  const handleStarPress = (rating) => {
    setStar(rating); // Update the star count based on the selected rating
  };

  const handleSubmitRating = async () => {
    try {
      await firebase
        .firestore()
        .collection("RecipePosts")
        .doc(services.id)
        .update({
          [`rating.${currentUser}`]: star, // Update the rating field with the user's ID and rating
        });
      alert("Rating submitted successfully!");
    } catch (error) {
      console.error("Error submitting rating:", error);
    }
  };

  const handleBookmarkToggle = async () => {
    try {
      const userRef = firebase.firestore().collection("users").doc(currentUser);
      if (isSaved) {
        // Remove the recipe from saved recipes
        await updateDoc(userRef, {
          saves: arrayRemove(item.id),
        });
      } else {
        // Add the recipe to saved recipes
        await updateDoc(userRef, {
          saves: arrayUnion(item.id),
        });
      }
      setIsSaved(!isSaved); // Toggle the saved state
    } catch (error) {
      console.error("Error toggling bookmark:", error);
    }
  };

  // Use for rendering the start in rating
  const renderStar = (rating) => {
    const coloredStars = [];
    const blankStars = [];

    // Render colored stars based on the rating
    for (let i = 1; i <= rating; i++) {
      coloredStars.push(
        <TouchableOpacity key={i} onPress={() => handleStarPress(i)}>
          <Image
            source={require("./../../assets/images/star.png")}
            className="h-6 w-6"
          />
        </TouchableOpacity>
      );
    }

    // Render blank stars for the remaining
    for (let i = rating + 1; i <= 5; i++) {
      blankStars.push(
        <TouchableOpacity key={i} onPress={() => handleStarPress(i)}>
          <Image
            source={require("./../../assets/images/star-blank.png")}
            className="h-6 w-6"
          />
        </TouchableOpacity>
      );
    }

    return (
      <View className="flex flex-row gap-3">
        {coloredStars}
        {blankStars}
      </View>
    );
  };

  // Check if the user save the current recipe in the database
  const checkIsSaved = async () => {
    const userRef = firebase.firestore().collection("users").doc(currentUser);
    const userDoc = await getDoc(userRef);
    const savedRecipes = userDoc.data().saves || [];
    setIsSaved(savedRecipes.includes(item.id));
  };

  // This will return the whole UI to display food details in screen
  return (
    <ScrollView className="bg-white">
      {/* Header */}
      <View className="flex flex-row">
        <View className="m-10 mt-20 mb-5">
          <Text className=" text-xl font-pextrabold mb-2">
            🍗 {services.ingredients && services.ingredients.length}{" "}
            <Text className=" font-plight"> ingredients</Text>
          </Text>
          <Text className="text-xl font-pextrabold mb-1">
            🍳 {services.steps && services.steps.length}{" "}
            <Text className="font-plight"> steps</Text>
          </Text>
        </View>

        {/* Bookmark */}
        <View className=" mt-24 mb-5 ml-3 flex flex-row">
          <Image
            source={require("./../../assets/images/arrow.gif")}
            className="h-8 w-8"
          />
          <View className="flex">
            <TouchableOpacity onPress={handleBookmarkToggle}>
              <Image
                source={
                  isSaved
                    ? require("./../../assets/images/bookmark.png")
                    : require("./../../assets/images/bookmark-blank.png")
                }
                className="h-10 w-10 ml-2 translate-y-[-24px]"
              />
            </TouchableOpacity>
            <Text className=" text-lg  translate-y-[-22px] ml-1 font-pbold">
              Save
            </Text>
          </View>
        </View>
      </View>

      {/* Image display with title*/}
      <View className=" flex flex-row">
        <View className="bg-white z-50 px-2 py-1 rounded-full translate-y-2">
          <Image
            source={{ uri: services.imageUrl }}
            className=" h-36 w-36 mb-1 rounded-full ml-6 mt-1"
          />
        </View>
        <View className=" bg-primaryBrown w-full rounded-full translate-x-[-120px] translate-y-1 flex justify-center">
          <View className="translate-x-32 ml-4 w-3/6 pr-12">
            <Text className="text-2xl font-pbold mb-2">{services.title}</Text>
          </View>
        </View>
      </View>

      {/* Ingredients List */}
      <View className="mt-10 mx-10">
        <Text className="text-xl font-pbold mb-2">Ingredients:</Text>
        <View className="flex flex-row flex-wrap ">
          {services.ingredients &&
            services.ingredients.map((ingredient, index) => (
              <View
                key={index}
                className="flex flex-row items-center mt-3 mx-1"
              >
                <View className="bg-secondaryBrown rounded-full p-3 px-5 max-w-100">
                  <Text className=" font-psemibold text-sm">{ingredient}</Text>
                </View>
              </View>
            ))}
        </View>
      </View>

      {/* Steps List */}
      <View className="mt-8 mx-10">
        <Text className=" text-xl font-pbold">Steps:</Text>
        {services.steps &&
          services.steps.map((step, index) => (
            <Text
              key={index}
              className=" pt-4 text-[17px] text tracking-wide leading-5 font-pregular"
            >
              {index + 1}. {step}
            </Text>
          ))}
      </View>

      {/* Rating */}
      <View className="mt-10 mx-10">
        <Text className="text-lg font-semibold mb-4 font-pregular">
          Give this recipe a rating
        </Text>
        <View className=" flex flex-row mb-20">
          <View className=" flex flex-row gap-3">{renderStar(star)}</View>
          <TouchableOpacity
            className="bg-secondaryBrown ml-4 p-3 px-2 rounded-full "
            onPress={handleSubmitRating}
          >
            <Text className="text-[14px] font-pregular px-4">Submit</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
}
