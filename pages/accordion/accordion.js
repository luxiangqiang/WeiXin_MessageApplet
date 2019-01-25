// pages/accordion/accordion.js
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
  },
  onLoad: function (options) {
  
  },
  showFrom(e){
    var param = e.target.dataset.param; 
    this.setData({ 
      isShowFrom1: param == 1 ? (!this.data.isShowFrom1) : false,
      // isShowFrom2: param == 2 ? (!this.data.isShowFrom2) : false,
      // isShowFrom3: param == 3 ? (!this.data.isShowFrom3) : false
    });
  }
})