// 获取全局应用程序实例对象
const app = getApp()

const wechat = require('../../utils/wechat')
const Promise = require('../../utils/bluebird')
const CryptoJS = require('../../utils/crypto-js/crypto-js');
const Base64 = require('../../utils/base64.js');
const CosCloud = require('../../utils/cos-wx-sdk-v4.js');
const config = require('../../config');

var appid = config.appid;
var bucket = config.bucket;
var region = config.region;
var sid = config.sid;
var skey = config.skey;

var getSignature = function (once) {
    var that = this;
    var random = parseInt(Math.random() * Math.pow(2, 32));
    var now = parseInt(new Date().getTime() / 1000);
    var e = now + 60; //签名过期时间为当前+60s
    var path = ''; //多次签名这里填空
    var str = 'a=' + appid + '&k=' + sid + '&e=' + e + '&t=' + now + '&r=' + random +
        '&f=' + path + '&b=' + bucket;
    var sha1Res = CryptoJS.HmacSHA1(str, skey);//这里使用CryptoJS计算sha1值，你也可以用其他开源库或自己实现
    var strWordArray = CryptoJS.enc.Utf8.parse(str);
    var resWordArray = sha1Res.concat(strWordArray);
    var res = resWordArray.toString(CryptoJS.enc.Base64);
    return res;
};

var cos = new CosCloud({
    appid: appid, // APPID 必填参数
    bucket: bucket, // bucketName 必填参数
    region: region, // 地域信息 必填参数 华南地区填gz 华东填sh 华北填tj
    progressInterval: 1000, // 控制上传进度回调间隔
    getAppSign: function (callback) {//获取签名 必填参数

        var res = getSignature(false); // 这个函数自己根据签名算法实现
        callback(res);
    },

    getAppSignOnce: function (callback) { 
        var res = getSignature(true);
        callback(res);
    }
});

// 创建页面实例对象
Page({
  /**
   * 页面的初始数据
   */
  createCallBack: function (msg) {
      var that = this;
      return function (result) {
          console.log(result);
          that.loading(0);
          if (result.errMsg != 'request:ok' && result.errMsg != 'uploadFile:ok') {
              wx.showModal({title: '请求出错', content: '请求出错：' + result.errMsg + '；状态码：' + result.statusCode,
                  showCancel: false});
          } else if (result.data.code) {
              wx.showModal({title: '返回错误',
                  content: (msg || '请求') + '失败：' + (ERR[result.data.message] || result.data.message) +
                  '；状态码：' + result.statusCode, showCancel: false});
          } else {
              wx.showToast({title: (msg || '请求') + '成功', icon: 'success', duration: 2000});
              
              if (that.which == 'a') {
                that.setData({
                  filePathA: result.data.data.source_url,
                })
              }

              if (that.which == 'b') {
                that.setData({
                  filePathB: result.data.data.source_url,
                })
              }
          }
      }
  },

  loading: function (isLoading, msg) {
      if (isLoading) {
          wx.showToast({title: (msg || '正在请求...'), icon: 'loading', duration: 60000});
      } else {
          wx.hideToast();
      }
  },
  data: {
    filePathA: '',
    filePathB: '',
    which: ''
  },

  chooseImage (event) {
    var that = this
    this.which = event.currentTarget.dataset.which
    console.log(this.which)
    wx.chooseImage({
      count: 1, // 默认9
      sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
      sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
      success: function (res) {
        console.log(res);
        // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片
        let name = Math.random() * 10000 + '-' + new Date().getTime();
        if (res.tempFilePaths && res.tempFilePaths.length) {
            var tempFilePath = res.tempFilePaths[0];
            let ext = tempFilePath.substr(tempFilePath.lastIndexOf('.'));
            let path = name + ext;
            that.loading(1, '正在上传...');
            cos.uploadFile({
                success: that.createCallBack('文件上传'),
                error: that.createCallBack(),
                bucket: bucket,
                path: path,
                filepath: tempFilePath,
                insertOnly: 0, // insertOnly==0 表示允许覆盖文件 1表示不允许覆盖
                bizAttr: 'test-biz-val',
                onProgress: function (info) {
                    console.log(info);
                }
            });
        }

        if (that.which == 'a') {
            app.data.tempFilePathA = res.tempFilePaths[0]
          }

          if (that.which == 'b') {
            app.data.tempFilePathB = res.tempFilePaths[0]
          }
      }
    })
  },

  toSuccess() {
    if (this.data.filePathA == '' || this.data.filePathB == '') {
      return false;
    }
    wx.navigateTo({
      url: '../success/success?filePathA=' + this.data.filePathA + '&filePathB=' + this.data.filePathB
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad () {
    // TODO: onLoad
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
