module Demo::ConceptResults

  def self.create_from_classrooms(classrooms)
    activity_sessions = classrooms
                            .map(&:students).flatten
                            .map(&:activity_sessions).flatten

    data_from_csv = self.get_data_from_csv

    crs = activity_sessions.each do |as|
      self.create_concept_results_for_activity_session(data_from_csv, as)
    end
  end

  #private

  def self.create_concept_results_for_activity_session(data_from_csv, activity_session)
    data = data_from_csv.find{ |ele| ele[:activity] == activity_session.activity.name }
    crs = data[:concept_result_data].reduce([]) do |acc, ele|
      crs_for_concept = self.create_concept_results_for_concept(ele[:concept],
                                                                ele[:number_of_concept_results],
                                                                activity_session)
      new_acc = [].concat(acc).concat(crs_for_concept)
      new_acc
    end
    crs = self.handle_scores(activity_session)
  end

  def self.handle_scores(activity_session)
    crs = activity_session.reload.concept_results
    percentage = activity_session.percentage
    num_correct = (percentage*crs.count).ceil
    shuffled = crs.shuffle
    correct = shuffled[0..(num_correct-1)]
    incorrect = shuffled[num_correct..((shuffled.length) - 1)]
    correct.map{ |c| self.update_metadata(c, :correct, 1) }
    incorrect.map{ |c| self.update_metadata(c, :correct, 0) }

    new_percentage = num_correct.to_f / crs.count.to_f
    activity_session.update(percentage: new_percentage)
    crs
  end

  def self.update_metadata(concept_result, key, value)
    new_metadata = concept_result.metadata
    new_metadata[key] = value
    concept_result.update(metadata: new_metadata.to_json)
    concept_result
  end

  def self.create_concept_results_for_concept(concept_name, number_of_concept_results, activity_session)
    concept = Concept.find_or_create_by(name: concept_name)
    crs = []
    number_of_concept_results.to_i.times do |i|
      cr = ConceptResult.find_or_create_by(concept: concept, activity_session: activity_session)
      cr.update(metadata: {}.to_json)
      crs.push(cr)
    end
    crs
  end


  def self.get_data_from_csv
    # OUTPUT:
    # [
    #   {
    #     activity: String,
    #     concept_result_data: [
    #       {concept: String, number_of_concept_results: Integer}
    #     ]
    #   }
    # ]
    arr = self.turn_csv_into_arr
    processed = self.process_arr(arr)
  end

  def self.process_arr(arr)
    processed = arr.reduce([]) do |acc, ele|
      extant = acc.find{|x| x[:activity] == ele[:activity]}
      if extant.present?
        crd = extant[:concept_result_data]
        new_acc = acc.reject{|y| y == extant}
      else
        crd = []
        new_acc = [].concat(acc)
      end

      new_crd_hash = {concept: ele[:concept], number_of_concept_results: ele[:number_of_concept_results]}
      new_crd = [].concat(crd).push(new_crd_hash)
      new_hash = {activity: ele[:activity], concept_result_data: new_crd}
      new_new_acc = [].concat(new_acc).push(new_hash)
      new_new_acc
    end
    processed
  end

  def self.turn_csv_into_arr
    file = Rails.root.join('db', 'data', 'demo_data_for_concept_results.csv')
    arr = []
    CSV.foreach(file, headers: true) do |row|
      activity = row['activity']
      concept  = row['concept']
      number_of_concept_results = row['avg_number_of_concept_results_per_activity_session']
      hash = {activity: activity, concept: concept, number_of_concept_results: number_of_concept_results}
      arr.push(hash)
    end
    arr
  end
end
