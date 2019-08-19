//index.js
//获取应用实例
const app = getApp();
Page({
    data: {
        id: ''
    },
    onLoad: function (options) {
        this.setData({
            id:options.id
        })
    }
});
