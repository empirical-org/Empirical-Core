class RuleFeedbackHistory
    def self.generate_report(conj)

    
        # prompts = Comprehension::Prompt.where(conjunction: 'so')
        rules = Comprehension::Rule.find_by_sql(
            "select * from comprehension_rules as rules \
            INNER JOIN comprehension_prompts_rules as prompts_rules ON rules.id = prompts_rules.rule_id \
            INNER JOIN comprehension_prompts as prompts ON prompts_rules.prompt_id = prompts.id \ 
            WHERE conjunction = '#{conj}'
        ")        

        prepare_sql_results(rules)
    end

    def self.prepare_sql_results(relations)
        # api_order: 1, -> suborder
        # api_name: element of Enum<API_NAMES>, -> rule.rule_type
        # rule_order: 1,
        # feedback_first_layer, -> rule.feedbacks.first
        # rule_description: "A lovely rule" -> rule.description
        # pct_strong: 0.85
        # total_responses: 100, -> calculable
        # scored_responses: 100, -> hardcode to 0
        # pct_scored: 1.00 -> hardcode to 0

        relations
    end

end