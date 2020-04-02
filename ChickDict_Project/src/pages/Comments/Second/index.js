import React, { Component } from 'react';
import { Icon, Button, Divider, Popconfirm, Modal, message, Form, Input, Table, Pagination, Spin, Select,Avatar } from 'antd'
import XLSX from "xlsx"
import style from './second.module.less'
import commentsApi from '../../../api/comments.js'
import dicManage from '../../../api/dicmanage.js'
//图片懒加载
import LazyLoad from 'react-lazyload';
const { TextArea } = Input;
const { Option } = Select;
class First extends Component {
  state = {
    img: '',
    type: [],
    visible: false,
    confirmLoading: false,
    fun: null,
    columns: [
      {
        title: '创建者',
        dataIndex: 'name',
        width: 120,
        key: "name"
      },
      {
        title: '内容',
        dataIndex: 'desc',
        width: 180,
        key: "desc"
      },
      {
        title: '头像',
        dataIndex: 'img',
        width: 80,
        key: "img",
        render: (img) => {
          return (
            <LazyLoad width={120}>
              <Avatar src={img} width='60' height='60' type="circle" alt="缩略图"/>
            </LazyLoad>
          )
        }
      },
      {
        title: '一级评论id',
        dataIndex: 'from_id',
        width: 80,
        key: "_id",
      },
      {
        title: '点赞',
        dataIndex: 'likes',
        width: 80,
        key: "likes",
        defaultSortOrder: 'descend',
        sorter: (a, b) => a.hot - b.hot,
      },
      {
        title: '时间',
        dataIndex: 'ctime',
        width: 150,
        key: "ctime",
        render: (ctime) => {
          return (
            <div>
              {this.getTime(ctime)}
            </div>
          )
        }
      },
      {
        title: '操作',
        width: 120,
        key: "options",
        render: (recode) => {
          return (
            <div>
              <Popconfirm title="确认删除吗？" onConfirm={this.delConfirm.bind(this, recode._id)} okText="Yes" cancelText="No" icon={<Icon type="question-circle-o" style={{ color: 'red' }} />}>
                <Button type="link" size="small">删除</Button>
              </Popconfirm>
              <Divider type="vertical" />
              <Popconfirm title="确认修改吗？" onConfirm={this.updateSecond.bind(this, recode._id)} okText="Yes" cancelText="No" icon={<Icon type="question-circle-o" style={{ color: 'red' }} />}>
                <Button type="link" size="small">编辑</Button>
              </Popconfirm>
            </div>
          )
        }
      }
    ],
    value:'id查询',
    list: [],
    page: 1,
    pageSize: 3,
    count: 0,
    loading: true,
    username: '',
    name: '',
    note: null,
    id: '',
    up: false,
    methods: '',
    leavel: ''
  };
  //解析时间
  getTime = (time) => {
    let result = time.slice(0, 19).split('T').join(' ')
    return result
  }
  //确认删除
  delConfirm(_id) {
    this.setState({ loading: false })
    commentsApi.delSecond({ _id })
      .then((data) => {
        if (data.err === 0) {
          message.warning('删除成功')
          this.setState({ loading: true })
          this.getListData()
        }
      })
  }
  //新加
  addSecond = async () => {
    if (this.state.leavel === 'admin') { return message.warning('权限不足') }
    this.setState({ visible: true, methods: '新建' })
  }
  //编辑
  updateSecond = async (_id) => {
    let result = await this.getDataById(_id)
    if (!result.list) { return }
    let { name, desc, img, from_id } = result.list[0]
    //将数据写入表单，让模态框显示
    this.props.form.setFieldsValue({
      creator: name,
      desc,
      img,
      from_id,
    });
    this.setState({ visible: true, id: _id, methods: '编辑', img })
  }
  //确认新加
  addConfirm = () => {
    let flag = this.state.methods
    let id = this.state.id
    this.props.form.validateFieldsAndScroll(async (err, values) => {
      if (!err) {
        let { creator, desc, from_id } = values
        let img = this.state.img
        let result
        if (flag === '新建') {
          result = await commentsApi.addSecond({ name: creator, desc, img, from_id })
        } else {
          result = await commentsApi.updateSecond({ _id: id, name: creator, desc, img, from_id })
        }

        if (result.err === 0) {
          message.success('成功')
          this.setState({ visible: false, loading: true })
          this.getListData()
        }
      } else {
        message.warning('请完善表单信息');
      }
    });
  };

  //根据ID获取当前话题
  getDataById = async (_id) => {
    let result = await commentsApi.getData({ _id })
    return result
  }

