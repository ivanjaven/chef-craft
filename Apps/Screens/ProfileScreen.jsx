import { View, Text, ScrollView, Alert } from "react-native";
import { firebase } from "../Utils/firebase";
import React, { useEffect, useState } from "react";
import { TouchableOpacity } from "react-native-gesture-handler";

export default function ProfileScreen() {
  useEffect(() => {}, []);

  const handleLogout = () => {
    // Display the confirmation alert
    Alert.alert(
      "Logout",
      "Are you sure you want to logout?",
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Logout",
          onPress: () => {
            firebase
              .auth()
              .signOut()
              .catch((error) => {
                // An error occurred during logout
                console.error("Logout error:", error);
                alert("An error occured while logging out");
              });
          },
        },
      ],
      { cancelable: false }
    );
  };

  return (
    <ScrollView
      className="mt-14 mx-4 mb-4"
      showsVerticalScrollIndicator={false}
      showsHorizontalScrollIndicator={false}
    >
      <View className="flex items-center">
        <Text className=" text-3xl pb-3 mb-8 font-pbold">Profile</Text>
        <TouchableOpacity onPress={handleLogout}>
          <Text className=" font-bold text-lg mb-3 pt-1 text-white bg-red-500 p-4 rounded-full px-8">
            Log out
          </Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}
