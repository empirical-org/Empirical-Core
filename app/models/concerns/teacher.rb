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


  def scorebook_scores current_page=1, classroom_id=nil, unit_id=nil
    
    if classroom_id.present?
      users = Classroom.find(classroom_id).students
    else
      users = classrooms.map(&:students).flatten.compact.uniq
    end



    user_ids = users.map(&:id)

    results = ActivitySession.select("user_id, max(percentage) as percentage, max(activity_id) as activity_id")
                            .includes(:user)
                            .where(user_id: user_ids)
                            


    if unit_id.present?
      classroom_activity_ids = Unit.find(unit_id).classroom_activities.map(&:id)
      results = results.where(classroom_activity_id: classroom_activity_ids)
    end


    results = results.group('user_id, classroom_activity_id')
                     .order('user_id, percentage')
                     .limit(SCORES_PER_PAGE)
                     .offset( (current_page - 1)*SCORES_PER_PAGE   )



    activity_ids = results.map(&:activity_id).uniq.compact
    activities = Activity.includes(:topic => [:section, :topic_category]).includes(:classification).find(activity_ids)

    results = results.group_by(&:user_id)

    hash = {}

    results.each do |user_id, result|
      user = users.find{|u| u.id == user_id}
      arr = []
      

      result.each do |r|
        a = activities.find{|a1| a1.id ==  r.activity_id}
        ele = {
          percentage: r.percentage,
          activity: (ActivitySerializer.new(a)).as_json(root: false)
        }
        arr.push ele
      end


      hyper_ele = {
        user: user,
        results: arr
      }
      hash[user_id] = hyper_ele
    end

    hash
  end





end
