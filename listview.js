import React, { Component } from 'react';
import { StyleSheet, Text, View, Alert, ScrollView } from 'react-native';
import { SQLite } from 'expo-sqlite';
import moment from "moment";


const db = SQLite.openDatabase('newdb.db');
let display = [1,2,3,4];
let objects= [1,2,3,4];
let arraylength = 0;
let i=0;


class Listview extends Component{

  render()
  {
    
    db.transaction(
        tx=>{
          tx.executeSql('update test1 set sessionlen= timewakeup - timetosleep');  
          tx.executeSql('select * from test1 order by creationtiemstamp dsec',[],(_,results)=>{
           
            objects = results.rows._array.splice(1,20);
            // arraylength = objects.length;
            // console.log(objects.length);
            // console.log(results.rows._array);
            // console.log(results.rows._array[0].id);
                      
                },
            );        
          },
        ); 
 
    return(
        objects.map(object=>
        <View key={object.id} style={{flexDirection: 'row'}}>
           
              <Text>
                to sleep:{moment(object.timetosleep).format('MM-DD HH:MM')} 
              </Text>
              <Text> | </Text>
              <Text>
                wakeup:{moment(object.timewakeup).format('MM-DD HH:MM')} 
              </Text>
              <Text> {object.sessionlens} hrs</Text>
  

        </View>
        )
      )
  }
}

export default Listview;