module Evidence 
  module Grammar
    class FeedbackAssembler < Evidence::FeedbackAssembler
      def self.error_to_rule_uid 
        { } 
      end

      def self.default_payload
        super.merge({'feedback_type' => 'grammar'})
      end
    end
    
  end
end
