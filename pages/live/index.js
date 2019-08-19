//index.js
//获取应用实例
const app = getApp();
Page({
    data: {
        link: ''
    },
    onLoad: function () {
        this.getLiveAddr();
    },
    getLiveAddr() {
        let link = wx.getStorageSync('live-link');
        this.setData({
            link: link
        })
    }
});
