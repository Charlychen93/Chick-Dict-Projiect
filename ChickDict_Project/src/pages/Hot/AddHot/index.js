import React, { Component } from 'react';
import {
  Form,
  Input,
  Button,
  InputNumber,
  message
} from 'antd';
import style from './add.module.less'

import hotApi from '../../../api/hot.js'

const { TextArea } = Input;
class AddHot extends Component {
  state = {
    
  };

  handleSubmit = e => {
    let that = this.props.form
    e.preventDefault();
    this.props.form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        let {username,name,note} = values
        hotApi.addTopic({name:username,desc:name,hot:note})
        .then((data)=>{
          if(data.err === 0){
            message.success('新建成功');
            that.resetFields()
          }
        })
      }else{
        message.warning('请完善表单信息');
      }
    });
  };


  render(h) {
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

    return(
      <div className={style.wrapper}>
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
            新建
          </Button>
        </Form.Item>
      </Form>
      </div>
    )
  }
}

export default Form.create()(AddHot);