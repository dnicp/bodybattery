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
      id:0,


    }


  
  };

  componentDidMount(){

    this.timerID = setInterval(
      ()=>this.tick(), 1000
    );

    // db creation
    db.transaction(tx => {
      // temp to delete
      tx.executeSql("drop table if exists test1");
      // temp to delete above
      tx.executeSql("create table if not exists test1 (id text, timetosleep text, timewakeup text);");
    },
    ()=>console.log('error create db'),
    ()=>console.log('success create db')
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

  
  handleLogSleepTime=(event)=>
  {

    this.setState({
      time_to_sleep: moment(),
    });

    let timetosleep_record = moment(this.state.time_to_sleep).format('YYYY-MM-DD HH:MM:SS');
    let uuid = this.uuidv4();

    db.transaction(
      tx=>{

          tx.executeSql('insert into test1 (id,timetosleep) VALUES (?,?)',[uuid],timetosleep_record);
         
          tx.executeSql('select * from test1 where id = ?',[uuid],(_,results)=>{
              console.log(results.rows.item(0));
            }
          );        

        },
        ()=>console.log('error transaction'),
        ()=>console.log('success transaction')
      );  



  };

  handleLogWakeUpTime=(event)=>
  {
    this.setState ({time_wokeup: moment()})
  };

  
  
  sqliteQuery=()=>{
    

    db.transaction(
      tx=>{
          tx.executeSql('insert into test4 (id,name,address) VALUES (?,"daniel","somewhere1")',[this.uuidv4()]);
          tx.executeSql('insert into test4 (id,name,address) VALUES (?,"caroline","somewhere2")',[this.uuidv4()]);
          tx.executeSql('select * from test4 where name = ?',['daniel'],(_,results)=>{
              console.log(results.rows.item(0).id);
              this.setState({name: results.rows.item(0).id});
            }
          );        

        },
        ()=>console.log('error transaction'),
        ()=>console.log('success transaction')
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
          <Text></Text>
          <Button title="log wake up time" onPress = {this.handleLogWakeUpTime}/>
          <Text> </Text>
          <Button title="sqlite" onPress = {this.sqliteQuery} />
          <Text> id: {this.state.name} </Text>
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
