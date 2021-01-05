import {request} from "../../request/index.js"
Page({

  /**
   * 页面的初始数据
   */
  data: {
    orders: [],
    tabs: [
      {
        id: 0,
        value: '全部',
        isActive: true
      },
      {
        id: 1,
        value: '待付款',
        isActive: false
      },
      {
        id: 2,
        value: '待发货',
        isActive: false
      },
      {
        id: 3,
        value: '退款/退货',
        isActive: false
      }
    ],
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    
  },
  // 根据标题索引来激活选中 标题数组
  changeTitleByIndex(index){
    const tabs = this.data.tabs;
    tabs.forEach((item, i) => {
      i == index ? item.isActive = true : item.isActive = false
    });
    this.setData({
      tabs: tabs
    })
  },
  handleTabsItemChange(e){
    const currendIndex = e.detail;
    this.changeTitleByIndex(currendIndex);
    // 重新发生请求 type = index + 1
    this.getOrders(index + 1);
  },
  

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    // 获取当前小程序的页面栈 
    let pages = getCurrentPages();
    let currentPage = pages[pages.length - 1];
    const type = currentPage.options.type;
    this.getOrders(type);

    this.changeTitleByIndex(type - 1);
  },  
  // 获取订单列表
  async getOrders(type){
    const token = wx.getStorageSync('token')
    const header = {Authorization: token};
    const res = await request({url: "/my/orders/all", header, data:{type}});
    this.setData({
      orders: res.data.message.orders.map(item => ({...item, create_time_cn: (new Date(item.create_time*1000).toLocaleString())}))
    });
    
    
  }
  
})