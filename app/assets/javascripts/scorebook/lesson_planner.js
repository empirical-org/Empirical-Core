$(document).ready(function(){
	
	lesson_planner_object.initialize();
});

window.lesson_planner_object = {
	filters: {
		activity_classification: null,
		topic: null,
		section: null
	},
	sort: {
		field: null,
		asc_or_dsc: null
	}

	initialize: function () {
		that = this
		$('#search_activities_button').click(function(){
			that.search_request();
		});

		$('.activity_classification_option').click(function(e) {
			ele = $(e.target)
			pre_id = ele.attr('id')
			id = pre_id.slice(24, pre_id.length)
			that.filters.activity_classification = id
			that.search_request();
		});

		$('#activity_classification_all').click(function() {
			that.filters.activity_classification = ''
			that.search_request();
		});

		$('#section_all').click(function(){
			that.filters.section = ''
			that.search_request();
		});

		$('#topic_all').click(function(){
			that.filters.topic = ''
			that.search_request();
		})


		$('.topic_option').click(function(e) {
			ele = $(e.target);
			pre_id  = ele.attr('id')
			id = pre_id.slice(6,pre_id.length)
			that.filters.topic = id
			that.search_request();
		});

		$('.section_option').click(function(e) {
			console.log('section option click;');
			ele = $(e.target)
			pre_id = ele.attr('id')
			id = pre_id.slice(8,pre_id.length)
			that.filters.section = id
			that.search_request();
		});

		$('#sort_by_activity_classification').click(function(e) {
			console.log('sort by app');
			that.sort.field = 'activity_classification'
			x = $(e.target).find('.fa-caret-up');
			if (x.length == 0) {
				console.log('change to asc')
				that.sort.asc_or_dsc = 'asc'
				$(e.target).find('.fa-caret-down').addClass('fa-caret-up').removeClass('fa-caret-down')

			} else {
				console.log('change to dsc')
				that.sort.asc_or_dsc = 'dsc'
				$(e.target).find('.fa-caret-up').addClass('fa-caret-down').removeClass('fa-caret-up')
			}
			that.search_request();


		});



	},

	search_request: function () {
		that = this
		query = $('#search_activities_input').val();
		$.ajax({
			url: '/teachers/classrooms/search_activities',
			//data: "search_query=" + query,
			data: {
				search_query: query,
				filters: that.filters,
				sort: that.sort
			},
			success: function (data, status, jqXHR) {
				console.log('search activities success, data: ');
				console.log(data);
				that.display_activity_search_results(data.activities)

			},
			error: function () {
				console.log('error searching activities');
			}

		});

	},

	display_activity_search_results : function (activities) {
		$('#activities_table tbody > *').remove()
		for (i=0; i < activities.length; i++) {
			activity = activities[i];
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
				name: 'checkboxG1',
				class: 'css-checkbox'
			});
			checkbox_label = $(document.createElement('label'))
			checkbox_label.attr({
				for: 'checkbox1',
				id: 'activity_' + activity.activity_id,
				class: 'css-label'
			});
			img = $(document.createElement('img'));
			img.attr('src', activity.image_path);

			tr.append(td1,td2,td3,td4,td5);
			td1.append(checkbox, checkbox_label);
			td2.append(img);
			td3.text(activity.activity_name);
			td4.text(activity.section_name);
			td5.text(activity.topic_name);

			$('#activities_table tbody').append(tr);
		}
	}

};
