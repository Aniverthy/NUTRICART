import {
  View,
  Text,
  ScrollView,
  TextInput,
  Pressable,
  Alert,
} from "react-native";
import { Picker } from "react-native-web";
import React from "react";
import { useState } from "react";
import { StyleSheet } from "react-native";

export default urReciepe = () => {
  const [name, setName] = useState("");
  const [ingredients, setIngredients] = useState("");
  const [reciepe, setReciepe] = useState("");

  const submitReciepe = async () => {
    Alert.alert(`Your reciepe for ${name} will be considered!`);
    setName("");
    setIngredients("");
    setReciepe("");
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.generatedText}>Name of the Reciepe:</Text>
      <TextInput
        style={styles.input}
        multiline
        numberOfLines={1}
        maxLength={100}
        placeholder={"Reciepe!"}
        value={name}
        onChangeText={setName}
        editable
      />

      <Text style={styles.generatedText}>Write down your ingredients!</Text>
      <TextInput
        style={styles.input}
        multiline
        numberOfLines={4}
        maxLength={100}
        placeholder={"Your ingredients!"}
        value={ingredients}
        onChangeText={setIngredients}
        editable
      />

      <Text style={styles.generatedText}>Write down your recipie!</Text>
      <TextInput
        style={styles.input}
        multiline
        numberOfLines={4}
        maxLength={100}
        placeholder={"Your reciepe!!\n\nStep - 1\nStep - 2\n.\n."}
        value={reciepe}
        onChangeText={setReciepe}
        editable
      />

      {reciepe && ingredients && name && (
        <Pressable
          style={({ pressed }) => [
            {
              backgroundColor: pressed ? "#238636" : "#34C759",
            },
            styles.pressableButton,
          ]}
          onPress={submitReciepe}
        >
          <Text style={styles.generatedText}>Submit Reciepe!</Text>
        </Pressable>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 18,
    backgroundColor: "#000",
  },
  picker: {
    width: "60%", // Adjust button width as needed
    color: "white",
    marginVertical: 10,
    backgroundColor: "#34C759",
  },
  input: {
    backgroundColor: "white",
    width: "90%",
    padding: 12,
    marginVertical: 5,
    borderRadius: 6,
  },
  button: {
    backgroundColor: "green",
    height: 30,
  },
  pressableButton: {
    width: "50%", // Adjust button width as needed
    marginBottom: 10,
    paddingVertical: 8, // Adjust vertical padding
    borderRadius: 8,
    padding: 12,
    marginVertical: 3,
  },
  image: {
    marginVertical: 10,
    width: 240,
    height: 180,
  },
  generatedText: {
    color: "white",
  },
});
