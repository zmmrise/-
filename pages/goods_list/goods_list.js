// 总页数 = Math.ceil(总条数(total) / 页容量(pagesize))
import {request} from "../../request/index.js"
Page({

  /**
   * 页面的初始数据
   */
  data: {
    tabs: [
      {
        id: 0,
        value: '综合',
        isActive: true
      },
      {
        id: 1,
        value: '销量',
        isActive: false
      },
      {
        id: 2,
        value: '价格',
        isActive: false
      }
    ],
    goods_list: [],
    
  },
  // 接口需要的参数
  queryParams: {
    query: '',
    cid: "",
    pagenum: 1,
    pagesize: 10
  },
  // 总页数
  totalPages: 1,
  // 子组件 Tabs 点击切换
  handleTabsItemChange(e){
    const currendIndex = e.detail;
    const tabs = this.data.tabs;
    tabs.forEach((item, index) => {
      if (index == currendIndex){
        item.isActive = true
      }
      else{
        item.isActive = false
      }
    });
    this.setData({
      tabs: tabs
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    
    this.queryParams.cid = options.cid;
    this.getGoodsList();
  },
  // 获取商品列表
  async getGoodsList(){
    const res = await request({url: "/goods/search", data: this.queryParams});
    // 总条数
    const total = res.data.message.total;
    // 总页数
    this.totalPages = Math.ceil(total / this.queryParams.pagesize)
    this.setData({
      goods_list: [...this.data.goods_list, ...res.data.message.goods]
    })
    // 关闭下拉刷新的窗口
    wx.stopPullDownRefresh()
  },
  // 页面上滑   滚动条触底事件
  onReachBottom(){
    // 判断是否有下一页数据
    if (this.queryParams.pagenum >= this.totalPages){
      wx.showToast({
        title: '似乎到头了呢',
      })
    }
    else{
      this.queryParams.pagenum++;
      this.getGoodsList()
    }
  },
  // 下拉刷新
  onPullDownRefresh(){
    // 重置数组
    this.setData({
      goods_list: []
    });
    // 重置页码
    this.queryParams.pagenum = 1;
    // 发送请求
    this.getGoodsList()
  }
  
})