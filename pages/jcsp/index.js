//index.js
//获取应用实例
const app = getApp();
const http = require('../../utils/http.js');
Page({
    data: {
        tabs: [
            {value: '1', text: '在线直播'},
            {value: '2', text: '精彩回放'}
        ],
        activeTab: '1',
        weather: {},
        liveData: [],
        livePage: {currentPage: 1, totalPage: 1, loadData: false, hideRefresh: true, hideLoadMore: true},
        recordData: [],
        recordPage: {currentPage: 1, totalPage: 1, loadData: false, hideRefresh: true, hideLoadMore: true},
    },
    //事件处理函数
    tabClick: function (event) {
        let type = event.currentTarget.id;
        this.setData({
            activeTab: type
        });
        if (type == 1) {
            this.queryLiveList()
        } else {
            this.queryRecordList()
        }
    },
    jumpToSearch() {
        wx.navigateTo({
            url: '/pages/search/index'
        })
    },
    onLoad: function () {
        this.queryLiveList();
        this.getScrollHeight();
        this.initWeather();
    },
    initWeather() {
        if (app.globalData.weather.condition) {
            this.setData({
                weather: app.globalData.weather
            })
        } else {
            app.weatherCallBack2 = data => {
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
    jumpToLivePage(event) {
        let target = event.currentTarget, link = target.dataset.link;
        this.cacheLiveAddr(link);
        wx.navigateTo({
            url: '/pages/live/index'
        })
    },
    jumpToDetail(event) {
        let target = event.currentTarget, data = target.dataset.item;
        this.cacheRecordData(data);
        wx.navigateTo({
            url: '/pages/hfxq/index'
        })
    },
    queryLiveList() {
        let page = this.data.livePage.currentPage;
        http.http({
            url: '',
            method: 'get',
            data: {
                type: 1,
                page: page,
                v: 'v1',
                action: 'live.list'
            }
        }).then(res => {
            if (page == 1) {
                this.setData({
                    liveData: res.data
                });
            } else {
                this.setData({
                    liveData: {
                        ...this.data.recordData,
                        list: this.data.liveData.list.concat(res.data.list)
                    }
                });
            }
            this.setData({
                livePage: {
                    ...this.data.livePage,
                    hideRefresh: true,
                    hideLoadMore: true,
                    loadData: false,
                    totalPage: res.data.page.pageTotal

                }
            })
        })
    },
    queryRecordList() {
        let page = this.data.recordPage.currentPage;
        http.http({
            url: '',
            method: 'get',
            data: {
                type: 2,
                page: page,
                v: 'v1',
                action: 'live.list'
            }
        }).then(res => {
            if (page == 1) {
                this.setData({
                    recordData: res.data
                });
            } else {
                this.setData({
                    recordData: {
                        ...this.data.recordData,
                        list: this.data.recordData.list.concat(res.data.list)
                    }
                });
            }
            this.setData({
                recordPage: {
                    ...this.data.recordPage,
                    hideRefresh: true,
                    hideLoadMore: true,
                    loadData: false,
                    totalPage: res.data.page.pageTotal

                }
            })
        })
    },
    cacheLiveAddr(link) {
        wx.setStorageSync('live-link', link);
    },
    cacheRecordData(data) {
        wx.setStorageSync('record-data', JSON.stringify(data));
    },
    refreshRecord() {
        if (this.data.recordPage.loadData) {
            return;
        }
        this.setData({
            recordPage: {
                ...this.data.recordPage,
                hideRefresh: false,
                currentPage: 1
            }
        });
        this.queryRecordList();
    },
    loadMoreRecord() {
        let {currentPage, totalPage} = this.data.recordPage;
        let page = parseInt(currentPage) + 1;
        if (page > totalPage) {
            wx.showToast({
                title: '没有更多了',
                icon: 'none'
            });
            return
        }
        if (this.data.recordPage.loadData) {
            return;
        }
        this.setData({
            recordPage: {
                ...this.data.recordPage,
                hideLoadMore: false,
                currentPage: page
            }
        });
        this.queryRecordList();
    },
    loadMoreLive() {
        let {currentPage, totalPage} = this.data.livePage;
        let page = parseInt(currentPage) + 1;
        if (page > totalPage) {
            wx.showToast({
                title: '没有更多了',
                icon: 'none'
            });
            return
        }
        if (this.data.livePage.loadData) {
            return;
        }
        this.setData({
            livePage: {
                ...this.data.livePage,
                hideLoadMore: false,
                currentPage: page
            }
        });
        this.queryLiveList();
    },
    refreshLive() {
        if (this.data.livePage.loadData) {
            return;
        }
        this.setData({
            livePage: {
                ...this.data.livePage,
                hideRefresh: false,
                currentPage: 1
            }
        });
        this.queryLiveList();
    }
});
