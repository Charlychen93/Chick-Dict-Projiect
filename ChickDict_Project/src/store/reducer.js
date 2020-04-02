import state from './state'
import {CHANGE_TOKEN_MODAL} from './actionType'
export default (prevState=state,action)=>{
  let newData = JSON.parse(JSON.stringify(prevState))
  let {type,payload} = action
  switch (type) {
    case CHANGE_TOKEN_MODAL:
      newData.tokenModal = payload
      break;
  
    default:
      break;
  }
  return newData
}