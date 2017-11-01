shared_examples_for "teacher" do

  let(:teacher) { FactoryBot.build(:classroom) }

  context 'with an email' do

    let!(:teacher) { FactoryBot.build(:teacher, email: nil) }

    it 'requires to be present' do
      teacher.valid?
      expect(teacher.errors[:email]).to include "can't be blank"
    end

  end

  context "with the ActiveRecords's delegated methods" do
      describe ".all" do
        it "must me included in methods" do
          expect(Teacher.methods).to include( :all)
        end
      end

      describe ".first" do
        it "must me included in methods" do
          expect(Teacher.methods).to include( :first)
        end
      end

      describe ".where" do
        it "must me included in methods" do
          expect(Teacher.methods).to include( :where)
        end
      end

      describe ".find" do
        it "must me included in methods" do
          expect(Teacher.methods).to include( :find)
        end
      end

      describe "count" do
        it "must me included in methods" do
          expect(Teacher.methods).to include( :count)
        end
      end
  end

  describe "default scope" do
    let(:teacher){FactoryBot.create(:teacher)}
    let(:user){FactoryBot.create(:user)}
    let(:student){FactoryBot.create(:student)}
    let(:admin){FactoryBot.create(:admin)}
    let(:staff){FactoryBot.create(:staff)}

    it "must list only teacher users" do
      Teacher.all.each do |teacher|
        expect(teacher).to be_teacher
      end
    end

  end

end
