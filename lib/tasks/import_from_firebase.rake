require 'json'

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
      vals["concept_results"] = val["conceptResults"]
      vals["created_at"] = val["createdAt"]

      begin
        Response.create(vals)
      rescue ActiveRecord::RecordNotUnique
      end

    end
  end
end


# "-KcZgRckW7dkIkS_pejV":
#   "conceptResults":{
#     "-Kjs8kdzCgHAXiL_9Bg8":{"conceptUID":"S8b-N3ZrB50CWgxD5yg8yQ","correct":true},
#     "-Kjs8mF4kQT2FnXt2ynx":{"conceptUID":"o1yvrCpaYu0r-jqogv7PBw","correct":false}
#   },
#   "count":3,
#   "createdAt":"1486674314949",
#   "feedback":"<p><em>When</em> works well in this sentence. Nice! Now try writing your sentence in a different way. Use the hint as an example.<br>\n</p>",
#   "gradeIndex":"human-KcZgRckW7dkIkS_pejV",
#   "optimal":false,
#   "questionUID":"-KR_MSvF1pXP47auHtrm",
#   "text":"The ocean air was salty, when he inhaled it.",
#   "weak":false
# }
