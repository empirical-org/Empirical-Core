# frozen_string_literal: true

module CleverIntegration::Requesters

  def self.teacher(clever_id, district_token=nil)
    api_instance(district_token).get_teacher(clever_id)
  end

  def self.section(clever_id, district_token=nil)
    api_instance(district_token).get_section(clever_id)
  end

  def self.district(clever_id, district_token=nil)
    api_instance(district_token).get_district(clever_id)
  end

  def self.school_admin(clever_id, district_token=nil)
    api_instance(district_token).get_school_admin(clever_id)
  end

  def self.school(clever_id, district_token=nil)
    api_instance(district_token).get_school(clever_id)
  end

  def self.schools_for_school_admin(clever_id, district_token=nil)
    api_instance(district_token).get_schools_for_school_admin(clever_id)
  end

  def self.api_instance(district_token=nil)
    config = Clever::Configuration.new
    config.access_token = district_token
    api_instance = Clever::DataApi.new
    api_instance.api_client.config = config
    api_instance
  end
end
