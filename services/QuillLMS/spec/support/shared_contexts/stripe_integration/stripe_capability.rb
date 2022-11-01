# frozen_string_literal: true

RSpec.shared_context 'Stripe Capability' do
  let(:stripe_capability) do
    Stripe::Capability.construct_from(
      object: {
        id: "treasury",
        object: "capability",
        account: "acct_abc123def456",
        future_requirements: {
        },
        requested: true,
        requested_at: 1232423423,
        requirements: {
          alternatives: [],
          currently_due: [
            "person_adbcde.email",
            "person_adbcde.relationship.title",
            "settings.treasury.tos_acceptance.date",
            "settings.treasury.tos_acceptance.ip"
          ],
          disabled_reason: "requirements.fields_needed",
          errors: [],
          eventually_due: [
            "person_adbcde.email",
            "person_adbcde.relationship.title",
            "settings.treasury.tos_acceptance.date",
            "settings.treasury.tos_acceptance.ip"
          ],
          past_due: [
            "person_adbcde.email",
            "person_adbcde.relationship.title",
            "settings.treasury.tos_acceptance.date",
            "settings.treasury.tos_acceptance.ip"
          ],
          pending_verification: []
        },
        status: "inactive"
      },
      previous_attributes: {
        requirements: {
          currently_due: [],
          eventually_due: [],
          past_due: []
        }
      }
    )
  end
end
