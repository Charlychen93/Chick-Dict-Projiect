import React from 'react'
import { Component } from 'react'
import { Select,Card, Table, Button, Popconfirm, message, Modal, Form, Input,Spin,Pagination,Avatar} from 'antd'
import disFirst from '../../../api/dicFirst'
import dicmanage from '../../../api/dicmanage'
import LazyLoad from 'react-lazyload';
import commentsApi from '../../../api/comments.js'
const { Option } = Select;
class Discuss extends Component {
    state = {
        img:'',
        dataSource: [],
        page: 1,
        pageSize: 3,
        visible: false,
        loading:true,
        count:1,
        type:[],
        selValue:'请选择词条id',
        methods:'',
        id:'',
        columns: [
            { title: '主词条id', dataIndex: 'from_id', key: 'from_id' },
            { title: '评论者', dataIndex: 'name', key: 'name' },
            { title: '评论内容', dataIndex: 'desc', key: 'desc' },
            { title: '头像', dataIndex: 'img', key: 'img',render:(img)=>{
                return (
                    <LazyLoad width={120}>
                        <Avatar src={img} width='60' height='60' type="circle" alt="缩略图"/>
                    </LazyLoad>
                )
            } },
            { title: '创建时间', dataIndex: 'ctime', key: 'ctime' },
            {
                title: '操作', key: 'action', render: (recode) => {
                    return (
                        <div>
                            <Popconfirm title='您确定要删除该评论吗？'
                                onCancel={() => {
                                    message.error('取消删除')
                                }}
                                onConfirm={() => {
                                    let _id = recode._id
                                    this.del(_id)
                                }}
                            >
                                <Button type='danger' size='small'>删除</Button>
                            </Popconfirm>
                            <Popconfirm title='您确定要修改该评论吗？'
                                onCancel={() => {
                                    message.error('取消修改')
                                }}
                                onConfirm={() => {
                                    let _id = recode._id
                                    this.updateFirst(_id)
                                }}
                            >
                                <Button type='primary' size='small'>编辑</Button>
                            </Popconfirm>

                        </div>
                    )
                }
            }
        ]
    }
    del = (_id) => {
        this.setState({loading:true})
        disFirst.delFirst({_id}).then((res) => {
            let { page, pageSize } = this.state
            if (res.err === 0) {
                this.refersh(page, pageSize)
                message.success('删除成功')
            }
            this.setState({loading:false})
        })
    }
    //编辑
    updateFirst=async (_id)=>{
        let result =await this.getDataById(_id)
        if(!result.list){return}
        let {name,desc,img,from_id} = result.list[0]
        //将数据写入表单，让模态框显示
        this.props.form.setFieldsValue({
        name,
        desc,
        img,
        from_id,
        });
        this.setState({visible:true,id:_id,methods:'编辑',img})
    }
    //根据ID获取当前话题
    getDataById=async (_id)=>{
        let result = await commentsApi.getData1({_id})
        return result
    }
    upload=async ()=>{
        let file = this.refs.img.files[0]
        if(!file){return message.error('请先选择一张图片')}
        let {size,type} = file
        // console.log(type)
        let types = ['jpg',"jpeg",'gif','png']
        if(size>1000000){return message.warning('图片超过1M')}
        if(types.indexOf(type.split('/')[1])===-1){return message.warning('只允许jpg.jpeg,gif,png四种类型')}
        let data = new FormData()
        data.append('hehe',file)
        let {code,msg,path} = await dicmanage.img(data)
        if(code){
            return message.error(msg)
        }
        this.setState({img:'http://39.99.195.178:3000'+path})
    }
    refersh = (page, pageSize) => {
        // console.log(page, pageSize)
        disFirst.findFirst({ page, pageSize }).then((res) => {
            if(!res.list){return}
            //处理from_id
            let dataType = this.handleType(res.list.result)
            this.setState({ dataSource: res.list.result,loading:false,count:res.list.allCount ,type:dataType})
        })
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
    //根据主词条id进行查询
    searchById=async ()=>{
        this.setState({loading:true})
        let {selValue}=this.state
        if(selValue !== '请选择词条id'){
            let result = await disFirst.getDataById({from_id:selValue})
            // console.log(result)
            let {list,err} = result
            if(!list){return}
            if(err === 0){
                this.setState({dataSource:list.result,count:list.allCount})
                message.success('查询成功')
            }
            this.setState({loading:false})
        }else{
            message.warning('请输入正确id')
            this.setState({loading:false})
        }
    }
    componentDidMount() {
        let { page, pageSize } = this.state
        this.refersh(page, pageSize)
    }
    addDiscuss = () => {
        this.setState({loading:true})
        let { validateFieldsAndScroll } = this.props.form
        let id = this.state.id
        validateFieldsAndScroll((err, data) => {
            if (!err) {
                let { name, desc, from_id } = data
                let img = this.state.img
                let { page, pageSize } = this.state
                // let { leavel } = JSON.parse(localStorage.getItem('user'))
                if(this.state.methods==='新建'){
                    disFirst.addFirst({ name, desc, img, from_id }).then((res) => {
                        if (res.err === 0) {
                            this.refersh(page, pageSize)
                            message.success('添加成功')
                        }
                        this.setState({ visible: false })
                    })
                }else{
                    disFirst.updateOne({_id:id,name,desc,img,from_id}).then((res) => {
                        if (res.err === 0) {
                            this.refersh(page, pageSize)
                            message.success('修改成功')
                        }
                        this.setState({ visible: false,loading:false })
                    })
                }
            } else {
                // console.log(err)
            }
        })
    }
    //打开模态框
    openModal=()=>{
        this.setState({ visible: true,loading:true ,methods:'新建'})
    }
   
    render() {
        let { dataSource, columns, visible,img,loading,page,pageSize,count,type,selValue,methods} = this.state
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
        let { getFieldDecorator } = this.props.form
        return (
            <div style={{ background: '#ECECEC', padding: '30px' }}>
                <Card title="评论管理" bordered={false} >
                    <div>
                        <Button type='primary' size='small' onClick={this.openModal}>新增</Button>
                        {/* <Button type='primary' size='small' style={{margin:'0 0 15px 15px'}}>导出</Button> */}
                    </div>
                    <div style={{margin: '20px 0'}}>
                        <Select value={selValue} style={{width:'200px'}} onChange={(value)=>{
                            this.setState({selValue:value})
                        }}>
                            {
                                type.map((item,index)=>{
                                    return (
                                        <Option value={item} key={index}>{item}</Option>
                                    )
                                })
                            }
                        </Select>
                        <Button type="primary" icon="search"  onClick={this.searchById}/>
                    </div>
                    <Spin tip="Loading..." spinning={loading}>
                        <Table columns={columns}
                        dataSource={dataSource}
                        pagination={false}
                        rowKey='_id'
                        bordered
                        >
                        </Table>
                    </Spin>
                    <Pagination showQuickJumper current={page}  total={count}
                    pageSize={pageSize}
                    style={{marginTop:'20px'}}
                    onChange={(page,pageSize)=>{
                        // console.log(page)
                        //只要页码数发生改变就会触发          
                        this.setState({page,loading:true},()=>{
                        this.refersh(page,pageSize)
                        })   
                    }}
                    />
                    <Modal
                        title={methods}
                        visible={visible}
                        onCancel={() => {
                            this.setState({ visible: false,loading:false })
                        }}
                        onOk={this.addDiscuss}
                    >
                        <Form
                            {...formItemLayout}
                        >
                            <Form.Item label='主词条id'>
                                {getFieldDecorator('from_id', {
                                    rules: [{
                                        required: true,
                                        message: '内容不能为空',
                                    }]
                                })(<Input />)
                                }
                            </Form.Item>
                            <Form.Item label='评论者'>
                                {getFieldDecorator('name', {
                                    rules: [{
                                        required: true,
                                        message: '内容不能为空',
                                    }]
                                })(<Input />)
                                }
                            </Form.Item>
                            <Form.Item label='内容'>
                                {getFieldDecorator('desc', {
                                    rules: [{
                                        required: true,
                                        message: '内容不能为空',
                                    }]
                                })(<Input />)
                                }
                            </Form.Item>
                            <Form.Item label='头像'>
                                {getFieldDecorator('img', {
                                    rules: [{
                                        required: true,
                                        message: '内容不能为空',
                                    }]
                                })(
                                    <div>
                                        <input type="file" ref='img' /> <Button onClick={this.upload}>上传</Button>
                                        <div>
                                            <img src={img} alt="" width='180px'/>
                                        </div>
                                    </div>
                                )
                                }
                            </Form.Item>
                        </Form>
                    </Modal>
                </Card>
            </div>
        )
    }
}


export default Form.create()(Discuss)