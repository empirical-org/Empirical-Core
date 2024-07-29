# frozen_string_literal: true

require 'rails_helper'

module Evidence
  module Research
    module GenAI
      RSpec.describe DatasetValidator do
        subject { described_class.run(file:) }

        let(:file) { StringIO.new(content) }

        let(:headers) do
          [
            'Curriculum Assigned Optimal Status',
            'Data Partition',
            'Optional - AutoML Label',
            'Optional - AutoML Primary Feedback',
            'Optional - AutoML Secondary Feedback',
            'Optional - Curriculum Label',
            'Curriculum Proposed Feedback',
            'Optional - Highlight',
            'Student Response'
          ]
        end

        context 'when the CSV content is valid' do
          let(:content) do
            <<-CSV
              #{headers.join(',')}
              TRUE,prompt,label1,primary_feedback1,secondary_feedback1,curriculum_label1,proposed_feedback1,highlight1,response1
              FALSE,prompt,label2,,secondary_feedback2,curriculum_label2,proposed_feedback2,highlight2,response2
              TRUE,test,label3,primary_feedback3,secondary_feedback3,curriculum_label3,proposed_feedback3,highlight3,response3
              FALSE,test,label4,primary_feedback4,secondary_feedback4,curriculum_label4,proposed_feedback4,highlight4,response4
            CSV
          end

          it { is_expected.to eq [] }
        end

        context 'when the CSV content is invalid' do
          let(:content) do
            <<-CSV
              #{headers.join(',')}
              TRUE,prompt,label1,primary_feedback1,secondary_feedback1,curriculum_label1,proposed_feedback1,highlight1,response1
              FALSE,prompt,label2,,secondary_feedback2,curriculum_label2,,highlight2,response2
              TRUE,test,label3,primary_feedback3,secondary_feedback3,curriculum_label3,proposed_feedback3,highlight3,response3
              FALSE,test,label4,primary_feedback4,secondary_feedback4,curriculum_label4,proposed_feedback4,highlight4,response4
            CSV
          end

          it { is_expected.to eq ["Row 3: #{described_class::MISSING_FEEDBACK_ERROR}"] }
        end
      end
    end
  end
end
