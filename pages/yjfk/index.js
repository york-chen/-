//index.js
//获取应用实例
const app = getApp();
const http = require('../../utils/http.js');
Page({
    data: {
        complaintsType: [],
        complaints: {},
        belongField: [],
        field: {},
        imglist: [],
        tempImgs: []
    },
    onLoad: function () {
        this.queryComplaintsType();
    },
    formSubmit(event) {
        let formData = event.detail.value;
        let postData = {
            ...formData,
            img: JSON.stringify(this.data.imglist),
            catalog_id: this.data.field.id

        };
        //校验数据
        if (!postData.content) {
            wx.showToast({
                title: '请输入投诉内容',
                icon: 'none'
            });
            return;
        }
        if (!postData.title) {
            wx.showToast({
                title: '请输入标题',
                icon: 'none'
            });
            return;
        }
        if (!postData.catalog_id) {
            wx.showToast({
                title: '请选择所属领域',
                icon: 'none'
            });
            return;
        }
        if (!postData.name) {
            wx.showToast({
                title: '请输入您的姓名',
                icon: 'none'
            });
            return;
        }
        if (!postData.contact) {
            wx.showToast({
                title: '请输入联系方式',
                icon: 'none'
            });
            return;
        }
        if (!postData.sex) {
            wx.showToast({
                title: '请选择性别',
                icon: 'none'
            });
            return;
        }
        if (!postData.expect) {
            wx.showToast({
                title: '请输入期望的结果',
                icon: 'none'
            });
            return;
        }
        http.http({
            url: `?v=v1&action=info.feedback&token=${app.globalData.token}`,
            method: 'post',
            data: postData
        }).then(res => {
            wx.navigateBack({
                delta: 1
            })
        })
    },
    openComplaintsType() {
        let arr = this.data.complaintsType.map(item => item.name), self = this;
        wx.showActionSheet({
            itemList: arr,
            success(res) {
                let index = res.tapIndex;
                self.setData({
                    complaints: self.data.complaintsType[index],
                    belongField: self.data.complaintsType[index].children,
                    field: {}
                })
            }
        })

    },
    openBelongField() {
        if (!this.data.complaints.name) {
            wx.showToast({
                title: '请选择投诉类型',
                icon: 'none'
            });
            return
        }
        let arr = this.data.belongField.map(item => item.name), self = this;
        wx.showActionSheet({
            itemList: arr,
            success(res) {
                self.setData({
                    field: self.data.belongField[res.tapIndex]
                })
            }
        })
    },
    openChooseImgs() {
        let self = this;
        wx.chooseImage({
            count: 1,
            sizeType: ['original', 'compressed'],
            sourceType: ['album', 'camera'],
            success(res) {
                // tempFilePath可以作为img标签的src属性显示图片
                const tempFilePaths = res.tempFilePaths[0];
                self.data.tempImgs.push(tempFilePaths);
                self.setData({
                    tempImgs: self.data.tempImgs
                });
                self.uploadImage(tempFilePaths)
            }
        })
    },
    navigationtoMy() {
        wx.navigateTo({
            url: '/pages/wdfk/index'
        })
    },
    queryComplaintsType() {
        http.http({
            url: '',
            method: 'get',
            data: {
                v: 'v1',
                action: 'info.catalog'
            }
        }).then(res => {
            let data = res.data;
            this.setData({
                complaintsType: data
            })
        })
    },
    uploadImage(img) {
        let self = this;
        wx.uploadFile({
            url: 'http://czjt.entian.net/app/api?v=v1&action=upload.default', //仅为示例，非真实的接口地址
            filePath: img,
            name: 'upfile',
            success(res) {
                let result = JSON.parse(res.data);
                self.data.imglist.push(result.data);
            }
        })
    }
});
