// pages/mycenter/mycenter.js
Page({

  data: {
    title: '',
    no: '',
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
    id: '' //公众号id
  },

  //悬浮按钮（回到主页）
  onPostClick: function () {
    wx: wx.navigateTo({
      url: '../../pages/index/index'
    })
  },

/**
* 长按复制
*/
  copy: function (e) {
    var that = this;
    console.log(e);
    wx.setClipboardData({
      data: 'pages/message/message?title=' + that.data.title + '& no=' + that.data.no,
      success: function (res) {
        wx.showToast({
          title: '复制成功',
        });
      }
    });
  },

  //弹出回复框
  showModal: function (event) {
    // console.log(event.currentTarget.dataset.index)
    var u_index = event.currentTarget.dataset.index;
    console.log("回复索引：" + event.currentTarget.dataset.index)
    this.setData({
      modalHidden: !this.data.modalHidden,
      index2: u_index
    })
  },

  //获取输入框（作者回复）内容
  getInputContent: function (e) {
    console.log(e.detail.value)
    this.setData({
      inputContent: e.detail.value
    })
  },

  //确定
  modalBindaconfirm: function () {
    var that = this;
    that.getInputContent
    console.log(that.data.inputContent)
    if (that.data.inputContent == "") {
      wx.showToast({
        title: '回复内容不能为空！',
        icon: 'none',
      })
    } else {
      this.setData({
        modalHidden: !this.data.modalHidden,
        buttonDisabled: !this.data.buttonDisabled,
        inputContentxml: that.data.inputContent,
      })
      console.log(that.data.authormessages)
      //回复内容上传服务器
      that.replay()
    }
  },

  //作者回复
  replay: function () {
    var that = this;
    var l = '自己服务器API';//信息用户自己接收
    console.log("更新forim"+that.data.formId)
    var d = {
      p_id: that.data.messages[that.data.index2].p_id,//用户留言编号
      page: '/pages/message/message?g_id=' + that.data.messages[that.data.index2].g_id + '&no=' + that.data.messages[that.data.index2].no + '&title=' + that.data.title,//跳转页面
      title: that.data.messages[that.data.index2].title,//文章标题
      message: that.data.messages[that.data.index2].userMesContent,//留言内容
      replyMes: that.data.inputContent,//回复内容
      formid: that.data.formId, //更新formid
      g_id: that.data.id //公众号id
    }
    wx: wx.showToast({
      title: '正在回复中',
      icon: 'loading'
    })
    wx.request({
      url: '自己服务器API', //作者回复
      data: {
        id: that.data.messages[that.data.index2].p_id,//用户编号
        replyContent: that.data.inputContent,   //回复内容
        isCheckChoess: '0'  //是否筛选（否）
      },
      header: {
        'content-type': 'application/json' // 数据格式（默认值）
      },
      method: 'post', //上传方式
      success: function (res) {   //回调成功
        console.log(res.data)
        if (res.statusCode == 200) {
          if (res.data.result == '1') {
            //通过消息推送到用户微信
            wx.request({
              url: l,
              data: d,
              method: 'POST',
              success: function (res) {
                that.data.authorBool[that.data.index2] = true
                that.data.authormessages[that.data.index2] = that.data.inputContent
                that.setData({
                  authormessages: that.data.authormessages,
                  authorBool: that.data.authorBool,
                })
                wx.showToast({
                  title: '已回复',
                  icon: 'none',
                })
              },
              fail: function (err) {
                wx.showToast({
                  title: '网络连接失败',
                  icon: 'none',
                })
              }
            });

          } else {
            wx.showToast({
              title: '回复失败',
              icon: 'none',
            })
          }
        } else {
          wx.showToast({
            title: '回复失败',
            icon: 'none',
          })
        }
      },
      //回调失败
      fail: function (res) {
        console.log(res)
        wx.showToast({
          title: '服务器错误',
          icon: 'fail',
        })
      },
    })
  },

  //服务推送通知
  orderSign: function (e) {
    var that = this;
    var fId = e.detail.formId;
    this.setData({
      inputContentxml: ''
    })
    console.log("留言内容：" + that.data.messages)
    that.setData({
      formId: fId
    })
  },
  // 取消
  modalBindcancel: function () {
    this.setData({
      modalHidden: !this.data.modalHidden,
      inputContent: ''
    })
  },

  //精选留言
  choose: function (event) {
    var that = this;
    var j_index = event.currentTarget.dataset.index;
    console.log("精选索引：" + event.currentTarget.dataset.index)
    wx: wx.showToast({
      title: '正在设置中',
      icon: 'loading'
    })
    wx.request({
      url: '自己服务器API', //设置为精选留言
      data: {
        id: that.data.messages[j_index].p_id,//留言用户id
        type: '1' //精选留言标识 
      },
      header: {
        'content-type': 'application/json' // 数据格式（默认值） 
      },
      method: 'post', //上传方式
      success: function (res) {   //回调成功
        console.log(res.data)
        if (res.statusCode == 200) {
          if (res.data.result == '1') {
            wx.showToast({
              title: '已设为精选留言',
              icon: 'none',
            })
            that.data.isChoose[j_index] = true
            that.setData({
              isChoose: that.data.isChoose
            })
          } else {
            wx.showToast({
              title: '设置精选留言失败',
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
          title: '网络连接失败',
          icon: 'none',
        })
      },
    })
  },

  //取消精选
  cancelChoose: function (event) {
    var that = this;
    var j_index = event.currentTarget.dataset.index;
    console.log("精选索引：" + event.currentTarget.dataset.index)
    wx: wx.showToast({
      title: '正在设置中',
      icon: 'loading'
    })
    wx.request({
      url: '自己服务器API', //设置为精选留言
      data: {
        id: that.data.messages[j_index].p_id,//留言用户id
        type: '2' //精选留言标识 
      },
      header: {
        'content-type': 'application/json' // 数据格式（默认值） 
      },
      method: 'post', //上传方式
      success: function (res) {   //回调成功
        console.log(res.data)
        if (res.statusCode == 200) {
          if (res.data.result == '1') {
            wx.showToast({
              title: '已取消精选留言',
              icon: 'none',
            })
            that.data.isChoose[j_index] = false
            that.setData({
              isChoose: that.data.isChoose
            })
          } else {
            wx.showToast({
              title: '取消精选留言失败',
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
          title: '网络连接失败',
          icon: 'none',
        })
      },
    })
  },

  // 置顶留言
  settop: function (event) {
    var that = this;
    var j_index = event.currentTarget.dataset.index;
    console.log("置顶索引：" + event.currentTarget.dataset.index)
    wx: wx.showToast({
      title: '正在设置中',
      icon: 'loading'
    })
    wx.request({
      url: '自己服务器API', //留言置顶
      data: {
        id: that.data.messages[j_index].p_id,//留言用户id
        type: '1' //置顶留言标识 
      },
      header: {
        'content-type': 'application/json' // 数据格式（默认值） 
      },
      method: 'post', //上传方式
      success: function (res) {   //回调成功
        console.log(res.data)
        if (res.statusCode == 200) {
          if (res.data.result == '1') {
            wx.showToast({
              title: '已置顶留言',
              icon: 'none',
            })
            that.data.isTop[j_index] = !that.data.isTop[j_index]
            that.setData({
              isTop: that.data.isTop
            })
          } else {
            wx.showToast({
              title: '取消置顶留言失败',
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
          title: '网络连接失败',
          icon: 'none',
        })
      },
    })
  },

  // 取消置顶
  canceltop: function (event) {
    var that = this;
    var j_index = event.currentTarget.dataset.index;
    console.log("取消置顶索引：" + event.currentTarget.dataset.index)
    wx: wx.showToast({
      title: '正在设置中',
      icon: 'loading'
    })
    wx.request({
      url: '自己服务器API', //取消留言置顶
      data: {
        id: that.data.messages[j_index].p_id,//留言用户id
        type: '2' //置顶留言标识 
      },
      header: {
        'content-type': 'application/json' // 数据格式（默认值） 
      },
      method: 'post', //上传方式
      success: function (res) {   //回调成功
        console.log(res.data)
        if (res.statusCode == 200) {
          if (res.data.result == '1') {
            wx.showToast({
              title: '已取消置顶留言',
              icon: 'none',
            })
            that.data.isTop[j_index] = !that.data.isTop[j_index]
            that.setData({
              isTop: that.data.isTop
            })
          } else {
            wx.showToast({
              title: '取消置顶留言失败',
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
          title: '网络连接失败',
          icon: 'none',
        })
      },
    })
  },

  //删除留言
  deleteMessage: function (event) {
    var that = this;
    var j_index = event.currentTarget.dataset.index;
    console.log("精选索引：" + event.currentTarget.dataset.index)
    wx: wx.showToast({
      title: '正在删除',
      icon: 'loading'
    })
    wx.request({
      url: '自己服务器API', //删除留言
      data: {
        id: that.data.messages[j_index].p_id,//留言用户id
        type: '0' //精选留言标识 
      },
      header: {
        'content-type': 'application/json' // 数据格式（默认值） 
      },
      method: 'post', //上传方式
      success: function (res) {   //回调成功
        console.log(res.data)
        if (res.statusCode == 200) {
          if (res.data.result == '1') {
            wx.showToast({
              title: '已删除该留言',
              icon: 'none',
            })
            //刷新页面
            var messlist = that.data.messages;
            messlist.splice(j_index, 1);
            //隐藏作者回复
            that.data.authorBool[j_index] = false
            that.setData({
              messages: messlist,
              authorBool: that.data.authorBool
            })
          } else {
            wx.showToast({
              title: '删除留言失败',
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
          title: '网络连接失败',
          icon: 'none',
        })
      },
    })
  },

  /**
   * 生命周期函数 -- 监听页面加载
   *  功能：获取已留言未回复用户。
   */
  onLoad: function (options) {
    var that = this;
    var title = options.title;// 文章标题
    var nos = options.no;   // 文章编号
    var ids = options.id;// 公众号id
    that.setData({
      no: nos,
      title: title,
      id: ids
    })
    wx: wx.showToast({
      title: '正在获取数据',
      icon: 'loading'
    })
    wx.request({
      url: '自己服务器API', //url
      data: {
        ischeckmessage: 0,
        no: that.data.no,
        id: that.data.id
      },
      header: {
        'content-type': 'application/json' // 数据格式（默认值）
      },
      method: 'post', //上传方式
      success: function (res) {   //回调成功
        console.log(res.data)
        if (res.statusCode == 200) {
          if (res.data.result == '1') {
            console.log(res.data.count)
            var isReplyArray = new Array(res.data.count);
            var isChoosem = new Array(res.data.count);
            var arraymessage = new Array(res.data.count);
            var top = new Array(res.data.count);
            for (var i = 0; i < res.data.count; i++) {
              if (res.data.content[i].authorMesContent != "") {
                isReplyArray[i] = true;
                arraymessage[i] = res.data.content[i].authorMesContent;
              } else {
                isReplyArray[i] = false;
              }
              if (res.data.content[i].istop != 1) {
                top[i] = false
              } else {
                top[i] = true
              }
              if (res.data.content[i].isCheck != 1) {
                isChoosem[i] = false;
              } else {
                isChoosem[i] = true;
              }
            }
            that.setData({
              authormessages: arraymessage,
              isChoose: isChoosem,//精选留言文字的切换
              isTop: top,//置顶留言文字的切换
              authorBool: isReplyArray,//显示作者留言
              messages: res.data.content
            })
            for (var i = 0; i < res.data.count; i++) {
              console.log("authorBool:" + that.data.authorBool[i])
            }
          } else {
            wx.showToast({
              title: '无用户留言',
              icon: 'none',
            })
          }
        } else {
          wx.showToast({
            title: '服务器错误',
            icon: 'fail',
          })
        }
      },
      //回调失败
      fail: function (res) {
        console.log(res)
        wx.showToast({
          title: '连接失败',
          icon: 'fail',
        })
      },
    })
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
    wx.showNavigationBarLoading(); //在标题栏中显示加载图标 
    var that = this;
    wx: wx.showToast({
      title: '正在获取数据',
      icon: 'loading'
    })
    wx.request({
      url: '自己服务器API', //url
      data: {
        ischeckmessage: 0,
        no: that.data.no,
        id: that.data.id
      },
      header: {
        'content-type': 'application/json' // 数据格式（默认值）
      },
      method: 'post', //上传方式
      success: function (res) {   //回调成功
        console.log(res.data)
        if (res.statusCode == 200) {
          if (res.data.result == '1') {
            console.log(res.data.count)
            var isReplyArray = new Array(res.data.count);
            var isChoosem = new Array(res.data.count);
            var arraymessage = new Array(res.data.count);
            var top = new Array(res.data.count);
            for (var i = 0; i < res.data.count; i++) {
              if (res.data.content[i].authorMesContent != "") {
                isReplyArray[i] = true;
                arraymessage[i] = res.data.content[i].authorMesContent;
              } else {
                isReplyArray[i] = false;
              }
              if (res.data.content[i].istop != 1) {
                top[i] = false
              } else {
                top[i] = true
              }
              if (res.data.content[i].isCheck != 1) {
                isChoosem[i] = false;
              } else {
                isChoosem[i] = true;
              }
            }
            that.setData({
              authormessages: arraymessage,
              isChoose: isChoosem,//精选留言文字的切换
              isTop: top,//置顶留言文字的切换
              authorBool: isReplyArray,//显示作者留言
              messages: res.data.content
            })
            for (var i = 0; i < res.data.count; i++) {
              console.log("authorBool:" + that.data.authorBool[i])
            }
          } else {
            wx.showToast({
              title: '无用户留言',
              icon: 'none',
            })
          }
        } else {
          wx.showToast({
            title: '服务器错误',
            icon: 'fail',
          })
        }
      },
      //回调失败
      fail: function (res) {
        console.log(res)
        wx.showToast({
          title: '连接失败',
          icon: 'fail',
        })
      },
      complete: function () {
        wx.hideNavigationBarLoading();          //完成停止加载 
        // 动态设置导航条标题 
        wx.stopPullDownRefresh();            //停止下拉刷新 
      }
    })
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
    wx.showNavigationBarLoading(); //在标题栏中显示加载图标 
    var that = this;
    wx: wx.showToast({
      title: '正在获取数据',
      icon: 'loading'
    })
    wx.request({
      url: '自己服务器API', //url
      data: {
        ischeckmessage: 0,
        no: that.data.no,
        id: that.data.id
      },
      header: {
        'content-type': 'application/json' // 数据格式（默认值）
      },
      method: 'post', //上传方式
      success: function (res) {   //回调成功
        console.log(res.data)
        if (res.statusCode == 200) {
          if (res.data.result == '1') {
            console.log(res.data.count)
            var isReplyArray = new Array(res.data.count);
            var isChoosem = new Array(res.data.count);
            var arraymessage = new Array(res.data.count);
            var top = new Array(res.data.count);
            for (var i = 0; i < res.data.count; i++) {
              if (res.data.content[i].authorMesContent != "") {
                isReplyArray[i] = true;
                arraymessage[i] = res.data.content[i].authorMesContent;
              } else {
                isReplyArray[i] = false;
              }
              if (res.data.content[i].istop != 1) {
                top[i] = false
              } else {
                top[i] = true
              }
              if (res.data.content[i].isCheck != 1) {
                isChoosem[i] = false;
              } else {
                isChoosem[i] = true;
              }
            }
            that.setData({
              authormessages: arraymessage,
              isChoose: isChoosem,//精选留言文字的切换
              isTop: top,//置顶留言文字的切换
              authorBool: isReplyArray,//显示作者留言
              messages: res.data.content
            })
            for (var i = 0; i < res.data.count; i++) {
              console.log("authorBool:" + that.data.authorBool[i])
            }
          } else {
            wx.showToast({
              title: '无用户留言',
              icon: 'none',
            })
          }
        } else {
          wx.showToast({
            title: '服务器错误',
            icon: 'fail',
          })
        }
      },
      //回调失败
      fail: function (res) {
        console.log(res)
        wx.showToast({
          title: '连接失败',
          icon: 'fail',
        })
      },
      complete: function () {
        wx.hideNavigationBarLoading();          //完成停止加载 
        // 动态设置导航条标题 
        wx.stopPullDownRefresh();            //停止下拉刷新 
      }
    })
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