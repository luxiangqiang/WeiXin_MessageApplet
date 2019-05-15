//index.js
//获取应用实例
const app = getApp()

Page({
  data: {
    buttonDisabled: false,
    modalHidden: true,
    userInfo: {},
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    gongMessage: [], //存储公众号所有信息
    inputContent: '',
    inputContentxml: '',
    id:'',
    lock: false,
  },


  //事件处理函数 登录日志
  bindViewTap: function() {
    wx.navigateTo({
      
    })
  },

  //跳转文章页面
  to_articel_list: function (event) {
    //检查锁
    if (this.data.lock) {
      return;
    }
    var that = this;
    var index = event.currentTarget.dataset.index;
    var g_id = that.data.gongMessage[index].id
    console.log("公众号id为:" + g_id)
    wx.navigateTo({
      url: '../../pages/artical/artical?g_id=' + g_id
    })
  },

  touchend: function () {
    var that = this;
    if (that.data.lock) {
      //开锁
      console.log("离开")
      that.setData({ 
        lock: false 
      });
    }
  },

  // 长按复制公众号名称
  copy: function (event) {
    //锁住
    this.setData({ lock: true });
    var that = this;
    var index = event.currentTarget.dataset.index;
    console.log(event);
    wx.setClipboardData({
      data: that.data.gongMessage[index].name,
      success: function (res) {
        wx.showToast({
          title: '复制成功',
        });
      }
    });
  },

  onLoad: function () {
    var that = this;
    // 如果获取到用户信息就存储
    if (app.globalData.userInfo) {
      this.setData({
        userInfo: app.globalData.userInfo,
        hasUserInfo: true
      })
      wx.setStorageSync('username', that.data.userInfo.nickName)
      wx.setStorageSync('headpath', that.data.userInfo.avatarUrl)
      console.log("在index页面全局app1中获取到的用户信息为：" + that.data.userInfo.nickName + " " + that.data.userInfo.avatarUrl);
    } else if (this.data.canIUse){
      // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
      // 所以此处加入 callback 以防止这种情况
      app.userInfoReadyCallback = res => {
        // console.log("用户名2：" + res.userInfo.nickName + " " + res.userInfo.avatarUrl)
        // wx.setStorageSync('username', res.userInfo.nickName)
        // wx.setStorageSync('headpath', res.userInfo.avatarUrl)
        this.setData({
          userInfo: res.userInfo,
          hasUserInfo: true
        })
        wx.setStorageSync('username', that.data.userInfo.nickName)
        wx.setStorageSync('headpath', that.data.userInfo.avatarUrl)
        console.log("在index页面全局app2中获取到的用户信息为：" + that.data.userInfo.nickName + " " + that.data.userInfo.avatarUrl);
      }
    } else {
      // 没有获取到用户信息就发起授权窗口
      wx.getUserInfo({
        success: res => {
          // console.log("用户名3：" + res.userInfo.nickName + " " + res.userInfo.avatarUrl)
          app.globalData.userInfo = res.userInfo
          this.setData({
            userInfo: res.userInfo,
            hasUserInfo: true
          })
          wx.setStorageSync('username', that.data.userInfo.nickName)
          wx.setStorageSync('headpath', that.data.userInfo.avatarUrl)
          console.log("在index页面全局app3中获取到的用户信息为：" + that.data.userInfo.nickName + " " + that.data.userInfo.avatarUrl);
        },
      })
    }
  //   wx.setStorageSync('username', that.data.userInfo.nickName)
  //   wx.setStorageSync('headpath', that.data.userInfo.avatarUrl)

   //获取公众号信息
    that.getGongInfo();
  },

  //点击按钮授权
  getUserInfo: function (e) {
    var that = this;
    if (e.detail.userInfo) {
      console.log(e)
      app.globalData.userInfo = e.detail.userInfo
      this.setData({
        userInfo: e.detail.userInfo,
        hasUserInfo: true
      })
      wx.setStorageSync('username', that.data.userInfo.nickName)
      wx.setStorageSync('headpath', that.data.userInfo.avatarUrl)
      console.log("在index页面临时授权中获取到的用户信息为：" + that.data.userInfo.nickName + " " + that.data.userInfo.avatarUrl);
    } else {
      console.log('用户取消授权');
      return;
    }
  },

  //获取公众号信息
  getGongInfo: function () {
    var that = this;
    wx.request({
      url: '自己服务器API', //获取公众号信息
      data: {
      },
      header: {
        'content-type': 'application/json' // 数据格式（默认值）
      },
      method: 'post', //上传方式
      success: function (res) {   //回调成功
        console.log(res.data.result)
        if (res.statusCode == 200) {
          if (res.data.result == '1') {
            var posts_content = res.data;
            console.log(posts_content)
            that.setData({
              gongMessage: res.data.content,
            })
          } else {
            wx.showToast({
              title: '获取失败',
              icon: 'none',
            })
          }
        } else {
          wx.showModal({
            title: '服务器错误',
            content: 'none',
          })
        }
      },
      //回调失败
      fail: function (res) {
        console.log(res.errMsg)
        wx.showToast({
          title: '联网失败',
          icon: 'fail',
        })
      },
    })
  },

  //弹出回复框
  showModal: function (event) {
    this.setData({
      modalHidden: !this.data.modalHidden,
    })
  },

  // 获取弹出框密码
  getInputContent: function (e) {
    console.log(e.detail.value)
    this.setData({
      inputContent: e.detail.value
    })
  },

  //确定
  modalBindaconfirm: function () {
    var that = this;
    console.log(that.data.inputContent)
    if (that.data.inputContent == "") {
      wx.showToast({
        title: '秘钥不能为空！',
        icon: 'none',
      })
    } else {
      //通过秘钥换取公众号 id
      that.getIdentifyId();
    }
  },
  
  //取消
  modalBindcancel: function () {
    this.setData({
      modalHidden: !this.data.modalHidden,
    })
  },

  //通过后台秘钥获取公众号 id
  getIdentifyId: function () {
    var that = this;
    wx.request({
      url: '自己服务器API', //获取公众号信息
      data: {
        password: that.data.inputContent //登录后台密码
      },
      header: {
        'content-type': 'application/json' // 数据格式（默认值）
      },
      method: 'post', //上传方式
      success: function (res) {   //回调成功
        console.log(res.data)
        if (res.statusCode == 200) {
          if (res.data.result == '1') {
              //弹出框消失
              that.setData({
                modalHidden: !that.data.modalHidden,
                buttonDisabled: !that.data.buttonDisabled,
                id: res.data.content[0].id,
              })
            //上传openid
              // that.postOpenid();
             //跳转后台管理界面
              wx.navigateTo({
                url: '../../pages/select/select?id=' + that.data.id + "&avatarUrl=" + that.data.userInfo.avatarUrl + "&nickName=" + that.data.userInfo.nickName + "&headpath=" + res.data.content[0].headpath + "&name=" + res.data.content[0].name + "&describe=" + res.data.content[0].describes
              })
          } else {
            wx.showToast({
              title: '你不是管理员或者密码错误',
              icon: 'none',
            })
          }
        } else {
          wx.showModal({
            title: '服务器错误',
            content: 'none',
          })
        }
      },
      //回调失败
      fail: function (res) {
        console.log(res.errMsg)
        wx.showToast({
          title: '联网失败',
          icon: 'fail',
        })
      },
    })
  },

  // 上传管理员openid
  postOpenid: function () {
    var that = this;
    wx.request({
      url: '自己服务器API', //获取公众号信息
      data: {
        openid: wx.getStorageSync('openid'),
        id: that.data.id
      },
      header: {
        'content-type': 'application/json' // 数据格式（默认值）
      },
      method: 'post', //上传方式
      success: function (res) {   //回调成功
        console.log(res.data.result)
        if (res.statusCode == 200) {
          if (res.data.result == '1') {
            console.log("openid加入成功！")
          } else {
            console.log("openid加入失败！")
          }
        } else {
          wx.showModal({
            title: '服务器错误',
            content: 'none',
          })
        }
      },
      //回调失败
      fail: function (res) {
        console.log(res.errMsg)
        wx.showToast({
          title: '联网失败',
          icon: 'fail',
        })
      },
    })
  },

  //下拉刷新
  onPullDownRefresh: function () {
    var that = this;

    //在标题栏中显示加载图标 
    wx.showNavigationBarLoading(); 

    //获取公众号信息
    that.getGongInfo();

    //完成停止加载
    wx.hideNavigationBarLoading();
    
    //停止下拉刷新 
    wx.stopPullDownRefresh();           
  },

  //wx.showNavigationBarLoading(); //在标题栏中显示加载图标 
  // wx.hideNavigationBarLoading();          //完成停止加载 
  // 动态设置导航条标题 
  // wx.stopPullDownRefresh();            //停止下拉刷新 

  //后天切换到前台调用 onShow
  onShow:function () {
  
  }
})
