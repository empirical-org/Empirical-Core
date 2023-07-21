# frozen_string_literal: true

namespace :update_scoring_for_demo_account_activity_sessions do
  desc 'updates scoring for demo account activity sessions to give full credit for optimal responses on any attempt'
  task :update => :environment do

    include PublicProgressReports

    REPLAYED_PAIR = [Demo::ReportDemoCreator::REPLAYED_ACTIVITY_ID, Demo::ReportDemoCreator::REPLAYED_SAMPLE_USER_ID]

    ACTIVITY_USER_PAIRS = Demo::ReportDemoCreator::ACTIVITY_PACKS_TEMPLATES.map {|hash| hash[:activity_sessions].map(&:to_a)}.flatten(2).push(REPLAYED_PAIR)

    activity_sessions =  ACTIVITY_USER_PAIRS.map do |id_pair|
      activity_id, user_id = id_pair

      ActivitySession.unscoped.find_by(activity_id: activity_id, user_id: user_id, is_final_score: true)
    end.compact

    activity_sessions.filter { |as| ActivityClassification::UNSCORED_KEYS.exclude?(as.classification.key) }.each do |as|
      concept_results = as.concept_results

      correct_questions = []

      grouped_concept_results = concept_results.group_by{ |cr| cr.question_number }

      grouped_concept_results.each do |key, cr|
        if get_score_for_question(cr) > 0
          cr.each { |concept_result| concept_result.update(question_score: 100) }
          correct_questions.push(cr)
        end
      end

      as.update(percentage: (correct_questions.length/grouped_concept_results.length.to_f).round(2))
    end
  end
end
