import React, { useEffect, useState } from "react";

import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Image,
  ScrollView,
  ActivityIndicator
} from "react-native";

import AsyncStorage from "@react-native-async-storage/async-storage";

import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();


// ================= LOGIN =================
function LoginScreen({ navigation, setIsLogin }) {
  const [email, setEmail] = useState("");

  const handleLogin = async () => {
    if (!email) {
      alert("Nhập email đi!");
      return;
    }

    await AsyncStorage.setItem("user", JSON.stringify({ email }));

    setIsLogin(true); // 🔥 FIX QUAN TRỌNG
  };

  return (
    <View style={styles.container}>

      <Text style={styles.title}>Sign In</Text>

      <Text style={styles.label}>Email ID</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter your email"
        onChangeText={setEmail}
      />

      <Text style={styles.label}>Password</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter password"
        secureTextEntry
      />

      <Text style={styles.forgot}>Forgot password?</Text>

      <TouchableOpacity style={styles.loginBtn} onPress={handleLogin}>
        <Text style={styles.loginText}>Sign In</Text>
      </TouchableOpacity>

      <Text style={styles.orText}>Or sign in with</Text>

      <View style={styles.socialRow}>
        <TouchableOpacity style={styles.googleBtn}>
          <Text>Google</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.fbBtn}>
          <Text style={{ color: "white" }}>Facebook</Text>
        </TouchableOpacity>
      </View>

    </View>
  );
}


// ================= EXPLORER =================
function ExplorerScreen() {
  return (
    <ScrollView style={styles.container}>

      <Text style={styles.header}>Explorer</Text>

      <TextInput
        style={styles.search}
        placeholder="Search for meals or area"
      />

      <View style={styles.rowBetween}>
        <Text style={styles.sectionTitle}>Top Categories</Text>
        <Text style={{ color: "orange" }}>Filter</Text>
      </View>

      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        <View style={styles.category}>
          <Image source={require("./assets/pizza.png")} style={styles.categoryImg} />
          <Text>Pizza</Text>
        </View>

        <View style={styles.category}>
          <Image source={require("./assets/burger.png")} style={styles.categoryImg} />
          <Text>Burger</Text>
        </View>

        <View style={styles.category}>
          <Image source={require("./assets/steak.png")} style={styles.categoryImg} />
          <Text>Steak</Text>
        </View>
      </ScrollView>

      <View style={styles.rowBetween}>
        <Text style={styles.sectionTitle}>Popular Items</Text>
        <Text style={{ color: "orange" }}>View all</Text>
      </View>

      <View style={styles.cardBox}>
        <Image source={require("./assets/food1.png")} style={styles.foodImg} />
        <View>
          <Text style={styles.foodTitle}>Food 1</Text>
          <Text>By Viet Nam</Text>
          <Text style={styles.price}>1$</Text>
        </View>
      </View>

      <View style={styles.cardBox}>
        <Image source={require("./assets/food2.png")} style={styles.foodImg} />
        <View>
          <Text style={styles.foodTitle}>Food 2</Text>
          <Text>By Viet Nam</Text>
          <Text style={styles.price}>3$</Text>
        </View>
      </View>

    </ScrollView>
  );
}


// ================= ACCOUNT =================
function AccountScreen({ setIsLogin }) {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const loadUser = async () => {
      const data = await AsyncStorage.getItem("user");
      if (data) setUser(JSON.parse(data));
    };
    loadUser();
  }, []);

  const handleLogout = async () => {
    await AsyncStorage.removeItem("user");
    setIsLogin(false); // 🔥 FIX QUAN TRỌNG
  };

  return (
    <View style={{ flex: 1, backgroundColor: "#f2f2f2" }}>

      <View style={styles.profileTop}></View>

      <View style={styles.avatarWrapper}>
        <Image
          source={{ uri: "https://i.pravatar.cc/150" }}
          style={styles.avatar}
        />
      </View>

      <Text style={styles.name}>
        {user?.email || "User"}
      </Text>

      <Text style={styles.job}>Mobile developer</Text>

      <Text style={styles.desc}>
        I have above 5 years of experience in mobile apps
      </Text>

      <TouchableOpacity style={styles.logoutBtn} onPress={handleLogout}>
        <Text style={{ color: "white" }}>Sign Out</Text>
      </TouchableOpacity>

    </View>
  );
}


