module PagesHelper

	def pages_tab_class tabname
		arr = ["mission", "develop"]

		if tabname == 'about'
			arr.include?(action_name) ? "active" : ""
		else
			arr.include?(action_name) ? "" : "active"
		end

	end

	def about_subtab_class tabname
		if action_name == tabname
			"active"
		else
			""
		end
	end


end