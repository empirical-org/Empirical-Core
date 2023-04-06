# frozen_string_literal: true

module Evidence
  module Grammar
    class FeedbackAssembler < Evidence::FeedbackAssembler
      RULE_MAPPING = {
        'accept_vs_except' => '99257c28-9281-4ace-a131-952719f56a17',
        'advise_vs_advice' => 'da27c3fe-67cc-471f-974e-b89743be6fc1',
        'affect_vs_effect' => 'aad27eb2-9ca4-417a-82dc-ba31f7417ef1',
        'allcaps' => 'a9e29976-3d99-4db2-a209-e215e2c3e34a',
        'alot_instead_of_a_lot' => '3072b56a-d995-4611-a1f8-90bc14f66c9a',
        'an_instead_of_and' => 'c3d22cec-edf0-494e-944e-e4defe24499d',
        'apart_vs_a_part' => '94a8b3e4-1aa9-4f9d-bf6a-09b75be68e77',
        'articles_a_optimal' => '4c2962f1-03c4-449c-b821-8213688a9aa1',
        'articles_an_optimal' => '04b69d41-f235-4a98-9fcd-1e8677961a2e',
        'cite_vs_sight_vs_site' => '110da2cc-9acd-43e9-a137-774b3b994f08',
        'contractions' => '112cc9e1-75db-47ab-9be1-7b9084838575',
        'council_vs_counsel' => '31c3118f-0952-485b-8318-c3feba9fb5c4',
        'extra_space' => '51199c73-2f78-4b65-b607-a1e15d9b0870',
        'fragment_no_subj' => '02abb262-e28c-4e95-a7a9-820adee2a9a5',
        'fragment_no_verb' => '973998ce-17af-4bf7-8a8e-4374c31376eb',
        'further_vs_farther' => 'ba42ab74-e0f8-4abe-998e-e11ffeb060a5',
        'incorrect_infinitive' => 'ab45e277-91a3-4bea-a050-d3aa2c923e4f',
        'incorrect_infinitive_ing' => 'f5bee655-e47b-4224-961b-b3db9b31141a',
        'incorrect_infinitive_past' => 'cf520ac5-ef09-4fd5-bfd4-3e99184a6104',
        'incorrect_preposition' => 'b65360a3-5571-432c-b0bc-7d169096e77d',
        'in_regards_to' => 'b5068c7d-30f7-496b-832e-a6eca792ffe5',
        'irregular_plural_nouns' => '2d628fc1-7ce4-4205-a2bc-1469207b9683',
        'its_versus_it_s_it_s_optimal' => '8d8fe106-e0a5-440a-8bd4-4e34d8d0a16e',
        'its_versus_it_s_its_optimal' => 'f8d7863a-e52f-4d05-9b81-994c16004315',
        'lead_vs_led' => 'da9ded20-284d-4ceb-bb8a-c44623b26415',
        'missing_hyphen' => 'da2b9bac-6109-40a7-a0d5-cdd6a2d148fb',
        'missing_preposition_after_stat' => '569cd321-9dc1-4359-8941-e8b417bda2a4',
        'loose_vs_lose' => '32e8ab57-269a-45aa-9394-95f94e5020b7',
        'passed_vs_past' => 'c745ca1f-b94f-41ea-912a-2012cc654056',
        'past_instead_of_participle' => 'c745ca1f-b94f-41ea-912a-2012cc654055',
        'plural_versus_possessive_nouns_plural_noun_optimal' => 'a75f910d-fad0-4552-8985-1f989b92770e',
        'plural_versus_possessive_nouns_possessive_noun_optimal' => 'a3ecaca2-82c1-463e-9d31-8a73b69498d1',
        'punctuation' => 'c37fd0d2-4342-41e1-a628-b9381effdefa',
        'repeated_conjunction' => 'f68c5847-9bc9-4f9f-80bf-07ddae7cbc38',
        'repeated_word' => '98e19806-c3a2-4ea7-926d-50a0dead43d8',
        'runon' => '67b52a0e-9641-4e66-a9cc-7468ea8e8220',
        'runon_with_conjunctive_adverb' => '4344e40e-9594-4d87-9607-ba7c5693e8a3',
        'singular_and_plural_nouns' => '41ddcd4c-fe53-491c-8d94-a13da0ef28de',
        'singular_and_plural_nouns_no_determiner' => '38713885-37a3-40ac-af33-f2cf6a9ad2d1',
        'singular_and_plural_nouns_these_those' => '0c1cb8f7-480d-4aab-809c-e6a9adacef7a',
        'singular_and_plural_possessive' => '7c1f5d33-d119-425c-b2c8-391bfa524d1d',
        'singular_and_plural_possessive_irregular' => 'a775c5a7-c427-45b1-8031-bfaa0f3d773e',
        'singular_and_plural_possessive_regular' => 'b81fca3b-e12d-4ea3-afb0-e64c91e633c1',
        'spacing' => 'c745ca1f-b94f-41ea-912a-2012cc654054',
        'starts_with_punctuation' => '0a8d1d20-e7e0-493c-9fa1-29d4facb5dfe',
        'subject_verb_agreement_with_inversion' => '7527808d-c73f-4f8a-9b0c-7364f6b13132',
        'subject_verb_agreement_with_personal_pronoun' => 'dad4d9a7-2bfc-48d7-b87d-5c747a7d9493',
        'subject_verb_agreement_with_indefinite_pronoun' => 'dbe36e70-a523-4442-894b-82f88d1e34ad',
        'subject_verb_agreement_with_indefinite_pronoun_plural_indefinite_pronoun_with_regular_present_tense_plural_verb_optimal_and_error_is_regular_present_tense_singular_verb' => '0bf34376-6ee7-48fa-a7c8-281a385b4cfa',
        'subject_verb_agreement_with_indefinite_pronoun_plural_indefinite_pronoun_with_plural_to_be_verb_optimal_and_error_is_singular_to_be_verb' => '34a70532-eed6-43a2-9a24-d4f2d4029e37',
        'subject_verb_agreement_with_indefinite_pronoun_plural_indefinite_pronoun_with_plural_to_have_verb_optimal_and_error_is_singular_to_have_verb' => '0b495025-127a-48fc-871a-171a90a3bd2a',
        'subject_verb_agreement_with_indefinite_pronoun_singular_indefinite_pronoun_with_singular_to_be_verb_optimal_and_error_is_plural_to_be_verb' => 'd53fcd0c-58b4-4acf-a051-5ff6581af21f',
        'subject_verb_agreement_with_indefinite_pronoun_singular_indefinite_pronoun_with_singular_to_have_verb_optimal_and_error_is_plural_to_have_verb' => 'c0d5181b-8bcf-478e-9b41-aeea4454c178',
        'subject_verb_agreement_with_indefinite_pronoun_singular_indefinite_pronoun_with_regular_singular_verb_optimal_and_error_is_regular_plural_verb' => 'a555b194-0acc-452f-98ce-73f321a07ca3',
        'subject_verb_agreement_with_personal_pronoun_plural_pronoun_with_plural_to_be_verb_optimal_and_error_is_singular_to_be_verb' => '54392aec-f671-4970-bdb8-457e546e477a',
        'subject_verb_agreement_with_personal_pronoun_plural_pronoun_with_plural_to_have_verb_optimal_and_error_is_singular_to_have_verb' => '4e3deee9-278e-40d0-85af-c8be60cc5d59',
        'subject_verb_agreement_with_personal_pronoun_plural_pronoun_with_regular_present_tense_plural_verb_optimal_and_error_is_regular_present_tense_singular_verb' => 'fe0bb27b-3682-4470-a3da-738a8748f6aa',
        'subject_verb_agreement_with_personal_pronoun_singular_pronoun_with_regular_singular_verb_optimal_and_error_is_regular_plural_verb' => '8c3f2265-2677-403d-b1f6-6ef6c11c3920',
        'subject_verb_agreement_with_personal_pronoun_singular_pronoun_with_singular_to_be_verb_optimal_and_error_is_plural_to_be_verb' => 'a6e430c4-3f3c-4e54-ae43-97e236765afe',
        'subject_verb_agreement_with_personal_pronoun_singular_pronoun_with_singular_to_have_verb_optimal_and_error_is_plural_to_have_verb' => '1801060c-c459-4a9d-aef5-a8be4b4dbd0a',
        'subject_verb_agreement_with_simple_noun' => '3f43f0b8-3859-40b3-b642-c00662c966c1',
        'subject_verb_agreement_with_simple_noun_plural_noun_with_plural_to_be_verb_optimal_and_error_is_singular_to_be_verb' => '602596df-3d36-43b6-a706-ecb57cf6e92f',
        'subject_verb_agreement_with_simple_noun_plural_noun_with_plural_to_have_verb_optimal_and_error_is_singular_to_have_verb' => '9312b980-a0f8-435f-af32-5f421c02cc88',
        'subject_verb_agreement_with_simple_noun_plural_noun_with_regular_present_tense_plural_verb_optimal_and_error_is_regular_present_tense_singular_verb' => 'bda6e9ba-fc5c-4a73-8edf-e4efdd74ce66',
        'subject_verb_agreement_with_simple_noun_singular_noun_with_regular_singular_verb_optimal_and_error_is_regular_plural_verb' => '20569caf-fb4f-4ece-948f-411a5017a0b2',
        'subject_verb_agreement_with_simple_noun_singular_noun_with_singular_to_be_verb_optimal_and_error_is_plural_to_be_verb' => '4f4d04b4-254f-437d-923c-97e0fbacebf3',
        'subject_verb_agreement_with_simple_noun_singular_noun_with_singular_to_have_verb_optimal_and_error_is_plural_to_have_verb' => '3feb708d-b789-42dc-8b7a-7288a0945fff',
        'than_versus_then_than_optimal' => '4aa3f48b-7be9-414b-91e0-ffa92c85f323',
        'than_versus_then_then_optimal' => 'ad97bd7a-1215-4c52-91ec-8973d646a381',
        'their_vs_there_vs_they_re_they_re_optimal' => 'e4cf078b-a838-445e-a873-c795da9f7ed8',
        'their_vs_there_vs_they_re_their_optimal' => '6ca8f080-c4a2-470e-8171-0fa72f0b18da',
        'their_vs_there_vs_they_re_there_optimal' => 'f257a25f-8bc3-46ce-b811-82cbd98fad2a',
        'there_no' => 'd1ffc7b1-12a6-43c5-9eb8-593215a04eb5',
        'through_vs_threw_vs_thru' => '1f3cff3f-47ef-4e92-b7d5-9867cb4f3dff',
        'to_vs_too_vs_two' => '1522516d-4bdb-4cd1-8f90-30f4f4be3f30',
        'who_s_vs_whose' => 'b4d8997f-736b-41fc-92c5-b410981b43cb'
      }


      EXCEPTIONS = [
        "cloning mammals",
        "united states",
        "texas"
      ]

      def self.run(client_response:, previous_feedback: [])
        error = client_response[error_name]
        return default_payload if contains_exception?(client_response) || error.empty?

        rule_uid = error_to_rule_uid.fetch(error)
        rule = Evidence::Rule.where(uid: rule_uid).includes(:feedbacks).first
        feedback = rule.determine_feedback_from_history(previous_feedback)

        default_payload.merge({
          'concept_uid': rule&.concept_uid,
          'feedback': feedback&.text,
          'optimal': rule&.optimal.nil? ? true : rule&.optimal,
          'highlight': client_response['highlight'],
          'rule_uid': rule&.uid,
          'hint': rule&.hint
        })
      end

      def self.contains_exception?(client_response)
        highlights = client_response[Evidence::Grammar::Client::HIGHLIGHT_KEY]

        highlight_texts(highlights).any?{|h| EXCEPTIONS.any? {|e| h.match(e.downcase)}}
      end

      def self.highlight_texts(highlights)
        highlights
          &.map {|hash| hash['text']}
          &.compact
          &.map(&:downcase)
      end

      def self.error_to_rule_uid
        RULE_MAPPING
      end

      def self.default_payload
        super.merge({'feedback_type' => 'grammar'})
      end

      def self.error_name
        Evidence::Grammar::Client::ERROR_KEY
      end
    end
  end
end
