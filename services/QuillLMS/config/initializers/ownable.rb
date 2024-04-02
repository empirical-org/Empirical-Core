# frozen_string_literal: true

Rails.application.config.to_prepare { ApplicationRecord.include(Owner) }
