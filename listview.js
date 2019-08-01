import React, { Component } from 'react';
import { StyleSheet, Text, View, Alert } from 'react-native';
import { SQLite } from 'expo-sqlite';


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
            tx.executeSql('select * from test1',[],(_,results)=>{
           
            objects = results.rows._array.splice(1,10);
            // arraylength = objects.length;
            // console.log(objects.length);
            // console.log(results.rows._array);
            // console.log(results.rows._array[0].id);
                      
                },
            );        
          },
        ); 
 
    return(
        objects.map(object=><Text key={object.id}>{object.id}</Text>)
      )
  }
}

export default Listview;