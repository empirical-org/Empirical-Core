# frozen_string_literal: true

module Evidence
  class SpellingCheck
    API_TIMEOUT = 5
    ALL_CORRECT_FEEDBACK = '<p>Correct spelling!</p>'
    FALLBACK_INCORRECT_FEEDBACK = '<p>Update the spelling of the bolded word(s).</p>'
    FEEDBACK_TYPE = Rule::TYPE_SPELLING
    RESPONSE_TYPE = 'response'
    BING_API_URL = 'https://api.bing.microsoft.com/v7.0/spellcheck'
    SPELLING_CONCEPT_UID = 'H-2lrblngQAQ8_s-ctye4g'

    class BingRateLimitException < StandardError; end
    class BingTimeoutError < StandardError; end
    TIMEOUT_ERROR_MESSAGE = "request took longer than #{API_TIMEOUT} seconds"

    # TODO: replace with better exception code
    EXCEPTIONS = [
      'antisemitic',
      'solartogether',
      'jerom',
      'espana',
      'españa',
      'cafebabel',
      'cafébabel',
      'then',
      'sanchez',
      'sánchez',
      "shoguns'",
      "shogun's",
      'kanaka',
      'kānaka',
      'kirishitans',
      'worldwatch',
      'wilmut',
      'quokkaselfie',
      'quokkaselfies',
      'mestres',
      'villages',
      'jacobo',
      "d'état"
    ].concat(
      # britishisms
      [
        'acclimatise',
        'acclimatised',
        'acknowledgement',
        'ageing',
        'aeroplane',
        'aluminium',
        'amongst',
        'analogue',
        'analyse',
        'analysed',
        'analysing',
        'apologise',
        'apologised',
        'armour',
        'armoured',
        'artefact',
        'behaviour',
        'burnt',
        'calibre',
        'cancelled',
        'catalogue',
        'catalyse',
        'catalysed',
        'centre',
        'cheque',
        'civilisation',
        'civilise',
        'civilised',
        'colonisation',
        'colonise',
        'colonised',
        'colonising',
        'colour',
        'coloured',
        'colouring',
        'counsellor',
        'cosy',
        'criticise',
        'criticised',
        'criticising',
        'kerb',
        'defence',
        'dialogue',
        'dreamt',
        'emphasise',
        'emphasised',
        'emphasising',
        'encyclopaedia',
        'enrol',
        'aeon',
        'equalling',
        'familiarise',
        'familiarised',
        'familiarising',
        'favour',
        'favourable',
        'favoured',
        'favouring',
        'favourite',
        'fibre',
        'flavour',
        'fuelled',
        'fuelling',
        'fulfil',
        'globalisation',
        'globalised',
        'harbour',
        'honour',
        'honoured',
        'honouring',
        'humanise',
        'humanised',
        'humanising',
        'humour',
        'idealised',
        'idealise',
        'idolise',
        'enquiries',
        'enquiry',
        'instalment',
        'jeweller',
        'jewellery',
        'judgement',
        'kilometre',
        'labelled',
        'labelling',
        'labour',
        'labouring',
        'labourer',
        'leapt',
        'learnt',
        'legalise',
        'legalised',
        'legalising',
        'licence',
        'likeable',
        'litre',
        'liveable',
        'lustre',
        'manoeuvre',
        'manoeuvred',
        'manoeuvring',
        'marginalise',
        'marginalised',
        'mediaeval',
        'metre',
        'modelled',
        'modelling',
        'mould',
        'moulded',
        'moulding',
        'mollusc',
        'moveable',
        'neighbour',
        'neighbourhood',
        'neighbouring',
        'odour',
        'offence',
        'organisation',
        'organise',
        'organised',
        'organising',
        'orientated',
        'pyjamas',
        'paralyse',
        'paralysed',
        'paralysing',
        'paediatric',
        'practise',
        'practised',
        'practising',
        'pretence',
        'prioritise',
        'prioritised',
        'prioritising',
        'programme',
        'realise',
        'realised',
        'realising',
        'recognise',
        'recognised',
        'recognising',
        'revolutionise',
        'revolutionised',
        'revolutionising',
        'routeing',
        'rumour',
        'sabre',
        'saleable',
        'satirise',
        'satirised',
        'satirising',
        'savoury',
        'sawn',
        'signalled',
        'signalling',
        'sizeable',
        'sceptic',
        'sceptical',
        'skilful',
        'specialisation',
        'specialise',
        'specialised',
        'specialising',
        'speciality',
        'spelt',
        'standardise',
        'standardised',
        'sulphur',
        'theatre',
        'tyre',
        'tonne',
        'travelled',
        'traveller ',
        'travelling',
        'unrealised',
        'unshakeable',
        'utilise',
        'utilised',
        'utilising',
        'visualise',
        'visualised',
        'visualising',
        'whilst',
        'wilful',
        'woollen'
      ]
    )

    attr_reader :entry

    def initialize(entry, feedback_history = [])
      @entry = entry
      @feedback_history = feedback_history
    end

    # rubocop:disable Metrics/CyclomaticComplexity
    def feedback_object
      return {} if error.present?

      {
        feedback: optimal? ? ALL_CORRECT_FEEDBACK : non_optimal_feedback_string,
        feedback_type: FEEDBACK_TYPE,
        optimal: optimal?,
        entry: @entry,
        concept_uid: SPELLING_CONCEPT_UID,
        rule_uid: spelling_rule&.uid || '',
        hint: optimal? ? nil : spelling_rule&.hint,
        highlight: optimal? ? [] : highlight
      }
    end
    # rubocop:enable Metrics/CyclomaticComplexity

    def non_optimal_feedback_string
      spelling_rule&.determine_feedback_from_history(@feedback_history)&.text || FALLBACK_INCORRECT_FEEDBACK
    end

    def error
      bing_response['error'] ? bing_response['error']['message'] : nil
    end

    private def spelling_rule
      return @spelling_rule if @spelling_rule

      @spelling_rule ||= Rule.where(rule_type: FEEDBACK_TYPE).first
    end

    private def highlight
      misspelled.map {|m| { type: RESPONSE_TYPE, id: nil, text: m['token']}}
    end

    private def optimal?
      misspelled.empty?
    end

    private def misspelled
      bing_response['flaggedTokens']&.reject {|r| r['token']&.downcase&.in?(EXCEPTIONS)} || []
    end

    private def bing_response
      @response ||= HTTParty.get(BING_API_URL.to_s,
        headers: {
          "Ocp-Apim-Subscription-Key": ENV['BING_SPELL_KEY']
        },
        query: {
          text: @entry,
          mode: "proof"
        },
        timeout: API_TIMEOUT
      )
      # The rest of this code basically swallows any errors, but we want
      # to avoid swallowing errors around rate limiting, so raise those here
      raise BingRateLimitException if @response.code == 429

      JSON.parse(@response.body)
    rescue *Evidence::HTTP_TIMEOUT_ERRORS
      raise BingTimeoutError, TIMEOUT_ERROR_MESSAGE
    end
  end
end
