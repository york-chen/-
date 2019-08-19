//index.js
//获取应用实例
const app = getApp();
Page({
    data: {
        link: ''
    },
    onLoad: function () {
        this.getLink();
    },
    getLink() {
        let link = JSON.parse(wx.getStorageSync('service-data')).link;
        this.setData({
            link: link
        })
    }
});
