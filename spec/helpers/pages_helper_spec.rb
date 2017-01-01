require "rails_helper"

describe PagesHelper, type: :helper do
  subject {
    class Foo
      include PagesHelper
      action_name = tabname
    end
    Foo.new
  }

  describe "#subtab_class" do
    context "with tabname equal to action name" do
      let(:tabname) { "tabname" }
      it "is active when tabname is a subtab class" do
        expect(subject.subtab_class).to eq "active"
      end
      end

    context "with tabname not equal to action name" do
      let(:tabname) { "not tabname" }
      it "is empty string when tabname is a subtab class" do
        expect(subject.subtab_class).to eq ""
      end
    end
  end
end