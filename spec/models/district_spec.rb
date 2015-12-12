require 'rails_helper'

describe District, type: :model do
  def other_object_counts
    "# Classrooms: #{Classroom.count}; # Users: #{User.count}"
  end

  describe 'setup from clever', :vcr do
    it 'passes an auth hash for a district to be setup' do
      def setup_district
        @district = District.setup_from_clever(info: {
                                                 name: '#DEMO Quill Sandbox District',
                                                 id: '53ea7c626e727c2e0d000018'
                                               },
                                               credentials: {
                                                 token: 'c0b73f915c29bf2541454b7f20a98ed65c0bbc88'
                                               })
      end

      expect { setup_district }.not_to change { other_object_counts }

      expect(@district.valid?).to be_truthy
      expect(@district.id).to_not be_nil
      expect(@district.name).to eq('#DEMO Quill Sandbox District')
    end
  end

  describe 'create from clever', :vcr do
    it 'gets data from clever' do
      def create_district
        @district = District.create_from_clever('53ea7c626e727c2e0d000018', 'c0b73f915c29bf2541454b7f20a98ed65c0bbc88')
      end

      expect { create_district }.not_to change { other_object_counts }

      expect(@district.name).to eq('#DEMO Quill Sandbox District')
      expect(@district.valid?).to be_truthy
      expect(@district.id).to_not be_nil
    end
  end

  describe 'importing users', :vcr do
    before do
      @district = District.create(clever_id: '53ea7c626e727c2e0d000018',
                                  name: '#DEMO Quill Sandbox District',
                                  token: 'c0b73f915c29bf2541454b7f20a98ed65c0bbc88')

      @school = School.create(name: 'Test School',
                              clever_id: '535ea6e0e17efb3e297374f2')
    end

    it 'finds its clever district' do
      d = @district.send(:clever_district)

      expect(d.id).to eq(@district.clever_id)
      expect(d.name).to eq(@district.name)
    end
  end
end
