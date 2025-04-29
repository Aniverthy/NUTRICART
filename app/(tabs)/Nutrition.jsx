import { useState } from "react";
import {
  Button,
  Image,
  View,
  StyleSheet,
  Text,
  ScrollView,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import * as FileSystem from "expo-file-system";

const { GoogleGenerativeAI } = require("@google/generative-ai");
const genAI = new GoogleGenerativeAI(process.env.EXPO_PUBLIC_GEMINI_API_KEY);

export default function ImagePickerExample() {
  const [imageURI, setImage] = useState(null);
  const [nutritionData, setNutritionData] = useState(null);
  const [loading, setLoading] = useState(false);

  const generateResult = async () => {
    setLoading(true);
    try {
      const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

      const base64ImageData = await FileSystem.readAsStringAsync(imageURI, {
        encoding: FileSystem.EncodingType.Base64,
      });

      const image = {
        inlineData: {
          data: base64ImageData,
          mimeType: "image/png",
        },
      };

      const prompt = "Give nutrition of the food in the image.  description like what cuisine it belongs, how to prepare it and some background to it include this also and tell me weather its healthy or not to consume. Assess the healthiness of consuming the product and rate its healthiness level on a scale of 1 to 10.dont use heading styles of bold in data formatting, dont even bold the heading or sub heading give plain text, give name of the food also and end it with an enter at the end of the text. give prompt in ordered way in pointwise";

      const result = await model.generateContent([prompt, image]);
      const response = await result.response;
      const text = await response.text();
      setNutritionData(text);
      console.log(text);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const handleImageSelection = () => {
    Alert.alert(
      "Upload Image",
      "Choose an option to upload the image",
      [
        {
          text: "Camera",
          onPress: () => pickImage(true),
        },
        {
          text: "Gallery",
          onPress: () => pickImage(false),
        },
        {
          text: "Cancel",
          style: "cancel",
        },
      ],
      { cancelable: true }
    );
  };

  const pickImage = async (useCamera) => {
    let result;
    if (useCamera) {
      const permissionResult = await ImagePicker.requestCameraPermissionsAsync();
      if (permissionResult.granted === false) {
        alert("You've refused to allow this app to access your camera!");
        return;
      }
      result = await ImagePicker.launchCameraAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        quality: 0.6,
      });
    } else {
      result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.All,
        allowsEditing: true,
        quality: 1,
      });
    }

    if (!result.canceled) {
      setImage(result.assets[0].uri);
    }
  };

  const resetApp = () => {
    setImage(null);
    setNutritionData(null);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.mainHeader}>Food Nutritional Analysis</Text>
      <Text style={styles.subHeader}>Please provide image of the food</Text>
      <TouchableOpacity onPress={handleImageSelection} style={styles.imagePlaceholder}>
        {imageURI ? (
          <Image source={{ uri: imageURI }} style={styles.image} />
        ) : (
          <Text style={styles.placeholderText}>Select Image</Text>
        )}
      </TouchableOpacity>
      <View style={styles.analyzeButtonContainer}>
        {loading ? (
          <ActivityIndicator size="large" color="#34C759" />
        ) : (
          imageURI && (
            <TouchableOpacity style={styles.button} onPress={generateResult}>
              <Text style={styles.buttonText}>Analyze Product</Text>
            </TouchableOpacity>
          )
        )}
      </View>
      <ScrollView>
        {nutritionData && (
          <>
            <Text style={styles.generatedText}>{nutritionData}</Text>
            <TouchableOpacity style={[styles.button, styles.centeredButton]} onPress={resetApp}>
  <Text style={styles.buttonText}>Refresh</Text>
</TouchableOpacity>

          </>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    padding: 12,
    backgroundColor: "#000",
  },
  mainHeader: {
    fontSize: 20,
    color: "#fff",
    marginBottom: 5,
  },
  subHeader: {
    marginTop: 20,
    color: "#fff",
    textAlign: "center",
    marginBottom: 20,
  },
  imagePlaceholder: {
    width: 240,
    height: 180,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#333",
    marginVertical: 10,
  },
  placeholderText: {
    color: "#fff",
    fontSize: 16,
  },
  image: {
    width: "100%",
    height: "100%",
  },
  analyzeButtonContainer: {
    marginTop: 20,
    marginBottom: 20,
  },
  button: {
    backgroundColor: "#34C759",
    padding: 10,
    borderRadius: 5,
    alignItems: "center",
    marginVertical: 5,
    width: 150,
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    alignSelf: "center",
  },
  centeredButton: {
    alignSelf: "center",
  },
  
  generatedText: {
    color: "white",
    fontSize: 14,
    marginVertical: 10,
  },
});

