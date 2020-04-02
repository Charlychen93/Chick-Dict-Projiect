import {CHANGE_TOKEN_MODAL} from './actionType'

export default {
  [CHANGE_TOKEN_MODAL](boolean){
    return{
      type:CHANGE_TOKEN_MODAL,
      payload:boolean
    }
  }
}