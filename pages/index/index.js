//index.js
//获取应用实例
const app = getApp();
const http = require('../../utils/http.js');
Page({
    data: {
        keyword: '',
        tabs: [],
        activeTab: '',
        imgUrls: [],
        weather: {},
        refreshHidden: true,
        loadMoreHidden: true,
        loadingData: false,
        scrollHeight: ''
    },
    scrollToLower(event) {
        let arr = this.data.tabs.filter(item => item.value == this.data.activeTab);
        let {current, pageTotal} = arr[0].page;
        if ((parseInt(current) + 1) > pageTotal) {
            wx.showToast({
                title: '没有更多了',
                icon: 'none'
            });
            return;
        }
        let hidden = this.data.loadMoreHidden,
            loadingData = this.data.loadingData;
        if (hidden) {
            this.setData({
                loadMoreHidden: false
            });
        }
        if (loadingData) {
            return;
        }
        this.setData({
            loadingData: true
        });
        // 加载数据,模拟耗时操作
        setTimeout(() => {
            this.queryCategoryContent(this.data.activeTab, parseInt(current) + 1).then(() => {
                this.setData({
                    loadingData: false,
                    loadMoreHidden: true
                })
            });
        }, 500);
    },
    scrollToUpper() {
        let hidden = this.data.refreshHidden,
            loadingData = this.data.loadingData;
        if (hidden) {
            this.setData({
                refreshHidden: false
            });
        }
        if (loadingData) {
            return;
        }
        this.setData({
            loadingData: true
        });
        // 加载数据,模拟耗时操作
        setTimeout(() => {
            this.queryCategoryContent(this.data.activeTab, 1).then(() => {
                this.setData({
                    loadingData: false,
                    refreshHidden: true
                })
            });
        }, 500);
    },
    //事件处理函数
    searchAction: function (event) {
        console.log(event.detail.value)
    },
    tabClick(e) {
        let cate = e.currentTarget.id;
        this.setData({
            activeTab: cate
        });

        this.queryCategoryContent(cate, 1)
    },
    onLoad: function () {
        this.queryCategory();
        this.getScrollHeight();
        this.initWeather()
    },
    jumpToSearch() {
        wx.navigateTo({
            url: '/pages/search/index'
        })
    },
    initWeather() {
        if (app.globalData.weather.condition) {
            this.setData({
                weather: app.globalData.weather
            })
        } else {
            app.weatherCallBack1 = data => {
                this.setData({
                    weather: data
                })
            }
        }
    },
    getScrollHeight() {
        let that = this;
        let query = wx.createSelectorQuery().in(this);
        query.select('.page__hd').boundingClientRect((res) => {
            //得到标题的高度
            let titleHeight = res.height;
            console.log(titleHeight);
            //scroll-view的高度 = 屏幕高度- tab高(50) - 10 - 10 - titleHeight
            //获取屏幕可用高度
            let screenHeight = wx.getSystemInfoSync().windowHeight;
            //计算 scroll-view 的高度
            let scrollHeight = screenHeight - titleHeight;
            console.log(screenHeight);
            that.setData({
                scrollHeight: scrollHeight
            })
        }).exec()
    },
    queryCategory() {
        http.http({
            url: '',
            method: 'get',
            data: {
                v: 'v1',
                action: 'news.cate'
            }
        }).then(res => {
            let result = res.data.map(item => {
                item.list = [];
                return item;
            });
            this.setData({
                tabs: res.data,
                activeTab: res.data[0].value
            });
            return res.data;
        }).then((res) => {
            this.queryCategoryContent(res[0].value, 1)
        })
    },
    queryCategoryContent(cate, page) {
        return http.http({
            url: '',
            method: 'get',
            data: {
                cate: cate,
                page: page,
                v: 'v1',
                action: 'news.list'
            }
        }).then(res => {
            let tabs = this.data.tabs;
            let category = tabs.filter(item => item.value == cate);
            if (page == 1) {
                category[0].list = res.data.list;
                category[0].banner = res.data.banner;
            } else {
                category[0].list = category[0].list.concat(res.data.list);
            }
            category[0].page = {
                current: page,
                pageTotal: res.data.page.pageTotal
            };
            this.setData({
                tabs: tabs
            })
        })
    },
    viewDetail(event) {
        let id = event.currentTarget.dataset.id;
        wx.navigateTo({
            url: `/pages/newsDetail/index?id=${id}`
        })
    }
});
