require 'test_helper'

class ActivitiesControllerTest < ActionDispatch::IntegrationTest
  setup do
    @activity = activities(:one)
  end

  test "should get index" do
    get activities_url
    assert_response :success
  end

  test "should get new" do
    get new_activity_url
    assert_response :success
  end

  test "should create activity" do
    assert_difference('Activity.count') do
      post activities_url, params: { activity: { article: @activity.article, description: @activity.description, title: @activity.title } }
    end

    assert_redirected_to activity_url(Activity.last)
  end

  test "should show activity" do
    get activity_url(@activity)
    assert_response :success
  end

  test "should get edit" do
    get edit_activity_url(@activity)
    assert_response :success
  end

  test "should update activity" do
    patch activity_url(@activity), params: { activity: { article: @activity.article, description: @activity.description, title: @activity.title } }
    assert_redirected_to activity_url(@activity)
  end

  test "should destroy activity" do
    assert_difference('Activity.count', -1) do
      delete activity_url(@activity)
    end

    assert_redirected_to activities_url
  end
end
