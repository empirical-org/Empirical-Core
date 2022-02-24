# frozen_string_literal: true

require 'json'
require 'rails_helper'

describe Api::V1::ActiveActivitySessionsController, type: :controller do
  let!(:active_activity_session) { create(:active_activity_session) }

  describe "#show" do
    it "should return the specified active_activity_session" do
      get :show, params: { id: active_activity_session.uid }, as: :json
      expect(JSON.parse(response.body)).to eq(active_activity_session.data)
    end

    it "should return a 404 if the requested activity session is not found" do
      get :show, params: { id: 'doesnotexist' }, as: :json
      expect(response.status).to eq(404)
      expect(response.body).to include("The resource you were looking for does not exist")
    end
  end

  describe "#update" do
    let(:update_payload) do
      {
        "updatedAt": 1593741284430,
        "questionSet": [
            {
                "attempts": [],
                "question": "-LLpg811AFtOLArzxhGD"
            },
            {
                "attempts": [],
                "question": "-LLpge97AyWoQvHD1x-z"
            },
            {
                "attempts": [],
                "question": "-LLpgiatjAx6rqO7WSFM"
            },
            "-LLpgoQ5htJoVCvD7UVm",
            "-LLpgzQe__AE9qPPyGjI",
            "-LLph6mZ4dNZBKbUp85P",
            "-LLphFPNUJTDPT_c6051",
            "-LLphUnDFXlV1j9U-Lhn",
            "-LLph_7oSgbIcaghSm0O",
            "-LLpheCBnjyVA-sn0dJl",
            "-LLphovfRQrIM6fPwQMu"
        ],
        "currentQuestion": {
            "attempts": [
                {
                    "response": {
                        "text": "I saw the Mayor give a speech at Richmond city hall.",
                        "count": 1,
                        "author": "Incorrect Sequence Hint",
                        "feedback": "<p>Revise your work. Only capitalize a job title if it comes before a name.</p>",
                        "parent_id": 7641004,
                        "question_uid": "-LLpgiatjAx6rqO7WSFM",
                        "concept_results": {
                            "nrq-IGTxmwLxyr_hieouGg": {
                                "key": "nrq-IGTxmwLxyr_hieouGg",
                                "name": "Capitalization | Capitalizing Formal Titles | Capitalize Formal Titles",
                                "correct": false,
                                "conceptUID": "nrq-IGTxmwLxyr_hieouGg"
                            }
                        }
                    }
                },
                {
                    "response": {
                        "text": "I saw the Mayor give a speech at Richmond City Hall.",
                        "count": 1,
                        "author": "Incorrect Sequence Hint",
                        "feedback": "<p>Revise your work. Only capitalize a job title if it comes before a name.</p>",
                        "parent_id": 7641004,
                        "question_uid": "-LLpgiatjAx6rqO7WSFM",
                        "concept_results": {
                            "nrq-IGTxmwLxyr_hieouGg": {
                                "key": "nrq-IGTxmwLxyr_hieouGg",
                                "name": "Capitalization | Capitalizing Formal Titles | Capitalize Formal Titles",
                                "correct": false,
                                "conceptUID": "nrq-IGTxmwLxyr_hieouGg"
                            }
                        }
                    }
                },
                {
                    "response": {
                        "text": "I saw the Mayor give a speech at Richmond city Hall.",
                        "count": 1,
                        "author": "Incorrect Sequence Hint",
                        "feedback": "<p>Revise your work. Only capitalize a job title if it comes before a name.</p>",
                        "parent_id": 7641004,
                        "question_uid": "-LLpgiatjAx6rqO7WSFM",
                        "concept_results": {
                            "nrq-IGTxmwLxyr_hieouGg": {
                                "key": "nrq-IGTxmwLxyr_hieouGg",
                                "name": "Capitalization | Capitalizing Formal Titles | Capitalize Formal Titles",
                                "correct": false,
                                "conceptUID": "nrq-IGTxmwLxyr_hieouGg"
                            }
                        }
                    }
                },
                {
                    "response": {
                        "text": "I saw the Mayor give a speech at Richmond City hall.",
                        "count": 1,
                        "author": "Incorrect Sequence Hint",
                        "feedback": "<p>Revise your work. Only capitalize a job title if it comes before a name.</p>",
                        "parent_id": 7641004,
                        "question_uid": "-LLpgiatjAx6rqO7WSFM",
                        "concept_results": {
                            "nrq-IGTxmwLxyr_hieouGg": {
                                "key": "nrq-IGTxmwLxyr_hieouGg",
                                "name": "Capitalization | Capitalizing Formal Titles | Capitalize Formal Titles",
                                "correct": false,
                                "conceptUID": "nrq-IGTxmwLxyr_hieouGg"
                            }
                        }
                    }
                }
            ],
            "question": "-LLpgiatjAx6rqO7WSFM"
        },
        "answeredQuestions": [
            {
                "attempts": [
                    {
                        "response": {
                            "text": "The President is originally from North Dakota.",
                            "count": 1,
                            "author": "Incorrect Sequence Hint",
                            "feedback": "<p>Revise your work. Remember, only capitalize a job title if it comes before a name.</p>",
                            "parent_id": 7623759,
                            "question_uid": "-LLpg811AFtOLArzxhGD",
                            "concept_results": {
                                "nrq-IGTxmwLxyr_hieouGg": {
                                    "key": "nrq-IGTxmwLxyr_hieouGg",
                                    "name": "Capitalization | Capitalizing Formal Titles | Capitalize Formal Titles",
                                    "correct": false,
                                    "conceptUID": "nrq-IGTxmwLxyr_hieouGg"
                                }
                            }
                        }
                    },
                    {
                        "response": {
                            "text": "he President is originally from North Dakota.",
                            "count": 1,
                            "author": "Incorrect Sequence Hint",
                            "feedback": "<p>Revise your work. Remember, only capitalize a job title if it comes before a name.</p>",
                            "parent_id": 7623759,
                            "question_uid": "-LLpg811AFtOLArzxhGD",
                            "concept_results": {
                                "nrq-IGTxmwLxyr_hieouGg": {
                                    "key": "nrq-IGTxmwLxyr_hieouGg",
                                    "name": "Capitalization | Capitalizing Formal Titles | Capitalize Formal Titles",
                                    "correct": false,
                                    "conceptUID": "nrq-IGTxmwLxyr_hieouGg"
                                }
                            }
                        }
                    },
                    {
                        "response": {
                            "text": "the President is originally from North Dakota.",
                            "count": 1,
                            "author": "Incorrect Sequence Hint",
                            "feedback": "<p>Revise your work. Remember, only capitalize a job title if it comes before a name.</p>",
                            "parent_id": 7623759,
                            "question_uid": "-LLpg811AFtOLArzxhGD",
                            "concept_results": {
                                "nrq-IGTxmwLxyr_hieouGg": {
                                    "key": "nrq-IGTxmwLxyr_hieouGg",
                                    "name": "Capitalization | Capitalizing Formal Titles | Capitalize Formal Titles",
                                    "correct": false,
                                    "conceptUID": "nrq-IGTxmwLxyr_hieouGg"
                                }
                            }
                        }
                    },
                    {
                        "response": {
                            "text": "the President is originally from north Dakota.",
                            "count": 1,
                            "author": "Incorrect Sequence Hint",
                            "feedback": "<p>Revise your work. Remember, only capitalize a job title if it comes before a name.</p>",
                            "parent_id": 7623759,
                            "question_uid": "-LLpg811AFtOLArzxhGD",
                            "concept_results": {
                                "nrq-IGTxmwLxyr_hieouGg": {
                                    "key": "nrq-IGTxmwLxyr_hieouGg",
                                    "name": "Capitalization | Capitalizing Formal Titles | Capitalize Formal Titles",
                                    "correct": false,
                                    "conceptUID": "nrq-IGTxmwLxyr_hieouGg"
                                }
                            }
                        }
                    },
                    {
                        "response": {
                            "text": "The president is originally from north Dakota.",
                            "count": 1,
                            "author": "Incorrect Sequence Hint",
                            "feedback": "<p>Revise your work. Always capitalize the names of cities, countries, or states.</p>",
                            "parent_id": 7623759,
                            "question_uid": "-LLpg811AFtOLArzxhGD",
                            "concept_results": {
                                "YkA1YFe-dUvXqkEXxbNgQw": {
                                    "name": "Capitalization | Capitalize Geographic Names | Capitalize Geographic Names",
                                    "correct": false,
                                    "conceptUID": "YkA1YFe-dUvXqkEXxbNgQw"
                                }
                            }
                        }
                    }
                ],
                "question": "-LLpg811AFtOLArzxhGD"
            },
            {
                "attempts": [
                    {
                        "response": {
                            "text": "I have maths class with Mr. Jenkins on Tuesday and english class on Thursday.",
                            "count": 1,
                            "author": "Incorrect Sequence Hint",
                            "feedback": "<p>Revise your work. Capitalize a class name when it&#x27;s a language like <em>English</em> or <em>Spanish</em>.</p>",
                            "parent_id": 7641019,
                            "question_uid": "-LLpge97AyWoQvHD1x-z",
                            "concept_results": {
                                "66upe3S5uvqxuHoHOt4PcQ": {
                                    "key": "66upe3S5uvqxuHoHOt4PcQ",
                                    "name": "Capitalization | Capitalization | Capitalization",
                                    "correct": false,
                                    "conceptUID": "66upe3S5uvqxuHoHOt4PcQ"
                                }
                            }
                        }
                    },
                    {
                        "response": {
                            "text": "I have Maths class with Mr. Jenkins on Tuesday and English class on Thursday.",
                            "count": 1,
                            "author": "Incorrect Sequence Hint",
                            "feedback": "<p>Revise your work. Only capitalize the name of a class when it&#x27;s the official name like <em>Introduction to Biology 101 </em>or when it&#x27;s a language like<em> English</em>.</p>",
                            "parent_id": 7641019,
                            "question_uid": "-LLpge97AyWoQvHD1x-z",
                            "concept_results": {
                                "66upe3S5uvqxuHoHOt4PcQ": {
                                    "key": "66upe3S5uvqxuHoHOt4PcQ",
                                    "name": "Capitalization | Capitalization | Capitalization",
                                    "correct": false,
                                    "conceptUID": "66upe3S5uvqxuHoHOt4PcQ"
                                }
                            }
                        }
                    },
                    {
                        "response": {
                            "text": "I have Maths Class with Mr. Jenkins on Tuesday and English Class on Thursday.",
                            "count": 1,
                            "author": "Incorrect Sequence Hint",
                            "feedback": "<p>Revise your work. Only capitalize the name of a class when it&#x27;s the official name like <em>Introduction to Biology 101 </em>or when it&#x27;s a language like<em> English</em>.</p>",
                            "parent_id": 7641019,
                            "question_uid": "-LLpge97AyWoQvHD1x-z",
                            "concept_results": {
                                "66upe3S5uvqxuHoHOt4PcQ": {
                                    "key": "66upe3S5uvqxuHoHOt4PcQ",
                                    "name": "Capitalization | Capitalization | Capitalization",
                                    "correct": false,
                                    "conceptUID": "66upe3S5uvqxuHoHOt4PcQ"
                                }
                            }
                        }
                    },
                    {
                        "response": {
                            "text": "I have Maths Class with Mr. Jenkins on Tuesday and English class on Thursday.",
                            "count": 1,
                            "author": "Incorrect Sequence Hint",
                            "feedback": "<p>Revise your work. Only capitalize the name of a class when it&#x27;s the official name like <em>Introduction to Biology 101 </em>or when it&#x27;s a language like<em> English</em>.</p>",
                            "parent_id": 7641019,
                            "question_uid": "-LLpge97AyWoQvHD1x-z",
                            "concept_results": {
                                "66upe3S5uvqxuHoHOt4PcQ": {
                                    "key": "66upe3S5uvqxuHoHOt4PcQ",
                                    "name": "Capitalization | Capitalization | Capitalization",
                                    "correct": false,
                                    "conceptUID": "66upe3S5uvqxuHoHOt4PcQ"
                                }
                            }
                        }
                    },
                    {
                        "response": {
                            "text": "I have Maths class with Mr. Jenkins on Tuesday and English class on Thursday.",
                            "count": 1,
                            "author": "Incorrect Sequence Hint",
                            "feedback": "<p>Revise your work. Only capitalize the name of a class when it&#x27;s the official name like <em>Introduction to Biology 101 </em>or when it&#x27;s a language like<em> English</em>.</p>",
                            "parent_id": 7641019,
                            "question_uid": "-LLpge97AyWoQvHD1x-z",
                            "concept_results": {
                                "66upe3S5uvqxuHoHOt4PcQ": {
                                    "key": "66upe3S5uvqxuHoHOt4PcQ",
                                    "name": "Capitalization | Capitalization | Capitalization",
                                    "correct": false,
                                    "conceptUID": "66upe3S5uvqxuHoHOt4PcQ"
                                }
                            }
                        }
                    }
                ],
                "question": "-LLpge97AyWoQvHD1x-z"
            }
        ],
        "unansweredQuestions": [
            "-LLpgoQ5htJoVCvD7UVm",
            "-LLpgzQe__AE9qPPyGjI",
            "-LLph6mZ4dNZBKbUp85P",
            "-LLphFPNUJTDPT_c6051",
            "-LLphUnDFXlV1j9U-Lhn",
            "-LLph_7oSgbIcaghSm0O",
            "-LLpheCBnjyVA-sn0dJl",
            "-LLphovfRQrIM6fPwQMu"
        ],
        "passage": []
      }
    end

    it 'performance testing', :benchmarking do
      create_list(:active_activity_session, 100)
      Benchmark.bm do |x|
        x.report do
          uids = ActiveActivitySession.all.pluck(:uid)
          uids.each do |uid|
            put :update, params: { id: active_activity_session.uid, active_activity_session: update_payload }, as: :json
          end
        end
      end
    end


    it "should update the existing record" do
      data = {"foo" => "bar"}
      put :update, params: { id: active_activity_session.uid, active_activity_session: data }, as: :json
      active_activity_session.reload
      expect(active_activity_session.data).to eq(data)
    end

    it "should filter out uid" do
      data = {"foo" => "bar", "uid" => "this-should-be-filtered-out" }
      put :update, params: { id: active_activity_session.uid, active_activity_session: data }, as: :json
      active_activity_session.reload
      expect(active_activity_session.data).to eq({"foo" => "bar"})
    end

    it "should handle proofreader nested passage data" do
      old_data = active_activity_session.data

      new_data = {
        "passage" => [
          [
            { "originalText" => "fred", "currentText" => "Fred"},
            { "originalText" => "fred", "currentText" => "freD"}
          ],
          [],
          [
            { "originalText" => "bill", "currentText" => "Bill"},
            { "originalText" => "bill", "currentText" => "bill"}
          ]
        ]
      }

      put :update, params: { id: active_activity_session.uid, active_activity_session: new_data }, as: :json
      active_activity_session.reload
      expect(active_activity_session.data).to eq(old_data.merge(new_data))
    end

    it "should handle nested data" do
      old_data = active_activity_session.data

      new_data = {
        "answeredQuestions" => [
          {
            "attempts" => [
              {
                "response" => "{\"child_count\":2468}"
              }
            ],
            "question" => "-LOKpH-21lwuPa"
          }
        ]
      }

      put :update, params: { id: active_activity_session.uid, active_activity_session: new_data }, as: :json
      active_activity_session.reload
      expect(active_activity_session.data).to eq(old_data.merge(new_data))
    end

    it 'should include all top level hash keys in payload' do
      active_activity_session1 = create(:active_activity_session, data: {questionSet: []})
      put :update, params: { id: active_activity_session1.uid, active_activity_session: update_payload }, as: :json
      active_activity_session1.reload

      update_payload_property_set = update_payload.keys.map(&:to_s)
      result_property_set = active_activity_session1.data.keys
      expect(update_payload_property_set - result_property_set).to eq []
    end


    it "should create a new session if the requested activity session is not found" do
      data = {"foo" => "bar"}
      put :update, params: { id: 'doesnotexist', active_activity_session: data }, as: :json
      expect(response.status).to eq(204)
      new_activity_session = ActiveActivitySession.find_by(uid: 'doesnotexist')
      expect(new_activity_session).to be
      expect(new_activity_session.data).to eq(data)
    end

    it "should retain the values in keys not updated in the payload" do
      old_data = active_activity_session.data
      new_data = {"newkey" => "newvalue"}
      put :update, params: { id: active_activity_session.uid, active_activity_session: new_data }, as: :json
      active_activity_session.reload
      expect(active_activity_session.data.keys).to eq(old_data.keys + new_data.keys)
    end

    it "should not raise an ActiveRecord::RecordNotUnique error if that is raised during the first save attempt but not raised on retry" do
      call_count = 0
      allow_any_instance_of(ActiveActivitySession).to receive(:save!) do
        call_count += 1
        raise(ActiveRecord::RecordNotUnique, 'Error') if call_count == 1

        true
      end
      put :update, params: { id: active_activity_session.uid, active_activity_session: active_activity_session.data }
    end

    it "should raise an ActiveRecord::RecordNotUnique error if that is raised both during save and on retry" do
      err = ActiveRecord::RecordNotUnique.new('Error')
      allow_any_instance_of(ActiveActivitySession).to receive(:save!).and_raise(err)
      expect do
        put :update,
          params: {
            id: active_activity_session.uid,
            active_activity_session: active_activity_session.data
          },
          as: :json
      end.to raise_error(err)
    end
  end

end
