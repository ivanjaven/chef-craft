import { View, Text, Image } from "react-native";
import React from "react";

// A simple display to show a loading before user completely get the data
export default function Loader() {
  return (
    <View className="flex flex-row mt-4 p-3 bg-white rounded-2xl h-28 justify-center items-center">
      <Image
        source={require("./../../../assets/images/frying-pan.gif")}
        className="w-32 h-32"
      />
      <Text className=" text-[16px] font-bold text-primary">
        Preparing foods for you...
      </Text>
    </View>
  );
}
