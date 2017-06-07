require 'rails_helper'

describe UnitTemplate, redis: :true, type: :model do
  let!(:unit_template) {FactoryGirl.create(:unit_template)}

  describe '#around_save callback' do

    before(:each) do
      $redis.flushdb
      $redis.multi{
        $redis.set('beta_unit_templates', 'a')
        $redis.set('production_unit_templates', 'a')
        $redis.set('alpha_unit_templates', 'a')
      }
    end

    def exist_count
      flag_types = ['beta_unit_templates', 'production_unit_templates', 'alpha_unit_templates']
      exist_count = 0
      flag_types.each do |flag|
        exist_count += $redis.exists(flag) ? 1 : 0
      end
      return exist_count
    end

    it "deletes the cache of the saved unit" do
      $redis.set("unit_template_id:#{unit_template.id}_serialized", 'something')
      expect($redis.exists("unit_template_id:#{unit_template.id}_serialized")).to be
      unit_template.update(name: 'something else')
      expect($redis.exists("unit_template_id:#{unit_template.id}_serialized")).not_to be
    end

    it "deletes the cache of the saved unit's flag, or production before and after save" do
      expect(exist_count).to eq(3)
      unit_template.update(flag: 'beta')
      expect(exist_count).to eq(2)
      expect($redis.exists('alpha_unit_templates')).to be
      unit_template.update(flag: 'alpha')
      expect(exist_count).to eq(1)
    end
  end


  describe 'flag validations' do

    it "can equal production" do
      unit_template.update(flag:'production')
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

    it "cannot equal anything other than alpha, beta, production or nil" do
      unit_template.update(flag: 'sunglasses')
      expect(unit_template).to_not be_valid
    end


  end


  describe 'scope results' do
    let!(:production_unit_template){ FactoryGirl.create(:unit_template, flag: 'production') }
    let!(:beta_unit_template){ FactoryGirl.create(:unit_template, flag: 'beta') }
    let!(:alpha_unit_template){ FactoryGirl.create(:unit_template, flag: 'alpha') }
    let!(:all_types){[production_unit_template, beta_unit_template, alpha_unit_template]}

    context 'the default scope' do

      it 'must show all types of flagged activities when default scope' do

        default_results = UnitTemplate.all
        expect(all_types - default_results).to eq []
      end



    end

    context 'the production scope' do

      it 'must show only production flagged activities' do
        expect(all_types - UnitTemplate.production).to eq [beta_unit_template, alpha_unit_template]
      end

      it 'must return the same thing as UnitTemplate.user_scope(nil)' do
        expect(UnitTemplate.production).to eq (UnitTemplate.user_scope(nil))
      end

    end

    context 'the beta_user scope' do

      it 'must show only production and beta flagged activities' do
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
