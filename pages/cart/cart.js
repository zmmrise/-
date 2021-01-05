/* 
1 获取用户的收货地址
  1· 绑定点击事件
  2   调用小程序内置  api 获取用户的收货地址
  3   获取用户对小程序  所授予获取地址的权限状态 scope
    1 如果用户点击授权
        scope.address --> true  直接调用收货地址
    2 如果用户取消授权
        scope.address --> false 
    3 如果用户从来没有调用过收货地址的 api  直接调用收货地址
        scope.address --> undefined
*/

import {getSetting, chooseAddress, openSetting} from "../../utils/asyncWx"
Page({

  /**
   * 页面的初始数据
   */
  data: {
    // 地址信息
    address: {},
    // 购物车列表
    cart: [],
    // 是否全选
    isAllChecked: true,
    // 商品总价格
    totalPrice: 0,
    // 总数量
    totalNum: 0,
    

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
    const cart = wx.getStorageSync('cart') || [];
    this.setCart(cart);
    
  },
  // 点击收货地址按钮 触发事件
  async handleChooseAddress(){
    try {
      // 获取权限状态
    const res = await getSetting();
    const scopeAddress = res.authSetting["scope.address"];
    if (scopeAddress == false){
      await openSetting();

    }
    // 调用收货地址的API
    const address = await chooseAddress();
    // 将收货地址存入到缓存中
    wx.setStorageSync('address', address)
    } catch (error) {
      console.log(error);
    }
  },
  // 商品的选中
  handleItemChange(e){
    const goods_id = e.currentTarget.dataset.id;
    let {cart} = this.data;
    let index = cart.findIndex(item => item.goods_id == goods_id);
    cart[index].checked = !cart[index].checked;
    
    this.setCart(cart);

  },
  // 购物车全选
  handleItemAllCheck(){
      // 获取缓存中的购物车数组
      let {cart, isAllChecked} = this.data;
      isAllChecked = !isAllChecked;
      cart.forEach(item => item.checked = isAllChecked);
      this.setCart(cart);
  },
  // 设置购物车状态时， 重新计算底部工具栏的数据： 全选、合计、结算
  setCart(cart){
    let isAllChecked = true;
    let totalPrice = 0;
    let totalNum = 0;
    cart.forEach(item => {
      if (item.checked){
        totalPrice += item.num * item.goods_price;
        totalNum += item.num;
      }
      else{
        isAllChecked = false;
      }
    })
    // 判断数组是否为空
    isAllChecked = cart.length != 0 ? isAllChecked : false;
    this.setData({
      cart: cart,
      isAllChecked,
      totalPrice,
      totalNum
    });
    wx.setStorageSync('cart', cart);
  },
  // 商品数量的编辑
  handleItemNumEdit(e){
    const {id, operation} = e.currentTarget.dataset;
    let {cart} = this.data;
    const index = cart.findIndex(item => item.goods_id == id);
    if (cart[index].num == 1 && operation == -1){
      wx.showModal({
        title: '提示',
        content: '您确定要移除该商品？',
        success: (res) => {
          if (res.confirm) {
            cart.splice(index, 1);
            this.setCart(cart);
          } else if (res.cancel) {
            console.log('用户点击取消')
          }
        }
      })
    }
    else{
      cart[index].num += operation;
    this.setCart(cart);
    }
    
  },
  // 结算
  handlePay(){
    const {address, totalNum} = this.data;
    if (!address.userName){
      wx.showToast({
        title: '您还没有选择收货地址！',
        icon: 'none'
      });
      return;
    }
    if (totalNum == 0){
      wx.showToast({
        title: '您还没有选购商品！',
        icon: 'none'
      });
      return;
    }
    wx.navigateTo({
      url: '../pay/pay',
    })
  }
})