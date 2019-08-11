import React, {Component} from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Button,Alert,AsyncStorage } from 'react-native';
import moment from "moment";




var std_full_sleep = 8;

export default class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      current_time: moment(),
      time_to_sleep: moment(),
      time_wokeup: moment(),
      hours_slept:0,
      battery_percentage: 0,
      
      id:0,
      currentsessionid:'',
      currentsessionlen: 0.0,
      turntable: 'sleep',


    }


  
  };


  componentDidMount(){

    this.timerID = setInterval(
      ()=>this.tick(), 1000
    );

    this.async_storeData();
    this.async_retrieveData();

  };

  componentWillMount(){
    clearInterval(this.timerID);

  };

  roundTo(n, digits) {
    var negative = false;
    if (digits === undefined) {
        digits = 0;
    }
        if( n < 0) {
        negative = true;
      n = n * -1;
    }
    var multiplicator = Math.pow(10, digits);
    n = parseFloat((n * multiplicator).toFixed(11));
    n = (Math.round(n) / multiplicator).toFixed(2);
    if( negative ) {    
        n = (n * -1).toFixed(2);
    }
    return n;
}

  tick(){

    let hours_slept = this.state.time_wokeup.diff(this.state.time_to_sleep,'hours',true);
    let start_capacity = hours_slept/std_full_sleep;
    let consumptionPercent = this.state.current_time.diff(this.state.time_wokeup,'hours',true)/std_full_sleep;
    let battery_percentage = this.roundTo((start_capacity - consumptionPercent)*100,5);


    this.setState(
   
      {
        current_time: moment(),
        battery_percentage: battery_percentage,
        
      }
      )
  };

  async_storeData = async () => {
    try {
      await AsyncStorage.setItem('key3',this.state.turntable);
    } catch (error) {
      // Error saving data
    }
  };

  async_retrieveData = async () => {
    try {
      const value = await AsyncStorage.getItem('key3');
      if (value !== null) {
        // We have data!!
        console.log(value);
      }
    } catch (error) {
      // Error retrieving data
    }
  };

  // id method2
  uuidv4() {
    var d = new Date().getTime();
    if (typeof performance !== 'undefined' && typeof performance.now === 'function'){
        d += performance.now(); //use high-precision timer if available
    }
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
        var r = (d + Math.random() * 16) % 16 | 0;
        d = Math.floor(d / 16);
        return (c === 'x' ? r : (r & 0x3 | 0x8)).toString(16);
    });
  }

  // id method 1
  getId=()=>{this.setState({id: this.state.id});return(this.state.id+1);};
  
  handleLogSleepTime=(event)=>
  {
    

  };

  handleLogWakeUpTime=(event)=>
  {
   

  };

  render(){

    return (
        <View style={styles.container}>
          <Text>Current Time: {this.state.current_time.format("MMMM Do YYYY, h:mm:ss a")}</Text>
          <Text>Time went to sleep: {this.state.time_to_sleep.format("Do YYYY,h:mm:ss a")}</Text>
          <Text>Time woke up: {this.state.time_wokeup.format("Do YYYY,h:mm:ss a")}</Text>
          <Text>Battery: {this.state.battery_percentage}%</Text>
          <Button title="sleep now" onPress = {this.handleLogSleepTime}/>
          <Text></Text>
          <Button title="log wake up time" onPress = {this.handleLogWakeUpTime}/>
          <Text> </Text>
          <Button title="Async" />
          <Text> current session length: {this.state.currentsessionlen} </Text>
          <Text> turn table: {this.state.turntable} </Text>
      </View>
     
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
