import {
  View,
  Text,
  Image,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
} from "react-native";
import React, { useState } from "react";
import { firebase } from "../Utils/firebase";
import { useNavigation } from "@react-navigation/native";
import { ScrollView } from "react-native-gesture-handler";

export default function LoginScreen() {
  const navigation = useNavigation();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  handleLogIn = async (email, password) => {
    try {
      await firebase.auth().signInWithEmailAndPassword(email, password);
    } catch (error) {
      alert("Invalid Credentials");
    }
  };

  return (
    <KeyboardAvoidingView>
      <ScrollView>
        <View className="flex-1 items-center  translate-x-[-4px] ">
          <View className="flex w-full items-center">
            <Image
              source={require("./../../assets/images/chef-craft-logo.png")}
              className="w-[300px] h-[200px] object-cover mt-24 "
            />
          </View>
          <Text className=" text-2xl pt-8 6 -tracking-wide leading-9 font-pregular">
            Wanna cook something
          </Text>
          <Text className=" text-amber-900 text-2xl font-pbold">
            Delicious<Text className=" text-gray-800"> ?</Text>
          </Text>
        </View>
        <View className="p-10 ">
          <TextInput
            placeholder="Email"
            value={email}
            onChangeText={(text) => setEmail(text)}
            autoCapitalize="none"
            className=" text-lg border p-3 rounded-lg mb-5 font-plight"
          />

          <TextInput
            placeholder="Password"
            secureTextEntry={true}
            value={password}
            onChangeText={(text) => setPassword(text)}
            autoCapitalize="none"
            className=" text-lg border p-3 rounded-lg font-plight"
          />
          <TouchableOpacity
            className="p-3 bg-primary rounded-2xl mt-8"
            onPress={() => handleLogIn(email, password)}
          >
            <Text className=" text-white text-center text-lg mb font-psemibold">
              Log In
            </Text>
          </TouchableOpacity>
          <View className="flex flex-row justify-center mt-3">
            <Text>Don't have an account?</Text>
            <TouchableOpacity onPress={() => navigation.navigate("SignUp")}>
              <Text className="ml-1 text-primary">Sign Up</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
