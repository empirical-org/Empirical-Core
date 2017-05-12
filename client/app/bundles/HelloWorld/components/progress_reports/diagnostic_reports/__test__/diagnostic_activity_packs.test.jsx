import React from 'react'
import { shallow } from 'enzyme'
import $ from 'jquery'

import DiagnosticActivityPacks from '../diagnostic_activity_packs'
import EmptyDiagnosticProgressReport from '../empty_diagnostic_progress_report'
import LoadingSpinner from '../../../shared/loading_indicator.jsx'
import Units from '../../../lesson_planner/manage_units/units.jsx'

const units = [
  {unit:
    {id:47038,
      name:'Diagnostic',
      created_at:'2016-09-29T23:59:19.444Z',
      updated_at:'2017-04-03T14:28:11.668Z',
      visible:true,
      user_id:46978},
      classroom_activities:
        [
          {
            id:391646,
            classroom_id:57126,
            unit_id:47038,
            activity_id:413,
            due_date:null,
            created_at: '2016-09-29T23:59:19.456Z',
            updated_at:'2016-09-29T23:59:19.456Z',
            formatted_due_date: '',
            activity:
              {
                uid:'fNAwNLJDkc2T8O5lBeJQwg',
                id:413,
                name:'Sentence Structure Diagnostic',
                description:'Assess students on eight areas of sentence structure. Quill then recommends up to eight weeks of instruction based on the results.',
                flags: ['production'],
                data:null,
                created_at:'2016-09-21T16:04:09.248Z',
                updated_at:'2017-03-23T18:41:05.568Z',
                anonymous_path:'/activity_sessions/anonymous?activity_id=413',
                classification:
                  {
                    uid:'vrG0Fh3VobdALnbs9x-xdA',
                    id:4,
                    name:'Quill Diagnostic',
                    key:'diagnostic',
                    form_url:'https://connect.quill.org/#/play/diagnostic/',
                    module_url:'https://connect.quill.org/#/play/diagnostic/',
                    created_at:'2016-09-21T16:02:30.676Z',
                    updated_at:'2017-03-23T18:24:10.107Z',
                    image_class:'icon-diagnostic-gray',
                    alias:'Quill Diagnostic',
                    scorebook_icon_class:'icon-diagnostic'
                  },
                topic:
                  {
                    id:86,
                    name:'Diagnostic',
                    created_at:'2016-09-21T16:00:39.602Z',
                    updated_at:'2017-03-21T14:37:05.253Z',
                    section:
                    {
                      id:35,
                      name:'Diagnostic',
                      created_at:'2016-09-21T16:00:34.892Z',
                      updated_at:'2016-09-21T16:21:28.416Z'
                    },
                    topic_category:
                    {
                      id:17,
                      name:'Diagnostics',
                      created_at:'2016-09-21T15:54:00.644Z',
                      updated_at:'2016-09-21T15:56:02.889Z'
                  }
                }
              },
        classroom:
          {
          id:57126,
        name:'Teacher',
        code:'bland-silk',
        grade:8,
        updated_at:'2016-09-29T23:56:07.354Z'}}],
        num_students_assigned:1,
        classrooms:
        [
          {
            id:57126,
        name:'Teacher',
        code:'bland-silk',
        grade:'8',
        updated_at:'2016-09-29T23:56:07.354Z'}]
  },

  {
    unit:
    {
      id:1,
      name:'Diagnostic',
      created_at:'2016-09-29T19:15:57.782Z',
      updated_at:'2017-04-03T14:28:11.042Z',
      visible: true,
      user_id: 25
    },
    classroom_activities:[
      {
      id:12,
      classroom_id:3,
      unit_id:1,
      activity_id:413,
      due_date:null,
      created_at:'2016-09-29T19:15:57.788Z',
      updated_at:'2016-09-29T19:15:57.788Z',
      formatted_due_date:'',
      activity:
        {
          uid:'fNAwNLJDkc2T8O5lBeJQwg',
          id:413,
          name:'Sentence Structure Diagnostic',
          description:'Assess students on eight areas of sentence structure. Quill then recommends up to eight weeks of instruction based on the results.',
          flags:['production'],
          data:null,
          created_at:'2016-09-21T16:04:09.248Z',
          updated_at:'2017-03-23T18:41:05.568Z',
          anonymous_path:'/activity_sessions/anonymous?activity_id=413',
          classification:
            {
              uid:'vrG0Fh3VobdALnbs9x-xdA',
              id:4,
              name:'Quill Diagnostic',
              key:'diagnostic',
              form_url:'https://connect.quill.org/#/play/diagnostic/',
              module_url:'https://connect.quill.org/#/play/diagnostic/',
              created_at:'2016-09-21T16:02:30.676Z',
              updated_at:'2017-03-23T18:24:10.107Z',
              image_class:'icon-diagnostic-gray',
              alias:'Quill Diagnostic',
              scorebook_icon_class:'icon-diagnostic'
            },
            topic:
              {
                id:86,
                name:'Diagnostic',
                created_at:'2016-09-21T16:00:39.602Z',
                updated_at:'2017-03-21T14:37:05.253Z',
                section:
                  {
                    id:35,
                    name:'Diagnostic',
                    created_at:'2016-09-21T16:00:34.892Z',
                    updated_at:'2016-09-21T16:21:28.416Z'
                  },
                topic_category:
                  {
                    id:17,
                    name:'Diagnostics',
                    created_at:'2016-09-21T15:54:00.644Z',
                    updated_at:'2016-09-21T15:56:02.889Z'
                  }
                }
              },
                classroom:{
                  id:3,
                  name:'2017',
                  code:'rusty-seat',
                  grade:8,
                  updated_at:'2016-08-30T21:12:24.863Z'
                }
              }
                ],
                  num_students_assigned:84,
                  classrooms:[
                    {
                      id:3,
                      name:'2017',
                      code:'rusty-seat',
                      grade:8,
                      updated_at:'2016-08-30T21:12:24.863Z'
                    },
                    {
                      id:4,
                      name:'2019',
                      code:'swift-recess',
                      grade:6,
                      updated_at:'2016-08-30T21:13:43.031Z'
                    },
                    {
                      id:5,
                      name:'2018',
                      code:'funny-coat',
                      grade:'7',
                      updated_at:'2016-09-14T20:30:01.603Z'
                    }
                  ]
                }
              ]

