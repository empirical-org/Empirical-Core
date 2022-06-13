# frozen_string_literal: true

namespace :local do
  desc 'Update seed / prod dump\'d ActivityClassifications so that redirects point to localhost'
  task :localize_classification_module_urls => :environment do
    def change_url_domain(original, domain='http://localhost:3000')
      original.gsub('https://www.quill.org', domain)
    end

    ActivityClassification.all.each do |ac|
      ac.update!(**{
        module_url: change_url_domain(ac.module_url),
        form_url: change_url_domain(ac.form_url)
      })
    end
  end
end
