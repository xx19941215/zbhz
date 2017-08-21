var wxCharts = require('../../utils/wxcharts.js');
var app = getApp();
var radarChart = null;
const CryptoJS = require('../../utils/crypto-js/crypto-js');

// 创建页面实例对象
Page({
  /**
   * 页面的初始数据
   */
  data: {
    filePathA: 'http://oo17e84zr.bkt.clouddn.com/random_0001.jpg',
    filePathB: 'http://oo17e84zr.bkt.clouddn.com/random_0002.jpg',
    xiangSiDu: '?',
    introduction : '',
    hashCode: '',
    faces: [
        'image_face_a@2x.png',
        'image_face_b@2x.png',
        'image_face_c@2x.png',
        'image_face_d@2x.png',
        'image_face_e@2x.png'
      ],
    currentFace: '',
    isShare: false
  },
  touchHandler: function (e) {
    console.log(radarChart.getCurrentDataIndex(e));
  },

   onShareAppMessage: function (res) {
    let self = this;
    if (res.from === 'button') {
      // 来自页面内转发按钮
      console.log(res.target)
    }
    return {
      title: '占卜合照',
      path: 'pages/result/result?filePathA=' + self.data.filePathA + '&filePathB=' + self.data.filePathB + '&hashCode=' + self.data.hashCode,
      success: function(res) {
        // 转发成功
        console.log(this.path);
      },
      fail: function(res) {
        // 转发失败
      }
    }
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad (option) {
    //console.log(this.data.isShare);
    let hashCode = app.hashCode;
    console.log(hashCode);
    if (hashCode.indexOf(option.hashCode) != -1) {
      console.log('不是分享');
      this.setData({
        isShare: false
      });
      console.log(this.data.isShare);
    } else {
      console.log('是分享');
      this.setData({
        isShare: true
      });
      console.log(this.data.isShare);
    }

    wx.showLoading({
      title: '加载中',
    })
    // TODO: onLoad
    this.setData({
      filePathA: option.filePathA,
      filePathB: option.filePathB,
      hashCode: option.hashCode
    });

    let self = this;

    // let baseA = this.getBase64(app.data.tempPathA);
    // let baseB = this.getBase64(app.data.tempPathA);
    // let imgHash = CryptoJS.MD5(baseA + baseB);
    wx.request({
      url: 'https://wxapi.hotapp.cn/proxy/?appkey=hotapp11377340&url=http://122.152.212.162:8080/api/faces/' + this.data.hashCode,
      method: 'GET',
      // data: {
      //    img1: this.data.filePathA ,
      //    img2: this.data.filePathB,
      //    imgHash: Math.random() * 100000
      // },
      // header: {
      //     'content-type': 'application/json'
      // },
      success: function(res) {
        console.log(res.data)
        wx.hideLoading()
        radarChart = new wxCharts({
          canvasId: 'radarCanvas',
          type: 'radar',
          categories: ['面相', '脸型', '玄机', '颜值', '性格'],
          series: [{
            name: '匹配指数',
            data: [res.data.mianXiang, res.data.lianXing, res.data.xuanJi, 
            res.data.yanZhi, res.data.xingGe]
          }],
          dataLabel: true,
          width: 320,
          height: 200,
          extra: {
            radar: {
              max: 150,
              //labelColor: '#EC212A'
            }
          }
        });

        self.setData({
          xiangSiDu: res.data.xiangSiDu,
          introduction : res.data.introduction
        });

        let index = parseInt(res.data.xiangSiDu);
        if ( index < 60) {
          self.setData({
            currentFace : self.data.faces[0]
          });
          return;
        } else if (index < 70) {
          self.setData({
            currentFace : self.data.faces[1]
          });
          return;
        } else if (index < 80) {
          self.setData({
            currentFace : self.data.faces[2]
          });
          return;
        } else if (index < 90) {
          self.setData({
            currentFace : self.data.faces[3]
          });
          return;
        } else {
          self.setData({
            currentFace : self.data.faces[4]
          });
          return;
        }
      }
    })
  },

  getBase64 (path) {
    var reader = new FileReader(); 
    reader.readAsArrayBuffer(new Blob(path)); 
    reader.onload = function(e){ 
        var arrayBuffer = reader.result;
        var base64 = wx.arrayBufferToBase64(arrayBuffer)

        return base64;
    }
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady (e) {
    // TODO: onReady
  },

  coupon() {
    wx.showModal({
    title: '提示',
    content: '恭喜您获得定情信物红枣现金券请点击右上角...，关注公众号领取',
    success: function(res) {
      if (res.confirm) {
        console.log('用户点击确定')
      } else if (res.cancel) {
        console.log('用户点击取消')
      }
    }
})
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
