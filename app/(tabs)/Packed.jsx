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

export default function Packed() {
  const [imageURI, setImage] = useState(null);
  const [imageURI2, setImage2] = useState(null);
  const [nutritionData, setNutritionData] = useState(null);
  const [loading, setLoading] = useState(false);

  const generateResult = async () => {
    setLoading(true);
    try {
      const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

      const base64ImageData1 = await FileSystem.readAsStringAsync(imageURI, {
        encoding: FileSystem.EncodingType.Base64,
      });

      const base64ImageData2 = await FileSystem.readAsStringAsync(imageURI2, {
        encoding: FileSystem.EncodingType.Base64,
      });

      const images = [
        {
          inlineData: {
            data: base64ImageData1,
            mimeType: "image/png",
          },
        },
        {
          inlineData: {
            data: base64ImageData2,
            mimeType: "image/png",
          },
        },
      ];

      const prompt = `Please review the attached images of a food product for detailed analysis and tell me weather its healthy or not to consume. The first image is the front packaging, and the second image is the back packaging where nutritional information is located. Extract and provide the specific name of the item as presented on the front packaging. Additionally, summarize key nutritional details such as calories, fats, carbohydrates, proteins, vitamins, and minerals per serving, obtained from the back image. Assess the healthiness of consuming the product and rate its healthyness level on a scale of 1 to 10. dont use heading styles of bold in data formatting, dont even bold the heading or sub heading give plain text, give name of the food also and end it with an enter at the end of the text give prompt in ordered way`;

      const result = await model.generateContent([prompt, ...images]);
      const response = await result.response;
      const text = await response.text();
      setNutritionData(text);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const handleImageSelection = (setFunction) => {
    Alert.alert(
      "Upload Image",
      "Choose an option to upload the image",
      [
        {
          text: "Camera",
          onPress: () => pickImage(setFunction, true),
        },
        {
          text: "Gallery",
          onPress: () => pickImage(setFunction, false),
        },
        {
          text: "Cancel",
          style: "cancel",
        },
      ],
      { cancelable: true }
    );
  };

  const pickImage = async (setFunction, useCamera) => {
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
      setFunction(result.assets[0].uri);
    }
  };

  const resetImages = () => {
    setImage(null);
    setImage2(null);
    setNutritionData(null);
  };

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollView}>
        
        <Text style={styles.subHeader}>Food Product Analysis</Text>
        <Text style={styles.instructionText}>
          Please provide images of the front and back packaging of the food product.
        </Text>
        <View style={styles.imageRow}>
          <TouchableOpacity
            style={[styles.imagePlaceholder, !imageURI && styles.placeholder]}
            onPress={() => handleImageSelection(setImage)}
          >
            {imageURI ? (
              <Image source={{ uri: imageURI }} style={styles.image} />
            ) : (
              <Text style={styles.placeholderText}>Front Image</Text>
            )}
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.imagePlaceholder, !imageURI2 && styles.placeholder]}
            onPress={() => handleImageSelection(setImage2)}
          >
            {imageURI2 ? (
              <Image source={{ uri: imageURI2 }} style={styles.image} />
            ) : (
              <Text style={styles.placeholderText}>Back Image</Text>
            )}
          </TouchableOpacity>
        </View>
        <View style={styles.analyzeButtonContainer}>
          {loading ? (
            <ActivityIndicator size="large" color="#34C759" />
          ) : (
            <Button
              title="Analyze Product"
              onPress={generateResult}
              disabled={!(imageURI && imageURI2)}
              color="#34C759"
            />
          )}
        </View>
        {nutritionData && (
          <>
            <Text style={styles.nutritionText}>{nutritionData}</Text>
            <Button title="Refresh" onPress={resetImages} color="#34C759" />
          </>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000",
  },
  scrollView: {
    alignItems: "center",
    padding: 20,
  },
  headerText: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#fff",
    marginBottom: 10,
  },
  subHeader: {
    
    fontSize: 20,
    color: "#fff",
    marginBottom: 5,
  },
  instructionText: {
    marginTop: 20,
    color: "#fff",
    textAlign: "center",
    marginBottom: 20,
  },
  imageRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    marginBottom: 20,
  },
  imagePlaceholder: {
    width: "48%",
    height: 200,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#333",
  },
  placeholder: {
    backgroundColor: "#333", // Dark gray placeholder for images
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
  nutritionText: {
    color: "#fff",
    marginTop: 20,
    fontSize: 14,
  },
});

