//index.js
//获取应用实例
const app = getApp();

Page({
    data: {
        recruitInfo: {}
    },
    onLoad: function () {
        this.getRecruitCache();
    },
    getRecruitCache() {
        let data = wx.getStorageSync('recruit-item');
        this.setData({
            recruitInfo: JSON.parse(data)
        })
    }
});
