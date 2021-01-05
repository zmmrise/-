import {request} from "../../request/index.js"

Page({

  /**
   * 页面的初始数据
   */
  data: {
    // 地址信息
    address: {},
    // 购物车列表
    cart: [],
    
    // 商品总价格
    totalPrice: 0,
    // 总数量
    totalNum: 0,
    // 显示支付
    isShowPay: false
  },
  
  
  
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    
  },
  onShow(){
    // 获取缓存中的地址信息
    const address = wx.getStorageSync('address');
    if (address){
      this.setData({
        address
      })
    }
    // 获取缓存中的购物车数组
    let cart = wx.getStorageSync('cart') || [];
    cart = cart.filter(item => item.checked);

    

    let totalPrice = 0;
    let totalNum = 0;
    cart.forEach(item => {
        totalPrice += item.num * item.goods_price;
        totalNum += item.num;
    })
    
    
    this.setData({
      cart: cart,
      totalPrice,
      totalNum
    });
    
  },
  

  // 点击支付
  async handleOrderPay(){
    const token = wx.getStorageSync('token');
    if (!token){
      wx.navigateTo({
        url: '../auth/auth',
      });
      return;
    }
    const header = {Authorization: token};
   
    const order_price = this.data.totalPrice;
    const consignee_addr = this.data.address.provinceName + this.data.address.cityName + this.data.address.countyName + this.data.address.detailInfo;
    const cart = this.data.cart;
    let goods = [];
    cart.forEach(item => goods.push({
      goods_id: item.goods_id,
      goods_number: item.num,
      goods_price: item.goods_price
    }))
    const orderParams = {order_price, consignee_addr, goods};
    const result = await request({url: "/my/orders/create", data: orderParams, method: "POST", header: header});
    const order_number = result.data.message.order_number;
    const res = await request({url: "/my/orders/req_unifiedorder", header: header, method: "POST", data: {order_number}});
    const pay = res.data.message.pay;
    this.setData({
      isShowPay: true
    })
  }
  
  
 
  
})