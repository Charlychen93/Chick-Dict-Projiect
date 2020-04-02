import React from 'react'
import LoadAble from 'react-loadable'
import { Empty } from 'antd';
function LogingComponent (){
    return(
      <Empty />
    )
  }
  
  export default (LoadComponent)=>{
    return LoadAble({
      loader:LoadComponent,
      loading:LogingComponent
    })
  } 