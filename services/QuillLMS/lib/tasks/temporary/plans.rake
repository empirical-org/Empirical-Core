namespace :plans do
  task seed: :environment do
    ActiveRecord::Base.transaction do
      [
        {
          name: 'Teacher Paid',
          display_name: 'Teacher Premium',
          paid: true,
          audience: 'teacher',
          interval: 'yearly',
          interval_count: 1
        },
        {
          name: 'School Paid (via Stripe)',
          display_name: 'School Premium',
          paid: true,
          audience: 'school',
          interval: 'yearly',
          interval_count: 1
        },
        {
          name: 'School Paid (via invoice)',
          display_name: 'School Premium',
        paid: true,
        audience: 'school',
        interval: 'yearly',
        interval_count: 1
        },
        {
          name: 'School District Paid',
          display_name: 'District Premium',
          paid: true,
          audience: 'district',
          interval: 'yearly',
          interval_count: 1
        },
        {
          name: 'Premium Credit',
          display_name: 'Teacher Premium Credit',
          paid: true,
          audience: 'teacher',
          interval: 'weekly',
          interval_count: 4
        },
        {
          name: 'College Board Educator Lifetime Premium',
          display_name: 'Teacher Premium',
          paid: false,
          audience: 'teacher',
          interval: 'yearly',
          interval_count: 50
        },
        {
          name: 'School Sponsored Free',
          display_name: 'School Premium (Scholarship)',
          paid: false,
          audience: 'school',
          interval: 'yearly',
          interval_count: 1
        },
        {
          name: 'Teacher Sponsored Free',
          display_name: 'Teacher Premium (Scholarship)',
          paid: false,
          audience: 'teacher',
          interval: 'yearly',
          interval_count: 1
        },
        {
          name: 'Teacher Trial',
          display_name: 'Teacher Premium Trial',
          paid: false,
          audience: 'teacher',
          interval: 'daily',
          interval_count: 30
        }
      ].each do |plan_attrs|
        Plan.find_or_create_by!(plan_attrs)
      end

      puts "\nBase plans were added to the database"
    end
  end
end
