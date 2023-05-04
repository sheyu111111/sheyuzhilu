// pages/searchResult/searchResult.js
Page({
  /**
   * 页面的初始数据
   */
  data: {
    searchContent: '',
    isEmpty: false,
    Lname: '',
    Lphonetic: '',
    Lid: '',
    shine: false,
  },
  onLoad(options) {
    this.setData({
      searchContent:options.searchContent
    })
    this.search();
  },
  play() {
    let that = this;
    that.setData({
      shine:true
    });
   const innerAudioContext = wx.createInnerAudioContext({
     useWebAudioImplement: false 
   })
   innerAudioContext.src = 'cloud://cloud1-2g1ahtye45db4b81.636c-cloud1-2g1ahtye45db4b81-1317017498/test/' + that.data.Lid + that.data.Lname + '.wav'

  innerAudioContext.play() // 播放
  setTimeout( function(){
    that.setData({
      shine:false
   })
  },3000)
 },
 search() {
   const db = wx.cloud.database();
   const Language = db.collection('Language');
   let searchContent = this.data.searchContent;
   let that = this;
     Language.where({
       Lname: {
         $regex : '.*' + searchContent,
         $options : 'i'
       }
     }).get({
     success:function(res) {
      if (res.data.length == 0)
        {
          that.setData({
            isEmpty : true
          })
        }
      else {
        that.setData({
          Lid: res.data[0]._id,
          Lphonetic: res.data[0].Lphonetic,
          Lname: res.data[0].Lname
        })
      }
     },
     fail:function() {
      console.log('fail')
     }
   })
 }
})