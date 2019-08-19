//index.js
//获取应用实例
const app = getApp();
const http = require('../../utils/http.js');
Page({
    data: {
        tabs: [
            {value: 1, text: '成中概况'},
            {value: 2, text: '在线画册'},
            {value: 3, text: '招聘信息'},
            {value: 4, text: '地图导航'},
            {value: 5, text: '在线联系'}
        ],
        activeTab: 1,
        albumList: [],
        albumPage: {current: 1, totalPage: 1, hideLoadMore: true, hideRefresh: true, loadData: false},
        recruitList: [],
        contactList: [],
        scrollHeight: ''
    },
    getScrollHeight() {
        let that = this;
        let query = wx.createSelectorQuery().in(this);
        query.select('.page__hd').boundingClientRect((res) => {
            //得到标题的高度
            let titleHeight = res.height;
            //scroll-view的高度 = 屏幕高度- tab高(50) - 10 - 10 - titleHeight
            //获取屏幕可用高度
            let screenHeight = wx.getSystemInfoSync().windowHeight;
            //计算 scroll-view 的高度
            let scrollHeight = screenHeight - titleHeight - 20;
            console.log(titleHeight);
            console.log(screenHeight);
            that.setData({
                scrollHeight: scrollHeight
            })
        }).exec()
    },
    tabClick(event) {
        let tab = event.currentTarget.id;
        if (tab != 4) {
            this.setData({
                activeTab: tab
            });
        }
        switch (tab) {
            case '2':
                this.queryZxhcList(1);
                break;
            case '3':
                this.queryRecruit();
                break;
            case '4':
                wx.navigateTo({
                    url: `/pages/mapNavigation/index`
                });
                break;
            case '5':
                this.queryContactList();
                break;
        }
    },
    onLoad: function () {
        this.getScrollHeight();
    },
    priviewImg(event) {
        let target = event.currentTarget, dataset = target.dataset, imglist = dataset.imglist;
        wx.previewImage({
            current: dataset.current, // 当前显示图片的http链接
            urls: imglist.map(item => item.link_url) // 需要预览的图片http链接列表
        })
    },
    jumpToZpxq(event) {
        let target = event.currentTarget, data = target.dataset.item;
        this.cacheRecruitInfo(data);
        wx.navigateTo({
            url: '/pages/zpxq/index'
        })
    },
    makePhoneCall(event) {
        let target = event.currentTarget, phone = target.dataset.phone;
        wx.makePhoneCall({
            phoneNumber: phone //仅为示例，并非真实的电话号码
        })
    },
    queryZxhcList(page) {
        this.setData({
            albumPage: {
                ...this.data.albumPage,
                loadData: true,
            }
        });
        http.http({
            url: '',
            method: 'get',
            data: {
                page: 1,
                v: 'v1',
                action: 'info.album'
            }
        }).then(res => {
            this.setData({
                albumList: res.data.list,
                albumPage: {
                    current: page,
                    totalPage: res.data.page.pageTotal,
                    hideLoadMore: true,
                    hideRefresh: true,
                    loadData: false
                }
            })
        })
    },
    queryRecruit() {
        http.http({
            url: '',
            method: 'get',
            data: {
                v: 'v1',
                action: 'info.recruit'
            }
        }).then(res => {
            this.setData({
                recruitList: res.data
            });
        })
    },
    cacheRecruitInfo(data) {
        wx.setStorageSync('recruit-item', JSON.stringify(data));
    },
    queryContactList() {
        http.http({
            url: '',
            method: 'get',
            data: {
                v: 'v1',
                action: 'info.contact'
            }
        }).then(res => {
            this.setData({
                contactList: res.data
            });
        })
    },
    loadMoreAlbum() {
        let {current, totalPage} = this.data.albumPage;
        if (parseInt(current) + 1 > totalPage) {
            wx.showToast({
                title: '没有更多了',
                icon: 'none'
            });
            return
        }
        if (this.data.albumPage.loadData) {
            return;
        }
        this.setData({
            albumPage: {
                ...this.data.albumPage,
                hideRefresh: false
            }
        });
        this.queryZxhcList(parseInt(current) + 1);
    },
    refreshAlbum() {
        if (this.data.albumPage.loadData) {
            return;
        }
        this.setData({
            albumPage: {
                ...this.data.albumPage,
                hideLoadMore: false
            }
        });
        this.queryZxhcList(1);
    }
});
