import React, {Component} from 'react';
import {Card,Input,Select,Button,Avatar,Popconfirm} from 'antd';
import style from './index.module.less';
import UserApi from '../../../api/userManage';
import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'

const {Option} =Select;

class UserEdit extends Component{
    state={
        _id:'',
        name:'',
        avator:'',
        identity:'',
        limits:''
    }
    componentDidMount(){
        // console.log("state",this.props.location.state)
        let {_id,name,avator,identity,limit}=this.props.location.state;
        // console.log("信息",{_id,name,avator,identity})
        this.setState({_id:_id,name:name,avator:avator,identity:identity,limits:limit});
        
    }
    async submitChange(){
        let _id=this.state._id;
        let user=this.state.name;
        let pass = this.state.pass;
        let img = this.state.avator || '';
        let leavel =this.state.identity==="会员"?"admin":"root";
        // console.log({_id,user,pass,img,leavel})
        UserApi.userEdit({_id,user,pass,img,leavel})
        // console.log(result)
        this.props.history.push('/admin/user/userlist')
    }
    render(){
        return(
            
            <div>
            <Card title='用户信息编辑'>
            <p className={style.message}>编辑用户名</p>
            <Input value={this.state.name} onChange={(e)=>{
                this.setState({name:e.target.value})
            }}/>
            <p className={style.message} value="********">编辑新密码</p>
            <Input onChange={e=>{
                this.setState({pass:e.target.value})
            }}/>
            <p className={style.message}>编辑用户头像</p>
            <Input placeholder="请输入网络头像地址" className={style.avatar} onChange={e=>{
                this.setState({avator:e.target.value})
            }}/>
            {this.state.avator?
            <Avatar src={this.state.avator} shape="square" />:
            <Avatar icon="user" shape="square"/>
            }
            <p className={style.message}>编辑用户身份</p>
            {this.state.limits==="root"?
            <Select defaultValue={this.state.identity} onChange={(e)=>{
                // console.log(e)
                this.setState({identity:e})
            }}>
                <Option value="root">超级管理员</Option>
                <Option value="admin">会员</Option>
            </Select>:null
            }
            <p className={style.btns}>
            <Popconfirm title="你确定提交吗？" onConfirm={()=>{
            if(this.state.name && this.state.pass ){
                  this.submitChange()         
            }else{
                return false
            }
            }}>
            <Button type="danger" className={style.btn1}>提交</Button>
            </Popconfirm>
            <Button type="primary" onClick={()=>{
                this.props.history.push('/admin/user/userlist');
            }}>返回</Button>
            </p>
               </Card>
            </div>
        )
    }
}

// export default UserEdit;
export default connect(state => state)(withRouter(UserEdit));