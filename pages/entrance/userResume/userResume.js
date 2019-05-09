//logs.js
import {
	Api
} from '../../../utils/api.js';
var api = new Api();
const app = getApp();
import {
	Token
} from '../../../utils/token.js';
const token = new Token();
Page({
	data: {
		positionData: [],
		submitData: {
			title: '',
			phone: '',
			passage_array: '',
			gender: '',
			mainImg: [],
			content: '',
			relation_id: '',
			/* class:'' */
			education:'',
			origin:'',
			college:'',
		},
		urlSet:[],
		educationData:['硕士','本科','大专','高中'],
		isFirstLoadAllStandard: ['getPositonData'],
	},



	onLoad() {
		const self = this;

		api.commonInit(self);
		/* self.getMainData(); */
		self.getPositonData();

		self.setData({
			web_submitData: self.data.submitData,
			web_buttonCanClick: self.data.buttonCanClick,
			/* web_index: 0,
			web_index1:0 */
		})

	},


	/* getMainData() {
		const self = this;
		var date = new Date();
		var seperator1 = "-";
		var year = date.getFullYear();
		var month = date.getMonth() + 1;
		var strDate = date.getDate();
		if (month >= 1 && month <= 9) {
			month = "0" + month;
		}
		if (strDate >= 0 && strDate <= 9) {
			strDate = "0" + strDate;
		}
		var currentdate = year + seperator1 + month + seperator1 + strDate;
		api.checkLoadAll(self.data.isFirstLoadAllStandard, 'getMainData', self);
		self.data.submitData.passage_array = currentdate.split('-');
		consolelog()
		self.setData({
			web_submitData: self.data.submitData
		})
	},
 */


	changeBind(e) {
		const self = this;
		if (api.getDataSet(e, 'value')) {
			self.data.submitData[api.getDataSet(e, 'key')] = api.getDataSet(e, 'value');
		} else {
			api.fillChange(e, self, 'submitData');
		};
		self.setData({
			web_submitData: self.data.submitData,
		});
		console.log(self.data.submitData)
	},

	PositionChange(e) {
		const self = this;
		console.log('picker发送选择改变，携带值为', e.detail.value)
		console.log(self.data.positionData[e.detail.value].id)
		self.data.submitData.relation_id = self.data.positionData[e.detail.value].id;

		self.setData({
			web_index: e.detail.value,
			web_submitData: self.data.submitData
		})
	},

	educationChange(e) {
		const self = this;
		console.log('picker发送选择改变，携带值为', e.detail.value)
		console.log(self.data.educationData[e.detail.value])
		self.data.submitData.education = self.data.educationData[e.detail.value];

		self.setData({
			web_index1: e.detail.value,
			web_submitData: self.data.submitData
		})
	},

	bindDateChange: function(e) {
		const self = this;
		console.log('picker发送选择改变，携带值为', e.detail.value);
		self.data.submitData.passage_array = e.detail.value.split("-");
		console.log(self.data.submitData.passage_array)
		self.setData({
			web_submitData: self.data.submitData
		})
		new Date(self.data.submitData.passage_array.join("-")).getTime();
	},


	formIdAdd(e) {
		api.WxFormIdAdd(e.detail.formId, (new Date()).getTime() / 1000 + 7 * 86400);
	},

	getPositonData() {
		const self = this;
		const postData = {};
		postData.searchItem = {
			thirdapp_id: getApp().globalData.solely_thirdapp_id
		};
		postData.getBefore = {
			partner: {
				tableName: 'Label',
				searchItem: {
					title: ['=', ['热招职位']],
				},
				middleKey: 'menu_id',
				key: 'id',
				condition: 'in',
			},
		}
		const callback = (res) => {
			if (res.info.data.length > 0) {
				self.data.positionData.push.apply(self.data.positionData, res.info.data),
					self.data.submitData.relation_id = self.data.positionData[0].id
			};
			console.log(self.data.positionData)
			api.checkLoadAll(self.data.isFirstLoadAllStandard, 'getPositonData', self);
			self.setData({

				web_positionData: self.data.positionData,
			});
		};
		api.articleGet(postData, callback);
	},


	submit() {
		const self = this;
		api.buttonCanClick(self);
		var phone = self.data.submitData.phone;
		const pass = api.checkComplete(self.data.submitData);
		console.log('pass', pass);
		console.log('self.data.submitData',self.data.submitData)
		if (pass) {
			if (phone.trim().length != 11 || !/^1[3|4|5|6|7|8|9]\d{9}$/.test(phone)) {
				api.buttonCanClick(self, true)
				api.showToast('手机格式不正确', 'none')

			} else {
				
				const callback = (user, res) => {
					self.resumeAdd();
				};
				api.getAuthSetting(callback);
			}
		} else {
			api.buttonCanClick(self, true)
			api.showToast('请补全信息', 'none')
		};
	},

	upLoadImg() {
		const self = this;
		if (self.data.submitData.mainImg.length > 2) {
			api.showToast('仅限3张', 'fail');
			return;
		};
		wx.showLoading({
			mask: true,
			title: '图片上传中',
		});
		const callback = (res) => {
			console.log('res', res)
			if (res.solely_code == 100000) {

				self.data.submitData.mainImg.push({
					url: res.info.url
				})
				self.setData({
					web_submitData: self.data.submitData
				});
				wx.hideLoading()
			} else {
				api.showToast('网络故障', 'none')
			}
		};

		wx.chooseImage({
			count: 1,
			success: function(res) {
				console.log(res);
				var tempFilePaths = res.tempFilePaths;
				console.log(callback)
				api.uploadFile(tempFilePaths[0], 'file', {
					tokenFuncName: 'getEntranceToken'
				}, callback)
			},
			fail: function(err) {
				wx.hideLoading();
			}
		})
	},

	previewImg(e){
		const self = this;
		var index = e.currentTarget.dataset.index;
		if(self.data.submitData.mainImg.length>0){
		  for(var i=0;i<self.data.submitData.mainImg.length;i++){
			  self.data.urlSet.push(self.data.submitData.mainImg[i].url);
		  }
		}
		console.log('self.data.submitData.mainImg',self.data.submitData.mainImg)
		wx.previewImage({
		  current: self.data.submitData.mainImg[index].url,
		  urls: self.data.urlSet,
		  success: function(res) {},
		  fail: function(res) {},
		  complete: function(res) {},
		})
	},

	formIdAdd(e) {
		api.WxFormIdAdd(e.detail.formId, (new Date()).getTime() / 1000 + 7 * 86400);
	},

	 delete(e) {
		const self = this;
		var index = api.getDataSet(e, 'index');
		console.log('deleteImg', index)
		self.data.submitData.mainImg.splice(index, 1);
		self.setData({
			web_submitData: self.data.submitData
		})
	},
	
	resumeAdd() {
		const self = this;
		const postData = {};
		postData.tokenFuncName = 'getEntranceToken';
		if(!wx.getStorageSync('info')||!wx.getStorageSync('info').headImgUrl){
		  postData.refreshToken = true;
		};
		postData.data = {};
		postData.data = api.cloneForm(self.data.submitData);
		postData.data.behavior = 1;
		
		const callback = (data) => {
			
			if (data.solely_code == 100000) {
				
				api.showToast('投递成功', 'none', 1000, function() {
					setTimeout(function() {
						wx.navigateBack({
							delta: 1
						})
					}, 1000);
				})
			} else {
				api.showToast(data.msg, 'none', 1000)
			}

		};
		api.resumeAdd(postData, callback);
	},


})
