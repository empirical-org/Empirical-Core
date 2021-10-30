module Evidence 
  module Grammar
    class FeedbackAssembler < Evidence::FeedbackAssembler
      RULE_MAPPING = {
        "accept_vs_except" => '99257c28-9281-4ace-a131-952719f56a17',
        "advise_vs_advice" => 'da27c3fe-67cc-471f-974e-b89743be6fc1',
        "affect_vs_effect" => 'aad27eb2-9ca4-417a-82dc-ba31f7417ef1',
        "allcaps" => 'a9e29976-3d99-4db2-a209-e215e2c3e34a',
        "apart_vs_a_part" => '94a8b3e4-1aa9-4f9d-bf6a-09b75be68e77',
        "articles_-_a_optimal" => '4c2962f1-03c4-449c-b821-8213688a9aa1',
        "articles_-_an_optimal" => '04b69d41-f235-4a98-9fcd-1e8677961a2e',
        "cite_vs_sight_vs_site" => '110da2cc-9acd-43e9-a137-774b3b994f08',
        "contractions" => '112cc9e1-75db-47ab-9be1-7b9084838575',
        "council_vs_counsel" => '31c3118f-0952-485b-8318-c3feba9fb5c4',
        "further_vs_farther" => 'ba42ab74-e0f8-4abe-998e-e11ffeb060a5',
        "in_regards_to" => 'b5068c7d-30f7-496b-832e-a6eca792ffe5',
        "its_versus_it's_-_it's_optimal" => '8d8fe106-e0a5-440a-8bd4-4e34d8d0a16e',
        "its_versus_it's_-_its_optimal" => 'f8d7863a-e52f-4d05-9b81-994c16004315',
        "lead_vs_led" => 'da9ded20-284d-4ceb-bb8a-c44623b26415',
        "loose_vs_lose" => '32e8ab57-269a-45aa-9394-95f94e5020b7',
        "passed_vs_past" => 'ec41df97-603f-4e77-ab0c-0d27c2a265fd',
        "plural_versus_possessive_nouns_-_plural_noun_optimal" => 'a75f910d-fad0-4552-8985-1f989b92770e',
        "plural_versus_possessive_nouns_-_possessive_noun_optimal" => 'a3ecaca2-82c1-463e-9d31-8a73b69498d1',
        "punctuation" => 'c37fd0d2-4342-41e1-a628-b9381effdefa',
        "repeated_conjunction" => 'f68c5847-9bc9-4f9f-80bf-07ddae7cbc38',
        "repeated_word" => '98e19806-c3a2-4ea7-926d-50a0dead43d8',
        "spacing" => 'c745ca1f-b94f-41ea-912a-2012cc654054',
        "subject_verb_agreement_with_personal_pronoun" => 'dad4d9a7-2bfc-48d7-b87d-5c747a7d9493',
        "subject_verb_agreement_with_personal_pronoun_-_plural_pronoun_with_plural_to-be_verb_optimal_and_error_is_singular_to-be_verb" => '54392aec-f671-4970-bdb8-457e546e477a',
        "subject_verb_agreement_with_personal_pronoun_-_plural_pronoun_with_plural_to_have_verb_optimal_and_error_is_singular_to_have_verb" => '4e3deee9-278e-40d0-85af-c8be60cc5d59',
        "subject_verb_agreement_with_personal_pronoun_-_plural_pronoun_with_regular_present_tense_plural_verb_optimal_and_error_is_regular_present_tense_singular_verb" => 'fe0bb27b-3682-4470-a3da-738a8748f6aa',
        "subject_verb_agreement_with_personal_pronoun_-_singular_pronoun_with_regular_singular_verb_optimal_and_error_is_regular_plural_verb" => '8c3f2265-2677-403d-b1f6-6ef6c11c3920',
        "subject_verb_agreement_with_personal_pronoun_-_singular_pronoun_with_singular_to-be_verb_optimal_and_error_is_plural_to-be_verb" => 'a6e430c4-3f3c-4e54-ae43-97e236765afe',
        "subject_verb_agreement_with_personal_pronoun_-_singular_pronoun_with_singular_to_have_verb_optimal_and_error_is_plural_to_have_verb" => '1801060c-c459-4a9d-aef5-a8be4b4dbd0a',
        "subject_verb_agreement_with_simple_noun" => '3f43f0b8-3859-40b3-b642-c00662c966c1',
        "subject_verb_agreement_with_simple_noun_-_plural_noun_with_plural_to-be_verb_optimal_and_error_is_singular_to-be_verb" => '602596df-3d36-43b6-a706-ecb57cf6e92f',
        "subject_verb_agreement_with_simple_noun_-_plural_noun_with_plural_to_have_verb_optimal_and_error_is_singular_to_have_verb" => '9312b980-a0f8-435f-af32-5f421c02cc88',
        "subject_verb_agreement_with_simple_noun_-_plural_noun_with_regular_present_tense_plural_verb_optimal_and_error_is_regular_present_tense_singular_verb" => 'bda6e9ba-fc5c-4a73-8edf-e4efdd74ce66',
        "subject_verb_agreement_with_simple_noun_-_singular_noun_with_regular_singular_verb_optimal_and_error_is_regular_plural_verb" => '20569caf-fb4f-4ece-948f-411a5017a0b2',
        "subject_verb_agreement_with_simple_noun_-_singular_noun_with_singular_to-be_verb_optimal_and_error_is_plural_to-be_verb" => '4f4d04b4-254f-437d-923c-97e0fbacebf3',
        "subject_verb_agreement_with_simple_noun_-_singular_noun_with_singular_to_have_verb_optimal_and_error_is_plural_to_have_verb" => '3feb708d-b789-42dc-8b7a-7288a0945fff',
        "than_versus_then_-_than_optimal" => '4aa3f48b-7be9-414b-91e0-ffa92c85f323',
        "than_versus_then_-_then_optimal" => 'ad97bd7a-1215-4c52-91ec-8973d646a381',
        "their_vs._there_vs._they're_-_they_optimal" => 'e4cf078b-a838-445e-a873-c795da9f7ed8',
        "their_vs._there_vs.they're_their_optimal" => '6ca8f080-c4a2-470e-8171-0fa72f0b18da',
        "their_vs._there_vs.they're_there_optimal" => 'f257a25f-8bc3-46ce-b811-82cbd98fad2a',
        "through_vs_threw_vs_thru" => '1f3cff3f-47ef-4e92-b7d5-9867cb4f3dff',
        "to_vs_too_vs_two" => '1522516d-4bdb-4cd1-8f90-30f4f4be3f30',
        "who's_vs_whose" => 'b4d8997f-736b-41fc-92c5-b410981b43cb'
      }   

      def self.error_to_rule_uid 
        RULE_MAPPING
      end

      def self.default_payload
        super.merge({'feedback_type' => 'grammar'})
      end
    end
    
  end
end
