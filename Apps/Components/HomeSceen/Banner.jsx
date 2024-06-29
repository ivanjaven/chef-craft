import { View, Text, SafeAreaView, ImageBackground } from "react-native";
import React, { useState, useEffect } from "react";
import { firebase } from "../../Utils/firebase";
import {
  collection,
  doc,
  getDoc,
  getDocs,
  getFirestore,
  limit,
  query,
} from "firebase/firestore";
import Loader from "./Loader";

//Banners - use to display the top recipe base on the first item on the database
export default function Banner() {
  const db = getFirestore(firebase.app); // intialize firebase firestore (getting data)

  // intialize state
  const [recipeOfTheDay, setRecipeOfTheDay] = useState(null);
  const [chef, setChefName] = useState(null);
  const [isBannerLoading, setBannerLoading] = useState(true);

  //initial code that run when this component mounts/called
  useEffect(() => {
    getItem().then((recipe) => {
      setRecipeOfTheDay(recipe);
      if (recipe) {
        //check if recipe exist then call getChefName
        getChefName(recipe.userId).then((name) => {
          setChefName(name);
          setBannerLoading(false);
        });
      }
    });
  }, []);

  //assync function to get the first date on the database
  const getItem = async () => {
    try {
      const q = query(collection(db, "RecipePosts"), limit(1));
      const querySnapshot = await getDocs(q);
      let result;
      querySnapshot.forEach((doc) => {
        result = doc.data();
      });
      return result;
    } catch (error) {
      console.error("Error getting documents: ", error);
    }
  };

  //getting the name of the chef/uploader
  const getChefName = async (id) => {
    try {
      const docRef = doc(db, "users", id);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        const firstName = docSnap.data().firstName;
        const lastName = docSnap.data().lastName;
        const chefName = firstName + " " + lastName;
        return chefName;
      } else {
        console.log("No such document!");
        return null;
      }
    } catch (error) {
      console.error("Error getting chef name: ", error);
      return null;
    }
  };

  //helper function to format the date today
  const formatDate = () => {
    const dateNow = new Date();
    return dateNow.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    });
  };

  // This will return a UI to show the banner base on the data of the recipe
  return (
    <SafeAreaView className=" m-4 mt-6 mb-2">
      <Text className=" font-pextrabold text-xl">Recipe of the day</Text>
      {isBannerLoading ? (
        <Loader /> // Execute loading state when the banner data is not yet fetched/laoded
      ) : (
        recipeOfTheDay && (
          <View className="mb-[-100px]">
            <View className=" m-2 mt-4 rounded overflow-hidden">
              <ImageBackground
                source={{ uri: recipeOfTheDay.imageUrl }}
                className=" w-full h-80 rounded-full"
              />
            </View>
            <View className="items-center">
              <View className="w-4/5 h-32 align-middle justify-center bg-white rounded-xl translate-y-[-165px] px-2 py-4 opacity-80">
                <View className="flex items-center">
                  <Text className=" font-plight text-lg">{formatDate()}</Text>
                  <Text className=" text-xl font-psemibold text-primary">
                    {recipeOfTheDay.title}
                  </Text>
                  {chef && (
                    <Text className=" font-pregular mt-1">
                      {" "}
                      Recipe by: <Text className=" font-pbold">{chef}</Text>
                    </Text>
                  )}
                </View>
              </View>
            </View>
          </View>
        )
      )}
    </SafeAreaView>
  );
}