  //编辑模态框关闭事件
  handleCancel = () => {
    this.setState({
      visible: false,
    });
  };
  //声明周期获取数据
  async componentDidMount() {
    if (localStorage.getItem('user')) {
      let value = JSON.parse(localStorage.getItem('user'))
      this.setState({ leavel: value.leavel })
    }
    this.getListData()
  }
  // 获取热门话题数据
  getListData = async () => {
    let { page, pageSize } = this.state
    let { err, list } = await commentsApi.findSecondList({ page, pageSize })
    let type = this.handleType(list.result)
    if (err !== 0) { return }
    this.setState({ list: list.result, count: list.allCount, loading: false,type })
  }
  //处理from_id
  handleType=(list)=>{
    let result = []
    for (const v of list) {
        if(!result.includes(v.from_id)){
            result.push(v.from_id)
        }
    }
    return result
  }
  //导出excel文件
  export = async () => {
    let thead = this.state.columns.map((item, index) => {
      return item.title
    })
    thead.length = 6
    thead.unshift('id')
    //获取数据
    let { err, list } = await commentsApi.findSecondList({ page: 1, pageSize: 1000 })
    let result = list.result
    if (err === 0) {
      let newArr = result.map((item, index) => {
        let arr = []
        for (let key in item) {
          arr.push(item[key])
        }
        arr.length = 7
        return arr
      })
      let res = [thead, ...newArr]
      // 将数组转化为标签页 
      var ws = XLSX.utils.aoa_to_sheet(res);
      // 创建工作薄
      var wb = XLSX.utils.book_new()
      // 将标签页插入到工作薄里
      XLSX.utils.book_append_sheet(wb, ws)
      // 将工作薄导出为excel文件
      XLSX.writeFile(wb, '商品.xlsx');
    }
  }
  //上传图片
  upload = async () => {
    // 1. 获取图片里的内容
    let file = this.refs.img.files[0]
    if (!file) { return message.error('请先选择一张图片') }
    // 图片的验证
    let { size, type } = file
    // console.log(type)
    let types = ['jpg', "jpeg", 'gif', 'png']
    if (size > 1000000) { return message.warning('图片超过1m') }
    if (types.indexOf(type.split('/')[1]) === -1) { return message.warning('只允许jpg.jpeg,gif,png四种类型') }
    // 调用接口
    // 将图片转化为formdata 
    let data = new FormData()
    data.append('hehe', file)
    let { code, msg, path } = await dicManage.img(data)
    if (code) { return message.error(msg) }
    this.setState({ img: 'http://39.99.195.178:3000' + path })
  }
  //id搜索
  idSearch=async ()=>{
    this.setState({loading:true})
    let {value}=this.state
    // console.log(value)
    if(value !== '一级评论id查询'){
        let result = await commentsApi.getDataByFirst({from_id:value })
        // console.log(result)
        let {list,err} = result
        if(!list){return}
        if(err === 0){
            this.setState({list:list.result,count:list.allCount})
            message.success('查询成功')
        }
        this.setState({loading:false})
    }else{
        message.warning('请输入正确id')
        this.setState({loading:false})
    }
}

  render() {
    let { columns, list, page, pageSize, count, loading, visible, confirmLoading, img, methods,type,value } = this.state
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
          <Icon type="project" /><span>二级评论</span>
        </div>
        <div className={style.wrapper}>
          <Button type="primary" onClick={this.addSecond} >新建</Button>
          <Button type="primary" className={style.btn} onClick={this.export}>导出</Button>
          <div style={{margin:'20px 0'}}>
            <Select value={value} style={{ width: '40%' }}  onChange={(value)=>{
            this.setState({value:value})
            }}>
                {
                  type.map((item) => {
                    return (
                      <Option value={item} key={value}>{item}</Option>
                    )
                  })
                }
            </Select>
            <Button type="primary" icon="search" onClick={this.idSearch} />
          </div>
          <Spin tip="Loading..." spinning={loading}>
            <Table bordered columns={columns} dataSource={list} rowKey='_id' pagination={false} className={style.table} />
          </Spin>
        </div>
        <Pagination showQuickJumper className={style.page} current={page} total={count} pageSize={pageSize}
          onChange={(page, pageSize) => {
            //只要页码数发生改变就会触发          
            this.setState({ page, loading: true }, () => {
              this.getListData()
            })
          }}
        />
        <Modal
          title={methods}
          visible={visible}
          confirmLoading={confirmLoading}
          onCancel={this.handleCancel}
          footer={null}
        >
          <Form {...formItemLayout} onSubmit={this.addConfirm}>
            <Form.Item label="创建者">
              {getFieldDecorator('creator', {
                rules: [
                  {
                    required: true,
                    message: '创建者不能为空',
                  },
                ],
              })(<Input />)}
            </Form.Item>
            <Form.Item label="内容">
              {getFieldDecorator('desc', {
                rules: [
                  {
                    required: true,
                    message: '内容不能为空',
                  },
                ],
              })(<TextArea placeholder="话题描述" />)}
            </Form.Item>
            <Form.Item label="头像">
              {getFieldDecorator('img', {
                rules: [
                  {
                    required: true,
                    message: '图片不能为空',
                  },
                ],
              })(
                <div>
                  <input type="file" ref="img" /> <Button onClick={this.upload}>上传</Button>
                  <div>
                    <img src={img} alt="" width="180px" />
                  </div>
                </div>
              )}
            </Form.Item>
            <Form.Item label="一级评论id">
              {getFieldDecorator('from_id', {
                rules: [
                  {
                    required: true,
                    message: '一级评论id不能为空',
                  },
                ],
              })(<Input style={{ width: '100%' }} />)}
            </Form.Item>
            <Form.Item {...tailFormItemLayout} >
              <Button type="primary" htmlType="submit" >
                确认
              </Button>
            </Form.Item>
          </Form>
        </Modal>
      </div>
    );
  }
}

export default Form.create()(First);