module Teacher
  extend ActiveSupport::Concern
  SCORES_PER_PAGE = 200

  included do
    has_many :classrooms, foreign_key: 'teacher_id'
  end

  class << self
    delegate :first, :find, :where, :all, :count, to: :scope

    def scope
      User.where(role: 'teacher')
    end
  end

  # Occasionally teachers are populated in the view with
  # a single blank classroom.
  def has_classrooms?
    !classrooms.empty? && !classrooms.all?(&:new_record?)
  end


  # def scorebook_scores current_page=1, classroom_id=nil, unit_id=nil
    
  #   if classroom_id.present?
  #     users = Classroom.find(classroom_id).students
  #   else
  #     users = classrooms.map(&:students).flatten.compact.uniq
  #   end

  #   user_ids = users.map(&:id)

  #   results = ActivitySession.select("user_id, users.name, max(percentage) as percentage, max(activity_id) as activity_id")
  #                           .includes(:user)
  #                           .where(user_id: user_ids)

                            

  #   if unit_id.present?
  #     classroom_activity_ids = Unit.find(unit_id).classroom_activities.map(&:id)
  #     results = results.where(classroom_activity_id: classroom_activity_ids)
  #   end


  #   results = results.group('user_id, classroom_activity_id')
  #                    .order('user_id, percentage')
  #                    .limit(SCORES_PER_PAGE)
  #                    .offset( (current_page - 1)*SCORES_PER_PAGE   )


  #   is_last_page = (results.length < SCORES_PER_PAGE)

  #   activity_ids = results.map(&:activity_id).uniq.compact
  #   activities = Activity.includes(:topic => [:section, :topic_category]).includes(:classification).find(activity_ids)

  #   results = results.group_by(&:user_id)

  #   all = []
  #   results.each do |user_id, result|
  #     user = users.find{|u| u.id == user_id}      
  #     arr = result.map do |r|
  #       a = activities.find{|a1| a1.id ==  r.activity_id}
  #       ele = {percentage: r.percentage, activity: (ActivitySerializer.new(a)).as_json(root: false)}
  #     end
  #     hyper_ele = {user: user, results: arr}
  #     all.push hyper_ele
  #   end
  #   [all, is_last_page]
  # end


  def scorebook_scores current_page=1, classroom_id=nil, unit_id=nil
    
    if classroom_id.present?
      users = Classroom.find(classroom_id).students
    else
      users = classrooms.map(&:students).flatten.compact.uniq
    end
    
  
  
    results = ActivitySession.select("users.name, activity_sessions.id, activity_sessions.percentage,
                                substring(
                                    users.name from (
                                      position(' ' in users.name) + 1
                                    ) 
                                    for (
                                      char_length(users.name)
                                    )
                                  ) 
                                  ||
                                  substring(
                                    users.name from (
                                      1
                                    )
                                    for (
                                      position(' ' in users.name)
                                    )

                                  ) as sorting_name

                              ")
                              .includes(:user, :activity => [:classification, :topic => [:section, :topic_category]])
                              .references(:user)
                              .where(user: users)
                              .where('(activity_sessions.is_final_score = true) or ((activity_sessions.completed_at IS NULL) and activity_sessions.is_retry = false)')
                              
    if unit_id.present?
      classroom_activity_ids = Unit.find(unit_id).classroom_activities.map(&:id)
      results = results.where(classroom_activity_id: classroom_activity_ids)
    end

    results = results.order('sorting_name')
                      .limit(SCORES_PER_PAGE)
                      .offset( (current_page -1 )*SCORES_PER_PAGE)

    is_last_page = (results.length < SCORES_PER_PAGE)


    
    x1 = results.group_by(&:user_id)

    x2 = []
    x1.each do |user_id, scores|
      formatted_scores = scores.map do |s|
        {
          percentage: s.percentage,
          activity: (ActivitySerializer.new(s.activity)).as_json(root: false)
        }
      end
      y1, y2 = formatted_scores.partition{|x| x[:percentage].present? }
      y1 = y1.sort_by{|x| x[:percentage]}
      formatted_scores = y1.concat(y2)


      ele = {
        user: User.find(user_id),
        results: formatted_scores
      }
      x2.push ele
    end

    x2 = x2.sort_by{|x2| x2[:user].sorting_name}
    all = x2

    [all, is_last_page]

  end





end
