require 'json'

@time = Time.now

namespace :responses do
  desc 'generate uids'
  task :import => :environment do
    import_from_firebase_json
  end

  task :destroy => :environment do
    Response.delete_all
  end

  def import_from_firebase_json
    file_name = "lib/data/gradedResponses.json"
    file = File.read(file_name);0
    data_hash = JSON.parse(file);0

    data_hash.each do |key, val|
      vals = {}
      vals["uid"] = key
      vals["parent_uid"] = val["parentID"]
      vals["question_uid"] = val["questionUID"]
      vals["text"] = val["text"]
      vals["feedback"] = val["feedback"]
      vals["author"] = val["author"]
      vals["optimal"] = val["optimal"]
      vals["count"] = val["count"]
      vals["first_attempt_count"] = val["firstAttemptCount"]
      vals["child_count"] = val["childCount"]
      vals["concept_results"] = convert_concept_results(val["conceptResults"], val["createdAt"]) if val["conceptResults"]
      vals["created_at"] = val["createdAt"]

      begin
        Response.create(vals)
      rescue ActiveRecord::RecordNotUnique
      end
    end

  end

  def convert_concept_results(concept_results={}, created_at)
    begin
      new_h = {}
      concept_results.each do |k,v|
        new_h[v['conceptUID']] = v['correct']
      end
      new_h
    rescue NoMethodError
      new_h = {}
      new_h[concept_results[0]['conceptUID']] = concept_results[0]['correct']
      new_h
    end
  end
end
