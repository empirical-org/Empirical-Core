class Dashboard

  def self.queries(user)
    get_redis_values(user)
    strug_stud = @@cached_strug_stud
    diff_con = @@cached_diff_con
    unless @@cached_strug_stud && @@cached_diff_con
      students = user.students.map(&:id)
      sessions = ActivitySession.where(user_id: students).includes(:concept_results)
      sessions = sessions.where.not(percentage: nil)
      # we plan on limiting the timespan of this query
      # sessions = sessions.where(["completed_at > ?", 30.days.ago])
      if sessions.count == 0 || nil
        return
      end
      if sessions.count > 30
        # teacherISteacher_id
        diff_con ||= difficult_concepts(sessions)
        strug_stud ||= lowest_performing_students(sessions)
        if diff_con.length == 0
          diff_con = 'insufficient data'
        end
      else
        strug_stud = 'insufficient data'
        diff_con = 'insufficient data'
      end
    end
    set_cache_if_empty(strug_stud, diff_con, user)
    results = [
              {header: 'Lowest Performing Students', results: strug_stud, placeholderImg: '/lowest_performing_students_no_data.png'},
              {header: 'Difficult Concepts', results: diff_con, placeholderImg: '/difficult_concepts_no_data.png'}]
  end

  private

  def self.lowest_performing_students(sessions)
    averages = {}
    sessions = sessions.group_by(&:user_id)
    sessions.each do |u, s|
      total = s.sum(&:percentage)
      # if they have a zero, it is probably because of connect and we don't want
      # to hold that against them
      if total > 0
        averages[User.find(u).name] = ((total/sessions[u].count)*100).round
      end
    end
    averages.sort_by{|user, score| score}[0..4].to_h
  end



  def self.difficult_concepts(sessions)
    h = Hash.new { |hash, key| hash[key] = {correct: 0, total: 0}}
    sessions.each do |s|
      s.concept_results.each do |cr|
        h[cr.concept_id][:correct] += cr.metadata["correct"]
        h[cr.concept_id][:total] += 1
      end
    end
    clean_concepts_hash(h)
  end

  def self.clean_concepts_hash(h)
    diff_concepts = {}
    h.each do |k,v|
      percentage = ((v[:correct].to_f/v[:total])*100).to_i
      if percentage > 0
        diff_concepts[Concept.find(k).name] = ((v[:correct].to_f/v[:total])*100).to_i
      end
    end
    diff_concepts.sort_by{|k,v| v}[0..4].to_h
    ## Line below if for local testing where concept results aren't always accessible
    # diff_concepts = {"Commas in Addresses"=>56, "Future Tense Verbs"=>61, "Commas and Quotation Marks in Dialogue"=>66, "That"=>72, "Singular Possessive"=>72}
  end
  def self.set_cache_if_empty(strug_stud, diff_con, user)
    unless @@cached_strug_stud || strug_stud == 'insufficient data'
      $redis.set("user_id:#{user.id}_struggling_students", strug_stud, {ex: 16.hours})
    end
    unless @@cached_diff_con || diff_con == 'insufficient data'
      $redis.set("user_id:#{user.id}_difficult_concepts", diff_con, {ex: 16.hours})
    end
  end

  def self.get_redis_values(user)
    strug_stud = $redis.get("user_id:#{user.id}_struggling_students")
    diff_con = $redis.get("user_id:#{user.id}_difficult_concepts")
    # don't use cache if it doesn't exist or is blank
    @@cached_strug_stud = strug_stud.nil? || strug_stud&.blank? ? nil : eval(strug_stud)
    @@cached_diff_con = diff_con.nil? || diff_con&.blank? ? nil : eval(diff_con)
  end


end
