# == Schema Information
#
# Table name: unit_templates
#
#  id                        :integer          not null, primary key
#  activity_info             :text
#  flag                      :string
#  grades                    :text
#  image_link                :string
#  name                      :string
#  order_number              :integer          default(999999999)
#  time                      :integer
#  created_at                :datetime
#  updated_at                :datetime
#  author_id                 :integer
#  unit_template_category_id :integer
#
# Indexes
#
#  index_unit_templates_on_activity_info              (activity_info)
#  index_unit_templates_on_author_id                  (author_id)
#  index_unit_templates_on_unit_template_category_id  (unit_template_category_id)
#
require 'rails_helper'

describe UnitTemplate, redis: true, type: :model do
  let!(:unit_template) {create(:unit_template)}

  it { should belong_to(:unit_template_category) }
  it { should belong_to(:author) }
  it { should have_many(:activities_unit_templates) }
  it { should have_many(:activities).through(:activities_unit_templates) }
  it { should have_many(:units) }
  it { should serialize(:grades).as(Array) }
  it { should validate_inclusion_of(:flag).in_array([:alpha, :beta, :gamma, :production])}

  describe '#activity_ids=' do
    let(:activity) { create(:activity) }
    let(:activity1) { create(:activity) }

    it 'should find the activities and assign it to the unit template' do
      unit_template.activity_ids = [activity.id, activity1.id]
      unit_template.save
      expect(unit_template.activities).to include(activity, activity1)
    end
  end

  describe '#related_models' do
    let!(:unit_template1) { create(:unit_template, unit_template_category_id: unit_template.unit_template_category_id) }
    let!(:unit_template2) { create(:unit_template) }

    it 'should return the unit templates with the same category' do
      expect(unit_template.related_models("alpha")).to include unit_template1
      expect(unit_template.related_models("alpha")).to_not include unit_template2
    end
  end

  describe '#activity_ids' do
    let(:activity) { create(:activity) }
    let(:activity1) { create(:activity) }
    let(:unit_template1) { create(:unit_template, activities: [activity, activity1]) }

    it 'should give the activity ids for the associated activities' do
      expect(unit_template1.activity_ids).to include(activity.id, activity1.id)
    end
  end

  describe '#activities' do
    #TODO
  end

  describe '#user_scope' do
    it 'should give the right unit template for the given flags' do
      expect(UnitTemplate.user_scope('alpha')).to eq(UnitTemplate.alpha_user)
      expect(UnitTemplate.user_scope('beta')).to eq(UnitTemplate.beta_user)
      expect(UnitTemplate.user_scope('gamma')).to eq(UnitTemplate.gamma_user)
      expect(UnitTemplate.user_scope('production')).to eq(UnitTemplate.production)
    end
  end

  describe '#get_cached_serialized_unit_template' do
    let(:category) { create(:unit_template_category) }
    let(:author) { create(:author) }
    let(:activity) { create(:activity) }
    let(:unit_template1) { create(:unit_template, author: author, unit_template_category: category, activities: [activity]) }
    let(:json) {
      {
        activities: [{
          id: activity.id,
          name: activity.name,
          description: activity.description,
          standard_level_name: activity.standard_level.name,
          standard: {
            id: activity.standard.id,
            name: activity.standard.name,
            standard_category: {
              id: activity.standard.standard_category.id,
              name: activity.standard.standard_category.name
            }
          },
          classification: {
            key: activity.classification.key,
            id: activity.classification.id,
            name: activity.classification.name
          }
        }],
        activity_info: nil,
        author: {
          name: author.name,
          avatar_url: author.avatar_url,
        },
        created_at: unit_template1.created_at.to_i,
        grades: [],
        id: unit_template1.id,
        name: unit_template1.name,
        number_of_standards: 1,
        order_number: 999999999,
        time: nil,
        unit_template_category: {
          primary_color: category.primary_color,
          secondary_color: category.secondary_color,
          name: category.name,
          id: category.id
        }
      }.to_json
    }

    it 'should save the serialized hash to the db and returns it' do
      unit_template1.get_cached_serialized_unit_template
      serialized_template_from_db = JSON.parse($redis.get("unit_template_id:#{unit_template1.id}_serialized"))
      JSON.parse(json).each do |k, v|
        expect(serialized_template_from_db).to include(k)
        expect(serialized_template_from_db[k]).to eq(v)
      end
    end
  end

  describe 'assign_to_whole_class' do
    it 'should set off background job to populate the student ids' do
      expect(AssignRecommendationsWorker.jobs.size).to eq 0
      UnitTemplate.assign_to_whole_class(1 ,2)
      expect(AssignRecommendationsWorker.jobs.size).to eq 1
    end
  end

  describe '#around_save callback' do

    before(:each) do
      $redis.redis.flushdb
      $redis.multi{
        $redis.set('beta_unit_templates', 'a')
        $redis.set('production_unit_templates', 'a')
        $redis.set('gamma_unit_templates', 'a')
        $redis.set('alpha_unit_templates', 'a')
      }
    end

    def exist_count
      flag_types = ['beta_unit_templates', 'production_unit_templates', 'gamma_unit_templates', 'alpha_unit_templates']
      exist_count = 0
      flag_types.each do |flag|
        exist_count += $redis.exists(flag) ? 1 : 0
      end
      exist_count
    end

    it "deletes the cache of the saved unit" do
      $redis.set("unit_template_id:#{unit_template.id}_serialized", 'something')
      expect($redis.exists("unit_template_id:#{unit_template.id}_serialized")).to be
      unit_template.update(name: 'something else')
      expect($redis.exists("unit_template_id:#{unit_template.id}_serialized")).not_to be
    end

    it "deletes the cache of the saved unit's flag, or production before and after save" do
      expect(exist_count).to eq(4)
      unit_template.update(flag: 'beta')
      expect(exist_count).to eq(3)
      expect($redis.exists('alpha_unit_templates')).to be
      unit_template.update(flag: 'alpha')
      expect(exist_count).to eq(2)
    end
  end


  describe 'flag validations' do

    it "can equal production" do
      unit_template.update(flag:'production')
      expect(unit_template).to be_valid
    end

    it "can equal gamma" do
      unit_template.update(flag:'gamma')
      expect(unit_template).to be_valid
    end

    it "can equal beta" do
      unit_template.update(flag:'beta')
      expect(unit_template).to be_valid
    end

    it "can equal alpha" do
      unit_template.update(flag:'alpha')
      expect(unit_template).to be_valid
    end

    it "can equal nil" do
      unit_template.update(flag: nil)
      expect(unit_template).to be_valid
    end

    it "cannot equal anything other than alpha, beta, gamma, production or nil" do
      unit_template.update(flag: 'sunglasses')
      expect(unit_template).to_not be_valid
    end
  end

  describe '#delete_all_caches' do
    let(:template) { create(:unit_template) }

    it 'should clear the unit templates' do
      $redis.set("unit_template_id:#{template.id}_serialized", "pretend")
      $redis.set('production_unit_templates', "this")
      $redis.set('beta_unit_templates', "is")
      $redis.set('alpha_unit_templates', "real")
      $redis.set('private_unit_templates', "data")
      $redis.set('gamma_unit_templates', "same")
      UnitTemplate.delete_all_caches
      expect($redis.get("unit_template_id:#{template.id}_serialized")).to eq nil
      expect($redis.get('production_unit_templates')).to eq nil
      expect($redis.get('gamma_unit_templates')).to eq nil
      expect($redis.get('beta_unit_templates')).to eq nil
      expect($redis.get('alpha_unit_templates')).to eq nil
      expect($redis.get('private_unit_templates')).to eq nil
    end

  end

  describe 'scope results' do
    let!(:production_unit_template){ create(:unit_template, flag: 'production') }
    let!(:gamma_unit_template){ create(:unit_template, flag: 'gamma') }
    let!(:beta_unit_template){ create(:unit_template, flag: 'beta') }
    let!(:alpha_unit_template){ create(:unit_template, flag: 'alpha') }
    let!(:all_types){[production_unit_template, gamma_unit_template, beta_unit_template, alpha_unit_template]}

    context 'the default scope' do

      it 'must show all types of flagged activities when default scope' do

        default_results = UnitTemplate.all
        expect(all_types - default_results).to eq []
      end

    end

    context 'the production scope' do

      it 'must show only production flagged activities' do
        expect(all_types - UnitTemplate.production).to eq [gamma_unit_template, beta_unit_template, alpha_unit_template]
      end

      it 'must return the same thing as UnitTemplate.user_scope(nil)' do
        expect(UnitTemplate.production).to eq (UnitTemplate.user_scope(nil))
      end

    end

    context 'the gamma_user scope' do

      it 'must show only production and gamma flagged activities' do
        expect(all_types - UnitTemplate.gamma_user).to eq [beta_unit_template, alpha_unit_template]
      end

      it 'must return the same thing as UnitTemplate.user_scope(gamma)' do
        expect(UnitTemplate.gamma_user).to eq (UnitTemplate.user_scope('gamma'))
      end


    end

    context 'the beta_user scope' do

      it 'must show only production and beta and gamma flagged activities' do
        expect(all_types - UnitTemplate.beta_user).to eq [alpha_unit_template]
      end

      it 'must return the same thing as UnitTemplate.user_scope(beta)' do
        expect(UnitTemplate.beta_user).to eq (UnitTemplate.user_scope('beta'))
      end


    end

    context 'the alpha_user scope' do

      it 'must show all types of flags except for archived with alpha_user scope' do
        expect(all_types - UnitTemplate.alpha_user).to eq []
      end

      it 'must return the same thing as UnitTemplate.user_scope(alpha)' do
        expect(UnitTemplate.alpha_user).to eq (UnitTemplate.user_scope('alpha'))
      end

    end

  end


end
