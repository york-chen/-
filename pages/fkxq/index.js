//index.js
//获取应用实例
const app = getApp();
const http = require('../../utils/http.js');
Page({
    data: {
        detail: {}
    },
    onLoad: function (options) {
        this.queryDetail(options.id)
    },
    queryDetail(id) {
        http.http({
            url: '',
            method: 'get',
            data: {
                v: 'v1',
                action: 'info.detail',
                id: id,
                token: `${app.globalData.token}`
            }
        }).then(res => {
            let data = res.data;
            this.setData({
                detail: data
            })
        })
    }
});
