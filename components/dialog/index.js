Component({
    options: {
        styleIsolation: 'apply-shared',
        multipleSlots: true
    },
    properties: {
        // 这里定义了innerText属性，属性值可以在组件使用时指定
        title: {
            type: String,
            value: '标题'
        }
    },
    data: {
        showDialog: false
    },
    methods: {
        openDialog: function () {
            wx.hideTabBar({
                fail: function () {
                    setTimeout(function () {
                        wx.hideTabBar({});
                    }, 500)
                }
            });
            this.setData({
                showDialog: true
            })
        },
        stopEvent() {
        },
        closeDialog: function () {
            wx.showTabBar({
                fail: function () {
                    wx.showTabBar({})
                }
            });
            this.setData({
                showDialog: false
            })
        }
    }
});
