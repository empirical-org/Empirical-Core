module Teacher
  extend ActiveSupport::Concern

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


  def scorebook_scores classroom_id=nil, unit_id=nil
    user_ids = classrooms.map(&:students).flatten.compact.uniq.map(&:id)

    result = ActivitySession.select("user_id, max(percentage) as percentage, max(activity_id) as activity_id")
                            .includes(:user)
                            .where(user_id: user_ids)
                            .group('user_id, classroom_activity_id')
                            .order('user_id')
                            .limit(10)
                             
    activity_ids = result.map(&:activity_id).uniq.compact
    acts = Activity.includes(:topic => [:section, :topic_category]).includes(:classification).find(activity_ids)

    
    result
    
  end





end
