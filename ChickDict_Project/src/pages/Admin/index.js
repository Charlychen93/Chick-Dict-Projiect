import React, { Component } from 'react';
import { withRouter } from 'react-router-dom'
import Nav from '../../components/Nav'
import Modal from '../tokenModal'
import style from './admin.module.less'
import { Layout, Breadcrumb, Button, Dropdown, Menu, Icon, Avatar } from 'antd';
import { connect } from 'react-redux'
import userManage from '../../api/userManage'
const { Header, Content, Footer, Sider } = Layout;


class Admin extends Component {
  state = {
    collapsed: false,
    user: '',
    show: false,
    administrator: '',
    page: '1',
    pageSize: '100',
    imgSrc: '',
    name: '',
    locationList: ''
  };

  onCollapse = collapsed => {
    this.setState({ collapsed });
  };
  toLogin = () => {
    this.props.history.push('/login')
    localStorage.removeItem('token')
  }
  changeUl = () => {
    this.setState({ visiable: true })
  }
  componentDidMount() {
    // 获取头像和_id
    if (localStorage.getItem('user')) {
      let { page, pageSize } = this.state
      userManage.userQuery({ page, pageSize }).then((res) => {
        // console.log(res)
        let { _id } = JSON.parse(localStorage.getItem('user'))
        res.list.forEach((item) => {
          let id = item._id
          if (id === _id) {
            this.setState({ imgSrc: item.img, name: item.user })
          }
        })
      })
    }else{
      this.props.history.push('/login')
    }

    // console.log(window.location.hash)
    //获取用户名
    if (localStorage.getItem('user')) {
      let result = JSON.parse(localStorage.getItem('user'))
      this.setState({ user: result.user })
      // console.log(result.leavel)
      if (result.leavel === 'root') {
        this.setState({ administrator: 1 })
      }
    }
    let token = localStorage.getItem('token')
    if (token) {
      this.setState({ show: true })
    }
    // console.log(this.props)
  }
  exitLogin = () => {
    localStorage.setItem('user', '')
    this.setState({ user: '' })
  }


  render() {
    const menu = (
      <Menu>
        <Menu.Item key='1'>
          {/* <Button onClick={this.changeUl}>个人中心</Button> */}
          <Avatar src={this.state.imgSrc}></Avatar>
          <span style={{ margin: '0 10px' }}>{this.state.name}</span>
        </Menu.Item>
        <Menu.Item key='2' >
          <Button onClick={this.toLogin}>退出登录</Button>
        </Menu.Item>
      </Menu>)
    let { tokenModal } = this.props
    // console.log(tokenModal)
    let { show, administrator } = this.state
    return (
      <Layout style={{ minHeight: '100vh' }}>
        {tokenModal ? <Modal></Modal> : ''}
        <Sider collapsible collapsed={this.state.collapsed} onCollapse={this.onCollapse}>
          <div className={style.logo}>
          </div>
          <Nav></Nav>
        </Sider>
        <Layout className="site-layout">
          <Header className={style.header} style={{ padding: 0 }}>
            <div className={style.headerDiv}>
              <div className={style.headerBg}></div>
            </div>
            <div className={style.right}>

              {!show || <Dropdown overlay={menu} className={style.Dropdown}>
                <span className={style.headerBtn} >
                  {administrator === 1 ? '超级管理员' : '会员'}<Icon type="down" />
                </span>
                {/* <span className={style.headerBtn} >
                {administrator === 1 ? '超级管理员' : '普通管理员'}<Icon type="down" />
                </span> */}
              </Dropdown>}

            </div>
            {/* <Button type="link" onClick={this.toLogin} className={style.login}>登录</Button> */}
          </Header>
          <Content >
            {/*cy修改*/}
            <Breadcrumb style={{ margin: '16px 20px 16px' }}>
              <Breadcrumb.Item href={`http://localhost:3000/admin#/admin/home`}>
                <Icon type={"setting"} style={{ marginRight: "5px" }} />
                {
                  this.props.location.pathname.split('/')[1]
                }</Breadcrumb.Item>
              <Breadcrumb.Item href={`http://localhost:3000/admin#/admin/${this.props.location.pathname.split('/')[2]}`}>
                <Icon type={"sync"} style={{ marginRight: "5px" }} />
                {
                  this.props.location.pathname.split('/')[2]
                }</Breadcrumb.Item>
              {this.props.location.pathname.split('/')[3] ?
                <Breadcrumb.Item href={`http://localhost:3000/admin#/admin/${this.props.location.pathname.split('/')[2]}/${this.props.location.pathname.split('/')[3]}`}>
                  <Icon type={"tag"} style={{ marginRight: "5px" }} />
                  {
                    this.props.location.pathname.split('/')[3]
                  }</Breadcrumb.Item> : null
              }


            </Breadcrumb>
            <div className="site-layout-background" style={{ padding: 24, minHeight: 360 }}>
              {/* {this.setState({locationList:this.props.location.pathname.split('/')})} */}
              {this.props.children}
            </div>
          </Content>
          <Footer style={{ textAlign: 'center' }}>Ant Design ©2018 Created by Ant UED</Footer>
        </Layout>
      </Layout>
    );
  }
}

export default connect(state => state)(withRouter(Admin));