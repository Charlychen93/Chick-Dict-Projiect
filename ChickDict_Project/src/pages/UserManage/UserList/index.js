import React, {Component} from 'react';
import style from './index.module.less';
import LazyLoad from 'react-lazyload';
import { Table, Input, Button, Icon, Pagination ,Card, message,Popconfirm,Alert,Spin,Avatar} from 'antd';
import Highlighter from 'react-highlight-words';
import XLSX from 'xlsx'
import UserApi from '../../../api/userManage'
// import { withRouter } from 'react-router-dom'
// import { connect } from 'react-redux'
// let rootpath = 'http://39.99.195.178:3000'
class UserList extends Component{
    state={
        searchText:'',
        searchedColumn:'',
        page:1,
        pageSize:5,
        count:1,
        data:[],
        delSign:false,
        loading:true,
        limit:''
    }
    getUserData = async()=>{
        let {page,pageSize} =this.state
        let {list,msg,err,allCount} =await UserApi.userQuery({page,pageSize})
        // console.log(list)
        if(err !==0){ return message.error(msg)}
        let result=list.map((item,index)=>{
            return {
                key:index+1,
                _id:item._id,
                name:item.user,
                avator:item.img||'',
                identity:item.leavel === 'root'?'超级管理员':'会员',
                handle:''
            }
        })
        this.setState({data:result,count:allCount,loading:false})
    }
    componentDidMount(){
        this.getUserData()
        if(localStorage.getItem("user")){
          // console.log(localStorage.getItem("user"))
          let result=JSON.parse(localStorage.getItem("user")).leavel
          this.setState({limit:result})
        }
        // let result=JSON.parse(localStorage.getItem('user'))
        // console.log(result.leavel)
    }
    delUser=async (_id,identity)=>{
        if(identity==='超级管理员'){
            return false
        }
        await UserApi.userDel({_id})
        this.getUserData()
        // console.log(result)
    }
    getColumnSearchProps = dataIndex => ({
        filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters }) => (
          <div style={{ padding: 8 }}>
            <Input
              ref={node => {
                this.searchInput = node;
              }}
              placeholder={`Search ${dataIndex}`}
              value={selectedKeys[0]}
              onChange={e => setSelectedKeys(e.target.value ? [e.target.value] : [])}
              onPressEnter={() => this.handleSearch(selectedKeys, confirm, dataIndex)}
              style={{ width: 188, marginBottom: 8, display: 'block' }}
            />
            <Button
              type="primary"
              onClick={() => this.handleSearch(selectedKeys, confirm, dataIndex)}
              icon="search"
              size="small"
              style={{ width: 90, marginRight: 8 }}
            >
              搜索
            </Button>
            <Button onClick={() => this.handleReset(clearFilters)} size="small" style={{ width: 90 }}>
              重置
            </Button>
          </div>
        ),
        filterIcon: filtered => (
          <Icon type="search" style={{ color: filtered ? '#1890ff' : undefined }} />
        ),
        onFilter: (value, record) =>
          record[dataIndex]
            .toString()
            .toLowerCase()
            .includes(value.toLowerCase()),
        onFilterDropdownVisibleChange: visible => {
          if (visible) {
            setTimeout(() => this.searchInput.select());
          }
        },
        render: text =>
          this.state.searchedColumn === dataIndex ? (
            <Highlighter
              highlightStyle={{ backgroundColor: '#ffc069', padding: 0 }}
              searchWords={[this.state.searchText]}
              autoEscape
              textToHighlight={text.toString()}
            />
          ) : (
            text
          ),
      });
    
      handleSearch = (selectedKeys, confirm, dataIndex) => {
        confirm();
        this.setState({
          searchText: selectedKeys[0],
          searchedColumn: dataIndex,
        });
      };
    
      handleReset = clearFilters => {
        clearFilters();
        this.setState({ searchText: '' });
      };
      handleClose = () => {
        this.setState({ delSign: false });
      };
      exportAll(){
          if(this.state.loading) {return false}
          let thead=this.state.columns.map((item)=>{
              return item.title
          })
          let list=this.state.data.map((item)=>{
              let arr =[]
              for(const key in item){
                  if(key !== 'key'){
                    arr.push(item[key])
                }
              }
              return arr
          })
          let result = [thead,...list]
          let sheet=XLSX.utils.aoa_to_sheet(result);
          let wb=XLSX.utils.book_new()
          XLSX.utils.book_append_sheet(wb,sheet)
          XLSX.writeFile(wb,'小鸡用户.xlsx')
            }
    render(){
        const  columns=[
            {
                title: 'ID',
                dataIndex: '_id',
                key: '_id',
                // width: 200,
                align:'center',
                // fixed:'left',
                ...this.getColumnSearchProps('_id'),
              },
              {
                title: '用户',
                dataIndex: 'name',
                key: 'name',
                // width: 150,
                align:'center',
                ...this.getColumnSearchProps('name'),
              },
              {
                title: '头像',
                dataIndex: 'avator',
                key: 'avator',
                // width: 150,
                align:'center',
                //图片路径
                render:(avator)=>{
                    return (
                      <LazyLoad>
                        <Avatar  src={avator} alt='暂无图片' width='40' height='40' type="circle"/>
                      </LazyLoad>
                    )
                }
              },
              {
                title: '身份',
                dataIndex: 'identity',
                key: 'identity',
                // width:200,
                align:'center',
                ...this.getColumnSearchProps('identity'),
              },
              {
                title: '操作',
                key: 'handle',
                // width:200,
                // fixed:'right',
                align:'center',
                render:(text,record,index)=>{
                    return(
                    <div>
                    <Popconfirm title='你确定要删除该用户吗?' onConfirm={()=>{
                        let result=this.delUser(record._id,record.identity)
                        this.setState({delSign:!result})
                    }}>
                    <Button type='danger' size='small'>删除此用户
                    </Button>
                    </Popconfirm>
                    <Button type='primary' size='small' className={style.change}
                    onClick={()=>{
                      // console.log(record)
                      this.props.history.push({pathname:'/admin/user/useredit',state:{
                        _id:record._id,
                        name:record.name,
                        avator:record.avator,
                        identity:record.identity,
                        limit:this.state.limit
                      }})
                    }}
                    >修改
                    </Button>
                    </div>
                    )
                }
              }
        ]
        return(
            <div className={style.box}>
                       <Card title='小鸡词典用户' className={style.card}>
                       <Button type='primary' className={style.export} onClick={()=>{
                     if(this.state.loading) {return false}
                     let thead=columns.map((item)=>{
                         return item.title
                     })
                     let list=this.state.data.map((item)=>{
                         let arr =[]
                         for(const key in item){
                             if(key !== 'key'){
                               arr.push(item[key])
                           }
                         }
                         return arr
                     })
                     let result = [thead,...list]
                     let sheet=XLSX.utils.aoa_to_sheet(result);
                     let wb=XLSX.utils.book_new()
                     XLSX.utils.book_append_sheet(wb,sheet)
                     XLSX.writeFile(wb,'小鸡用户.xlsx')
           
                       }}>
                           导出用户表格
                       </Button>
                       {this.state.delSign?(
                       <Alert
                       message="无法删除"
                       type="error"
                       closable='true'
                       className={style.alert}
                       onClose={()=>{
                           this.setState({delSign:false})
                       }}
                     />):null}
                     <Spin tip="Loading..." spinning={this.state.loading}>
                     <Table columns={columns} dataSource={this.state.data} 
                       scroll={{x:'max-content'}} 
                       rowKey='_id' pagination={false}
                       bordered={true}
                       />
                     </Spin>
                     <div className={style.page}>
                     <Pagination current={this.state.page} total={this.state.count} showQuickJumper pageSize={this.state.pageSize}
                       onChange={(page,pageSize)=>{
                           this.setState({page,loading:true},()=>{
                               this.getUserData()
                           })
                       }}
                       defaultCurrent={1}
                       />
                     </div>
                       </Card>           
            </div>
        )
    }
}
// export default connect(state => state)(withRouter(UserList));
export default UserList;