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
    dashboard_data.each {|x| dashboard_data_hash[x["question_uid"]] = x}
    HTTParty.put("#{ENV["FIREBASE_URL"]}/v2/datadash.json", body: dashboard_data_hash.to_json).body
    render json: :ok
  end

end
