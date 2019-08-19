//index.js
//获取应用实例
const app = getApp();
const http = require('../../utils/http.js');
Page({
    data: {
        tabs: [{
            value: 1, name: '新闻'
        },
            {
                value: 2, name: '视频'
            },
        ],
        activeTab: 1,
        scrollHeight: '',
        newsList: [],
        newsPage: {currentPage: 1, totalPage: 1, loadData: false, hideRefresh: true, hideLoadMore: true},
        recordData: [],
        recordPage: {currentPage: 1, totalPage: 1, loadData: false, hideRefresh: true, hideLoadMore: true},
        keyword: ''
    },
    tabClick(e) {
        let cate = e.currentTarget.id;
        this.setData({
            activeTab: cate
        });
    },
    bindinput(event) {
        this.setData({
            keyword: event.detail.value
        })
    },
    jumpToDetail(event) {
        let target = event.currentTarget, data = target.dataset.item;
        this.cacheRecordData(data);
        wx.navigateTo({
            url: '/pages/hfxq/index'
        })
    },
    cacheRecordData(data) {
        wx.setStorageSync('record-data', JSON.stringify(data));
    },
    viewDetail(event) {
        let id = event.currentTarget.dataset.id;
        wx.navigateTo({
            url: `/pages/newsDetail/index?id=${id}`
        })
    },
    onLoad: function () {
        this.getScrollHeight();
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
    searchAction() {
        let keyword = this.data.keyword;
        if (!keyword) {
            wx.showToast({
                title: '请输入搜索内容',
                icon: 'none'
            });
            return
        }
        this.refreshNews();
        this.refreshRecord();
    },
    queryNewsList() {
        let keywords = this.data.keyword;
        let newsPage = this.data.newsPage;
        http.http({
            url: '',
            method: 'get',
            data: {
                cate: -1,
                page: newsPage.currentPage,
                v: 'v1',
                keywords,
                action: 'news.list'
            }
        }).then(res => {
            if (newsPage.currentPage == 1) {
                this.setData({
                    newsData: res.data.list
                })
            } else {
                this.setData({
                    newsData: this.data.newsData.concat(res.data.list)
                })
            }
            this.setData({
                newsPage: {
                    currentPage: res.data.page.currentPage,
                    totalPage: res.data.page.pageTotal,
                    loadData: false,
                    hideRefresh: true,
                    hideLoadMore: true
                }
            })
        })
    },
    refreshNews() {
        if (this.data.newsPage.loadData) {
            return;
        }
        this.setData({
            newsPage: {
                ...this.data.newsPage,
                hideRefresh: false,
                currentPage: 1
            }
        });
        this.queryNewsList();
    },
    loadMoreNews() {
        let {currentPage, totalPage} = this.data.newsPage;
        let page = parseInt(currentPage) + 1;
        if (page > totalPage) {
            wx.showToast({
                title: '没有更多了',
                icon: 'none'
            });
            return
        }
        if (this.data.newsPage.loadData) {
            return;
        }
        this.setData({
            newsPage: {
                ...this.data.newsPage,
                hideLoadMore: false,
                currentPage: page
            }
        });
        this.queryNewsList();
    },
    queryRecordList() {
        let keywords = this.data.keyword;
        let page = this.data.recordPage.currentPage;
        http.http({
            url: '',
            method: 'get',
            data: {
                type: 2,
                page: page,
                v: 'v1',
                keywords: keywords,
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
    }
});
