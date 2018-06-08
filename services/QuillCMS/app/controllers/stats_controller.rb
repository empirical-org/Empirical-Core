class StatsController < ApplicationController

  def question_health_index

    sql = """
      SELECT
        question_uid,
        COUNT(distinct id) as responses,
        SUM(CASE WHEN optimal IS null AND parent_id IS null THEN 1 ELSE 0 END) as unmatched_responses,
        COALESCE(SUM(count), 0) as total_attempts,
        SUM(CASE WHEN count > 4 THEN count ELSE 0 END) as common_matched_attempts,
        SUM(CASE WHEN optimal IS null AND parent_id IS null AND count > 4 THEN count ELSE 0 END) as common_unmatched_attempts,
        SUM(CASE WHEN optimal IS null AND parent_id IS null AND count > 4 THEN 1 ELSE 0 END) as common_unmatched_responses
      FROM responses
      WHERE question_uid IS NOT null
      GROUP BY question_uid
    """

    dashboard_data = ActiveRecord::Base.connection.execute(sql)
    dashboard_data_hash = {}
    firebase_url = ENV["FIREBASE_URL"] || 'https://quillconnectstaging.firebaseio.com'

    activities = HTTParty.get("#{firebase_url}/v2/lessons.json")

    dashboard_data.each do |x|
      question_uid = x["question_uid"]
      dashboard_data_hash[question_uid] = x
    end

    activities.each do |k, v|
      activity_obj = {uid: k, name: v['name']}
      if v['questions']
        v['questions'].each do |q|
          question_data = dashboard_data_hash[q['key']]
          if question_data && question_data['activities']
            dashboard_data_hash[q['key']]['activities'] = question_data['activities'].push(activity_obj)
          elsif question_data
            dashboard_data_hash[q['key']]['activities'] = [activity_obj]
          end
          puts dashboard_data_hash[q['key']]
        end
      end
    end

    HTTParty.put("#{firebase_url}/v2/datadash.json", body: dashboard_data_hash.to_json).body
    render json: :ok
  end

end
