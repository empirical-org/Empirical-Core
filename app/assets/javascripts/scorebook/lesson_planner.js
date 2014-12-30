$(document).ready(function(){
	
	lesson_planner_object.initialize();
});

window.lesson_planner_object = {
	results_per_page: 2,
	current_page_number: 1, // since rails will have loaded 1st page on page-load
	number_of_pages: 1,
	search_results: [],
	search_results_loaded_from_ajax: false, // this will be relevant on page-turn (if ajax has loaded before, will just iterate through list)
	teaching_cart: [],
	filters: {
		activity_classification: null,
		topic: null,
		section: null
	},
	sort: {
		field: null,
		asc_or_desc: null
	},

	initialize: function () {
		that = this
		$('#search_activities_button').click(function(){
			that.search_request(1);
		});
		that.initialize_events();
	},

	initialize_events: function () {
		that = this
		$('.filter_option').click(that.filter_option_click_cb)
		$('.sorter').click(that.sorter_click_cb)
		$('.pagination .right_arrow').click(that.right_arrow_click_cb)
		$('.pagination .left_arrow').click(that.left_arrow_click_cb)
		$('.pagination .page_number').click(that.page_number_click_cb)
		$('.pagination .page_number span').click(that.page_number_click_cb)
		$('#unit_name').blur(function (e) {
			$('.teaching-cart .unit_name').text($('#unit_name').val())
		});
		$('input[type=checkbox]').click(that.checkbox_click_cb)
		$('button#continue').click(function (e) {
			// arr = []
			// for (i=0; i< that.teaching_cart.length; i++){
			// 	x = teaching_cart[i]
			// 	activity_id = x.activity_id
			// 	arr.push(activity_id)
			// }
			// unit_name = $('#unit_name').val()
			// $.ajax({
			// 	url: 
			// 	data: 
			// 	success: function () {

			// 	},
			// 	error: function () {

			// 	}
			// });


		});
	},
	checkbox_click_cb: function (e) {
		console.log('chceckbox checkced')
		x = $(e.target).attr('id')
		y = $('input[type=checkbox]#' + x + ':checked')
		activity_id = parseInt($(e.target).attr('data-model-id'))
		if (y.length > 0) {
			console.log('its checked')
			activity_name = $(e.target).parent().siblings('.activity_name').text().trim()
			activity_classification_image_path = $(e.target).parent().siblings().children('img').attr('src')
			that.add_to_teaching_cart(activity_id, activity_name, activity_classification_image_path)
			console.log('teaching cart after adding : ')
			console.log(that.teaching_cart)
		} else {
			console.log('its not checked')
			that.remove_from_teaching_cart(activity_id)
			console.log('teaching cart after removeing: ' )
			console.log(that.teaching_cart)
		}
	},
	add_to_teaching_cart: function (activity_id, activity_name, activity_classification_image_path) {
		obj = {activity_id: activity_id, activity_name: activity_name, activity_classification_image_path: activity_classification_image_path}
		that.teaching_cart.push(obj)
		tr = $(document.createElement('tr'))
		td1 = $(document.createElement('td'))
		td2 = $(document.createElement('td'))
		td3 = $(document.createElement('td'))
		img1 = $(document.createElement('img'))
		img2 = $(document.createElement('img'))

		img1.attr('src', activity_classification_image_path)
		img2.attr('src', '/assets/scorebook/icon-x-gray.png')
		td1.append(img1)
		td3.append(img2)
		td2.text(activity_name)
		tr.append(td1,td2,td3)
		tr.attr('data-model-id', activity_id)
		$('.teaching-cart tbody').append(tr)
		td3.click(function (e) {
			that.remove_from_teaching_cart(parseInt(activity_id))
			$('input[type=checkbox]' + '#activity_' + activity_id).prop('checked', false)
		});
		if (that.teaching_cart.length > 0){
			$('.teaching-cart #continue').show();
		}

	},

	remove_from_teaching_cart: function (id) {
		console.log('remove from teaching cart')
		console.log('input id is : ' + id)
		for (i=0; i< that.teaching_cart.length; i++) {
			x = that.teaching_cart[i]
			if (parseInt(x.activity_id) == id) {
				console.log('made it past if')
				that.teaching_cart.splice(i,1)
			}
		}
		$('.teaching-cart tr[data-model-id=' + id + ']').remove()
		if (that.teaching_cart.length == 0) {
			$('.teaching-cart #continue').hide();
		}


	},

	page_number_click_cb: function (e) {
		console.log('click page number')
		x = $(e.target).attr('data-page-number')
		$('.pagination .active').removeClass('active').addClass('page_number')
		$(e.target).parent('li').addClass('active')
		
		if (that.search_results_loaded_from_ajax) {
			console.log('turn to a page in already loaded results')
			that.display_activity_search_results(parseInt(x))
		} else {
			console.log('need to load more results')
			that.search_request(parseInt(x))
		}
	},


	right_arrow_click_cb: function (e) {
		console.log('right arrow click')
		if (that.search_results_loaded_from_ajax) {
			console.log('turn through loaded results')
			if (that.number_of_pages > that.current_page_number) {
				console.log('there are still pages left')
				next_page = that.current_page_number + 1
				that.display_activity_search_results(next_page)				
				x = $('.pagination .active').next('.page_number')
				$('.pagination .active').removeClass('active').addClass('page_number')
				x.addClass('active')
			} else {
				console.log('no more pages left')
			}
			
		} else {
			console.log('request next page through ajax')
			// dont need to check number of pages -> if on page load there was 1 one page of results, no 'right arrow' would appear
			that.search_request(2);
		}

	},
	left_arrow_click_cb: function (e) {
		console.log('left arrow click')
		if (that.current_page_number > 1) {
			next_page = that.current_page_number - 1
			that.display_activity_search_results(next_page)
			x = $('.pagination .active').prev('.page_number')
			$('.pagination .active').removeClass('active').addClass('page_number')
			x.addClass('active')
		} else {
			console.log('cant go back anymore, at page 1')
		}

	},
	filter_option_click_cb: function (e) {
		ele = $(e.target)
		filter_type  = ele.attr('data-filter-type')
		model_id = ele.attr('data-model-id')
		x = $("button[data-filter-type=" + filter_type + "]")
		y = ele.text()
		x.text(y)
		z = $(document.createElement('i')).addClass('fa fa-caret-down')
		x.append(z)
		that.filters[filter_type] = model_id
		if (model_id == '') {
			if (filter_type == 'activity_classification') {
				that.filters['section'] = ''
				that.filters['topic'] = ''
				z1 = $(document.createElement('i')).addClass('fa fa-caret-down')
				z2 = $(document.createElement('i')).addClass('fa fa-caret-down')
				$("button[data-filter-type='section']").text("All Levels").append(z1)
				$("button[data-filter-type='topic']").text("All Concepts").append(z2)
			} else if (filter_type == 'section') {
				that.filters['topic'] = ''
				z2 = $(document.createElement('i')).addClass('fa fa-caret-down')
				$("button[data-filter-type='topic']").text("All Concepts").append(z2)
			}
		}
		that.current_page_number = 1
		that.search_request(1);
	},
	sorter_click_cb: function (e) {
		console.log('sorter clicked')
		that.sort.field = $(e.target).attr('id')
		$('.sorter').removeClass('active')
		$(e.target).addClass('active')
		that.change_asc_or_desc(e);
		that.current_page_number = 1
		that.search_request(1);
	},

	change_asc_or_desc: function(e) {
		x = $(e.target).find('.fa-caret-up');
		if (x.length == 0) {
			this.sort.asc_or_desc = 'asc'
			$(e.target).find('.fa-caret-down').addClass('fa-caret-up').removeClass('fa-caret-down')
		} else {
			this.sort.asc_or_desc = 'desc'
			$(e.target).find('.fa-caret-up').addClass('fa-caret-down').removeClass('fa-caret-up')
		}
	},

	search_request: function (page) {
		that = this
		query = $('#search_activities_input').val();
		$.ajax({
			url: '/teachers/classrooms/search_activities',
			data: {
				search_query: query,
				filters: that.filters,
				sort: that.sort
			},
			success: function (data, status, jqXHR) {
				console.log('success')
				console.log(data)
				that.search_results_loaded_from_ajax = true;
				that.number_of_pages = data.number_of_pages
				that.update_filter_options(data)
				that.search_results = data.activities
				that.display_activity_search_results(page)
				that.paginate_after_new_search_query_or_filter(data)

			},
			error: function () {
				console.log('error searching activities');
			}

		});

	},
	update_filter_options: function (data) {
		$('.filter_option').not('.all').parent('li').remove()
		fo = ['activity_classification', 'section', 'topic']
		for (i=0; i< fo.length; i++) {
			type = fo[i] + 's'
			id_key = fo[i] + '_id'
			name_key = fo[i] + '_name'
			set = data[type]
			if (that.filters[fo[i]] == '') {
				for (j=0; j< set.length; j++){
					ele = set[j]
					span = $(document.createElement('span')).attr({'data-filter-type': fo[i], 'data-model-id' : ele[id_key], 'class' : 'filter_option'})
					span.click(that.filter_option_click_cb)
					span.text(ele[name_key])
					par = $("button[data-filter-type='" + fo[i] + "']").siblings('ul')
					li = $(document.createElement('li'))
					li.append(span)
					par.append(li)
				}
			}
		}
		


	},
	paginate_after_new_search_query_or_filter: function (data) {
		np = data.number_of_pages
		if (np < 2) {
			$('.pagination').hide()
		} else {
			$('.pagination .page_number, .pagination .active').remove()
			$('.pagination').show()
			for (i=0; i< np; i++) {
				li = $(document.createElement('li'))
				if (i+1 == that.current_page_number) {
					li.addClass('active')
				} else {
					li.addClass('page_number')
				}
				
				span = $(document.createElement('span'))
				span.text(i+1)
				$('.pagination li.right_arrow').before(li)
				li.append(span)
				li.click(that.page_number_click_cb)
				span.attr('data-page-number', i+1)
			}
		}
	},


	display_activity_search_results : function (page_number) {
		console.log('display search results of page : ' + page_number)
		that.current_page_number = page_number
		start_point = (page_number - 1)*(that.results_per_page)
		end_point = page_number*that.results_per_page - 1
		if (end_point > that.search_results.length -1){
			end_point = that.search_results.length - 1
		}

		$('#activities_table tbody > *').remove()
		for (i=start_point; i <= end_point; i++) {
			activity = that.search_results[i]
			tr = $(document.createElement('tr'))
			td1 = $(document.createElement('td'))
			td2 = $(document.createElement('td'))
			td3 = $(document.createElement('td'))
			td4 = $(document.createElement('td'))
			td5 = $(document.createElement('td'))

			checkbox = $(document.createElement('input'))
			checkbox.attr({
				type: 'checkbox', 
				id: 'activity_' + activity.activity_id,
				'data-model-id': activity.activity_id,
				class: 'css-checkbox'
			});
			checkbox_label = $(document.createElement('label'))
			checkbox_label.attr({
				for: 'activity_' + activity.activity_id,
				id: 'activity_' + activity.activity_id,
				class: 'css-label'
			});
			img = $(document.createElement('img'));
			img.attr('src', activity.image_path);

			tr.append(td1,td2,td3,td4,td5);
			td1.append(checkbox, checkbox_label);
			td2.append(img);
			td3.text(activity.activity_name).addClass('activity_name');
			td4.text(activity.section_name);
			td5.text(activity.topic_name);
			$('#activities_table tbody').append(tr);
			checkbox.click(that.checkbox_click_cb)
		}
	}

};
