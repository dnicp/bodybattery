import React, {Component} from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Button,Alert } from 'react-native';
import moment from "moment";


var std_full_sleep = 8;

export default class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      current_time: null,
      time_to_sleep: null,
      time_wokeup: null,
      hours_slept: null,
      battery_percentage: 0,


    }
  
  };

  componentDidMount(){

    this.timerID = setInterval(
      ()=>this.tick(), 1000
    );
  };

  componentWillMount(){
    clearInterval(this.timerID);
  };


  tick(){

    let hours_slept = 100;
    

    this.setState(
   
      {
        current_time: new Date().toLocaleTimeString(),
        battery_percentage: hours_slept,
        
      }
      )
  };

  handleLogSleepTime=(event)=>
  {

    this.setState({
      time_to_sleep: this.state.current_time,
    })
    var now  = moment();
    var then = "02/09/2013 14:20:30";

    final = moment.utc(moment(now,"DD/MM/YYYY HH:mm:ss").diff(moment(then,"DD/MM/YYYY HH:mm:ss"))).format("HH:mm:ss")
    console.log(final);

  };

  handleLogWakeUpTime=(event)=>
  {
    this.setState ({time_wokeup: this.state.current_time})
  };



  render(){


    return (
        <View style={styles.container}>
          <Text>Current Time: {this.state.current_time}</Text>
          <Text>Time went to sleep: {this.state.time_to_sleep}</Text>
          <Text>Time woke up: {this.state.time_wokeup}</Text>
          <Text>Battery: {this.state.battery_percentage}</Text>
          <Button title="log sleep time" onPress = {this.handleLogSleepTime}/>
          <Text> </Text>
          <Button title="log wake up time" onPress = {this.handleLogWakeUpTime}/>
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
