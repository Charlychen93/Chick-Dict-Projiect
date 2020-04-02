import { Empty } from 'antd';
import React, { Component } from 'react';

class index extends Component {
  state={
    leavel:'admin'
  }
  componentDidMount(){
    if(localStorage.getItem('user')){
      let result = JSON.parse(localStorage.getItem('user'))
      let leavel = result.leavel
      this.setState({leavel})
    }
  }
  render() {
    let {leavel} = this.state
    return (
      <div>
        {leavel==='admin'?<Empty description="权限不足"/>:""}
      </div>
    );
  }
}

export default index;
