// pages/mycenter/mycenter.js
// var banner = require("../../src/js/banner.js");
Page({
  data: {
    isShowFrom1: false,
    // isShowFrom2: false,
    // isShowFrom3: false,
    indicatorDots: true,
    vertical: false,
    autoplay: true,
    interval: 3000,
    duration: 800,
    // banner_url: banner.bannerList
    // 折叠结束
    pathNo: '',
    title: '',//题目
    describe: '',//描述
    tempFilePath: [],
    authormessages: new Array(),//作者回复信息
    authormessage: new Array(),
    messages: [],
    // 用户留言设置
    show: false,
    tip: '',
    inputContent: '',//获取的回复信息
    inputContentxml: '',
    buttonDisabled: false,
    modalHidden: true,
    replyContent: '',
    authorBool: new Array(),//显示回复数组
    authorbool: new Array(),
    index2: '',//回复索引
    chooseIndex: '',//精选索引
    isChoose: new Array(),//是否设置为精选
    isTop: new Array(),//是否设置置顶留言
    formId: '',
    id: '',//公众号id
    name: '',
    headpath: '',
    describes: '',
    posts_key: [], //所有文章内容
    title: ' ',
    no: '',
    inputValue:'',
  },

  // 长按复制
  copy: function (e) {
    var that = this;
    var index = e.currentTarget.dataset.index
    console.log();
    that.setData({
      title: that.data.posts_key[index].title,
      no: that.data.posts_key[index].no
    })

    wx.setClipboardData({
      data: 'pages/message/message?title=' + that.data.title + '&g_id=' + that.data.id+ '&no=' + that.data.no,
      success: function (res) {
        wx.showToast({
          title: '复制成功',
        });
      }
    });
  },

  // 折叠显示
  showFrom(e) {
    var param = e.target.dataset.param;
    this.setData({
      isShowFrom1: param == 1 ? (!this.data.isShowFrom1) : false,
      // isShowFrom2: param == 2 ? (!this.data.isShowFrom2) : false,
      // isShowFrom3: param == 3 ? (!this.data.isShowFrom3) : false
    });
  },

  //获取标题文本值
  titleInput: function (e) {
    console.log(e.detail.value);
    this.setData({
      title: e.detail.value
    })
  },
  //获取描述文本值
  describeInput: function (e) {
    console.log(e.detail.value);
    this.setData({
      describe: e.detail.value
    })
  },

  //选择照片 
  chooseimage: function () {
    var that = this;
    wx.chooseImage({
      count: 1, // 默认9  
      sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有  
      sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有  
      success: function (res) {
        console.log(res.tempFilePaths)
        // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片  
        that.setData({
          tempFilePath: res.tempFilePaths[0]
        })
      }
    })
  },

  //上传照片
  post_image: function () {
    var that = this;
    console.log("照片路径"+that.data.tempFilePath)
    //上传服务器
    wx: wx.showToast({
      title: '上传中',
      icon: 'loading'
    })
    wx.uploadFile({
      url: '自己服务器API',
      filePath: that.data.tempFilePath,
      name: 'file',
      header: {
        'content-type': 'multipart/form-data'
      },
      method: 'post', //上传方式s
      success: function (res) {
        console.log(res.data)
        if (res.statusCode == 200) {
          // 获取文章列表
          that.getArticelList();
          //上传formid
          that.postFormid();
          wx.showToast({
            title: '上传成功',
            icon: 'success',
          })
        } else {
          console.log(res.data)
          wx.showToast({
            title: '服务器错误1',
            icon: 'fail',
          })
        }
      },
      fail: function (res) {
        console.log(res)
        wx.showToast({
          title: '服务器错误',
          icon: 'fail',
        })
      }
    })
  },

  //提交数据
  submitdata: function () {
    var that = this;
    //判断数据不能为空
    if (this.data.title == "" || this.data.describe == "" || that.data.tempFilePath == ""){
      wx.showToast({
        title: '标题、描述、文章配图不能为空',
        icon: 'none'
      })
    }else{
      //上传服务器
      wx:wx.showToast({
        title: '上传中',
        icon: 'loading'
      })
      wx.request({
        url: '自己服务器API', //url
        data: {
          title: this.data.title,   //标题
          describe: this.data.describe, //描述
          id: that.data.id,//公众号id
          isheck: 0 //标识
        },
        header: {
          'content-type': 'application/json' // 数据格式（默认值）
        },
        method: 'post', //上传方式
        success: function (res) {   //回调成功
          console.log(res.data)
          if (res.statusCode == 200) {
            if (res.data.result == '1'){
              that.setData({
                inputValue: ''
              })
              that.post_image();
            }else{
              wx.showToast({
                title: '上传失败',
                icon: 'fail',
              })
            }
          }else{
            wx.showToast({
              title: '服务器错误',
              icon: 'none',
            })
          }
        },
        //回调失败
        fail: function (res) {
          console.log(res)
          wx.showToast({
            title: '请检查网络',
            icon: 'fail',
          })
        },
      })
    }
  },

  //服务推送通知
  orderSign: function (e) {
    var that = this;
    var fId = e.detail.formId;
    console.log('formid' + fId)
    that.setData({
      formId: fId
    })
  },

  //上传Formid
  postFormid: function() {
    var that =this;
    console.log("formid="+that.data.formId)
    wx.request({
      url: '自己服务器API', //获取文章列表
      data: {
        id: that.data.id,
        formid: that.data.formId,
        token: wx.getStorageSync('token'),
        openid: wx.getStorageSync('openid')
      },
      header: {
        'content-type': 'application/json' // 数据格式（默认值）
      },
      method: 'post', //上传方式
      success: function (res) {   //回调成功
        console.log(res.data)
        if (res.statusCode == 200) {
          if (res.data.result == '1') {
            var posts_content = res.data;
            console.log('formid已上传')
          } else {
            wx.showToast({
              title: 'formid上传出错',
              icon: 'none',
            })
          }
        } else {
          wx.showToast({
            title: '服务器错误',
            icon: 'none',
          })
        }
      },
      //回调失败
      fail: function (res) {
        console.log(res)
        wx.showToast({
          title: '联网失败',
          icon: 'fail',
        })
      },
    })
  },

  // 删除文章
  delete: function (event){
    var that = this;
    var index = event.currentTarget.dataset.index;
    var nos = that.data.posts_key[index].no;
    console.log("文章编辑"+index + nos)

    wx.showModal({
      title: '提示',
      content: '是否也将本文章的留言内容也删除？',
      success: function (res) {
        if (res.confirm) {
          wx: wx.showToast({
            title: '正在删除',
            icon: 'loading',
          })
          wx.request({
            url: '自己服务器API', 
            data: {
              type: '2',
              id: that.data.id, //公众号id
              no: nos //文章id
            },
            header: {
              'content-type': 'application/json' // 数据格式（默认值）
            },
            method: 'post', //上传方式
            success: function (res) {   //回调成功
              console.log(res.data)
              if (res.statusCode == 200) {
                if (res.data.result == '1') {
                  // 重新获取文章列表
                  that.getArticelList();
                  wx: wx.showToast({
                    title: '删除成功',
                    icon: 'success',
                  })
                } else {
                  wx.showToast({
                    title: '删除失败！',
                    icon: 'none',
                  })
                }
              } else {
                wx.showToast({
                  title: '服务器错误',
                  icon: 'none',
                })
              }
            },
            //回调失败
            fail: function (res) {
              console.log(res)
              wx.showToast({
                title: '联网失败',
                icon: 'fail',
              })
            },
          })
        } else if (res.cancel) {
          console.log('用户点击取消')
        }
      }
    })
  },

  // 获取文章列表
  getArticelList: function(){
    var that = this;
    wx.request({
      url: '自己服务器API', //获取文章列表
      data: {
        type: '1',//获取列表标识
        id: that.data.id //公众号id
      },
      header: {
        'content-type': 'application/json' // 数据格式（默认值）
      },
      method: 'post', //上传方式
      success: function (res) {   //回调成功
        console.log(res.data)
        if (res.statusCode == 200) {
          if (res.data.result == '1') {
            var posts_content = res.data;
            console.log('onLoad文章信息为:' + res.data.content)
            that.setData({
              posts_key: posts_content.content
            })
          } else {
            that.setData({
              posts_key: ''
            })
            wx.showToast({
              title: '您还没有发布文章哦，请先发布文章',
              icon: 'none',
            })
          }
        } else {
          wx.showToast({
            title: '服务器错误',
            icon: 'none',
          })
        }
      },
      //回调失败
      fail: function (res) {
        console.log(res)
        wx.showToast({
          title: '联网失败',
          icon: 'fail',
        })
      },
    })
  },

  /**
   * 生命周期函数--监听页面加载
   *  功能：获取已留言未回复用户。
   */
  onLoad: function (options) {
    var that = this;
    that.setData({
      id: options.id,
      name: options.name,
      headpath: options.headpath,
      describes: options.describe
    })
    // 获取文章列表
    that.getArticelList();
  },
  

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    var that = this;
    // 获取文章列表
    that.getArticelList();
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
    var that = this;
    // 获取文章列表
    that.getArticelList();

    //完成停止加载
    wx.hideNavigationBarLoading();

    //停止下拉刷新 
    wx.stopPullDownRefresh();
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})