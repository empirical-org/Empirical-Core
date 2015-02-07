require 'rails_helper'

describe District, type: :model do
  def other_object_counts
    "# Classrooms: #{Classroom.count}; # Users: #{User.count}"
  end

  describe 'setup from clever', :vcr do
    it 'passes an auth hash for a district to be setup' do
      def setup_district
        @district = District.setup_from_clever({
          info: {
            name: 'Fake District',
            id: '535e91b05fc8cb160e001645'
          },
          credentials: {
            token: '123'
          }
        })
      end

      expect { setup_district }.not_to change { other_object_counts }

      expect(@district.valid?).to be_truthy
      expect(@district.id).to_not be_nil
      expect(@district.name).to eq('Fake District')
    end
  end

  describe 'create from clever', :vcr do
    it 'gets data from clever' do
      def create_district
        @district = District.create_from_clever('535e91b05fc8cb160e001645')
      end

      expect { create_district }.not_to change { other_object_counts }

      expect(@district.name).to eq('#DEMO Clever Team Testing')
      expect(@district.valid?).to be_truthy
      expect(@district.id).to_not be_nil
    end
  end

  describe 'importing users', :vcr do
    before do
      @district = District.create({
        clever_id: '535e91b05fc8cb160e001645',
        name: '#DEMO Clever Team Testing'
      })

      @school = School.create({
        name: 'Test School',
        clever_id: '535ea6e0e17efb3e297374f2'
      })
    end

    it 'finds its clever district' do
      d = @district.send(:clever_district)

      expect(d.id).to eq(@district.clever_id)
      expect(d.name).to eq(@district.name)
    end

  end
end
