import React, {Component} from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Button,Alert } from 'react-native';
import moment from "moment";
import { SQLite } from 'expo-sqlite';



var std_full_sleep = 8;
const db = SQLite.openDatabase('newdb.db');

export default class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      current_time: moment(),
      time_to_sleep: moment(),
      time_wokeup: moment(),
      hours_slept:0,
      battery_percentage: 0,
      name:'',


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

  handleLogSleepTime=(event)=>
  {

    this.setState({
      time_to_sleep: moment(),
    })
    



  };

  handleLogWakeUpTime=(event)=>
  {
    this.setState ({time_wokeup: moment()})
  };

  
  
  sqliteQuery=()=>{
    db.transaction(tx => {
      tx.executeSql("create table if not exists text1 (id integer primary key not null, name text, address text);");
    },
    console.log('error create db'),
    console.log('success create db')
    );

    db.transaction(
      (tx)=>{
          tx.executeSql('insrt into text1 (id,name,address) VALUES (1,"daniel","somewhere") ',);    
          tx.executeSql('insrt into text1 (id,name,address) VALUES (2,"caroline","somewhere2")',);
          tx.executeSql('select * from text1',[],(_,{rows})=>{console.log(rows)});
        },
        console.log('error transaction'),
        console.log('success transaction')
      );  
    };


  render(){

    return (
        <View style={styles.container}>
          <Text>Current Time: {this.state.current_time.format("MMMM Do YYYY, h:mm:ss a")}</Text>
          <Text>Time went to sleep: {this.state.time_to_sleep.format("Do YYYY,h:mm:ss a")}</Text>
          <Text>Time woke up: {this.state.time_wokeup.format("Do YYYY,h:mm:ss a")}</Text>
          <Text>Battery: {this.state.battery_percentage}%</Text>
          <Button title="log sleep time" onPress = {this.handleLogSleepTime}/>
          <Text> </Text>
          <Button title="log wake up time" onPress = {this.handleLogWakeUpTime}/>
          <Text> </Text>
          <Button title="sqlite" onPress = {this.sqliteQuery} />
          <Text> name: {this.state.name} </Text>
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
