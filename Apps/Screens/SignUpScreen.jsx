import {
  View,
  Text,
  Image,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  ScrollView,
} from "react-native";
import React, { useState } from "react";
import { firebase } from "../Utils/firebase";
import { useNavigation } from "@react-navigation/native";
import { RadioButton } from "react-native-paper";

export default function SignUpScreen() {
  const navigation = useNavigation();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [userType, setUserType] = useState("user");

  const handleRegistration = async (
    email,
    password,
    firstName,
    lastName,
    userType
  ) => {
    try {
      const userCredential = await firebase
        .auth()
        .createUserWithEmailAndPassword(email, password);
      const user = userCredential.user;
      await firebase.auth().signOut();

      // Navigate to login screen after successful registration
      navigation.navigate("Login");

      // Save additional user information to Firestore
      await firebase.firestore().collection("users").doc(user.uid).set({
        firstName,
        lastName,
        email,
        userType,
        saves: [],
      });

      // Notify the user about successful signup
      alert("Signup successful! Please log in with your credentials.");
    } catch (error) {
      alert(error.message);
    }
  };

  return (
    <KeyboardAvoidingView>
      <ScrollView>
        <View className="flex w-full items-center">
          <Image
            source={require("./../../assets/images/chef-craft-logo.png")}
            className="w-[250px] h-[200px] object-cover mt-12 "
          />
        </View>
        <View className="px-10 mt-6">
          <TextInput
            placeholder="First Name"
            value={firstName}
            onChangeText={(text) => setFirstName(text)}
            autoCapitalize="none"
            className=" text-lg border p-3 font-pregular rounded-lg mb-5"
          />

          <TextInput
            placeholder="Last Name"
            value={lastName}
            onChangeText={(text) => setLastName(text)}
            autoCapitalize="none"
            className=" text-lg border p-3 font-pregular rounded-lg mb-5"
          />

          <TextInput
            placeholder="Email"
            value={email}
            onChangeText={(text) => setEmail(text)}
            autoCapitalize="none"
            className=" text-lg border p-3 font-pregular rounded-lg mb-5"
          />

          <TextInput
            placeholder="Password"
            secureTextEntry={true}
            value={password}
            onChangeText={(text) => setPassword(text)}
            autoCapitalize="none"
            className=" text-lg border p-3 font-pregular rounded-lg"
          />
          <View className="mt-5">
            <RadioButton.Group
              onValueChange={(newValue) => setUserType(newValue)}
              value={userType}
            >
              <View className="flex flex-row gap-1">
                <View className="flex flex-row items-center">
                  <RadioButton value="user" color="#606C38" />
                  <Text>User (Viewer)</Text>
                </View>
                <View className="flex flex-row items-center">
                  <RadioButton value="chef" color="#606C38" />
                  <Text>Chef (Uploader)</Text>
                </View>
              </View>
            </RadioButton.Group>
          </View>
          <TouchableOpacity
            className="p-3 bg-primary rounded-2xl mt-4"
            onPress={() =>
              handleRegistration(email, password, firstName, lastName, userType)
            }
          >
            <Text className=" text-white text-center text-lg mb font-psemibold">
              Sign Up
            </Text>
          </TouchableOpacity>
          <View className="flex flex-row justify-center mt-3">
            <Text>Already have an account?</Text>
            <TouchableOpacity onPress={() => navigation.navigate("Login")}>
              <Text className="ml-1 text-primary">Log In</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
