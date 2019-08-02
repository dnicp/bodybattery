import React, {Component} from 'react';
import { StyleSheet, Text, View, ScrollView } from 'react-native';
import { Button,Alert } from 'react-native';
import moment from "moment";
import { SQLite } from 'expo-sqlite';
import * as FileSystem from 'expo-file-system';
import Listview from './listview.js'



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
      currentsessionid:'',
      currentsessionlen: 0.0,
      turntable: 'sleep',


    }


  
  };

  componentDidMount(){

    this.timerID = setInterval(
      ()=>this.tick(), 1000
    );

    // db creation
    db.transaction(
      tx => {
      // tx.executeSql("drop table if exists test1");

      tx.executeSql("create table if not exists test1 (id text, sessionlen real, timetosleep text, timewakeup text,creationtimestamp);");
     // add some records
    //  tx.executeSql('insert into test1 (id,sessionlen, timetosleep, timewakeup,creationtimestamp) VALUES (?,?,?,?,?)',[this.uuidv4(),2.0, "2019-07-27 10:07:46","2019-07-30 8:57:46","2019-07-27 10:07:46"]);
    //   tx.executeSql('insert into test1 (id,sessionlen, timetosleep, timewakeup,creationtimestamp) VALUES (?,?,?,?,?)',[this.uuidv4(),2.0, "2019-07-27 10:07:46","2019-07-30 8:57:46","2019-07-27 10:07:46"]);
    //   tx.executeSql('insert into test1 (id,sessionlen, timetosleep, timewakeup,creationtimestamp) VALUES (?,?,?,?,?)',[this.uuidv4(),2.0, "2019-07-27 10:07:46","2019-07-30 8:57:46","2019-07-27 10:07:46"]);
      

      tx.executeSql('select * from test1',[],(_,results)=>{
        console.log('db length: '+results.rows.length);
        // console.log(results.rows._array);
      // console.log(results.rows._array[0].id);
          },
      );        
    },
    ()=>console.log('error create db'),
    ()=>console.log('success create db')
  
    );

    // check the database

    // db.transaction(
    //   tx=>{
    //         tx.executeSql('select * from test1',[],(_,results)=>{
    //         console.log(results.rows.length);
    //         console.log(results.rows._array);
    //       },
    //       ()=>console.log('error'),
    //       ()=>console.log('success')
    //       );        
    //     },
    //   );  


    // assign current session id

    // db.transaction(
    //   tx=>{
    //       // insrt some dummy records into transactions
    //       tx.executeSql('insert into test1 (id,sessionlen, timetosleep, timewakeup) VALUES (?,?,?,?)',[this.uuidv4(),4, "2019-07-30 11:07:46",]);
    //       tx.executeSql('insert into test1 (id,sessionlen, timetosleep, timewakeup) VALUES (?,?,?,?)',[this.uuidv4(),2.0, "2019-07-29 10:07:46","2019-07-30 8:57:46"]);
    //       tx.executeSql('insert into test1 (id,sessionlen, timetosleep, timewakeup) VALUES (?,?,?,?)',[this.uuidv4(),2.0, "2019-07-27 10:07:46","2019-07-30 8:57:46"]);
             
    //     },
    //     ()=>console.log('data inserted'),
    //     ()=>console.log('data insert error')
    //   );  

    // db.transaction(
    //   tx=>{
    //     // find the last session that the duration is over 3hr
    //         tx.executeSql('select * from test1 where timewakeup is null',[],(_,results)=>{
    //         this.setState({currentsessionid: results.rows.item(0).id});
    //       },
    //       ()=>console.log('found last record'),
    //       ()=>console.log('query error')
    //       );        
    //     },
    //   );  

     
    

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
    this.setState({time_to_sleep: moment(),turntable:'wakeup'});

    db.transaction(
      tx=>{
          tx.executeSql('insert into test1 (id,timetosleep) VALUES (?,?)',[this.uuidv4(),this.state.time_to_sleep]);
        },
        ()=>console.log('sleep time wrote to db'),()=>console.log('sleep time writting to db error')
      );  
  };

  handleLogWakeUpTime=(event)=>
  {
    this.setState ({time_wokeup: moment(),turntable:'sleep'});
    // write timestamp into db
    db.transaction(
      tx=>{
        // find the last session that the duration is over 3hr
            tx.executeSql('update test1 set timewakeup=? where id=?',[this.state.time_wokeup,this.state.currentsessionid],(_,results)=>{
              this.setState({time_to_sleep: results.rows.item(0).timetosleep});
            });
            this.setState({currentsessionlen: this.state.time_wokeup.diff(this.state.time_to_sleep,'hours',true)});
            tx.executeSql('update test1 set sessionlen=? where id=?',[this.state.currentsessionlen,this.state.currentsessionid]);
        },
        ()=>console.log('wakeup time wrote to db'),
        ()=>console.log('wakeup time writting to db error')
      );

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
          <Button title="sqlite" />
          <Text> current session length: {this.state.currentsessionlen} </Text>
          <Text> turn table: {this.state.turntable} </Text>
          <ScrollView containerstyle = "alignitems"><Listview /></ScrollView>
           
          
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
