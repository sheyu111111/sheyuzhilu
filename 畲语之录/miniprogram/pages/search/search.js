Page({
  /**
   * 页面的初始数据
   */
  data: {
    searchContentStr : '',
    searchList : [],
    historyList : [],
    isHeader: true,
    isList: false
  },
  onShow(){
    this.initHisTory()
  },
  initHisTory() {
    let that = this
    wx.getStorage({
      key : 'historyList',
      success(res){
        if(res.data != null) {
          that.setData({
            historyList : res.data
          })
          that.initHeader()
        }
      }
    })
  },
  initHeader() {
    if(this.data.historyList.length == 0)
      {
        this.setData({
          isHeader : false
        })
      }
    else {
      this.setData({
        isHeader : true
      })
    }
  },
  searchContent(e) {
    this.setData({
      searchContentStr:e.detail.value
    })
    this.search()
  },
  clearAll() {
    this.setData({
      searchContentStr:''
    })
    this.search()
  },
  goSearch() {
    let searchContent = this.data.searchContentStr;
    if (this.data.searchContentStr == '' || this.data.searchContentStr == ' ') {
      wx.showModal({
        showCancel : false,
        content : '搜索内容不可为空~',
      })
    }
    else {
      let historyList = this.data.historyList;
      for (let i = 0; i < historyList.length; i++) {
        if(historyList[i] == searchContent) {
          historyList.splice(i, 1)
        }
      }
      historyList.unshift(searchContent);
      wx.setStorage({
        key : 'historyList',
        data : historyList,
        success(){
          wx.navigateTo({
            url: '/pages/searchResult/searchResult?searchContent=' + searchContent,
          })
        }
      })
    }
  },
  goSearch2 (e) {
      let historyList = this.data.historyList;
      for (let i = 0; i < historyList.length; i++) {
        if(historyList[i] == e.target.dataset.name) {
          console.log(11)
          historyList.splice(i, 1)
        }
      }
      historyList.unshift(e.target.dataset.name);
      wx.setStorage({
        key : 'historyList',
        data : historyList,
        success(){
          wx.navigateTo({
            url: '/pages/searchResult/searchResult?searchContent=' + e.target.dataset.name,
          })
        }
      }
    )
  },
  clearHistory () {
    this.setData({
      historyList:[],
      isHeader : false
    })
    let that = this
    wx.setStorage({
      key : 'historyList',
      data : that.data.historyList
    })
  },
  search () {
    const db = wx.cloud.database();
    const Language = db.collection('Language');
    let searchContent = this.data.searchContentStr;
    let that = this;
      Language.where({
        Lname: {
          $regex : '.*' + searchContent,
          $options : 'i'
        }
      }).get({
      success:function(res) {
       if (res.data.length == 0 || searchContent == '')
         {
          that.setData({
            searchList : [],
            isList: false
          })
         }
       else {
         that.setData({
          searchList : res.data,
          isList: true
         })
       }
      },
      fail:function() {
       console.log('fail')
      }
    })
  }
})
