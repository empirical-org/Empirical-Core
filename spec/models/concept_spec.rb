require 'rails_helper'

describe Concept, :type => :model do
  describe "can behave like an uid class" do
    context "when behaves like uid" do
      it_behaves_like "uid"
    end
  end
end