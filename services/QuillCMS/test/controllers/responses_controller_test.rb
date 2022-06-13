require 'test_helper'

class ResponsesControllerTest < ActionDispatch::IntegrationTest
  setup do
    @response = responses(:one)
  end

  test "should get index" do
    get responses_url, as: :json
    assert_response :success
  end

  test "should show response" do
    get response_url(@response), as: :json
    assert_response :success
  end

  test "should destroy response" do
    assert_difference('Response.count', -1) do
      delete response_url(@response), as: :json
    end

    assert_response 204
  end

  # test "should create response" do
  #   assert_difference('Response.count') do
  #     post responses_url, params: { response: {  } }, as: :json
  #   end
  #
  #   assert_response 201
  # end


  # test "should update response" do
  #   patch response_url(@response), params: { response: {  } }, as: :json
  #   assert_response 200
  # end


  # test "should increment response count" do
  #   put "/responses/#{@response.id}/count", params: {id: @response.uid, first_attempt_count: true}
  #
  #   assert_response 204
  # end
end
