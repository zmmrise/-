export const getSetting = () => {
  return new Promise((resolve, reject) => {
    wx.getSetting({
      success: (result => {
        resolve(result);
      }),
      fail: (err => {
        reject(err);
      })
    })
  })
}

export const chooseAddress = () => {
  return new Promise((resolve, reject) => {
    wx.chooseAddress({
      success: (result => {
        resolve(result);
      }),
      fail: (err => {
        reject(err);
      })
    })
  })
}

export const openSetting = () => {
  return new Promise((resolve, reject) => {
    wx.openSetting({
      success: (result => {
        resolve(result);
      }),
      fail: (err => {
        reject(err);
      })
    })
  })
}

export const login = () => {
  return new Promise((resolve, reject) => {
    wx.login({
      success: (result => {
        resolve(result);
      }),
      fail: (err => {
        reject(err);
      })
    })
  })
}

