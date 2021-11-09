module Evidence
  class RulesController < ApiController
    before_action :set_rule, only: [:create, :show, :update, :destroy]
    append_before_action :set_lms_user_id, only: [:create, :update, :destroy]

    # GET /rules.json
    def index
      @rules = Evidence::Rule
      @rules = @rules.joins(:prompts_rules).where(comprehension_prompts_rules: {prompt_id: params[:prompt_id].split(',')}) if params[:prompt_id]
      @rules = @rules.where(rule_type: params[:rule_type]) if params[:rule_type]

      # some rules will apply to multiple prompts so we only want to return them once
      render json: @rules.distinct.all
    end

    # GET /rules/1.json
    def show
      render json: @rule
    end

    # POST /rules.json
    def create
      if @rule.save
        render json: @rule, status: :created
      else
        render json: @rule.errors, status: :unprocessable_entity
      end
    end


    # PATCH/PUT /rules/1.json
    def update
      if @rule.update(rule_params)
        head :no_content
      else
        render json: @rule.errors, status: :unprocessable_entity
      end
    end

    # DELETE /rules/1.json
    def destroy
      @rule.destroy
      head :no_content
    end

    def update_rule_order
      ordered_rules = ordered_rules_params[:ordered_rule_ids].map.with_index do |id, index|
        rule = Evidence::Rule.find_by_id(id)
        rule.suborder = index if rule
        rule
      end

      if ordered_rules.all? { |r| r&.valid? }
        ordered_rules.each { |r| r.save! }
        render(json: {status: 200})
      else
        render json: {error_messages: ordered_rules.map { |r| r&.errors }.join('; ')}, status: :unprocessable_entity
      end
    end

    private def set_rule
      if params[:id].present?
        # warning - the id param is getting used as both an id and a uid, which is an antipattern
        @rule = Evidence::Rule.find_by_uid(params[:id]) || Evidence::Rule.find_by_id(params[:id])
      else
        @rule = Evidence::Rule.new(rule_params)
      end
    end

    private def rule_params
      params.require(:rule).permit(:name, :note, :universal, :rule_type, :optimal, :state, :suborder, :concept_uid,
         prompt_ids: [],
         plagiarism_text_attributes: [:id, :text],
         regex_rules_attributes: [:id, :regex_text, :case_sensitive, :sequence_type, :conditional],
         label_attributes: [:id, :name, :state],
         feedbacks_attributes: [:id, :text, :description, :order, highlights_attributes: [:id, :text, :highlight_type, :starting_index, :_destroy]]
      )
    end

    private def ordered_rules_params
      params.permit(ordered_rule_ids: [])
    end

    private def set_lms_user_id
      @rule.lms_user_id = lms_user_id
    end
  end
end
