//index.js
//获取应用实例
const app = getApp();
const http = require('../../utils/http.js');
Page({
    data: {
        service: [],
        list: [],
        page: {currentPage: 1, totalPage: 1, loadData: false}
    },
    onLoad: function () {
        this.queryPageData();
    },
    onPullDownRefresh() {
        if (this.data.page.loadData) {
            return
        }
        this.setData({
            page: {
                ...this.data.page,
                currentPage: 1
            }
        });
        this.queryPageData().then(() => {
            wx.stopPullDownRefresh()
        });
    },
    onReachBottom() {
        if (this.data.page.loadData) {
            return
        }
        let {currentPage, totalPage} = this.data.page;
        if (parseInt(currentPage) + 1 > totalPage) {
            wx.showToast({
                title: '没有更多了',
                icon: 'none'
            });
            return;
        }
        this.setData({
            page: {
                ...this.data.page,
                currentPage: parseInt(currentPage) + 1
            }
        });
        this.queryPageData();
    },
    queryPageData() {
        this.setData({
            page: {
                ...this.data.page,
                loadData: true
            }
        });
        return http.http({
            url: '',
            method: 'get',
            data: {
                page: this.data.page.currentPage,
                v: 'v1',
                action: 'service.circle-list'
            }
        }).then(res => {
            let data = res.data;
            if (this.data.page.currentPage == 1) {
                this.setData({
                    service: data.service,
                    list: data.list
                })
            } else {
                this.setData({
                    list: this.data.list.concat(data.list)
                })
            }
            this.setData({
                page: {
                    ...this.data.page,
                    loadData: false,
                    totalPage: data.page.pageTotal
                }
            })
        })
    },
    jumpToService(event) {
        let target = event.currentTarget, data = target.dataset.item, url;
        this.cacheServiceData(data);
        if (data.qr_code) {
            url = '/pages/qrcode/index';
        } else {
            url = '/pages/thirdservice/index';
        }
        wx.navigateTo({
            url: url
        })
    },
    cacheServiceData(data) {
        wx.setStorageSync('service-data', JSON.stringify(data));
    },
    viewDetail(event) {
        let id = event.currentTarget.dataset.id;
        wx.navigateTo({
            url: `/pages/circle/index?id=${id}`
        })
    }
});
