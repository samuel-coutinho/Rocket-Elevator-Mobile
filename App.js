import { StatusBar } from 'expo-status-bar';
import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, TextInput, View, Image, SafeAreaView, TouchableOpacity, FlatList, ActivityIndicator } from 'react-native';
import 'react-native-gesture-handler';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { render } from 'react-dom';

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
  const [isLoading, setIsLoading] = useState();
  isLoading => setIsLoading(true)

  useEffect(() => {
    fetch('http://samcoutinhoapi.azurewebsites.net/api/elevators/oos')
    .then((response) => response.json())
    .then((json) => {
      //const data = [];
      //console.log(json.id); 
      json.forEach(element => {
        //console.log(element.id)
        data.push(element.id)
      });      
      data => setData(data)
      isLoading => setIsLoading(false)
      //console.log(data);         
    })    
    .catch(e => console.log(e));
  }, []);
  if (isLoading) {
    return (
      <View>
        <ActivityIndicator/>
      </View>
    )
  } else {
      return (
        <SafeAreaView style={styles.container}>      
          <Image 
            style={styles.logo}
            source={require("./assets/RocketElevatorsLogo.png")} 
          />
          

          <TouchableOpacity style={styles.loginBtn} onPress={() => getListOfElevators()} >
            <Text>HomeScreen</Text>
          </TouchableOpacity>  
          <Text style={styles.item}>{data}</Text>    
          <StatusBar style="auto" />                            
        </SafeAreaView>   
      );
    }
};

const getListOfElevators = () => {  
  fetch('http://samcoutinhoapi.azurewebsites.net/api/elevators/oos')
  .then((response) => response.json())
  .then((json) => {
    const data = [];
    //console.log(json.id); 
    json.forEach(element => {
     //console.log(element.id)
      data.push(element.id)
    }); 
    console.log(data);         
  });
}

const getEmployeesFromApi = ( _email, {navigation}) => {
  return fetch('https://samcoutinhoapi.azurewebsites.net/api/employees') 
    
    .then((response) => response.json())
    .then((json) => {      
      var doesTheEmailExist = false;
      //console.log('email = ');
      //console.log(_email);
      json.forEach(element => {
        //console.log(element.email);
        if (element.email == _email) {
          doesTheEmailExist = true;         
          navigation.navigate('Home');
          //console.log(element.email);          
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
