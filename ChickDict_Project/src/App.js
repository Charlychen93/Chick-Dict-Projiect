import React ,{Component} from 'react';
import {HashRouter,Route,Redirect} from 'react-router-dom'
// import {Redirect} from 'react-router-dom'
// import KeepAlive from 'react-activation';
//引入重置样式文件-fan
import './reset.css'

//设置懒加载 - cy
import loadalbe from "./utils/loadable"
import First from './pages/Comments/First'
//引入用户组件 - cy
const UserList = loadalbe(()=>import ('./pages/UserManage/UserList'))
const UserEdit = loadalbe(()=>import ('./pages/UserManage/UserEdit'))
//引入数据统计表格 - cy
const EchartsPie = loadalbe(()=>import ('./pages/Echarts/Pie'))
const EchartsLine = loadalbe(()=>import ('./pages/Echarts/Line'))
const EchartsPiano = loadalbe(()=>import ('./pages/Echarts/Piano'))
const Admin = loadalbe(()=>import('./pages/Admin'))
//引入热门话题 -fan
const HotList = loadalbe(()=>import('./pages/Hot/HotList'))
const AddHot = loadalbe(()=>import('./pages/Hot/AddHot'))
const Home = loadalbe(()=>import('./pages/Home'))

//引入空状态组件-fan
const Empty = loadalbe(()=>import('./pages/Empty'))

//设置懒加载 - cy 
const Login = loadalbe(()=>import('./pages/Login'))
//引入词典管理 -xhp
const DicList = loadalbe(()=>import('./pages/DicManage/DicList'))
const DicAdd = loadalbe(()=>import('./pages/DicManage/DicAdd'))
const DicUpdate = loadalbe(()=>import('./pages/DicManage/DicUpdate'))

//引入评论管理-fan
const Second = loadalbe(()=>import('./pages/Comments/Second'))


class App extends Component{
    render(){
      return(
          <HashRouter>
          <Route path='/login' component={Login}>
          </Route>
          <Route path='/admin' render ={()=>{
            return(
              <Admin>
                <Route path='/admin/user/userlist' component={UserList}></Route>
                <Route path='/admin/user/useredit' component={UserEdit}></Route>
                <Route path='/admin/echarts/pie' component={EchartsPie}></Route>
                <Route path='/admin/echarts/line' component={EchartsLine}></Route>
                <Route path='/admin/echarts/piano' component={EchartsPiano}></Route>
                <Route path="/admin/hot/list" component={HotList}></Route>
                <Route path="/admin/hot/add" component={AddHot}></Route>
                <Route path="/admin/home" component={Home}></Route> 
                <Route path="/admin/dicmanage/dicinfo" component={DicList}></Route>
                <Route path="/admin/dicmanage/dicadd" component={DicAdd}></Route>
                <Route path="/admin/dicmanage/dicupdate/:id" component={DicUpdate}></Route>
                <Route path="/admin/echarts" component={Empty}></Route>
                <Route path='/admin/comments/first' component={First}></Route>
                <Route path="/admin/comments/second" component={Second}></Route>
              </Admin>
            )
          }}></Route>

          <Redirect  from="/" to="/admin/home"></Redirect>
        </HashRouter>
        
      )
    }
  }
export default App;
