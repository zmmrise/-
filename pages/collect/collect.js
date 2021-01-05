// pages/collect/collect.js
Page({

  /**
   * 页面的初始数据
   */
  data: { 
    collect: [],
    tabs: [
      {
        id: 0,
        value: '商品收藏',
        isActive: true
      },
      {
        id: 1,
        value: '品牌收藏',
        isActive: false
      },
      {
        id: 2,
        value: '店铺收藏',
        isActive: false
      },
      {
        id: 3,
        value: '浏览足迹',
        isActive: false
      }
    ],

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  
  onShow: function () {
    let collect = wx.getStorageSync('collect') || [];
    this.setData({
      collect
    })
  },
  handleTabsItemChange(e){
    const currendIndex = e.detail;
    const tabs = this.data.tabs;
    tabs.forEach((item, i) => {
      i == currendIndex ? item.isActive = true : item.isActive = false
    });
    this.setData({
      tabs: tabs
    })
  },
  
})