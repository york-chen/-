//index.js
//获取应用实例
const app = getApp();
Page({
    data: {
        service: {}
    },
    onLoad: function () {
        this.getLink();
    },
    getLink() {
        let data = JSON.parse(wx.getStorageSync('service-data'));
        this.setData({
            service: data
        })
    }
});
