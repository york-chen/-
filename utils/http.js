const hostname = 'https://czjt.entian.net/app/api';
let number = 0;

function http(option) {
    return new Promise((resolve, reject) => {
        wx.showLoading({
            title: '正在加载',
            mask: true
        });
        number++;
        wx.request({
            url: hostname + option.url, //仅为示例，并非真实的接口地址
            data: option.data || {},
            method: option.method,
            header: {
                'content-type': 'application/json' // 默认值
            },
            success(res) {
                resolve(res.data);
            },
            fail(err) {
                wx.showToast({
                    title: err.errMsg || '抱歉出错了',
                    icon: 'none'
                });
                reject(err);
            },
            complete() {
                number--;
                if (number < 1) {
                    wx.hideLoading();
                }
            }
        })
    })
}

module.exports = {
    http
};

