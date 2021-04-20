RSpec.shared_context "routing url helpers" do
  include Rails.application.routes.url_helpers

  def default_url_options
    { only_path: true }
  end
end