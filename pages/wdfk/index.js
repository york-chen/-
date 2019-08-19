//index.js
//获取应用实例
const app = getApp();
const http = require('../../utils/http.js');
Page({
    data: {
        list: []
    },
    onLoad: function () {
        this.queryList();
    },
    showDetail(event) {
        let target = event.currentTarget, id = target.dataset.id;
        wx.navigateTo({
            url: `/pages/fkxq/index?id=${id}`
        })
    },
    queryList() {
        http.http({
            url: '',
            method: 'get',
            data: {
                v: 'v1',
                action: 'info.list',
                token: `${app.globalData.token}`
            }
        }).then(res => {
            let data = res.data;
            this.setData({
                list: data
            })
        })
    }
});
