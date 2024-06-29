import {
  View,
  Text,
  Image,
  TextInput,
  TouchableOpacity,
  Alert,
} from "react-native";
import React from "react";
import { ScrollView } from "react-native-gesture-handler";
import { useState } from "react";
import { Feather } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import { getDownloadURL, getStorage, ref, uploadBytes } from "firebase/storage";
import {
  addDoc,
  collection,
  getDoc,
  getFirestore,
  serverTimestamp,
  setDoc,
} from "firebase/firestore";
import { firebase } from "../Utils/firebase";
import { useNavigation } from "@react-navigation/native";

// Use to add recipe in the database
export default function AddRecipe() {
  const navigation = useNavigation();
  const db = getFirestore(firebase.app); // get firebase firestore database
  const currentUserId = firebase.auth().currentUser.uid; // get the current user id
  const storage = getStorage(); // get the storage to store images

  // Set all useState
  const [title, setTitle] = useState("");
  const [ingredients, setIngredients] = useState([]);
  const [steps, setSteps] = useState([]);
  const [image, setImage] = useState(null);
  const [imageUrl, setImageUrl] = useState("");

  // This function are use to handle different tasks based on their names
  const handleAddIngredient = () => {
    setIngredients([...ingredients, ""]);
  };

  const handleIngredientChange = (text, index) => {
    const newIngredients = [...ingredients];
    newIngredients[index] = text;
    setIngredients(newIngredients);
  };

  const handleDeleteIngredient = (index) => {
    const newIngredients = [...ingredients];
    newIngredients.splice(index, 1);
    setIngredients(newIngredients);
  };

  const handleAddStep = () => {
    setSteps([...steps, ""]);
  };

  const handleStepChange = (text, index) => {
    const newSteps = [...steps];
    newSteps[index] = text;
    setSteps(newSteps);
  };

  const handleDeleteStep = (index) => {
    const newSteps = [...steps];
    newSteps.splice(index, 1);
    setSteps(newSteps);
  };

  // This function will be called when "post" was pressed to post all the date in the database
  const handlePost = async (image, title, ingredients, steps) => {
    try {
      // Convert image uri to blob
      const response = await fetch(image);
      const blob = await response.blob();
      const storageRef = ref(storage, "recipeImage/" + Date.now() + ".jpg");

      //save the image to firebase torage
      uploadBytes(storageRef, blob)
        .then((snapshot) => {})
        .then((resp) => {
          getDownloadURL(storageRef).then(async (downnloadUrl) => {
            setImageUrl(downnloadUrl); // set the download url
          });
        })
        .then(handleUpload());
    } catch (error) {
      alert("Error occured, try again");
    }
  };

  // This will trigger to finally post all the data on the database
  const handleUpload = async () => {
    if (
      imageUrl != "" &&
      title != "" &&
      steps.length > 0 &&
      ingredients.length > 0 &&
      checkIngredientsAndSteps()
    ) {
      try {
        // Add a new document to the "RecipePosts" collection
        const docRef = await addDoc(collection(db, "RecipePosts"), {
          imageUrl, // Use destructuring for brevity (assuming these are defined)
          title,
          ingredients,
          steps,
          rating: {},
          userId: currentUserId,
          createdAt: serverTimestamp(),
        });

        const docId = docRef.id;

        // Retrieve document data using getDoc
        const docSnap = await getDoc(docRef);

        // Check if document was successfully retrieved
        if (docSnap.exists) {
          const data = docSnap.data();
          await setDoc(docRef, { ...data, id: docId });
        } else {
          // Handle the scenario where the document doesn't exist
          console.error("Document not found:", docId);
        }

        // Alert to display the succesfuul posting
        Alert.alert(
          "Success",
          "You successfully uploaded your recipe!",
          [
            {
              text: "Cancel",
              style: "cancel",
            },
            {
              text: "OK",
              onPress: () => {
                // Navigate back to parent tab
                navigation.goBack();
              },
            },
          ],
          { cancelable: false }
        );
      } catch (error) {
        console.error("Error posting recipe:", error);
      }
    } else {
      alert("Complete the necessary fields first!");
    }
  };

  // This function will use the ImagePicker from expo to let the user choose photo to it's gallery
  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 4],
      quality: 1,
    });

    if (!result.canceled) {
      setImage(result.assets[0].uri);
    }
  };

  // This will render Ingredients text input field when the user need to add new ingredient (Triggered when "add ingredient" is pressed)
  const renderIngredients = () => {
    return ingredients.map((ingredient, index) => (
      <View className="flex flex-row gap-3 items-center">
        <TextInput
          key={index}
          value={ingredient}
          onChangeText={(text) => handleIngredientChange(text, index)}
          placeholder={`Ingredient ${index + 1}`}
          className="text-sm border p-2 rounded-lg mb-3 w-4/6 bg-white font-pregular"
        />
        <TouchableOpacity onPress={() => handleDeleteIngredient(index)}>
          <View className="flex flex-row gap-2 bg-red-600 w-7 h-7 justify-center rounded-full text-backgroundColor translate-x-2 text-white">
            <Text className=" font-bold text-backgroundColor mb-2 translate-x-[-4px] translate-y-[-1px] text-[10px]">
              X
            </Text>
          </View>
        </TouchableOpacity>
      </View>
    ));
  };

  // This will render steps text input field when the user need to add new steps (Triggered when "add ingredient" is pressed)
  const renderSteps = () => {
    return steps.map((step, index) => (
      <View key={index} className="flex flex-row gap-3 items-center">
        <TextInput
          value={step}
          onChangeText={(text) => handleStepChange(text, index)}
          placeholder={`Step ${index + 1}`}
          className="text-sm border p-2 rounded-lg mb-3 w-5/6 bg-white font-pregular"
        />
        <TouchableOpacity onPress={() => handleDeleteStep(index)}>
          <View className="flex flex-row gap-2 bg-red-600 w-7 h-7 justify-center rounded-full text-backgroundColor translate-x-2 text-white">
            <Text className="font-bold text-backgroundColor mb-2 translate-x-[-4px] translate-y-[-1px] text-[10px]">
              X
            </Text>
          </View>
        </TouchableOpacity>
      </View>
    ));
  };

  // Function to check if ingredients and steps input are valid
  const checkIngredientsAndSteps = () => {
    let valid = true;
    ingredients.forEach((value) => {
      if (value.trim() == "") {
        valid = false;
        return;
      }
    });

    steps.forEach((value) => {
      if (value.trim() == "") {
        valid = false;
        return;
      }
    });

    return valid;
  };

  // This will return the whole UI of adding a recipe
  return (
    <View className=" h-full bg-white">
      <ScrollView>
        <View className="mt-16 items-center">
          <Text className=" text-2xl font-pbold">
            Share your beloved recipe!
          </Text>
          <View>
            <TouchableOpacity
              className=" border h-40 w-40 translate-y-8 mb-10 rounded-2xl"
              onPress={pickImage}
            >
              {image ? (
                <Image
                  source={{ uri: image }}
                  className="w-40 h-40 object-cover mr-2 rounded-2xl"
                />
              ) : (
                <Image
                  source={require("./../../assets/images/image-upload.png")}
                  className="w-32 h-32 object-cover m-4 translate-x-1"
                />
              )}

              <View className=" translate-x-32 translate-y-[-20px] bg-tertiaryBrown w-9 h-9 p-2 rounded-full border ">
                <Feather name="camera" size={18} color="black" />
              </View>
            </TouchableOpacity>
          </View>
        </View>
        <View className="p-8">
          <Text className="mb-2 text-sm font-plight">Recipe Name:</Text>
          <TextInput
            placeholder="Takoyaki"
            value={title}
            onChangeText={(text) => setTitle(text)}
            autoCapitalize="none"
            className=" text-sm border p-2 rounded-lg mb-5 bg-white font-pregular"
          />
          <Text className="mb-2 text-sm font-plight">Ingredients:</Text>
          <View>
            {renderIngredients()}
            <TouchableOpacity onPress={handleAddIngredient}>
              <View className="flex flex-row gap-2 bg-primary w-40 justify-center p-2 rounded-2xl text-backgroundColor translate-x-2 mt-2">
                <Text className=" font-pbold text-white mb-2 translate-x-[-3px]">
                  Add ingredient
                </Text>
              </View>
            </TouchableOpacity>
          </View>
          <Text className="mb-2 text-sm font-plight mt-5">Steps:</Text>
          <View>
            {renderSteps()}
            <TouchableOpacity onPress={handleAddStep}>
              <View className="flex flex-row gap-2 bg-primary w-40 justify-center p-2 rounded-2xl text-backgroundColor translate-x-2 mt-2">
                <Text className=" font-pbold text-white mb-2 translate-x-[-3px]">
                  Add step
                </Text>
              </View>
            </TouchableOpacity>
          </View>
          <TouchableOpacity
            onPress={() => handlePost(image, title, ingredients, steps)}
          >
            <View className="items-center">
              <View className="flex flex-row gap-2 bg-primary justify-center p-2 rounded-2xl text-bgColor w-5/6 mt-12">
                <Text className=" font-pbold text-white mb-2 translate-x-[-3px]">
                  Post
                </Text>
              </View>
            </View>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
}
