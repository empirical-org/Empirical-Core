module PagesHelper

	def about_subtab_class tabname
		if action_name == tabname
			"active"
		else
			""
		end
	end


end