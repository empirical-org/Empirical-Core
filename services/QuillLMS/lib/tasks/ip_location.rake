namespace :ip_location do
  desc 'give every teacher with an ip address but no school a location'
  task :location_of_schoolless_teachers => :environment do
    # Selects from teachers that have no school, but do have an ip address and no ip_location
    target = User.where(role: 'teacher').select{|t| (t.school.nil?) && (!!t.ip_address) && !t.ip_location}
    generate_location(target)
  end

  def generate_location(target)
    #blacklist is an optional argument for locations we don't want, i.e. current/present Quill offices
    target.each do |t|
      IpLocationWorker.perform_async(t.id, t.ip_address, ["10005", "11237", "11385", "11212"])
    end
  end

end
