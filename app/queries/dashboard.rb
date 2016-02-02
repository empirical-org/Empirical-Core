class Dashboard

  def self.queries(user)
    students = user.students.map(&:id)
    sessions = ActivitySession.where(user_id: students).includes(:concept_results)
    sessions = sessions.where.not(percentage: nil)
    ## we plan on limiting the timespan of this query
    #sessions = sessions.where(["completed_at > ?", 30.days.ago])


    # # JUST BLOCKING THIS OUT FOR TESTING
    # # if sessions.count < 30
    # #   return null
    # # end
    results = [{header: 'Struggling Students', results: struggling_students(sessions)},
              {header: 'Difficult Concepts', results: difficult_concepts(sessions)}]
  end

  def self.struggling_students(sessions)
    averages = {}
    sessions = sessions.group_by(&:user_id)
    sessions.each do |u, s|
      total = s.sum(&:percentage)
      averages[u] = total/(sessions[u].count)
    end
    averages = averages.sort_by{|user, score| score}[0..4]
    add_names_to_averages(averages)
  end

  def self.add_names_to_averages (averages)
    named_averages = {}
    averages.each{|k,v| named_averages[User.find(k).name] = v}
    named_averages
  end


  def self.difficult_concepts(sessions)
    h = Hash.new { |hash, key| hash[key] = {correct: 0, total: 0}}
    sessions.each do |s|
      s.concept_results.each do |cr|
        h[cr.concept.name][:correct] += cr.metadata["correct"]
        h[cr.concept.name][:total] += 1
      end
    end
    clean_concepts_hash(h)
  end

  def self.clean_concepts_hash(h)
    dif_concepts = {}
    h.each do |k,v|
      dif_concepts[k] = v[:correct].to_f/v[:total]
    end
    dif_concepts.sort_by{|k,v| v}[0..4].to_h
    ## TODO remove this line, it is just for local testing!
    dif_concepts = {"Commas in Addresses"=>0.5603448275862069, "Future Tense Verbs"=>0.6146496815286624, "Commas and Quotation Marks in Dialogue"=>0.6675977653631285, "That"=>0.7213114754098361, "Singular Possessive"=>0.7225325884543762}
  end


end
