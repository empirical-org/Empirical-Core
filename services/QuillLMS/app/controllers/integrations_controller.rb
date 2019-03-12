class IntegrationsController < ApplicationController
  include HTTParty
  layout "integrations"

  def amplify
    store_partner_session()
    @body_class = 'full-width-page white-page'
    @js_file = 'public'
    @active_tab = 'Featured Activities'
    # get list of activities to pass to view
    @topics = cached_amplify_activities
  end

  def amplify_all
    @body_class = 'full-width-page white-page'
    @js_file = 'public'
    @active_tab = 'Explore All Activities'
    @section = if params[:section_id].present? then Section.find(params[:section_id]) else Section.first end
    @topics = @section.topics.map{ |topic| [topic, topic.activities.production] }.select{ |group| group.second.any? }
    render :template => 'integrations/amplify'
  end

  def cached_amplify_activities
    Rails.cache.fetch(:selected_amplify_activities, :expires_in => 1.day) do
      format_amplify_activities()
    end
  end

  def format_amplify_activities
    activities = selected_amplify_activities()
    topics = activities.map{ |activity| activity.topic }.uniq
    # The template expects an array of [topic, [activities]] objects, so sort our
    # activities into the appropriate shape
    topics.map{ |topic|
      [topic, activities.map{ |activity|
        if activity.topic == topic
          activity
        end
      }.compact]
    }
  end

  def selected_amplify_activities
    selected_activities = []
    selected_amplify_activity_uids().each do |uid|
      begin
        activity = Activity.find_by!(uid: uid)
        selected_activities << activity
      rescue ActiveRecord::RecordNotFound => e
        puts "NO RECORD FOUND FOR UID"
        NewRelic::Agent.add_custom_attributes({
          activity_uid: uid
        })
        NewRelic::Agent.notice_error(e)
      end
    end
    selected_activities
  end

  def selected_amplify_activity_uids
    # This is a pre-defined list of activities that we want to present to Amplify users
    [
      "-KS7eEAiCRClVOWBCjr0",
      "-KS7fEC2YOG1zwyMvl7M",
      "-KS7cpeXa94Ev9HHWoLQ",
      "-KS7hcS22a5sVy5tuLyc",
      "-LNLX8XiOFL5fubpnL4n",
      "-L9kxNh-Rg0TdAg4pTs9",
      "-L9kgJ-GCd6UCG21kr50",
      "-LBMo-QzVvdNPKglNmDI",
      "-LBNPyvS13vIqpF5RqG1",
      "-LBRzb1xwCPFrohj4Zv3",
      "-LCZhYVq7iWBms9O8iux",
      "-LVyd20sxExyCSbcycZE",
      "-KTAQiTDo_9gAnk3aBG5",
      "-KS7Gy-PFD6Hs5Kwc5ZC",
      "-KS7Morubx0PZ7ToGtXH",
      "-KXHxOiPXAMZmQOGGer9",
      "-LDN2q7QEA6HtQQZCVy8",
      "-LNLXrsydOGLQmCk4qvM",
      "-KQWzEjdKOXNhdnLbjff",
      "-KQX-8Dy-O-fK6YlW2b6",
      "-KQWzlX8sGtFYG26eG0l",
      "-KQX-YEGiFW71KKpep2X",
      "-KQX0HF6yFtrsbicleno",
      "-KQX-rHNK3Be8LWiPVui",
      "-KQX18KQAX6NHIuSOQiM",
      "-KQX1Rk4PY-bB7jsJsU2",
      "-KQX1jKAlI9bWSg-Iink",
      "-L2Mydvpa-65M2Q1QHW0",
      "-LNqB486yI4Yqvp0drp1",
      "-LOKZXZkDkAJ2jlTqhpT",
      "-L8sBL_088oejlo9RFip",
      "-L96-GrjSsMevkSVuGfO",
      "-LNr_skbr1dzork539o9",
      "-LP84xrUrVcbdB8O96VZ",
      "-L9MXKPhGbj8xZfd5G--",
      "-LP8Iq_LGjAUNTgkAdGR",
      "-LRSKHI7YboS363xmfm2",
      "-LP8IO5wfYN4GJj-W8jN",
      "-L4g-FHUF_4A9BpVc7Uc",
      "-L4g1S_14e8SYcyF-7Ky",
      "-L4g3j-cWT-MV2BIq_iQ",
      "-L4g54p2oYfDNWT7oiLC",
      "-L4gZDlvR333VxcXMYnH",
      "-LNqmoxU-SrpA8BLhomO",
      "-LNuYq4pXxmchQUUAB8o",
      "-LOK2A7L9RPwXN5TTgfu",
      "-LOs79HLbItPxh7-pRUt",
      "-LOsVaCzNsfXnSy8NLCJ",
      "-LC4oP1vZaRkuZkQ0QIu",
      "-LBgXZl1hPHrHeZE32JD",
      "-LCnwom23g5ssi7lr0Kc",
      "-K293EqvyXPYPunqKS2_",
      "rwSTz7k4JpTOrCun1PlBuA",
      "KfXZjcff6YVWh1fbRzGr4w",
      "b0XbYfl-ECVFe3KGORmFUQ"
    ]
  end

  def store_partner_session
    # Assumes that each partner gets a unique action corresponding to their name
    @partner_name = action_name
    @session_id = params[:session_id]
    session[:partner_session] = {
      "partner_name" => @partner_name,
      "session_id" => @session_id
    }
  end

end
