namespace :sync_lms_and_connect_flags do
  desc 'Get LMS Activity Flags and Sync with Firebase'
  task :sync => :environment do
    sync_lms_and_connect_flags
  end
end

def update_question_flags(questions, flag)
  questions.each do |q|
    url = "#{ENV["FIREBASE_URL"]}/v2/#{q['questionType']}/#{q['key']}/.json"
    HTTParty.patch(url, body: {flag: flag}.to_json)
  end
end

def standardized_flags(flag)
  standardization_map = {
    'Production' => 'production',
    'Beta' => 'beta',
    'Alpha' => 'alpha',
    'Archive' => 'archived'
  }
  standardization_map[flag] ? standardization_map[flag] : flag
end

def sync_lms_and_connect_flags
  uids_and_flags = HTTParty.get("#{ENV["LMS_URL"]}/api/v1/activities/uids_and_flags").parsed_response
  firebase_activities = HTTParty.get("#{ENV["FIREBASE_URL"]}/v2/lessons.json").parsed_response
  firebase_activities.each do |uid, val|
    url = "#{ENV["FIREBASE_URL"]}/v2/lessons/#{uid}/.json"
    lms_flag_obj = uids_and_flags[uid]

    if lms_flag_obj
      flag = lms_flag_obj['flag']
    else
      flag = val['flag'] ? standardized_flags(val['flag']) : 'alpha'
    end

    if val['questions']
      update_question_flags(val['questions'], flag)
    end

    HTTParty.patch(url, body: {flag: flag}.to_json)
  end


end
