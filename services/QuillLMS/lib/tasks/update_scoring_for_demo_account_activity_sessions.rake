# frozen_string_literal: true

namespace :update_scoring_for_demo_account_activity_sessions do
  desc 'updates scoring for demo account activity sessions to give full credit for optimal responses on any attempt'
  task :update => :environment do

    include PublicProgressReports

    REPLAYED_PAIR = [Demo::ReportDemoCreator::REPLAYED_ACTIVITY_ID, Demo::ReportDemoCreator::REPLAYED_SAMPLE_USER_ID]

    ACTIVITY_USER_PAIRS = Demo::ReportDemoCreator::ACTIVITY_PACKS_TEMPLATES.map {|hash| hash[:activity_sessions].map(&:to_a)}.flatten(2).push(REPLAYED_PAIR)

    fetch_activity_sessions(ACTIVITY_USER_PAIRS)
      .reject { |activity_session| ActivityClassification::UNSCORED_KEYS.include?(activity_session.classification.key) }
      .each { |activity_session|  update_activity_session_percentage(activity_session) }
  end

  def fetch_activity_sessions(id_pairs)
    id_pairs.map do |activity_id, user_id|
      ActivitySession.unscoped.find_by(activity_id: activity_id, user_id: user_id, is_final_score: true)
    end.compact
  end

  def update_activity_session_percentage(activity_session)
    correct_questions_count = 0
    grouped_concept_results = activity_session.concept_results.group_by(&:question_number)

    grouped_concept_results.each_value do |concept_results|
      if get_score_for_question(concept_results) > 0
        concept_results.each { |cr| cr.update(question_score: 100) }
        correct_questions_count += 1
      end
    end

    activity_session.update(percentage: (correct_questions_count.to_f / grouped_concept_results.size).round(2))
  end

end
