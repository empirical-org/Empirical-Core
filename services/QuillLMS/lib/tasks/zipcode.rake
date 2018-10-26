namespace :zipcode do
  desc "TODO"
  task populate: :environment do
    # TODO: perhaps copy from a zipped file to reduce heroku bundle size?
    ActiveRecord::Base.connection.execute("
      COPY zipcode_infos (zipcode,zipcode_type,city,
        state,timezone,lat,lng,_secondary_cities,county,
        decommissioned,estimated_population,
        area_codes) FROM '../data/zipcodes.copy'
    ")
  end

end
