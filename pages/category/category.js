import {request} from "../../request/index.js"
Page({

  /**
   * 页面的初始数据
   */
  data: {
    // 左侧的菜单数据
    leftMenuList: [],
    // 右侧的商品数据
    rightContent: [],
    // 被点击的菜单索引
    currentIndex: 0,
    // 设置竖向滚动条位置
    scrollTop: 0
  },
  // 接口的返回数据
  Cates: [],

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // 先判断本地存储中有没有旧的数据
    // 没有旧数据，直接发生新请求
    // 有旧数据，同时旧数据也没有过期，就使用 本地存储的数据
    // 1 获取本地存储的数据
    const Cates = wx.getStorageSync('cates');
    // 2 判断
    if (!Cates){
      // 不存在   发生请求获取数据
      this.getCategoryList();
    }
    else{
      // 有 旧的数据  定义过期时间
      if (Date.now() - Cates.time > 1000*10){
        // 重新发生请求
        this.getCategoryList();
      }
      else{
        // 可以使用旧数据
        this.Cates = Cates.data;
        const leftMenuList = this.Cates.map(item => item.cat_name);
     const rightContent = this.Cates[0].children;
     this.setData({
       leftMenuList,
       rightContent
     })
      }
    }
    
  },
  // 获取分类数据
  getCategoryList(){
   request({url: `/categories
   `}).then(result => {
     this.Cates = result.data.message;
     // 将接口的数据存入到本地存储中  
     wx.setStorageSync('cates', {time: Date.now(), data: this.Cates})
     const leftMenuList = this.Cates.map(item => item.cat_name);
     const rightContent = this.Cates[0].children;
     this.setData({
       leftMenuList,
       rightContent
     })
   })
  },
  // 点击左侧菜单
  handleItemTap(e){ 
    const index = e.currentTarget.dataset.index;
    const rightContent = this.Cates[index].children;
    this.setData({
      currentIndex: index,
      rightContent,
      scrollTop: 0
    })
  }  
})