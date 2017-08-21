/**
 * API module
 * @type {Object}
 * 用于将微信官方`API`封装为`Promise`方式
 * > 小程序支持以`CommonJS`规范组织代码结构
 */
App({
  /**
   * Global shared
   * 可以定义任何成员，用于在整个应用中共享
   */
  data: {
    name: 'WeApp Boilerplate',
    version: '0.1.0',
    userInfo: null,
    tempPathA: '',
    tempPathB: '',
  },

  hashCode : [],
  // 不是只能定义`data`，别的也可以
  /**
   * 获取用户信息
   * @return {Promise} 包含获取用户信息的`Promise`
   */
  getUserInfo () {
    return new Promise((resolve, reject) => {
      if (this.globalData.userInfo) return reject(this.globalData.userInfo)
      AV.User.loginWithWeapp()
        .then(user => {
          this.globalData.userInfo = user.toJSON()
          })
        .then(user => (this.data.userInfo = user))
        .then(user => resolve(user))
        .catch(console.error)
    })
  },
  /**
   * 生命周期函数--监听小程序初始化
   * 当小程序初始化完成时，会触发 onLaunch（全局只触发一次）
   */
   saveHash(code) {
    let codes = [];
    wx.getStorage({
      key: 'codes',
      success: function(res) {
          codes = res.data;
      } 
    })
    codes.push(code);
    wx.setStorage({
      key: "codes",
      data: codes
    })
   },
  getHash() {
    let codes = [];
    wx.getStorage({
      key: 'codes',
      success: function(res) {
          // console.log(res.data)
          codes = res.data;
      } 
    })

    return codes;
  },
  onLaunch () {
    console.log(' ========== Application is launched ========== ')
    let self = this;
    wx.getStorage({
      key: 'codes',
      success: function(res) {
          //console.log(res.data)
          self.hashCode = res.data;
      } 
    })
  },
  /**
   * 生命周期函数--监听小程序显示
   * 当小程序启动，或从后台进入前台显示，会触发 onShow
   */
  onShow () {
    console.log(' ========== Application is showed ========== ')
  },
  /**
   * 生命周期函数--监听小程序隐藏
   * 当小程序从前台进入后台，会触发 onHide
   */
  onHide () {
    console.log(' ========== Application is hid ========== ')
  }
})
