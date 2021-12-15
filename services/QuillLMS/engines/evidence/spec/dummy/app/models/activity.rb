class Activity < ApplicationRecord

  def flag(flag = nil)
    return super(flag) unless flag.nil?
    flags.first&.to_sym
  end

  def flag=(flag=nil)
    update(flags: [flag])
  end
end
