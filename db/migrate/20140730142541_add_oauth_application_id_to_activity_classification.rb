class AddOauthApplicationIdToActivityClassification < ActiveRecord::Migration
  def change
    add_reference :activity_classifications, :oauth_application, index: true
  end
end
