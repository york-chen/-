//index.js
//获取应用实例
const app = getApp();
const http = require('../../utils/http.js');
Page({
    data: {
        dialogTitle: '',
        dialogType: [0, 0]
    },
    onLoad: function () {

    },
    onReady: function () {
        this.cyDialog = this.selectComponent('#cyDialog')
    },
    openDialog() {
        this.setData({
            dialogTitle: '隐私政策',
            dialogType: [1, 0]
        });
        this.cyDialog.openDialog();
    },
    confirmClick() {
        this.cyDialog.closeDialog();
    },
    getAuthenrize() {
        this.getUserInfo();
        this.loginWx();
        this.cyDialog.closeDialog();
        wx.showLoading({
            title: '正在加载',
            mask: true
        })
    },
    getUserInfo() {
        // 获取用户信息
        wx.getSetting({
            success: res => {
                if (res.authSetting['scope.userInfo']) {
                    // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
                    wx.getUserInfo({
                        success: res => {
                            // 可以将 res 发送给后台解码出 unionId
                            app.globalData.userInfo = res.userInfo;
                            wx.setStorageSync('userInfo', JSON.stringify(res.userInfo));
                            if (app.globalData.openId) {
                                this.loginChengZhong();
                            }
                        }
                    });
                } else {
                }
            }
        });
    },
    handleTousu() {
        //是否已经有了用户的信息
        if (app.globalData.token) {
            wx.navigateTo({
                url: "/pages/yjfk/index"
            })
        } else {//如果没有就授权
            this.setData({
                dialogTitle: '获取授权',
                dialogType: [0, 1]
            });
            this.cyDialog.openDialog();
        }
    },
    loginWx() {
        let self = this;
        // 登录
        wx.login({
            success: res => {
                let appId = 'wxa217a6fbaad9adc5',
                    code = res.code,
                    secret = 'd158cb566daf43004a6a533ac5439d14';
                wx.request({
                    url: 'https://api.weixin.qq.com/sns/jscode2session?appid=' + appId + '&secret=' + secret + '&js_code=' + code + '&grant_type=authorization_code',
                    data: {},
                    header: {
                        'content-type': 'json'
                    },
                    success: function (res) {
                        let openid = res.data.openid; //返回openid
                        app.globalData.openId = openid;
                        wx.setStorageSync('openId', openid);
                        if (app.globalData.userInfo) {
                            self.loginChengZhong();
                        }
                    }
                })
            }
        });
    },
    loginChengZhong() {
        let {openId, userInfo} = app.globalData;
        http.http({
            url: '?v=v1&action=login.do',
            method: 'post',
            data: {
                type: 2,
                openid: openId,
                nickName: userInfo.nickName
            }
        }).then(res => {
            app.globalData.token = res.data;
            wx.setStorageSync('token', res.data);
            wx.navigateTo({
                url: "/pages/yjfk/index"
            })
        })
    },
    onShareAppMessage: function (res) {
        return {
            title: '成中-忠诚到永远',
            path: '/pages/index/index',
            imageUrl: '../../assets/images/share.jpg',  //用户分享出去的自定义图片大小为5:4,
            success: function (res) {
                // 转发成功
                wx.showToast({
                    title: "分享成功",
                    icon: 'success',
                    duration: 2000
                })
            },
            fail: function (res) {
                // 分享失败
            },
        }
    }
});
