require 'json'
require 'csv'
require 'zip'

@time = Time.now

namespace :responses do
  desc 'generate uids'
  task :import => :environment do
    import_from_firebase_json
  end

  task :import2 => :environment do
    import_columns_from_firebase_json
  end

  task :import3 => :environment do
    import_from_zip
  end

  task :stats => :environment do
    stats
  end

  task :dupes => :environment do
    dupes
  end

  task :destroy => :environment do
    Response.delete_all
  end

  task :convert => :environment do
    convert_to_csv
  end

  task :remove_uid => :environment do
    convert_parent_uid_to_parent_id
    remove_parent_uid_from_orphans
  end

  task :unstringify_concept_results => :environment do
    unstringify_concept_results
  end

  def import_from_firebase_json
    file_name = "lib/data/responses.json"
    file = File.read(file_name)
    data_hash = JSON.parse(file)

    val_array = []
    count = 0
    length_hash = Hash.new(0)
    length_count_hash = Hash.new(0)
    data_hash.each do |key, val|
      vals = {}
      vals["uid"] = key
      vals["parent_uid"] = val["parentID"]
      vals["question_uid"] = val["questionUID"]
      vals["text"] = val["text"] || ""
      vals["feedback"] = val["feedback"]
      vals["author"] = val["author"]
      vals["optimal"] = val["optimal"]
      vals["count"] = val["count"]
      vals["first_attempt_count"] = val["firstAttemptCount"]
      vals["child_count"] = val["childCount"]
      vals["concept_results"] = convert_concept_results(val["conceptResults"], val["createdAt"]) if val["conceptResults"]
      vals["created_at"] = val["createdAt"]
      if vals["text"].length <= 500
        val_array.push(vals)
      end
      if val_array.length == 1000
        begin
          Response.create(val_array)
        rescue ActiveRecord::RecordNotUnique
          nil
        end
        val_array = []
      end
    end
  end

  def import_columns_from_firebase_json
    file_name = "lib/data/responses.json"
    file = File.read(file_name)
    data_hash = JSON.parse(file)

    columns = ["uid", "parent_uid", "question_uid", "text", "feedback", "optimal", "author", "count", "first_attempt_count", "child_count", "concept_results"]
    val_array = []
    count = 0
    length_hash = Hash.new(0)
    length_count_hash = Hash.new(0)
    data_hash.each do |key, val|
      vals = []
      vals.push(key)
      vals.push val["parentID"]
      vals.push val["questionUID"]
      vals.push val["text"] || ""
      vals.push val["feedback"]
      vals.push val["author"]
      vals.push val["optimal"]
      vals.push val["count"]
      vals.push val["firstAttemptCount"]
      vals.push val["childCount"]
      vals.push val["conceptResults"] ? convert_concept_results(val["conceptResults"]).to_json : nil
      # vals.push val["createdAt"]
      if vals[3].length <= 500
        val_array.push(vals)
      end
      if val_array.length == 1000
        begin
          Response.transaction do
            Response.import columns, val_array, validate: false
          end
        rescue ActiveRecord::RecordNotUnique
          nil
        end
        val_array = []
      end
    end
  end

  def stats
    file_name = "lib/data/responses.json"
    file = File.read(file_name)
    data_hash = JSON.parse(file)

    val_array = []
    count = 0
    length_hash = Hash.new(0)
    length_count_hash = Hash.new(0)
    data_hash.each do |key, val|
      text = val["text"] || ""
      length_hash[text.length] += 1
      length_count_hash[text.length] += val["count"] || 0
      count += 1
      # if text.length > 500
      #   puts "Asshole says:"
      #   puts "#{text[0...150]}...#{text[-150...-1]}"
      # end
      if count % 1000 == 0
        puts "#{count/data_hash.length*100}% Complete"
      end

    end
    puts length_hash
    puts length_count_hash
  end

  def dupes
    file_name = "lib/data/responses.json"
    file = File.read(file_name)
    data_hash = JSON.parse(file)

    val_array = []
    count = 0
    dupes_hash = Hash.new(0)
    puts "count\tuniques\tdupes"
    data_hash.each do |key, val|
      text = val["text"] || ""
      dupes_hash["#{val['questionUID']}#{text}"] += 1
      count += 1
      # if text.length > 500
      #   puts "Asshole says:"
      #   puts "#{text[0...150]}...#{text[-150...-1]}"
      # end
      if count % 1000 == 0
        puts "#{count}\t#{dupes_hash.keys.length}\t#{count - dupes_hash.keys.length}"
      end

    end
    puts dupes_hash
  end

  # rubocop:disable Metrics/CyclomaticComplexity
  def convert_to_csv
    graded_file_name = "tmp/data/gradedResponses.json"
    graded_file = File.read(graded_file_name)
    graded_data_hash = JSON.parse(graded_file)
    file_name = "tmp/data/responses.json"
    file = File.read(file_name)
    data_hash = JSON.parse(file)
    dupes_hash = Hash.new(0)

    rows = []

    graded_data_hash.each do |key, val|
      text = val["text"] || ""
      if dupes_hash["#{val['questionUID']}#{text}"] == 0
        vals = []
        vals.push(key)
        vals.push val["parentID"]
        vals.push val["questionUID"]
        vals.push val["text"] || ""
        vals.push val["feedback"]
        vals.push val["author"]
        vals.push val["optimal"]
        vals.push val["count"]
        vals.push val["firstAttemptCount"]
        vals.push val["childCount"]
        vals.push val["conceptResults"] ? convert_concept_results(val["conceptResults"]).to_json : nil
        # vals.push val["createdAt"]
        if vals[3].length <= 500
          rows.push(vals)
        end
      end
      dupes_hash["#{val['questionUID']}#{text}"] += 1
    end
    data_hash.each do |key, val|
      text = val["text"] || ""
      if dupes_hash["#{val['questionUID']}#{text}"] == 0
        vals = []
        vals.push(key)
        vals.push val["parentID"]
        vals.push val["questionUID"]
        vals.push val["text"] || ""
        vals.push val["feedback"]
        vals.push val["author"]
        vals.push val["optimal"]
        vals.push val["count"]
        vals.push val["firstAttemptCount"]
        vals.push val["childCount"]
        vals.push val["conceptResults"] ? convert_concept_results(val["conceptResults"]).to_json : nil
        # vals.push val["createdAt"]
        if vals[3].length <= 500
          rows.push(vals)
        end
      end
      dupes_hash["#{val['questionUID']}#{text}"] += 1
    end

    CSV.open('respforpostgres.csv', 'wb') do |csv|
      rows.each do |row|
        csv << row
      end;0
    end;0

  end
  # rubocop:enable Metrics/CyclomaticComplexity

  def import_from_zip
    Zip::File.open('respforpostgres.csv.zip') do |zip_file|
      # Handle entries one by one
      zip_file.each do |entry|
        # Extract to file/directory/symlink
        puts "Extracting #{entry.name}"
        entry.extract("tmp/tmp.csv")

        # Read into memory
        # content = entry.get_input_stream.read
        File.open('tmp/tmp.csv', 'r') do |file|
          csv = CSV.new(file)
          sum = 0
          rows = []
          columns = ["uid", "parent_uid", "question_uid", "text", "feedback", "author", "optimal", "count", "first_attempt_count", "child_count", "concept_results"]
          cr_index = columns.length - 1
          while row = csv.shift
            row[cr_index] = parse_concept_results(row[cr_index])
            rows.push row

            if rows.length == 1000
              begin
                Response.transaction do
                  Response.import columns, rows, validate: false;0
                end;0
              rescue ActiveRecord::RecordNotUnique
                nil
              end
              rows = []
            end
          end

          puts "Done"
        end
      end

      # Find specific entry
      # entry = zip_file.glob('*.csv').first
      # puts entry.get_input_stream.read
    end
  end

  def unstringify_concept_results
    Response.where.not(concept_results: nil, optimal: nil).in_batches do |batch|;
      batch.each do |response|
        if response.concept_results.instance_of?(String)
          begin
            response.update({concept_results: JSON.parse(response.concept_results)})
          rescue JSON::ParserError
            puts response.id
            response.update({concept_results: nil})
          end
        end
      end
    end
  end

  def parse_concept_results(concept_results)
    return unless concept_results.instance_of?(String)

    JSON.parse(concept_results)
  rescue JSON::ParserError
    nil
  end

  def convert_parent_uid_to_parent_id

    parents = Response.where.not(optimal: nil).select(:id, :uid)
    parents_hash = {}
    parents.each do |par|
      parents_hash[par.uid] = par.id
    end
    parents = []

    responses_to_update = []

    parents_hash.each do |p_uid, p_id|
      Response.where(parent_uid: p_uid).update_all(parent_id: p_id)
    end

    # Response.where.not(parent_uid: nil).each do |response|
    #   response.parent_id = parents_hash[response.parent_uid]
    #   responses_to_update.push response
    #   if responses_to_update.length == 1000
    #     Response.builk
    # #     begin
    # #
    # #       Response.transaction do
    # #         Response.import columns, responses_to_update, validate: false
    # #       end
    # #
    # #     rescue ActiveRecord::RecordNotUnique
    # #     end
    #     responses_to_update = []
    #   end
    # end
  end

  def remove_parent_uid_from_orphans
    Response.where(parent_id: nil).where.not(parent_uid: nil).update_all({parent_uid: nil})
  end

  def convert_concept_results(concept_results={})
    begin
      new_h = {}
      concept_results.each do |k,v|
        new_h[v['conceptUID']] = v['correct']
      end
      new_h
    rescue NoMethodError
      begin
        new_h = {}
        new_h[concept_results[0]['conceptUID']] = concept_results[0]['correct']
        new_h
      rescue NoMethodError
        nil
      end
    end
  end
end
