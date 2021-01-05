// pages/feedback/feedback.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    tabs: [
      {
        id: 0,
        value: '体验问题',
        isActive: true
      },
      {
        id: 1,
        value: '商品、商家投诉',
        isActive: false
      }  
      
     
    ],
    // 被选中的图片数组
    chooseImgs: [],
    // 文本域的内容
    textVal: ''
  },
  // 外网的图片数组
  UpLoadImgs: [],
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  
  onShow: function () {

  },
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
  // 点击 + 选择图片
  handleChooseImg(){
    wx.chooseImage({
      count: 4,
      success: (res) => {
        this.setData({
          chooseImgs: [...this.data.chooseImgs, ...res.tempFilePaths]
        })
      }
    })
  },
  // 删除图片
  removeImg(e){
    const currentIndex = e.currentTarget.dataset.index;
    let chooseImgs = this.data.chooseImgs;
    chooseImgs.splice(currentIndex, 1);
    this.setData({
      chooseImgs
    })
  },
  // 文本域输入事件
  handleTextInput(e){
    
    let value = e.detail.value;
    this.setData({
      textVal: value
    })
  },
  // 点击提交
  handleSubmit(){
    // 获取图片数组
    const chooseImgs = this.data.chooseImgs;
    if (!this.data.textVal.trim()){
      wx.showToast({
        title: '请输入您的问题',
        icon: 'none',
        mask: true
      })
      return;
    }
  
    // 上传文件的 api 不支持 多个文件同时上传 遍历数组 挨个上传
    if (chooseImgs.length != 0){
      chooseImgs.forEach((item, index) => {
        // 上传图片到专门的服务器
        wx.uploadFile({
          filePath: item,
          name: 'file',
          formData: {},
          url: 'https://imgurl.org/',
          complete: (res) => {
            

            if (index == chooseImgs.length - 1){
              this.setData({
                textVal: '',
                chooseImgs: []
              })
              wx.showToast({
                title: '上传完成',
                icon: 'success'
              })
              wx.navigateBack({
                delta: 1,
              })
            }
          }
        })
      })
    }
    else{
      wx.navigateBack({
        delta: 1,
      })
    }
    
  }
})