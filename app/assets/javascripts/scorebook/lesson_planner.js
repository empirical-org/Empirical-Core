$(document).ready(function(){
	
	lesson_planner_object.initialize();
});

window.lesson_planner_object = {
	results_per_page: 2,
	current_page_number: 1, // since rails will have loaded 1st page on page-load
	number_of_pages: 1,
	search_results: [],
	search_results_loaded_from_ajax: false, // this will be relevant on page-turn (if ajax has loaded before, will just iterate through list)
	unit_name: '',
	classrooms: [],
	teaching_cart: [],
	filters: {
		activity_classification: '',
		topic: '',
		section: ''
	},
	sort: {
		field: null,
		asc_or_desc: null
	},
	selected_classrooms: [],
	/*
	{
		classroom_id: 
		all_students: true | false,
		student_ids: [] | empty if all_students=true; otherwise its a list of student ids

	}

	*/
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
			console.log('unit name blur event')
			$('.teaching-cart .unit_name').text($('#unit_name').val())
		});
		$('#activities_table input[type=checkbox]').click(that.checkbox_click_cb)
		$('button#continue').click(that.click_continue_cb)
		
		
	},
	classroom_checkbox_click_cb: function (e) {
		console.log('')
		console.log('calssroom checkbox clikc cb')
		classroom_id = parseInt($(e.target).attr('data-model-id'))
		console.log('classroom_id: ' + classroom_id)
		y = $('input[type=checkbox]#classroom_checkbox_' + classroom_id + ':checked')
		is_checked = y.length > 0
		console.log('is checked? : ' + is_checked)
		existing_classroom_obj_found = false
		for (i=0; i< that.selected_classrooms.length; i++) {
			classroom_obj = that.selected_classrooms[i]
			if (classroom_id == classroom_obj.classroom_id) {
				existing_classroom_obj_found = true
				if (!is_checked) {
					that.selected_classrooms.splice(i,1);	
				}
			}
		}
		if (is_checked & !existing_classroom_obj_found) {
			obj = {classroom_id: classroom_id, all_students: true, student_ids: []}
			that.selected_classrooms.push(obj)
				// perhaps check off all the checkboxes next to each student name ? 
		}
		console.log('')
		console.log('that.selected_classrooms after adding or removing one') 
		console.log(that.selected_classrooms)
	},
		
	click_continue_cb: function (e) {
		that.unit_name = $('#unit_name').val()
		$.ajax({
			url: '/teachers/classrooms/retrieve_classrooms_for_assigning_activities',  
			data: {activities: that.teaching_cart},
			success: function (data, status, jqXHR) {
				console.log('success ajaxing classrooms')
				//that.classrooms = data.classrooms
				$('.assign_activities_progress_bar').removeClass('disabled').addClass('complete')
				$('.container.lesson_planner_main').html(data)
				$('.classroom_checkbox').click(that.classroom_checkbox_click_cb);
				$('.remove_activity_from_teaching_cart').click(function (e) {
					id = $(e.target).attr('data-model')
					that.remove_from_teaching_cart(id)
				});
				$('.datepicker-input').datepicker({
					selectOtherMonths: true,
		      		dayNamesMin: ['S', 'M', 'T', 'W', 'T', 'F', 'S'],
		      		minDate: -20,
		      		maxDate: "+1M +10D" 
		      	});
					
				$('.student_checkbox').click(that.student_checkbox_cb);
				$('button#assign').click(that.click_assign_cb);
			},	
			error: function () {
				console.log('error ajaxing classrooms')
			}
		});
	},
	click_assign_cb: function (e) {
		console.log('assign clicked')
		arr = []
		for (i=0; i< that.teaching_cart.length; i++) {
			aid = that.teaching_cart[i]
			dpele = $('#datepicker_' + aid)
			date = dpele.datepicker('getDate')
			arr.push({activity_id: aid, due_date: date})
		}

		console.log('')
		console.log('pairs arr : ')
		console.log(arr)

		$.ajax({
			url: '/teachers/classrooms/assign_activities',
			data: {unit_name: that.unit_name, selected_classrooms: that.selected_classrooms, pairs_of_activity_id_and_due_date: arr},
			success: function (data, status, jqXHR) {
				console.log('assign ajax success')
				window.open('/teachers/classrooms/1/scorebook', '_self')
			},
			error: function () {
				console.log('assign ajax error')
			}
		});
	},
	student_checkbox_cb: function (e) {
		console.log('student checkbox callback')
		sid = parseInt($(e.target).attr('data-model-id'))
		cid = parseInt($(e.target).attr('data-classroom-id'))
		student_count = parseInt($(e.target).attr('data-student-count'))
		console.log('classroomid : ' + cid + '; student id : ' + sid)
		is_checked = $('input[type=checkbox]#student_' + sid + ':checked').length > 0
		console.log('is checked : ' + is_checked)

		selected_classroom_found = false;

		for (i=0; i< that.selected_classrooms.length; i++) {
			classroom = that.selected_classrooms[i]
			if (cid == classroom.classroom_id) {
				console.log('')
				console.log('classroom before removing or adding sid')
				console.log(classroom)
				selected_classroom_found = true;
				classroom.all_students = false
				x = classroom.student_ids.indexOf(sid)
				console.log('index of sid in classroom.students : ' + x)
				if (is_checked) {
					if (x == -1) {
						classroom.student_ids.push(sid)
						console.log('')
						console.log('student count: ' )
						console.log(student_count)
						console.log('student_ids length: ')
						console.log(classroom.student_ids.length)
						if (classroom.student_ids.length == student_count) {
							console.log('entire class selected')
						}
					}
				} else {
					console.log('')
					console.log('going to remove this student')
					if (x != -1) {
						console.log('sid is in classroom.student_ids, so were going to have to remove it')
						if (classroom.student_ids.length == 1) {
							console.log('classroom.student_ids only has one element in it, so were gonna remove it from set of that.selected_classrooms')
							classroom.student_ids.splice(x,1)
							that.selected_classrooms.splice(that.selected_classrooms.indexOf(classroom),1)
						} else {
							console.log('classroom.student_ids has more than one element, so were just gonna remove the relevant sid')
							console.log('classroom before doing so : ')
							console.log(classroom)
							classroom.student_ids.splice(x,1)
							console.log('classroom after removing sid: ' )
							console.log(classroom)
						}
						

					}

				}
				console.log('classroom after removing or adding new sid : ')
				console.log(classroom)
				console.log('that.selected_classrooms after potentially removing classroom : ')
				console.log(that.selected_classrooms)
			}
		}

		if (!selected_classroom_found) {
			obj = {
				classroom_id: cid,
				all_students: false,
				student_ids: [sid]
			}
			that.selected_classrooms.push(obj)
			console.log('didnt find classroom, had to add one')
			if (student_count == 1) {
				console.log('all students selected')
			}
		}






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
		//obj = {activity_id: activity_id, activity_name: activity_name, activity_classification_image_path: activity_classification_image_path}
		obj = activity_id
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
			if (parseInt(x) == id) {
				console.log('made it past if')
				that.teaching_cart.splice(i,1)
			}
		}
		$('.teaching-cart tr[data-model-id=' + id + ']').remove()
		$('.assign-dates tr[data-model-id=' + id + ']').remove()
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
				that.classrooms = data.classrooms
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