describe ('DiagnosticActivityPacks component', () => {
  // jest.mock('jquery', () => {
  //   return {
  //     ajax: jest.fn().mockReturnValue({
  //       success: jest.fn()
  //     })
  //   };
  // });
  //
  it('initializes state with an empty array of units, loaded being false, and a blank string diagnosticStatus', () => {
    const wrapper = shallow(<DiagnosticActivityPacks/>)

    expect(wrapper.state('units').length).toEqual(0)
    expect(wrapper.state('loaded')).toEqual(false)
    expect(wrapper.state('diagnosticStatus')).toEqual('')
  })

  describe('when displayUnits gets called', () => {
    const wrapper = shallow(<DiagnosticActivityPacks/>)
    wrapper.instance().displayUnits({units})

    it('sets state with loaded true and units as the passed data', () => {
      expect(wrapper.state('units')).toEqual(units)
      expect(wrapper.state('loaded')).toEqual(true)
    })
  })

  it('renders a LoadingSpinner if loaded is false', () => {
    const wrapper = shallow(<DiagnosticActivityPacks/>)
    expect(wrapper.find(LoadingSpinner)).toHaveLength(1)
  })

  it('renders an EmptyDiagnosticProgressReport if loaded is true and units.length == 0', () => {
    const wrapper = shallow(<DiagnosticActivityPacks/>)
    wrapper.setState({loaded: true})
    expect(wrapper.find(EmptyDiagnosticProgressReport)).toHaveLength(1)
  })

  it('calls goToDiagnosticReport if loaded is true and units.length == 1', () => {
    const wrapper = shallow(<DiagnosticActivityPacks/>)
    const mockGoToDiagnosticReport = jest.fn()
    wrapper.instance().goToDiagnosticReport = mockGoToDiagnosticReport
    wrapper.setState({loaded: true, units: [units[0]]})
    expect(mockGoToDiagnosticReport.mock.calls).toHaveLength(1)
  })

  it('renders units if there is more than one unit', () => {
    const wrapper = shallow(<DiagnosticActivityPacks/>)
    wrapper.setState({loaded: true, units})

    expect(wrapper.find(Units)).toHaveLength(1)
  })

})
