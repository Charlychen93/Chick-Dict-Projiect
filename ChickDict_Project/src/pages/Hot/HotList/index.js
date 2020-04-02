import React, { Component } from 'react';
import {Icon,Button,Divider,Popconfirm,Modal,message,Form,Input,InputNumber,Table,Pagination,Spin} from 'antd'
import XLSX from "xlsx"

import style from './hot.module.less'
import hotApi from '../../../api/hot.js'
const { TextArea } = Input;
const { Search } = Input;
class Hot extends Component {
  state = {
    visible:false,
    confirmLoading:false,
    columns: [
      {
        title: '话题',
        dataIndex: 'name',
        width: 120,
        key:"name"
      },
      {
        title: '描述',
        dataIndex: 'desc',
        width: 180,
        key:"desc"
      },
      {
        title: '热度',
        dataIndex: 'hot',
        width: 80,
        key:"hot",
        defaultSortOrder: 'descend',
        sorter: (a, b) => a.hot - b.hot,
      },
      {
        title: '操作',
        width: 120,
        key:"options",
        render:(recode)=>{
          return (
            <div>
              <Popconfirm title="确认删除吗？" onConfirm={this.delConfirm.bind(this,recode._id)} okText="Yes" cancelText="No" icon={<Icon type="question-circle-o" style={{ color: 'red' }} />}>
                <Button type="link" size="small">删除</Button>
              </Popconfirm>
              <Divider type="vertical" />
              <Popconfirm onConfirm={this.updateConfirm.bind(this,recode._id)} title="确认修改吗？" okText="Yes" cancelText="No" icon={<Icon type="question-circle-o" style={{ color: 'red' }} />}>
                <Button type="link" size="small">编辑</Button>
              </Popconfirm>            
            </div>
          )
        }
      }
    ],
    data:[],
    page:1,
    pageSize:9,
    count:0,
    loading:true,
    username:'',
    name:'',
    note:null,
    id:'',
    leavel:''
  };
  //确认删除
  delConfirm(_id){
    this.setState({loading:true})
    hotApi.delTopic({_id})
    .then((data)=>{
      if(data.err === 0){
        message.warning('删除成功')
        this.getListData()
      }
      this.setState({loading:false})
    })
  }
  //确认编辑
  updateConfirm=async (_id)=>{
    // console.log(id)
    //根据id获取当前话题
    let result = await this.getTopicById({_id})
    if(!result.list){
      return 
    }
    let {name,desc,hot} = result.list[0]
    //将数据写入表单，让模态框显示
    this.props.form.setFieldsValue({
      username:name,
      name:desc,
      note: hot,
    });
    this.setState({visible:true,id:_id})
  }
  //确认修改
  handleSubmit = () => {
    this.setState({loading:false})
    this.props.form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        this.setState({loading:false})
        let {username,name,note} = values
        hotApi.updateTopic({name:username,desc:name,hot:note,_id:this.state.id})
        .then((data)=>{
          if(data.err === 0){
            message.success('编辑成功')
            this.setState({visible:false,loading:true})
            this.getListData()
          }
        })
      }else{
        message.warning('请完善表单信息');
      }
    });
  };

  //根据ID获取当前话题
  getTopicById=async (_id)=>{
    let result = await hotApi.getTopic({_id})
    return result
  }
  
  //编辑模态框关闭事件
  handleCancel = () => {
    this.setState({
      visible: false,
    });
  };
  //声明周期获取数据
  async componentDidMount(){
    if(localStorage.getItem('user')){
      let value = JSON.parse(localStorage.getItem('user'))
      this.setState({leavel:value.leavel})
    }
    this.getListData()
  }
  // 获取热门话题数据
  getListData= async ()=>{
    let {page,pageSize}  = this.state
    let {err,list,allCount} = await hotApi.getData({page,pageSize})
    if(err !== 0){ return }
    this.setState({data:list,count:allCount,loading:false})
  }
  //新建热门话题
  addTopic=()=>{
    if(this.state.leavel==='admin'){return message.warning('权限不足')}
    this.props.history.push('/admin/hot/add')
  }
  //关键字搜索
  kwSearch=async (e)=>{
    this.setState({loading:true})
    let {page,pageSize}  = this.state
    let {err,list,allCount} = await hotApi.getKwInfo({kw:e,page,pageSize})
    if(err !== 0){ return }
    this.setState({data:list,count:allCount,loading:false})
    message.success('关键字搜索完成')
  }
  //导出excel文件
  export=async ()=>{
    let thead = this.state.columns.map((item,index)=>{
      return item.title
    })
    thead.length = 3
    thead.unshift('id')
    //获取数据
    let {err,list} = await hotApi.getData({page:1,pageSize:1000})
    if(err===0){
      let newArr = list.map((item,index)=>{
        let arr = []
        for(let key in item){
          arr.push(item[key])
        }
        arr.length = 4
        return arr
      })
      let result = [thead,...newArr]
      // 将数组转化为标签页 
      var ws = XLSX.utils.aoa_to_sheet(result);
      // 创建工作薄
      var wb = XLSX.utils.book_new() 
      // 将标签页插入到工作薄里
      XLSX.utils.book_append_sheet(wb,ws)
      // 将工作薄导出为excel文件
      XLSX.writeFile(wb,'商品.xlsx');
    }
  }
  render() {
    let {columns,data,page,pageSize,count,loading,visible,confirmLoading} = this.state
    //表单配置
    const { getFieldDecorator } = this.props.form;

    const formItemLayout = {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 8 },
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 16 },
      },
    };
    const tailFormItemLayout = {
      wrapperCol: {
        xs: {
          span: 24,
          offset: 0,
        },
        sm: {
          span: 16,
          offset: 8,
        },
      },
    };
    return (
      <div className={style.hot}>
        <div className={style.header}>
          <Icon type="fire"/><span>热门话题</span>
        </div>
        <div className={style.wrapper}>
          <Button type="primary" onClick={this.addTopic} >新建</Button>
          <Button type="primary" className={style.btn} onClick={this.export}>导出</Button>
          <div>
            <Search placeholder="关键字搜索" onSearch={this.kwSearch} enterButton style={{width:300,marginTop:20}}/>
          </div>
          <Spin tip="Loading..." spinning={loading}>
            <Table bordered columns={columns} dataSource={data} rowKey='_id' pagination={false} className={style.table}/>
          </Spin>
        </div>
        <Pagination showQuickJumper className={style.page} current={page}  total={count} pageSize={pageSize}
          onChange={(page,pageSize)=>{
            //只要页码数发生改变就会触发          
            this.setState({page,loading:true},()=>{
              this.getListData()
            })   
          }}
          />
          <Modal
          title="编辑"
          visible={visible}
          confirmLoading={confirmLoading}
          onCancel={this.handleCancel}
          footer={null}
        >
            <Form {...formItemLayout} onSubmit={this.handleSubmit}>
            <Form.Item label="话题名称">
              {getFieldDecorator('username',{
                rules: [
                  {
                    required: true,
                    message: '热门话题不能为空',
                  },
                ],
              })(<Input />)}
            </Form.Item>
            <Form.Item label="内容">
              {getFieldDecorator('name',{
                rules: [
                  {
                    required: true,
                    message: '内容不能为空',
                  },
                ],
              })(<TextArea placeholder="话题描述" />)}
            </Form.Item>
            <Form.Item label="热度" hasFeedback>
              {getFieldDecorator('note',{
                rules: [
                  {
                    required: true,
                    message: '热度不能为空',
                  },
                ],
              })(<InputNumber style={{ width: '100%' }} />)}
            </Form.Item>
            <Form.Item {...tailFormItemLayout} >
              <Button type="primary" htmlType="submit">
                确认
              </Button>
            </Form.Item>
          </Form>
        </Modal>
      </div>
    );
  }
}

export default Form.create()(Hot);