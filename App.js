import { StatusBar } from 'expo-status-bar';
import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, TextInput, View, Image, SafeAreaView, TouchableOpacity } from 'react-native';
import 'react-native-gesture-handler';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
//import { ScrollView } from 'react-native-gesture-handler';
import {Card} from 'react-native-shadow-cards';


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
        <Stack.Screen name="ElevatorStatus" component={ElevatorStatusScreen} />
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
                          
    </SafeAreaView>   
  );
};

const HomeScreen = ({ navigation }) => {
  const [elevator, setElevator] = useState([]);  
  const getListOfElevators = async () => {  
    const res = await fetch('http://samcoutinhoapi.azurewebsites.net/api/elevators/oos');
    const data = await res.json();
    setElevator(data)    
  }
  useEffect(() => {
    getListOfElevators();    
  }, []); 

  if (!elevator) return null;
  console.log(elevator);   

  return (
    <SafeAreaView style={styles.container}>         
      <Image 
        style={styles.logo}
        source={require("./assets/RocketElevatorsLogo.png")} 
      />        

      <TouchableOpacity style={styles.loginBtn} onPress={() => navigation.navigate('Start')} >
        <Text>Log Out</Text>
      </TouchableOpacity>

      <Text style={styles.item}>Lists of all the elevators that are not in operation</Text>
      
      {elevator.map(elevator =>
          <TouchableOpacity style={styles.elevatorBtn} onPress={() => callElevatorStatusScreen(elevator, {navigation})}>
            <Text>Elevator ID: {elevator.id}</Text>
          </TouchableOpacity>)
      }                                     
    </SafeAreaView>   
  );    
};

// const logOut = ({navigation}) => {
//   setEmail('');
//   navigation.navigate('Start');  
// }

const callElevatorStatusScreen = (_elevator, {navigation}) =>  {
  navigation.navigate('ElevatorStatus', { 
    id: _elevator.id,
    status: _elevator.elevatorStatus,
    model: _elevator.elevatorModel,
    elevator_type: _elevator.elevatorType,
    column_id: _elevator.columnId,
    information: _elevator.information,
    });
}

const ElevatorStatusScreen = ({ navigation, route }) => {  
  //console.log('elevator satus screen')
  
  return (
    <SafeAreaView style={styles.container}>      
      <Image 
        style={styles.logo}
        source={require("./assets/RocketElevatorsLogo.png")} 
      />    
        
      <Card style={{marginTop: 120, padding: 10, margin: 10}}>
        <Text> Elevator ID : {route.params.id}</Text>
        <Text> Status : {route.params.status}</Text>
        <Text> Model : {route.params.model}</Text>
        <Text> Elevator Type  : {route.params.elevator_type}</Text>
        <Text> Column ID : {route.params.column_id}</Text>
        <Text> Information : {route.params.information}</Text>        
      </Card>    
                         
    </SafeAreaView>   
  );
};

const getEmployeesFromApi = ( _email, {navigation}) => {
  return fetch('https://samcoutinhoapi.azurewebsites.net/api/employees') 
    
    .then((response) => response.json())
    .then((json) => {      
      var doesTheEmailExist = false;      
      json.forEach(element => {        
        if (element.email == _email) {
          doesTheEmailExist = true;         
          navigation.navigate('Home');                 
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
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  logo: {       
    resizeMode: 'cover', 
    justifyContent: 'flex-start',      
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
  elevatorBtn: {
    width: "50%",
    borderRadius: 15,
    height: 40,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 10,
    backgroundColor: 'firebrick',
  },
  item: {
    padding: 10,
    fontSize: 18,
    height: 44,
  },
  list: {    
    padding: 10,
    fontSize: 18,
    height: 44,
    justifyContent: "center",
  },
  txt: {
    fontSize: 24,
    color: '#333',
    flex: 1,
    alignSelf: 'stretch',
    margin: 10,
    alignItems: 'center',
    justifyContent: 'center',
    borderBottomWidth: 5,
    borderBottomColor: '#eeee',
},
})
export default App;
