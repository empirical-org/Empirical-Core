module Dashboard

  def self.queries

  end

  def self.struggling_students(user)
    averages = {}
    user = User.find user.id
    students = user.students.map(&:id)
    sessions = ActivitySession.where(user_id: students).includes(:concept_results)
    sessions = sessions.where.not(percentage: nil)
    # JUST BLOCKING THIS OUT FOR TESTING sessions = sessions.where(["completed_at > ?", 30.days.ago])
    # if sessions.count < 30
    #   return
    # end
    sessions = sessions.group_by(&:user_id)
    sessions.each do |u, s|
      total = s.sum(&:percentage)
      averages[u] = total/(sessions[u].count)
    end
    averages.sort_by{|user, score| score}[0..4].to_json
    end
  end


  def self.difficult_concepts
    h = Hash.new { |hash, key| hash[key] = {correct: 0, total: 0}}
    user = User.find user.id
    students = user.students.map(&:id)
    sessions = ActivitySession.where(user_id: students).includes(concept_results: :concept)
    sessions = sessions.where.not(percentage: nil)
    sessions.each do |s|
      s.concept_results.each do |cr|
        h[cr.concept.name][:correct] += cr.metadata["correct"]
        h[cr.concept.name][:total] += 1
      end
    end
    h.each{|k,v| v[:average] = v[:correct].to_f/v[:total]}
    h.sort_by{|k,v| v[:average]}[0..4].to_json
  end


end
