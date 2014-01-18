var Contributors = (function() {
	var contributors = function() {
		this.bindTeamFilters();
	};
	
	contributors.prototype.bindTeamFilters = function() {
		var self = this;
		
		$('#contributors').on('click', '.team', function() {
			var team = $(this).data('team');
			self.filterTeam(team);
		});
	};
	
	contributors.prototype.filterTeam = function(team) {
		
	};
	
	return contributors;
}());

$(document).ready(function() {
	new Contributors();
});