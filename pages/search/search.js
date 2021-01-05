import {request} from "../../request/index.js"
Page({

  /**
   * 页面的初始数据
   */
  data: {
    goods_list: [],
    // 取消按钮是否显示
    isFocus: false,
    // 输入框内容
    inputValue: ''
  },
  // 全局的定时器
  TimeId: -1,
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },

  
  
  onShow: function () {
    if (!this.data.inputValue.trim()){
      this.setData({
        goods_list: [],
        isFocus: false
      })
      return;
    }
  },
  handleInput(e){
    // 获取输入框的内容
    const query = e.detail.value;
    this.setData({
      inputValue: query
    })
    // 检测合法性
    if (!query.trim()){
      this.setData({
        goods_list: [],
        isFocus: false
      })
      return;
    }
    this.setData({
      isFocus: true
    })
    clearTimeout(this.TimeId);
    this.TimeId = setTimeout(() => {
      this.qsearch(query);
    }, 1000)
    
  },
  // 发送请求获取搜索
  async qsearch(query){
    const res = await request({url: "/goods/qsearch", data: {query}});
    this.setData({
      goods_list: res.data.message
    })
  },
  // 按钮取消， 清空输入框、重置数组
  handleBtn(){
    this.setData({
      inputValue: '',
      isFocus: false,
      goods_list: []
    })
  }
})