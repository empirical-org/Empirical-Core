$(document).ready(function(){
	
	lesson_planner_object.initialize();
});

window.lesson_planner_object = {
	results_per_page: 12, // should be the same as number set in classrooms_manager_controller.rb
	current_page_number: 1, // since rails will have loaded 1st page on page-load
	number_of_pages: 1,
	search_results: [],
	search_results_loaded_from_ajax: false, // this will be relevant on page-turn (if ajax has loaded before, will just iterate through list)
	unit_name: '',
	classrooms: [],
	teaching_cart: [], // the set of activity ids that have been selected thus far by the teacher to be assigned
	filters: {
		activity_classification: '',
		topic: '',
		section: ''
	},
	sort: {
		field: null,
		asc_or_desc: null
	},
	selected_classrooms: [], // the set of classrooms that have been selected thus far (the classrooms who will be assigned the lessons)
	/*
	each hash in selected_classrooms is of the following form : 
	{
		classroom_id: int
		all_students: boolean
		student_ids: array  // empty if all_students==true; otherwise its a list of student ids
	}
	*/
	initialize: function () {
		that = this	
		that.initialize_events();
	},

	initialize_events: function () {
		
		// User specifies name of new unit
		$('#unit_name').blur(that.blur_cb_unit_name)

		// Search activities
		$('#search_activities_button').click(that.click_cb_search);
		$('.filter_option').click(that.click_cb_filter_option)
		$('.sorter').click(that.click_cb_sorter)
		$('.pagination .right_arrow').click(that.click_cb_right_arrow)
		$('.pagination .left_arrow').click(that.click_cb_left_arrow)
		$('.pagination .page_number').click(that.click_cb_page_number)
		$('.pagination .page_number span').click(that.click_cb_page_number)
		
		// Selecting activities for teaching-cart
		$('#activities_table input[type=checkbox]').click(that.click_cb_activity_checkbox)
		$('#activities_table .tooltip-trigger').mouseenter(that.mouseenter_cb_tooltip_trigger)
		$('#activities_table .tooltip-trigger').mouseleave(that.mouseleave_cb_tooltip_trigger)

		// Move to page 2 of activity planner (assign)
		$('button#continue').click(that.click_cb_continue)
	},




	// SEARCH 
	
	search_request: function () {
		query = $('#search_activities_input').val();
		$.ajax({
			url: '/teachers/classrooms/search_activities',
			data: {
				search_query: query,
				filters: that.filters,
				sort: that.sort
			},
			success: function (data, status, jqXHR) {
				that.search_results_loaded_from_ajax = true;
				
				that.search_results = data.activities
				that.number_of_pages = data.number_of_pages
				that.classrooms = data.classrooms
				that.display_search_results()
				that.update_filter_options(data)
				that.paginate()
			},
			error: function () {
				//console.log('error searching activities');
			}
		});

	},

	display_search_results : function () {
		start_point = (that.current_page_number - 1)*(that.results_per_page)
		end_point = that.current_page_number*that.results_per_page - 1
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
			
			arr = [td3,td4,td5]
			
			for (j=0; j< arr.length; j++) {
			 	ele = arr[j]
			 	ele.addClass('tooltip-trigger')
			}

			tooltip_div = $(document.createElement('div'))
			tooltip_div.addClass('activate-tooltip').data({
				html: true,
				toggle: 'tooltip',
				placement: 'top',
				title: ("<h1>" + activity.activity_name + "</h1><p>App: " + activity.activity_classification_name + "</p><p>" + activity.activity_description + "</p>")
			})
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
			

			td2.append(tooltip_div);
			tooltip_div.append(img);

			td3.text(activity.activity_name).addClass('activity_name');
			td4.text(activity.section_name);
			td5.text(activity.topic_name);
			$('#activities_table tbody').append(tr);
			checkbox.click(that.click_cb_activity_checkbox)
		}
		$('.tooltip-trigger').mouseenter(that.mouseenter_cb_tooltip_trigger)
		$('.tooltip-trigger').mouseleave(that.mouseleave_cb_tooltip_trigger)
	},

	paginate: function () {
		if (that.number_of_pages < 2) {
			$('.pagination').hide()
		} else {
			if (that.number_of_pages - that.current_page_number >= 4) {
				first_page = that.current_page_number
				last_page = first_page + 4
			} else {
				if (that.number_of_pages > 4) {
					first_page = that.number_of_pages - 4
					last_page = first_page + 4
				} else {
					first_page = 1
					last_page = that.number_of_pages
				}
			}

			$('.pagination .page_number, .pagination .active').remove()
			$('.pagination').show()
			for (i=first_page; i <= last_page; i++) {
				li = $(document.createElement('li'))
				if (i == that.current_page_number) {
					li.addClass('active')
				} else {
					li.addClass('page_number')
				}
				span = $(document.createElement('span'))
				span.text(i)
				$('.pagination li.right_arrow').before(li)
				li.append(span)
				li.click(that.click_cb_page_number)
				span.attr('data-page-number', i)
			}
		}
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
					span.click(that.click_cb_filter_option)
					span.text(ele[name_key])
					par = $("button[data-filter-type='" + fo[i] + "']").siblings('ul')
					li = $(document.createElement('li'))
					li.append(span)
					par.append(li)
				}
			}
		}
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



	// TEACHING CART (accumulating list of selected activities in bottom half of first page of activity planner)

	add_to_teaching_cart: function (activity_id, activity_name, activity_classification_image_path) {
		that.teaching_cart.push(activity_id)
		
		tr = $(document.createElement('tr'))
		td1 = $(document.createElement('td'))
		td2 = $(document.createElement('td'))
		td3 = $(document.createElement('td'))
		
		img1 = $(document.createElement('img'))
		img1.attr('src', activity_classification_image_path)
		
		td1.append(img1)
		
		td2.text(activity_name)
		tr.append(td1,td2,td3)
		tr.data('model-id', activity_id)
		$('.teaching-cart tbody').append(tr)
		td3.addClass('icon-x-gray')
		td3.data({'model-id': activity_id})
		td3.click(that.click_cb_teaching_cart_x)
			
		if (that.teaching_cart.length > 0){
			$('.teaching-cart #continue').show();
		}

	},

	remove_from_teaching_cart: function (id) {
		$('#activity_' + id).parent().parent().removeClass('active')
		for (i=0; i< that.teaching_cart.length; i++) {
			x = that.teaching_cart[i]
			if (parseInt(x) == id) {
				that.teaching_cart.splice(i,1)
			}
		}
		$('.teaching-cart tr[data-model-id=' + id + ']').remove()
		$('.assign-dates tr[data-model-id=' + id + ']').remove()
		if (that.teaching_cart.length == 0) {
			$('.teaching-cart #continue').hide();
		}
	},



	// EVENT CALLBACKS

	// EVENTS CALLBACKS PART 1: EVENTS ON FIRST PAGE (WHERE ACTIVITIES ARE SEARCHED AND SELECTED)

	blur_cb_unit_name: function (e) {
		$('.teaching-cart .unit_name').text($('#unit_name').val())
	},

	click_cb_search: function () {
		that.current_page_number = 1
		that.search_request()
	},

	click_cb_filter_option: function (e) {
		ele = $(e.target)
		filter_type  = ele.attr('data-filter-type')
		model_id = ele.attr('data-model-id')
		x = $("button[data-filter-type=" + filter_type + "]")
		y = ele.text()
		x.text(y)
		z = $(document.createElement('i')).addClass('fa fa-caret-down')
		x.append(z)
		that.filters[filter_type] = model_id
		if (model_id == '') { // Means we want to allow ALL instances of this filter type (ie ALL apps, or ALL concepts, etc)
			if (filter_type == 'activity_classification') {
				that.filters['section'] = '' // If we are setting apps (activity_classifications) to 'ALL', then we should also set section and topic to 'ALL'
				that.filters['topic'] = '' 
				z1 = $(document.createElement('i')).addClass('fa fa-caret-down')
				z2 = $(document.createElement('i')).addClass('fa fa-caret-down')
				$("button[data-filter-type='section']").text("All Levels").append(z1)
				$("button[data-filter-type='topic']").text("All Concepts").append(z2)
			} else if (filter_type == 'section') {
				that.filters['topic'] = '' // If we are setting section to 'ALL', then we should also set topic to 'ALL'
				z2 = $(document.createElement('i')).addClass('fa fa-caret-down')
				$("button[data-filter-type='topic']").text("All Concepts").append(z2)
			}
		}
		that.current_page_number = 1
		that.search_request();
	},

	click_cb_sorter: function (e) {
		that.sort.field = $(e.target).attr('id')
		$('.sorter').removeClass('active')
		$(e.target).addClass('active')
		that.change_asc_or_desc(e);
		that.current_page_number = 1
		that.search_request();
	},
	
	mouseenter_cb_tooltip_trigger: function (e) {
		e.stopPropagation()
		$(e.target).parent().find('.activate-tooltip').tooltip('show');
	},
	mouseleave_cb_tooltip_trigger: function (e) {
		e.stopPropagation()
		$(e.target).parent().find('.activate-tooltip').tooltip('hide')
	},
	
	click_cb_activity_checkbox: function (e) {
		x = $(e.target).attr('id')
		y = $('input[type=checkbox]#' + x + ':checked')
		activity_id = parseInt($(e.target).attr('data-model-id'))
		activity_classification_image_path = $(e.target).attr('data-image-path')
		if (y.length > 0) {
			activity_name = $(e.target).parent().siblings('.activity_name').text().trim()
			that.add_to_teaching_cart(activity_id, activity_name, activity_classification_image_path)
			$(e.target).parent().parent().addClass('active')
		} else {
			$(e.target).parent().parent().removeClass('active')
			that.remove_from_teaching_cart(activity_id)
		}
	},
	
	click_cb_teaching_cart_x: function (e) {
		e.stopPropagation()
		id = $(e.target).data('model-id')
		that.remove_from_teaching_cart(id)
		$('input[type=checkbox]' + '#activity_' + activity_id).prop('checked', false)
	},

	click_cb_page_number: function (e) {	
		x = $(e.target).attr('data-page-number')
		$('.pagination .active').removeClass('active').addClass('page_number')
		$(e.target).parent('li').addClass('active')
		that.current_page_number = parseInt(x)
		if (that.search_results_loaded_from_ajax) {
			that.display_search_results()
		} else {
			that.search_request()
		}
	},

	click_cb_right_arrow: function (e) {
		if (that.search_results_loaded_from_ajax) {
			if (that.number_of_pages > that.current_page_number) {
				that.current_page_number = that.current_page_number + 1
				that.display_search_results()
				that.paginate()
			} 
		} else {
			that.current_page_number = 2 // dont need to check number of pages -> if on page load there was 1 one page of results, no 'right arrow' would appear
			that.search_request(); 
		}
	},

	click_cb_left_arrow: function (e) {
		if (that.current_page_number > 1) {
			that.current_page_number = that.current_page_number - 1
			that.display_search_results()
			that.paginate()
		}
	},
	
		
	click_cb_continue: function (e) {
		that.unit_name = $('#unit_name').val()
		$.ajax({
			url: '/teachers/classrooms/retrieve_classrooms_for_assigning_activities',  
			data: {activities: that.teaching_cart},
			success: function (data, status, jqXHR) {
				$('.assign_activities_progress_bar').removeClass('disabled').addClass('complete')
				$('.container.lesson_planner_main').html(data)
				$('.classroom_checkbox').click(that.click_cb_classroom_checkbox);
				$('.remove_activity_from_teaching_cart').click(that.click_cb_teaching_cart_x)
				
				$('.student_checkbox').click(that.click_cb_student_checkbox);
				$('button#assign').click(that.click_cb_assign);

				$('.datepicker-input').datepicker({
					selectOtherMonths: true,
		      		dayNamesMin: ['S', 'M', 'T', 'W', 'T', 'F', 'S'],
		      		minDate: -20,
		      		maxDate: "+1M +10D" 
		      	});
					
				
			},	
			error: function () {
				console.log('error ajaxing classrooms')
			}
		});
	},


	

	// EVENT CALLBACKS PART 2 : EVENTS ON SECOND PAGE OF ACTIVITY PLANNER (WHERE ACTIVITIES ARE ASSIGNED)

	click_cb_classroom_checkbox: function (e) {
		classroom_id = parseInt($(e.target).attr('data-model-id'))
		y = $('input[type=checkbox]#classroom_checkbox_' + classroom_id + ':checked')
		is_checked = y.length > 0
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
	},
	click_cb_student_checkbox: function (e) {
		sid = parseInt($(e.target).attr('data-model-id'))
		cid = parseInt($(e.target).attr('data-classroom-id'))
		student_count = parseInt($(e.target).attr('data-student-count'))
		is_checked = $('input[type=checkbox]#student_' + sid + ':checked').length > 0
		selected_classroom_found = false;

		for (i=0; i< that.selected_classrooms.length; i++) {
			classroom = that.selected_classrooms[i]
			if (cid == classroom.classroom_id) {
				selected_classroom_found = true;
				classroom.all_students = false
				x = classroom.student_ids.indexOf(sid)
				if (is_checked) {
					if (x == -1) {
						classroom.student_ids.push(sid)
						if (classroom.student_ids.length == student_count) {
							console.log('entire class selected')
						}
					}
				} else {
					if (x != -1) {
						if (classroom.student_ids.length == 1) {
							classroom.student_ids.splice(x,1)
							that.selected_classrooms.splice(that.selected_classrooms.indexOf(classroom),1)
						} else {
							classroom.student_ids.splice(x,1)
						}
						

					}

				}
			}
		}

		if (!selected_classroom_found) {
			obj = {
				classroom_id: cid,
				all_students: false,
				student_ids: [sid]
			}
			that.selected_classrooms.push(obj)
		}

	},

	click_cb_assign: function (e) {
		e.preventDefault()
		arr = []
		for (i=0; i< that.teaching_cart.length; i++) {
			aid = that.teaching_cart[i]
			dpele = $('#datepicker_' + aid)
			date = dpele.datepicker('getDate')
			arr.push({activity_id: aid, due_date: date})
		}
		arr = JSON.stringify(arr)
		form = $('form#new_unit')
		method = 'post'
		form.attr('method', method)

		inp1 = $(document.createElement('input'))
		inp1.attr('type', 'hidden')
		inp1.attr('name', 'unit_name')
		inp1.attr('value', that.unit_name)

		inp2 = $(document.createElement('input'))
		inp2.attr('type', 'hidden')
		inp2.attr('name', 'selected_classrooms')
		inp2.attr('value', JSON.stringify(that.selected_classrooms))

		inp3 = $(document.createElement('input'))
		inp3.attr('type', 'hidden')
		inp3.attr('name', 'pairs_of_activity_id_and_due_date')
		inp3.attr('value', arr)

		form.append(inp1,inp2,inp3)
		form.submit()

	}



};
