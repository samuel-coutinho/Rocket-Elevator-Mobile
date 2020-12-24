import { StatusBar } from 'expo-status-bar';
import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, TextInput, View, Image, SafeAreaView, TouchableOpacity, FlatList } from 'react-native';
import 'react-native-gesture-handler';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

console.log('Starting App');
const Stack = createStackNavigator();

const App = () => {  
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen
          name="Start"
          component={StartScreen}
          options={{ title: 'Welcome to Rocket Elevators Mobile App' }}
        />
        <Stack.Screen name="Home" component={HomeScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

const StartScreen = ({ navigation }) => {
  const [email, setEmail] = useState('');  
  return (
    <SafeAreaView style={styles.container}>      
      <Image 
        style={styles.logo}
        source={require("./assets/RocketElevatorsLogo.png")} 
      />               

      <View style={styles.inputView}>        
        <TextInput
          style={styles.TextInput}
          placeholder="Enter the employee Email"
          placeholderTextColor="#003f5c"
          onChangeText={email => setEmail(email)}            
        />
      </View>   
     
      <TouchableOpacity style={styles.loginBtn} onPress={() => getEmployeesFromApi(email, {navigation})} >
        <Text>LOGIN</Text>
      </TouchableOpacity>    
      <StatusBar style="auto" />                      
    </SafeAreaView>   
  );
};
//() => getEmployeesFromApi(email)}

const HomeScreen = ({ navigation }) => {
  const [data, setData] = useState([]);

  useEffect(() => {
    fetch('http://samcoutinhoapi.azurewebsites.net/api/elevators/oos')
    .then((response) => response.json())
    .then((json) => {
      setData(json.id)
    })
  }, []);
  return (
    <SafeAreaView style={styles.container}>      
      <Image 
        style={styles.logo}
        source={require("./assets/RocketElevatorsLogo.png")} 
      />

      <TouchableOpacity style={styles.loginBtn} onPress={() => navigation.navigate('Start')} >
        <Text>HomeScreen</Text>
      </TouchableOpacity>  

      <FlatList
        data={data}
        renderItem={({item}) => <Text style={styles.item}>{item.id}</Text>}
      />                             
    </SafeAreaView>   
  );
};

const getListOfElevators = () => {
  fetch('http://samcoutinhoapi.azurewebsites.net/api/elevators/oos')
  .then((response) => response.json())
  .then((json) => {
    console.log(json); 
    json.forEach(element => {
      console.log(element)     
    });
    return json
  })
}

const getEmployeesFromApi = ( _email, {navigation}) => {
  return fetch('https://samcoutinhoapi.azurewebsites.net/api/employees')  
    //.then(() => navigation.navigate('Home'))
    .then((response) => response.json())
    .then((json) => {      
      var doesTheEmailExist = false;
      console.log('email = ');
      console.log(_email);
      json.forEach(element => {
        //console.log(element.email);
        if (element.email == _email) {
          doesTheEmailExist = true;         
          navigation.navigate('Home');
          console.log(element.email);          
        }    
      });
      if (doesTheEmailExist == false) {
        alert('The email entered is not the email of a listed agent');         
      }         
    })    
    .catch((error) => {
      console.error(error);
    });    
};

const styles = StyleSheet.create({
  container: {
    //flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  logo: {       
    resizeMode: 'cover',       
    // width: '100%',
    // height: undefined,
    // aspectRatio: 1,
  },
  inputView: {
    backgroundColor: 'firebrick',
    borderRadius: 30,
    width: "70%",
    height: 45,
    marginTop: 150,
    alignItems: "center",
  },
  TextInput: {
    height: 50,
    flex: 1,
    padding: 10,
    marginLeft: 20,
  },
  loginBtn: {
    width: "80%",
    borderRadius: 25,
    height: 50,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 40,
    backgroundColor: 'royalblue',
  },
  item: {
    padding: 10,
    fontSize: 18,
    height: 44,
  },
})
export default App;
