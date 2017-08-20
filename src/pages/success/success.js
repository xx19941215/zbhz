// 获取全局应用程序实例对象
const app = getApp()

// 创建页面实例对象
Page({
  /**
   * 页面的初始数据
   */
  data: {
    filePathA: '',
    filePathB: '',
    hashCode: ''
  },

  toResult() {
    wx.showLoading({
      title: '加载中',
    })

    let self = this;
    wx.request({
      url: 'http://122.152.212.162:8080/api/faces',
      method: 'POST',
      data: {
         img1: self.data.filePathA,
         img2: self.data.filePathB,
      },
      header: {
          'content-type': 'application/json'
      },
      success: function(res) {
          console.log(app.hashCode);
          app.hashCode.push(res.data.idCode);
          self.setData({
            hashCode: res.data.idCode
          });
          app.saveHash(res.data.idCode);
          wx.navigateTo({
            url: '../result/result?filePathA=' + self.data.filePathA + '&filePathB=' + self.data.filePathB + '&hashCode=' + self.data.hashCode
          })
        }
        
      });
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad (option) {
    // TODO: onLoad
    this.setData({
      filePathA: option.filePathA,
      filePathB: option.filePathB,
    });
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady () {
    // TODO: onReady
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow () {
    // TODO: onShow
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide () {
    // TODO: onHide
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload () {
    // TODO: onUnload
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh () {
    // TODO: onPullDownRefresh
  }
})
