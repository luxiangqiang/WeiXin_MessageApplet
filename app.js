//app.js
App({
  onLaunch: function () {
    // 展示本地存储能力
    var logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs)
    // 登录
    //获取openid
    var user = wx.getStorageSync('user') || {};
    if (!user.openid || (user.expires_in || Date.now()) < (Date.now() + 600)) { //不要在30天后才更换openid-尽量提前 10 分钟更新
      wx.login({
        success: function (res) {
          // success
          // var d = that.globalData.wxData;//这里存储了appid、secret、token串
          // var l = 'https://api.weixin.qq.com/sns/jscode2session?appid=' + d.appId + '&secret=' + d.appSecret + '&js_code=' + res.code + '&grant_type=authorization_code';http://192.168.43.205:8080
          wx.request({
            url: '自己服务器API',//获取唯一标识 openId
            data: {
              code: res.code
            },
            header: {
              'content-type': 'application/json' // 数据格式（默认值）
            },
            method: 'post', //上传方式
            success: function (res) {
              console.log(res.data)
              wx.setStorageSync('token', res.data.token)//消息模板会用到
              wx.setStorageSync('openid', res.data.openid);//存储openid
            }
          });
        }
      });
    } else {
      wx.showToast({
        title: '登录失败',
        icon: 'none',
      })
      console.log(user);
      return;
    }

    //查看当前用户是否已经授权
    wx.getSetting({
      success: res => {
        if (res.authSetting['scope.userInfo']) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
          wx.getUserInfo({
            success: res => {
              // 授权成功后，直接将信息传到全局变量中
              this.globalData.userInfo = res.userInfo
              // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
              // 所以此处加入 callback 以防止这种情况
              if (this.userInfoReadyCallback) {
                this.userInfoReadyCallback(res)
              }
            }
          })
        }else{
          return;
        }
      }
    })
  },
  globalData: {
    userInfo: null
  }
})