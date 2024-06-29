import { View, ScrollView, Text, RefreshControl } from "react-native";
import React, { useState, useEffect } from "react";
import { firebase } from "../Utils/firebase";
import {
  getDocs,
  collection,
  getFirestore,
  doc,
  getDoc,
} from "firebase/firestore";
import Banner from "../Components/HomeSceen/Banner";
import DisplayList from "../Components/HomeSceen/DisplayList";
import { TouchableOpacity } from "react-native-gesture-handler";
import { Entypo } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import Header from "../Components/HomeSceen/Header";

export default function Home() {
  const db = getFirestore(firebase.app);
  const [recipes, setRecipes] = useState([]);
  const [refreshing, setRefreshing] = useState(false);
  const [isChef, setIsChef] = useState(false);
  const navigation = useNavigation();

  useEffect(() => {
    fetchData();
    getUserType();
  }, []);

  // Pull to referesh feature to fetch the data again in the database
  const onRefresh = () => {
    setRefreshing(true);
    fetchData();
    setRefreshing(false);
  };

  const fetchData = async () => {
    await getRecipes();
  };

  // Actual function that will run to get all the data
  const getRecipes = async () => {
    const querySnapshot = await getDocs(collection(db, "RecipePosts"));
    const recipeData = querySnapshot.docs.map((doc) => doc.data());
    setRecipes(recipeData);
  };

  // check if the user is chef or not
  const getUserType = async () => {
    try {
      const currentUser = firebase.auth().currentUser;
      if (currentUser) {
        const userDocRef = doc(db, "users", currentUser.uid); // Use doc function to specify the document
        const userDocSnapshot = await getDoc(userDocRef); // Use getDoc function to get the document snapshot
        if (userDocSnapshot.exists()) {
          const userData = userDocSnapshot.data();
          if (userData.userType === "chef") {
            setIsChef(true);
          }
        } else {
          console.log("User data not found");
        }
      } else {
        console.log("No user signed in");
      }
    } catch (error) {
      console.error("Error fetching user data:", error);
    }
  };

  // Return the whole UI for home
  return (
    <View className=" bg-white relative h-full">
      <ScrollView
        className="flex-1 bg-backgroundColor"
        showsVerticalScrollIndicator={false}
        showsHorizontalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        <View className="flex-1">
          <Header />
          <Banner />
          <DisplayList displayList={recipes} heading={"Chef Craft Favorites"} />
        </View>
      </ScrollView>
      <View className=" absolute bottom-5 right-5">
        {isChef && (
          <TouchableOpacity onPress={() => navigation.push("add-recipe")}>
            <View className="flex flex-row gap-2 bg-primary w-48 justify-center p-3 rounded-2xl text-white">
              <Entypo name="add-to-list" size={22} color="#fefefe" />
              <Text className=" font-bold text-bgColor mb-2 translate-x-[-3px]">
                Add New Recipe
              </Text>
            </View>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
}
