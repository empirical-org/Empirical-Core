module PagesHelper

	def pages_tab_class tabname
		about_actions = ["mission", "develop", "faq", "team"]
		impact_actions = ['impact']
		activities_actions = ['activities']

		if tabname == "about"
			about_actions.include?(action_name) ? 'active' : ''
		elsif tabname == "impact"
			impact_actions.include?(action_name) ? 'active' : ''
		elsif tabname == 'activities'
			activities_actions.include?(action_name) ? 'active' : ''
		elsif tabname == 'premium'
			(action_name == 'premium_from_discover') ? "premium-tab active" : ''
		end

	end

	def about_subtab_class tabname
		if action_name == tabname
			"active"
		else
			""
		end
	end

	def team_info
		arr = [
	      {
		      img: 'thumb-peter.png',
		      name: 'Peter Gault',
		      title: 'Executive Director, Founder',
		      desc: "Peter designs the user's experience and coordinates the Empirical team. Peter wrote his senior thesis at Bates College on the role of emotion in moral judgements."
		  },
		  {

		      img: 'thumb-ryan.jpg',
		      name: "Ryan Novas",
		      title: "Operations Director, Cofounder",
		      desc: "Ryan works with teachers to create new features content for Quill. He also helps integrate Quill into classrooms and oversees daily operations at Empirical."
	  	  },
	  	  {
		      img: 'thumb-tom.png',
		      name: "Tom Calabrese",
		      title: "Creative Director, Cofounder",
		      desc: "Thomas is a designer who likes to think about strategy, people, and science fiction. He studied at the Fashion Institute of Technology with a Bachelor’s degree in Communication Design, as well as the School of Visual Arts with a Masters in Branding."
	      },
	      {
		      img: 'thumb-marcello.jpg',
		      name: 'Marcello Sachs',
		      title: 'Technical Director, Cofounder',
		      desc: "Marcello has a background in pure math from Brown University, and he currently enjoys reading about ideas in analytic philosophy."
		  },
	  	  {
		      img: 'thumb_collin.png',
		      name: "Collin Cowdery",
		      title: "Development Director, Cofounder",
		      desc: "Collin studied Japanese at Oberlin College. He raises funds for Quill via grants and sales. He also assists teachers and helps develop new learning mechanics for our apps."
	      },
	      {
		      img: 'thumb_kris.jpg',
		      name: 'Kristopher Kelly',
		      title: "Senior Developer",
		      desc: "Kristopher Kelly has been writing code professionally for the past 8 years. He previously was the lead developer of Omeka, an open source citation tool that is popular with digital historians."
		  },
   		{
		      img: 'thumb-will.jpg',
		      name: 'Will Laurance',
		      title: 'Lead Apps Developer',
		      desc: "Will is passionate about HTTP, web and mobile applications, distributed systems, databases, network security, and computer science as a whole. Open Source is changing the world one repository at a time, and he tries to open source as much as much as possible on GitHub."
   		},
   	      {

		      img: 'thumb-alex.png',
		      name: "Alex Redmon",
		      title: "Open Source Developer",
		      desc: "Alex is an art collector, I.T. professional, and entrepreneur living in Brooklyn who enjoys reading, writing, photography, and music."
	  	  },
	  	  {
		      img: 'thumb-matt-coleman.png',
		      name: "Matt Coleman",
		      title: "Developer",
		      desc: "Matt is a developer with a BS in Computer Engineering. He likes Fedora and lives in Boston."
	      },
		  {

		      img: 'thumb-maggie.png',
		      name: "Maggie Wunderlich",
		      title: "Activity Writer",
		      desc: "Maggie is the Senior Achievement Associate at Rocketship Education and has taught upper elementary school and middle school English for the past four years. She creates and edits activities for Quill."
	  	  },
	  	  {
		      img: 'thumb-bill.png',
		      name: "W.D Robinson",
		      title: "Editor",
		      desc: "Bill has thirty years' experience writing and editing his way through engineering failure analysis, gaming, life sciences, corporate training, hardware & software procedural documentation, political survey design, and education."
	      },
		  # {

		  #     img: 'thumb-matt.png',
		  #     name: "Matt Cox",
		  #     title: "Community Manager",
		  #     desc: "Matt engages community members and partners. He attends college in New York City and is studying communications."
	  	#   }
	  	{
		      img: 'thumb_ben.png',
		      name: "Ben Sussman",
		      title: "Board Member",
		      desc: "Ben is the Director of Engineering at Zoc Doc and advises Quill on all things technical."
	      },
	      {
	      	img: "thumb-tim.png",
	      	name: "Timothy Grieves",
	      	title: "Board Member",
	      	desc: "Timothy is the chief administrator of the Northwest AEA, a regional agency that advises 33,000 students in Iowa."
	      }

	     ]
	    arr
	end
end




=begin



      =image_tag 'thumb-tim.png'
      h4 Timothy Grieves
      p Board Member
      p Timothy Grieves is the chief administrator of the Northwest AEA, a regional agency that advises 33,000 students in Iowa.


=end













