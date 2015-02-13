module PagesHelper

	def pages_tab_class tabname
		arr = ["mission", "develop", "faq", "team"]

		if tabname == "about"
			arr.include?(action_name) ? "active" : ""
		elsif tabname == "impact"
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

	def team_info 
		arr = [
	      {
		      img: 'thumb-peter.png',
		      name: 'Peter Gault',
		      title: 'Designer, Founder',
		      desc: "Peter designs the user's experience and coordinates the Empirical team. Peter wrote his senior thesis at Bates College on the role of emotion in moral judgements."
		  },
		  {

		      img: 'thumb-ryan.jpg',
		      name: "Ryan Novas",
		      title: "Operations Director",
		      desc: "Ryan works with teachers to create new features content for Quill. He also helps integrate Quill into classrooms and oversees daily operations at Empirical."
	  	  },
	  	  {
		      img: 'thumb-tom.png',
		      name: "Tom Calabrese",
		      title: "Creative Director",
		      desc: "Thomas is a designer who likes to think about strategy, people, and science fiction. He studied at the Fashion Institute of Technology with a Bachelor’s degree in Communication Design, as well as the School of Visual Arts with a Masters in Branding."
	      },
	      {
		      img: 'thumb-marcello.jpg',
		      name: 'Marcello Sachs',
		      title: 'Lead Developer',
		      desc: "Marcello has a background in pure math from Brown University, and currently enjoys reading about ideas in analytic philosophy."
		  },
	  	  {
		      img: 'thumb-josh.png',
		      name: "Josh Symonds",
		      title: "Developer",
		      desc: "Josh performs devops and server wrangling on cloud-scale infrastructures, deploys amazing web applications with Ruby on Rails, and creates awesome iOS apps with Objective-C and RubyMotion."
	      },
	      {
		      img: 'thumb-james.png',
		      name: 'James Cox',
		      title: "Developer",
		      desc: "James is responsible for developing the Empirical API. He has experience in software engineering, engineering management, system architecture, SOA strategy, product validation, and MVPs."
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
	      {
		      img: 'thumb-will.jpg',
		      name: 'Will Laurance',
		      title: 'Developer',
		      desc: "Will is passionate about HTTP, web and mobile applications, distributed systems, databases, network security, and computer science as a whole. Open Source is changing the world one repository at a time, and he tries to open source as much as possible on GitHub."
		  },
		  {

		      img: 'thumb-matt.png',
		      name: "Matt Cox",
		      title: "Community Manager",
		      desc: "Matt engages community members and partners. He attends college in New York City and is studying communications."
	  	  },
	      {

		      img: 'thumb-alex.png',
		      name: "Alex Redmon",
		      title: "Developer",
		      desc: "Alex is an art collector, I.T. professional, and entrepreneur living in Brooklyn who enjoys reading, writing, photography, and music."
	  	  },
	  	  {
		      img: 'thumb-matt-coleman.png',
		      name: "Matt Coleman",
		      title: "Developer",
		      desc: "Matt is a developer with a BS in Computer Engineering. He likes Fedora and lives in Boston."
	      },
	      {
	      	img: "thumb-tim.png",
	      	name: "Timothy Grieves",
	      	title: "Board Member",
	      	desc: "Timothy Grieves is the chief administrator of the Northwest AEA, a regional agency that advises 33,000 students in Iowa."
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












	