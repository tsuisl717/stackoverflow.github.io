;(function () {
	//https://api.stackexchange.com/  2.3/tags?pagesize=10&order=desc&sort=popular&site=stackoverflow

	/*axios.get('https://api.stackexchange.com/2.3/tags?pagesize=10&order=desc&sort=popular&site=stackoverflow').then(function(response){
		console.log(response);
	});*/

	var trends_app = new Vue({
		el: '#trends-layer',
		data: {
			items: null,
			trend: null
		},
		methods: {
			updateQuestionList: function (item) {
				const listElm = document.querySelector('#question-list-layer');
				listElm.scrollTop = 0;
				this.trend = item.name;
				question_list_app.updateList(item.name);
		    },
			updateTrend:function(){
				
			}
		},
		mounted () {
			axios.get('https://api.stackexchange.com/2.3/tags?pagesize=10&order=desc&sort=popular&site=stackoverflow')
			.then(function(response){				
				trends_app.items = response.data.items;
				trends_app.trend = response.data.items[0].name;
				question_list_app.updateList(response.data.items[0].name, 1);
			});
		}
	});


	var question_list_app = new Vue({
		el: '#question-list-layer',
		data: {
			trend: null,
			items: null,
			page: 1,
			loading: false
		},
		methods: {
			updateList:function(trend, page){
				this.trend = trend;
				axios.get('https://api.stackexchange.com/2.3/questions?page='+this.page+'&pagesize=20&order=desc&sort=activity&tagged='+this.trend+'&site=stackoverflow')
			  	.then(function(response){
					console.log(response.data);
					question_list_app.items = response.data.items
				});
			},
			loadMore:function(){
				this.loading = true;
				var _this = this;
				axios.get('https://api.stackexchange.com/2.3/questions?page='+this.page+'&pagesize=20&order=desc&sort=activity&tagged='+this.trend+'&site=stackoverflow')
			  	.then(function(response){
			  		question_list_app.items = question_list_app.items.concat(response.data.items); 
			  		_this.loading = false;
				});
			}
		},
		mounted () {
			const listElm = document.querySelector('#question-list-layer');
			listElm.addEventListener('scroll', e => {
			  if(listElm.scrollTop + listElm.clientHeight >= listElm.scrollHeight) {
			  	this.page++;
			    this.loadMore();
			  }
			});
		}
	});

	var seaching_app = new Vue({
		el: '#search-layer',
		data:{
			search: '',
		},
		methods:{
			updateList:function(){
				console.log(this.search);
				const listElm = document.querySelector('#question-list-layer');
				listElm.scrollTop = 0;
				question_list_app.updateList(this.search);
				trends_app.trend = this.search;
			}
		}
	});
	
})();