// ================= TAB =================
function MainTabs({ setIsLogin }) {
  return (
    <Tab.Navigator screenOptions={{ headerShown: false }}>
      <Tab.Screen name="Explorer" component={ExplorerScreen} />
      <Tab.Screen name="Account">
        {(props) => <AccountScreen {...props} setIsLogin={setIsLogin} />}
      </Tab.Screen>
    </Tab.Navigator>
  );
}


// ================= APP =================
export default function App() {
  const [loading, setLoading] = useState(true);
  const [isLogin, setIsLogin] = useState(false);

  useEffect(() => {
    const checkLogin = async () => {
      const user = await AsyncStorage.getItem("user");
      setIsLogin(!!user);
      setLoading(false);
    };
    checkLogin();
  }, []);

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {isLogin ? (
          <Stack.Screen name="Main">
            {(props) => <MainTabs {...props} setIsLogin={setIsLogin} />}
          </Stack.Screen>
        ) : (
          <Stack.Screen name="Login">
            {(props) => <LoginScreen {...props} setIsLogin={setIsLogin} />}
          </Stack.Screen>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}


// ================= STYLE =================
const styles = StyleSheet.create({

  container: { flex: 1, padding: 20, backgroundColor: "#fff" },

  center: { flex: 1, justifyContent: "center", alignItems: "center" },

  title: { fontSize: 30, fontWeight: "bold", marginBottom: 20 },

  label: { marginBottom: 5 },

  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 10,
    marginBottom: 15,
    borderRadius: 5
  },

  forgot: { alignSelf: "flex-end", color: "orange", marginBottom: 20 },

  loginBtn: {
    backgroundColor: "orange",
    padding: 15,
    alignItems: "center",
    borderRadius: 5
  },

  loginText: { color: "white", fontWeight: "bold" },

  orText: { textAlign: "center", marginTop: 20 },

  socialRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 15
  },

  googleBtn: {
    borderWidth: 1,
    padding: 10,
    width: "45%",
    alignItems: "center",
    borderRadius: 5
  },

  fbBtn: {
    backgroundColor: "#3b5998",
    padding: 10,
    width: "45%",
    alignItems: "center",
    borderRadius: 5
  },

  header: { fontSize: 25, fontWeight: "bold", marginBottom: 10 },

  search: {
    borderWidth: 1,
    padding: 10,
    borderRadius: 5,
    marginBottom: 20
  },

  rowBetween: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center"
  },

  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10
  },

  category: { alignItems: "center", marginRight: 15 },

  categoryImg: { width: 80, height: 80, borderRadius: 10 },

  cardBox: {
    flexDirection: "row",
    backgroundColor: "#fff",
    padding: 10,
    borderRadius: 10,
    marginBottom: 15,
    elevation: 3
  },

  foodImg: {
    width: 80,
    height: 80,
    borderRadius: 10,
    marginRight: 10
  },

  foodTitle: { fontWeight: "bold" },

  price: { color: "orange" },

  profileTop: { height: 120, backgroundColor: "#1da1f2" },

  avatarWrapper: { alignItems: "center", marginTop: -50 },

  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 3,
    borderColor: "#fff"
  },

  name: { fontSize: 22, fontWeight: "bold", textAlign: "center" },

  job: { textAlign: "center", color: "#1da1f2" },

  desc: { textAlign: "center", marginVertical: 20 },

  logoutBtn: {
    backgroundColor: "orange",
    padding: 15,
    alignItems: "center",
    borderRadius: 5,
    marginHorizontal: 20
  }

});