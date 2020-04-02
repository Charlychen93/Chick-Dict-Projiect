import React, { Component } from 'react';
import style from './home.module.less'
// import LazyLoad from 'react-lazyload';


class Home extends Component {
  render(){
    return (
      <div className={style.home}>
        <div>
          {/* <LazyLoad> */}
            <img src="https://jikipedia.com//images/logo/logo_full_side.png" alt="logo展示" />
          {/* </LazyLoad> */}
        </div>
      </div>
    )
  }
}

export default Home;