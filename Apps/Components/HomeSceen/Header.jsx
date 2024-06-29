import React, { useState, useEffect } from "react";
import { Text, SafeAreaView, View, TextInput } from "react-native";
import { firebase } from "../../Utils/firebase";
import { getFirestore, doc, getDoc } from "firebase/firestore";
import { Feather } from "@expo/vector-icons";

// This will return a UI that compose of welcoming message to the user and searchbar(not functioning)
export default function Header() {
  const [currentUser, setCurrentUser] = useState(null);

  // Fetch data from the database
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const user = firebase.auth().currentUser;
        if (user) {
          const db = getFirestore();
          const userDocRef = doc(db, "users", user.uid);
          const userDocSnapshot = await getDoc(userDocRef);
          if (userDocSnapshot.exists()) {
            setCurrentUser(userDocSnapshot.data());
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

    fetchUserData(); // call it immediately
  }, []);

  return (
    <SafeAreaView>
      {currentUser && (
        <View className="mt-16 mb-4">
          <Text className="mx-4 text-xl font-plight">Hi, Welcome Back</Text>

          <Text className="mx-4 text-2xl font-pbold">
            {currentUser.firstName} {currentUser.lastName}
          </Text>
        </View>
      )}
      <View className=" items-center mt-4">
        <View className="mt-3 px-5 bg-white p-2 rounded-full w-10/12  flex flex-row border border-gray-300 ">
          <Feather name="search" size={24} color="gray" />
          <TextInput
            placeholder="Search"
            className="ml-2 w-10/12 font-pregular"
            onChangeText={(value) => console.log(value)}
          />
        </View>
      </View>
    </SafeAreaView>
  );
}
