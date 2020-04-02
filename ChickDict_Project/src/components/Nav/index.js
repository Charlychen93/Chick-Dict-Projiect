import React, { Component } from 'react';
import { Menu,Icon,message} from 'antd';
import list from './list'
import {withRouter} from 'react-router-dom'
const { SubMenu } = Menu;

class Nav extends Component {
  state={
    leavel:'admin'
  }
  //点击事件
  handleClick = e => {
    let {path} = e.item.props 
    this.props.history.replace(path)
  
  };
  //获取权限
  componentDidMount(){
    //通过localstorage获取权限
    if(localStorage.getItem('user') && localStorage.getItem('token')){
      let leavel = JSON.parse(localStorage.getItem('user')).leavel
      if(leavel === 'root'){
        message.success('当前用户为超级管理员')
      }else{
        message.success('当前用户为普通用户')
      }
      this.setState({leavel})
    }
  }
  getIcon(icon){
    switch (icon) {
      case 'user':
        return 'user'
      case 'echarts':
        return 'fund'
      case 'hot':
        return 'fire'
      case 'add':
        return 'plus-circle'
      case 'pie':
        return 'pie-chart'
      case 'search':
        return 'search'
      case 'line':
        return 'line-chart'
      case 'heat-map':
        return 'heat-map'
      case 'home':
        return 'home'
      case 'list':
        return 'container'
      case 'dicmanage':
        return 'read'
      case 'comments':
        return 'message'
      default:
        return 'global'
    }
  }
  renderItem=(data)=>{
    return data.map((item,index)=>{
      let icon = this.getIcon(item.icon)
      if(item.children){
        return (
          <SubMenu
            key={item.key}
            title={
              <span>
                <Icon type={icon} />
                <span>{item.title}</span>
              </span>
            }
            onClick={this.handleClick.bind(this)}
          >
            {this.renderItem(item.children)}
          </SubMenu>
        )
      }else{
        return (
          <Menu.Item key={item.key} path={item.path}>
            <Icon type={icon} />
            <span>{item.title}</span>
          </Menu.Item>
        )
      }
    })
  }
  render() {
    let {leavel} = this.state
    return (
      <div style={{ width: 200 }}>
        <Menu
        onClick={this.handleClick}
        defaultSelectedKeys={['1']}
        defaultOpenKeys={['sub1']}
        mode="inline"
        theme="dark"
      >
        {this.renderItem(list[leavel])}
      </Menu>
      </div>
      
    );
  }
}

export default withRouter(Nav);