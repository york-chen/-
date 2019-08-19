//app.js
const http = require('./utils/http.js');
App({
    onLaunch: function () {
        this.queryWeather()
    },
    queryWeather() {
        http.http({
            url: '',
            method: 'get',
            data: {
                v: 'v1',
                action: 'third.weather'
            }
        }).then(res => {
            this.globalData.weather = res.data;
            if (this.weatherCallBack1) {
                this.weatherCallBack1(res.data)
            }
            if (this.weatherCallBack2) {
                this.weatherCallBack2(res.data)
            }
        })
    },
    globalData: {
        userInfo: wx.getStorageSync('userInfo'),
        // token: wx.getStorageSync('token'),
        token: 'uSqLKUeAbyC47xyThY3VQJdyeaHWYZbs',
        openId: wx.getStorageSync('openId'),
        weather: {}
    }
});