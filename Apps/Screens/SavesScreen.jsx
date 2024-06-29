import { ScrollView, RefreshControl } from "react-native";
import React, { useEffect, useState } from "react";
import { firebase } from "../Utils/firebase";
import { getFirestore, getDoc, doc } from "firebase/firestore";
import DisplayList from "../Components/HomeSceen/DisplayList";

export default function SavesScreen() {
  const db = getFirestore(firebase.app);
  const [allSaves, setAllSaves] = useState([]);
  const [refreshing, setRefreshing] = useState(false);

  const getAllSaves = async () => {
    try {
      const userId = firebase.auth().currentUser.uid;
      const userDocRef = doc(db, "users", userId);
      const userDocSnapshot = await getDoc(userDocRef);

      if (userDocSnapshot.exists()) {
        const userData = userDocSnapshot.data();
        if (userData && userData.saves) {
          const savedPosts = await Promise.all(
            userData.saves.map(async (postId) => {
              const postDocRef = doc(db, "RecipePosts", postId);
              const postDocSnapshot = await getDoc(postDocRef);
              if (postDocSnapshot.exists()) {
                return postDocSnapshot.data();
              }
              return null;
            })
          );

          setAllSaves(savedPosts.filter((post) => post));
        } else {
          setAllSaves([]);
        }
      } else {
        setAllSaves([]);
      }
    } catch (error) {
      alert(error);
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    getAllSaves();
    setRefreshing(false);
  };

  useEffect(() => {
    getAllSaves();
  }, []);

  return (
    <ScrollView
      className="mt-8  bg-white"
      showsVerticalScrollIndicator={false}
      showsHorizontalScrollIndicator={false}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
    >
      <DisplayList displayList={allSaves} heading={"Your Saves"} />
    </ScrollView>
  );
}
