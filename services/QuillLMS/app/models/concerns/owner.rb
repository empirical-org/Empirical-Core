# frozen_string_literal: true

module Owner
  extend ActiveSupport::Concern

  module ClassMethods
    attr_accessor :owner_name

    def ownable owner_name = :owner
      self.owner_name = owner_name

      if owner_name == :owner
        belongs_to :owner, class_name: 'User', foreign_key: 'owner.id'
      else
        belongs_to owner_name
      end
    end
  end

  def owner
    if self.class.owner_name == :owner
      super
    else
      send(self.class.owner_name)
    end
  end

  def owner=(object)
    send "#{self.class.owner_name}=", object
  end

  def ownable?
    self.class.owner_name.present?
  end

  def owned_by? user
    return false if owner.blank?
    return false if user.blank?

    owner == user
  end
end
