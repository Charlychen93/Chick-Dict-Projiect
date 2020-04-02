import React, { Component } from 'react';
import { Card, message, Button, Input, Form } from 'antd'
import style from './index.module.less'
import dicManage from '../../../api/dicmanage'


class DicAdd extends Component {
   state = {
      "name": "",
      "desc": '',
      "img": '',
      "topic": "",
      "creator": '',
      "comments": 0,
      "likes": 0,
   }

   dicAdd = async () => {
      let { validateFields } = this.props.form;
      // 校验输入的值
      validateFields((err, data) => {
         if (err) {
            // 输入错误
            message.error("输入有误，请重试！");
         } else {
            // 用户名和密码正确
            dicManage.dicAdd(this.state).then(res => {
               //console.log('res', res)
               if (res.err === -1) {
                  return message.error(res.msg)
               } else {

                  message.success("添加成功，跳回列表页", 1, () => {
                     this.props.history.replace('/admin/dicmanage/dicinfo')

                  });
               }
            });
         }
      });
   };
   upload = async () => {
      // 1. 获取图片里的内容
      let file = this.refs.img.files[0]
      // console.log(file)
      if (!file) { return message.error('请先选择一张图片') }
      // 图片的验证
      let { size, type } = file
      // console.log(type)
      let types = ['jpg', "jpeg", 'gif', 'png']
      if (size > 1000000) { return message.warning('图片超过1m') }
      if (types.indexOf(type.split('/')[1]) === -1) { return message.warning('只允许jpg.jpeg,gif,png四种类型') }
      //  调用接口
      //  将图片转化为formdata 
      let data = new FormData()
      data.append('hehe', file)
      let { code, msg, path } = await dicManage.img(data)
      // console.log(path)
      if (code) { return message.error(msg) }
      this.setState({ img: 'http://39.99.195.178:3000' + path })
   }
   render() {
      //console.log( this.props.form)
      let { getFieldDecorator } = this.props.form;
      let {  img,  comments, likes } = this.state
      return (
         <div className={style.box}>
            <Card title='添加词典' className={style.card}>
               <div className={style.content}>
                  <Form.Item>名称：
                     {/* 用户名验证 */}
                     {getFieldDecorator('userName', {
                        rules: [{ required: true, message: '用户名必须存在' },
                        { min: 3, message: '用户名最小长度3位' },
                        { max: 9, message: '用户名最大长度9位' }]
                     })(
                        <Input type='text' placeholder="Username" onChange={(e) => {
                           this.setState({ name: e.target.value })
                        }} />
                     )}
                  </Form.Item>
                  <Form.Item>描述：
                     {/*描述验证 */}
                     {getFieldDecorator('描述', {
                        rules: [{ required: true, message: '描述必须存在' }]
                     })(
                        <Input type='text' placeholder="描述"  onChange={(e) => {
                           this.setState({ desc: e.target.value })
                        }} />
                     )}
                  </Form.Item>
                  <Form.Item>话题：
                     {/*话题验证 */}
                     {getFieldDecorator('话题', {
                        rules: [{ required: true, message: '描述必须存在' }]
                     })(
                        <Input type='text' placeholder="话题"  onChange={(e) => {
                           this.setState({ topic: e.target.value })
                        }} />
                     )}
                  </Form.Item>
                  <Form.Item>
                     评论数：<Input type='number' className={style.input} value={comments} onChange={(e) => {
                        this.setState({ comments: e.target.value })
                     }} /> </Form.Item>
                  <Form.Item>
                     点赞数：<Input type='number' className={style.input} value={likes} onChange={(e) => {
                        this.setState({ likes: e.target.value })
                     }} />  </Form.Item>
                  <Form.Item>创建者：
                     {/*创建者验证 */}
                     {getFieldDecorator('创建者', {
                        rules: [{ required: true, message: '创建者必须存在' }]
                     })(
                        <Input type='text' placeholder="创建者"  onChange={(e) => {
                           this.setState({ creator: e.target.value })
                        }} />
                     )}
                  </Form.Item>
         图片：<input type="file" ref='img' /><br /><br /><Button onClick={this.upload}>上传图片</Button><br /><br />
                缩略图:<br /><img width='350' height='80' src={img} alt="" /><br /><br />
                  <Button onClick={this.dicAdd}>添加</Button></div>
            </Card>
         </div>)

   }
}

export default Form.create()(DicAdd);