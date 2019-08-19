//index.js
//获取应用实例
const app = getApp();
const http = require('../../utils/http.js');
Page({
    data: {
        record: {},
        recommend: []
    },
    onLoad: function () {
        this.getRecordData();
    },
    getRecordData() {
        let data = JSON.parse(wx.getStorageSync('record-data'));
        this.setData({
            record: data
        });
        console.log(data);
        this.queryRecommend(data.id)
    },
    queryRecommend(id) {
        http.http({
            url: '',
            method: 'get',
            data: {
                id: id,
                type: 2,
                v: 'v1',
                action: 'live.recommend'
            }
        }).then(res => {
            this.setData({
                recommend: res.data
            })
        })
    },
    viewRecord(event) {
        let target = event.currentTarget, data = target.dataset.item;
        this.cacheRecordData(data);
        wx.redirectTo({
            url: '/pages/hfxq/index'
        })
    },
    cacheRecordData(data) {
        wx.setStorageSync('record-data', JSON.stringify(data));
    }
});
