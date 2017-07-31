class LessonRecommendations
    def rec_activities(rec_id)
      UnitTemplate.find(rec_id).activities.map {|act| {name: act.name, url: 'placeholder_url'}}
    end
    def recs_for_413
        [
            # {
            #     recommendation: 'Fragments',
            #     activityPackId: 28,
            #     requirements: [
            #         {
            #             concept_id: 'j89kdRGDVjG8j37A12p37Q',
            #             count: 3
            #         },
            #         {
            #             concept_id: 'KfA8-dg8FvlJz4eY0PkekA',
            #             count: 6
            #         },
            #         {
            #             concept_id: 'LH3szu784pXA5k2N9lxgdA',
            #             count: 3
            #         }
            #     ]
            # },

            {
                recommendation: 'Compound Subjects, Objects, and Predicates',
                activityPackId: 24,
                activities: rec_activities(24),
                requirements: [
                    {
                        concept_id: 'Jl4ByYtUfo4VhIKpMt23yA',
                        count: 1
                    },
                    {
                        concept_id: 'QNkNRs8zbCXU7nLBeo4mgA',
                        count: 1
                    }
                ]
            },

            {
                recommendation: 'Adjectives',
                activityPackId: 23,
                activities: rec_activities(24),
                requirements: [
                    {
                        concept_id: 'oCQCO1_eVXQ2zqw_7QOuBw',
                        count: 1
                    }
                ]
            },

            {
                recommendation: 'Adverbs of Manner',
                activityPackId: 25,
                activities: rec_activities(24),
                requirements: [
                    {
                        concept_id: 'GZ04vHSTxWUTzhWMGfwcUQ',
                        count: 1
                    }
                ]
            },

            {
                recommendation: 'Compound Sentences',
                activityPackId: 22,
                activities: rec_activities(24),
                requirements: [
                    {
                        concept_id: 'GiUZ6KPkH958AT8S413nJg',
                        count: 2
                    },
                    {
                        concept_id: 'Qqn6Td-zR6NIAX43NOHoCg',
                        count: 1
                    },
                    {
                        concept_id: 'hJKqVOkQQQgfEsmzOWC1xw',
                        count: 1
                    },
                    {
                        concept_id: 'tSSLMHqX0q-9mKTJHSyung',
                        count: 1
                    }
                ]
            },

            {
                recommendation: 'Complex Sentences',
                activityPackId: 21,
                activities: rec_activities(24),
                requirements: [
                    {
                        concept_id: 'nb0JW1r5pRB5ouwAzTgMbQ',
                        count: 2
                    },
                    {
                        concept_id: 'Q8FfGSv4Z9L2r1CYOfvO9A',
                        count: 2
                    },
                    {
                        concept_id: 'S8b-N3ZrB50CWgxD5yg8yQ',
                        count: 1
                    },
                    {
                        concept_id: '7H2IMZvq0VJ4Uvftyrw7Eg',
                        count: 1
                    }
                ]
            },

            {
                recommendation: 'Appositives and Modifying Phrases',
                activityPackId: 27,
                activities: rec_activities(24),
                requirements: [
                    {
                        concept_id: 'InfGdB6Plr2M930kqsn63g',
                        count: 1
                    },
                    {
                        concept_id: 'GLjAExmqZShBTZ7DQGvVLw',
                        count: 1
                    }
                ]
            },

            {
                recommendation: 'Parallel Structure',
                activityPackId: 29,
                activities: rec_activities(24),
                requirements: [
                    {
                        concept_id: '1ohLyApTz7lZ3JszrA98Xg',
                        count: 1
                    }
                ]
            }
        ]
    end

    def recs_for_447
      [
        # {
        #     recommendation: 'Fragments',
        #     activityPackId: 28,
        # activities: rec_activities(24),
        #     requirements: [
        #         {
        #             concept_id: 'KfA8-dg8FvlJz4eY0PkekA',
        #             count: 0,
        #             noIncorrect: true
        #         }
        #     ]
        # },
        {
            recommendation: 'Articles',
            activityPackId: 2,
            activities: rec_activities(24),
            requirements: [
                {
                    concept_id: 'fJXVAoYCC8S9kByua0kXXA',
                    count: 0,
                    noIncorrect: true
                },
                {
                    concept_id: 'XHUbxx87N7TK1F-tiaNy-A',
                    count: 0,
                    noIncorrect: true
                },
                {
                    concept_id: '5s-r1281DV8EpHyc9qJfiw',
                    count: 0,
                    noIncorrect: true
                },
                {
                    concept_id: 'QsC1lua0t41_J2em_c7kUA',
                    count: 0,
                    noIncorrect: true
                }
            ]
        },
        {
            recommendation: 'Verb Tense',
            activityPackId: 10,
            activities: rec_activities(24),
            requirements: [
                {
                    concept_id: 'TE-ElKaRWWumTrmVE4-m6g',
                    count: 0,
                    noIncorrect: true
                },
                {
                    concept_id: 'RPNqOZuka_n8RESKbBF8OQ',
                    count: 0,
                    noIncorrect: true
                },
                {
                    concept_id: '9ZPpieSHhlMYQkEvrhQP1w',
                    count: 0,
                    noIncorrect: true
                },
                {
                    concept_id: 'YeioybAcmeBNsp3KRb9aow',
                    count: 0,
                    noIncorrect: true
                },
                {
                    concept_id: '1mXma17dtAL7NGmJRU80bQ',
                    count: 0,
                    noIncorrect: true
                },
                {
                    concept_id: 'TPm4a19NUn2RlKLCbPbVUw',
                    count: 0,
                    noIncorrect: true
                }
            ]
        },
        {
            recommendation: 'Prepositions',
            activityPackId: 7,
            activities: rec_activities(24),
            requirements: [
                {
                    concept_id: "LPMBB_M5hooC263qXFc_Yg",
                    count: 0,
                    noIncorrect: true
                },
                {
                    concept_id: "lD5FBHF-FEPpsFG0SXlcfQ",
                    count: 0,
                    noIncorrect: true
                },
                {
                    concept_id: "FZ0wa0oqQ-6ELHf1gzVJjw",
                    count: 0,
                    noIncorrect: true
                },
                {
                    concept_id: "wpzl6e2NhXcBaKDC11K4NA",
                    count: 0,
                    noIncorrect: true
                },
                {
                    concept_id: "iY2_MBNxcVgzH3xmnyeEJA",
                    count: 0,
                    noIncorrect: true
                }
            ]
        },
        {
            recommendation: 'Adjectives',
            activityPackId: 23,
            activities: rec_activities(24),
            requirements: [
                {
                    concept_id: 'KvF_BYehx-U2Mk5oGbcjBw',
                    count: 1,
                    noIncorrect: true
                }
            ]
        },
        {
            recommendation: 'Adverbs',
            activityPackId: 25,
            activities: rec_activities(24),
            requirements: [
                {
                    concept_id: 'GZ04vHSTxWUTzhWMGfwcUQ',
                    count: 1,
                    noIncorrect: true
                },
                {
                    concept_id: 'opY7bPUsNUMBk3FFhZ0wog',
                    count: 0,
                    noIncorrect: true
                }
            ]
        },
        {
            recommendation: 'Subject Verb Agreement',
            activityPackId: 24,
            activities: rec_activities(24),
            requirements: [
                {
                    concept_id: 'Jl4ByYtUfo4VhIKpMt23yA',
                    count: 1,
                    noIncorrect: true
                },
                {
                    concept_id: 'Tlhrx6Igxn6cR_SD1U5efA',
                    count: 0,
                    noIncorrect: true
                }
            ]
        },
        {
            recommendation: 'Compound Sentences',
            activityPackId: 22,
            activities: rec_activities(24),
            requirements: [
                {
                    concept_id: 'tSSLMHqX0q-9mKTJHSyung',
                    count: 1,
                    noIncorrect: true
                },
                {
                    concept_id: 'R3sBcYAvoXP2_oNVXiA98g',
                    count: 0,
                    noIncorrect: true
                },
                {
                    concept_id: 'GiUZ6KPkH958AT8S413nJg',
                    count: 1,
                    noIncorrect: true
                }
            ]
        },
        {
            recommendation: 'Complex Sentences',
            activityPackId: 21,
            activities: rec_activities(24),
            requirements: [
                {
                    concept_id: '7H2IMZvq0VJ4Uvftyrw7Eg',
                    count: 1,
                    noIncorrect: true
                },
                {
                    concept_id: '6gQZPREURQQAaSzpIt_EEw',
                    count: 0,
                    noIncorrect: true
                },
                {
                    concept_id: 'nb0JW1r5pRB5ouwAzTgMbQ',
                    count: 0,
                    noIncorrect: true
                },
                {
                    concept_id: 'Q8FfGSv4Z9L2r1CYOfvO9A',
                    count: 0,
                    noIncorrect: true
                }
            ]
        },
        {
            recommendation: 'Capitalization',
            activityPackId: 33,
            activities: rec_activities(24),
            requirements: [
                {
                    concept_id: '66upe3S5uvqxuHoHOt4PcQ',
                    count: 0,
                    noIncorrect: true
                }
            ]
        },


      ]
    end
end
