// pages/user/user.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    userinfo: {},
    // 收藏商品的数量
    collectNums: 0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },

 

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    const userinfo = wx.getStorageSync('userInfo');
    const collect = wx.getStorageSync('collect') || [];

    this.setData({
      userinfo,
      collectNums: collect.length
    })
  },
  // 跳转到登录页面
  handleLogin(){
    wx.navigateTo({
      url: '../login/login',
    })
  }
  
})