import React, { Component } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { SQLite } from 'expo-sqlite';


const db = SQLite.openDatabase('newdb.db');

class Listview extends Component{

  render()
  {
    let temparray=[];
    db.transaction(
        tx=>{
              tx.executeSql('select * from test1',[],(_,results)=>{
            //   console.log(results.rows.length);
            //   console.log(results.rows._array);
            // console.log(results.rows._array[0].id);
              
                },
            );        
          },
        ); 
    
 
    return(
        
    temparray.map(array=><Text key>({array.id})</Text>)
      )
  }
}

export default Listview;