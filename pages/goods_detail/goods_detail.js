
import {request} from "../../request/index.js"
Page({

  /**
   * 页面的初始数据
   */
  data: {
    goodsObj: {},
    // 商品是否被收藏
    isCollect: false
  },
  // 商品对象
  GoodsInfo: {},
  /**
   * 生命周期函数--监听页面加载
   */
  onShow: function () {
    let pages = getCurrentPages();
    let currentPage = pages[pages.length - 1];
    let options = currentPage.options;
   const {goods_id} = options;
   this.getGoodsDetail(goods_id);
   
    

  },
  // 获取商品详情数据
  async getGoodsDetail(goods_id){
    const res = await request({url: "/goods/detail", data: {goods_id}});
    this.GoodsInfo = res.data.message;
    // 获取缓存中的商品收藏的数组
    let collect = wx.getStorageSync('collect') || [];
    // 判断当前商品是否被收藏
    let isCollect = collect.some(item => item.goods_id == this.GoodsInfo.goods_id);
    this.setData({
      goodsObj: {
        goods_name: res.data.message.goods_name,
        goods_price: res.data.message.goods_price,
        // iphone部分手机，不识别webp图片格式
        // img.webp => img.jpg
        goods_introduce: res.data.message.goods_introduce.replace(/\.webp/g, '.jpg'),
        pics: res.data.message.pics,
      },
      isCollect
    }) 
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  // 点击轮播图， 预览大图
  // 1. 给轮播图绑定点击事件
  // 2. 调用小程序的api   previewImage
  handlePreviewImage(e){
    const urls = this.GoodsInfo.pics.map(item => item.pics_mid);
    const current = e.currentTarget.dataset.url;
    
    wx.previewImage({
      current: current, // 当前显示图片的http链接
      urls: urls // 需要预览的图片http链接列表
    })
  },
  // 点击 加入购物车
  // 获取缓存中的购物车数据
  // 1. 先判断 当前的商品是否已经存在于 购物车
  // 2. 已经存在的商品， 将商品数量+ 1， 重新将购物车数组 填回缓存中
  // 3. 不存在于购物车的数组， 直接给购物车数组添加一个新元素， 带有属性num
  handleCartAdd(){
    // 获取缓存中的购物车数组
    const cart = wx.getStorageSync('cart')||[];
    const index = cart.findIndex(item => item.goods_id == this.GoodsInfo.goods_id );
    if (index == -1){
      this.GoodsInfo.num = 1;
      this.GoodsInfo.checked = true;
      cart.push(this.GoodsInfo);
    }
    else{
      // 2. 已经存在的商品， 将商品数量+ 1
      cart[index].num++;
    }
    // 重新将购物车数组 填回缓存中
    wx.setStorageSync('cart', cart);
    // 弹窗提示用户添加成功
    wx.showToast({
      title: '加入购物车成功',
      icon: 'success',
      mask: true
    })
  },
  // 立即购买
  handleBuy(){
    wx.navigateTo({
      url: '../pay/pay',
    })
  },
  // 点击收藏
  handleCollect(){
    let collect = wx.getStorageSync('collect') || [];
    let index = collect.findIndex(item => item.goods_id == this.GoodsInfo.goods_id);
    if (index !== -1){
      // 已经收藏，在收藏数组中删除该商品
      collect.splice(index, 1);
      this.setData({
        isCollect: false
      });
      wx.showToast({
        title: '取消收藏',
        icon: 'success',
        mask: true
      })
    }
    else{
      // 没有收藏
      collect.push(this.GoodsInfo);
      this.setData({
        isCollect: true
      });
      wx.showToast({
        title: '收藏成功',
        icon: 'success',
        mask: true
      })
    }
    // 将收藏数组存入到缓存中
    wx.setStorageSync('collect', collect);
  }
})