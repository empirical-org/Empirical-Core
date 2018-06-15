require "rails_helper"

describe QuillComprehensionSchema do

  let(:context) { {} }
  let(:variables) { {} }
  # Call `result` to execute the query
  let(:result) {
    res = QuillComprehensionSchema.execute(
      query_string,
      context: context,
      variables: variables
    )
    # Print any errors
    if res["errors"]
      pp res
    end
    res 
  }

  describe "the activity query" do
    # provide a query string for `result`
    let(:query_string) { %|{ activity(id: 1) { id, title } }| }

    context "when there's no current user" do
      
      it "works" do
        activity = create(:activity)
        # calling `result` executes the query
        expect(result["data"]["activity"]).to eq(activity.attributes.select { |key| ['id', 'title'].include?(key) })
      end
    end

    # context "when there's a current user" do
    #   # override `context`
    #   let(:context) {
    #     { current_user: User.new(name: "ABC") }
    #   }
    #   it "shows the user's name" do
    #     user_name = result["data"]["viewer"]["name"]
    #     expect(user_name).to eq("ABC")
    #   end
    # end
  end

end