# frozen_string_literal: true

require_dependency 'evidence/application_controller'

module Evidence
  class ActivitiesController < ApiController
    before_action :set_activity, only: [:activity_versions, :create, :show, :update, :destroy, :seed_data, :change_logs, :labeled_synthetic_data, :topic_optimal_info]
    before_action :set_lms_user_id, only: [:create, :destroy, :update]

    # GET /activities.json
    def index
      @activities = Evidence::Activity.order(:title).map { |a| a.serializable_hash(include: []) }

      render json: @activities
    end

    # GET /activities/1.json
    def show
      render json: @activity
    end

    # POST /activities.json
    def create
      if @activity.save
        changelog_params = {
          action: Evidence.change_log_class::EVIDENCE_ACTIONS[:create],
          changed_record_type: 'Evidence::Activity',
          changed_record_id: @activity.id,
          user_id: lms_user_id,
          explanation: "Activity Created",
          changed_attribute: 'version',
          previous_value: "0",
          new_value: "1"
        }
        Evidence.change_log_class.create!(changelog_params)
        render json: @activity, status: :created
      else
        render json: @activity.errors, status: :unprocessable_entity
      end
    end

    # PATCH/PUT /activities/1.json
    def update
      if @activity.update(activity_params)
        head :no_content
      else
        render json: @activity.errors, status: :unprocessable_entity
      end
    end

    def increment_version
      @activity = Evidence::Activity.find(params[:id])
      old_version = @activity.version
      @activity.increment_version!

      changelog_params = {
        action: 'updated',
        changed_record_type: 'Evidence::Activity',
        changed_record_id: @activity.id,
        explanation: increment_version_params,
        changed_attribute: 'version',
        previous_value: old_version,
        new_value: @activity.version
      }
      Evidence.change_log_class.create!(changelog_params)
      head :no_content
    end

    # DELETE /activities/1.json
    def destroy
      @activity.destroy
      head :no_content
    end

    # GET /activities/1/rules.json
    def rules
      @activity = Evidence::Activity.includes(
        prompts: { rules: [:plagiarism_texts, { feedbacks: :highlights }, :label, :regex_rules, :hint, :prompts]}
      ).find(params[:id])
      rules = @activity.prompts&.map {|p| p.rules}&.flatten&.uniq
      render json: rules
    end

    # GET /activities/1/change_logs.json
    def change_logs
      render json: @activity&.change_logs_for_activity || []
    end

    def activity_versions
      render json: @activity&.activity_versions
    end

    # params [:id, nouns:, label_configs]
    def seed_data
      nouns_array = seed_data_params[:nouns]
        .split(',')
        .select(&:present?)
        .map(&:strip)
        .uniq

      label_configs = seed_data_params[:label_configs]&.to_h || {}

      use_passage_param = ActiveModel::Type::Boolean.new.cast(seed_data_params[:use_passage])
      # default to true for missing param
      use_passage = use_passage_param.nil? ? true : use_passage_param

      Evidence::ActivitySeedDataWorker.perform_async(@activity.id, nouns_array, label_configs, use_passage)

      head :no_content
    end

    # params [:id, :filenames]
    def labeled_synthetic_data
      (params[:filenames] || []).each do |filename|
        Evidence::SyntheticLabeledDataWorker.perform_async(filename, @activity.id)
      end

      head :no_content
    end

    # params [:id]
    def topic_optimal_info
      prompt_concept_uids = @activity.prompts.map do |prompt|
        automl_rules = prompt.rules.filter { |rule| rule.rule_type == Evidence::Rule::TYPE_AUTOML && rule.optimal }
        # Our expectation is that all AutoML rules for a given prompt have
        # the same concept_uid, so this should always extract the correct
        # value
        automl_concept_uid = automl_rules.map(&:concept_uid).uniq.first

        [prompt.id, automl_concept_uid]
      end.to_h

      # This is hard-coded because I couldn't figure out a clean way to
      # generate it dynamically.  This is basically the items in
      # Evidence::Check::ALL_CHECKS array cross referenced against the
      # Evdience::Rule::TYPES array.
      topic_optimal_rule_types = [
        'rules-based-2',
        'grammar',
        'spelling',
        'rules-based-3'
      ]

      render json: {
        concept_uids: prompt_concept_uids,
        rule_types: topic_optimal_rule_types
      }
    end

    private def set_activity
      if params[:id].present?
        @activity = Evidence::Activity.find(params[:id])
      else
        @activity = Evidence::Activity.new(activity_params)
        @activity.version = 1
      end
    end

    private def set_lms_user_id
      @activity.lms_user_id = lms_user_id
    end

    private def increment_version_params
      params.require(:note)
    end

    private def seed_data_params
      params.permit(:id, :nouns, :use_passage, label_configs: {}, activity: {})
    end

    private def activity_params
      params.require(:activity).permit(
        :title,
        :notes,
        :parent_activity_id,
        :target_level,
        :scored_level,
        :flag,
        passages_attributes: [:id, :text, :image_link, :image_alt_text, :image_caption, :image_attribution, :highlight_prompt, :essential_knowledge_text],
        prompts_attributes: [:id, :conjunction, :text, :max_attempts, :max_attempts_feedback, :first_strong_example, :second_strong_example]
      )
    end
  end
end
