require 'rails_helper'

# describe Api::V1::RuleFeedbackHistoriesController, type: :controller do
#   context "index" do
#     it 'foo' do 
#     end

    
#     xit "should return successfully - no history" do
#       get :index

#       parsed_response = JSON.parse(response.body)['feedback_histories']

#       assert_response :success
#       assert_equal Array, parsed_response.class
#       assert parsed_response.empty?
#     end

#     context 'with feedback_history' do
#       setup do
#         create(:feedback_history, entry: 'This is the first entry in history')
#         create(:feedback_history, entry: 'This is the second entry in history')
#       end

#       xit "should return successfully" do
#         get :index

#         parsed_response = JSON.parse(response.body)['feedback_histories']

#         assert_response :success
#         assert_equal Array, parsed_response.class
#         refute parsed_response.empty?

#         assert_equal "This is the first entry in history", parsed_response.first['entry']
#         assert_equal "This is the second entry in history", parsed_response.last['entry']
#       end
#     end
#   end

# end
