import React from 'react'
import request from 'request'
import ReactTable from 'react-table'

import LoadingSpinner from '../../Connect/components/shared/loading_indicator.jsx'
import UnitTemplate from '../components/unit_templates/unit_template.jsx'
import Cms from './Cms.jsx'

const UNIT_TEMPLATES_URL = `${process.env.DEFAULT_URL}/cms/unit_templates.json`
const NO_DATA_FOUND_MESSAGE = "Activity Packs data could not be found. Refresh to try again, or contact the engineering team."


export default class UnitTemplates extends React.Component {

  state = {
    loadingTableData: true,
    flag: '',
    fetchedData: [],
    promptSearchInput: "",
    dataToDownload: []
  };

  shouldComponentUpdate(nextProps, nextState){
    return !(this.state === nextState)
  }

  componentDidMount() {
    this.fetchUnitTemplatesData();
  }

  fetchUnitTemplatesData() {
    this.setState({ loadingTableData: true })
    request.get({
      url: UNIT_TEMPLATES_URL,
    }, (e, r, body) => {
      let newState = {}
      if (e || r.statusCode != 200) {
        console.log("dont got it")
        newState = {
          loadingTableData: false,
          dataResults: [],
        }
      } else {
        console.log("got it")
        const data = JSON.parse(body);
        console.log(data)
        newState = {
          loadingTableData: false,
          fetchedData: data.unit_templates
        };
      }
      this.setState(newState)
    });
  }

  columnDefinitions() {
    return [
      {
        Header: 'Name',
        accessor: 'name',
        filterMethod: (filter, rows) =>
                    matchSorter(rows, filter.value, { keys: ["name"]}),
        filterAll: true,
        resizeable: true,
        minWidth: 200,
        Cell: (row) => (
          <div>
            {
              row.original['name']
            }
          </div>
        )
      },
      {
        Header: 'Flag',
        accessor: 'flags',
        filterMethod: (filter, rows) =>
                    matchSorter(rows, filter.value, { keys: ["flag"] }),
        filterAll: true,
        resizeable: true,
        Cell: (row) => (
          <div>
            {
              row.original['flag']
            }
          </div>
        )
      },
      {
        Header: 'Diagnostics',
        accessor: 'diagnostic_names',
        resizeable: true,
        Cell: (row) => (
          <div>
            {
              row.original['diagnostic_names'].map((d) => (
                <div key={d}>{d}</div>
              ))
            }
          </div>
        )
      },
      {
        Header: 'Preview',
        Cell: (row) => (
          <div>
            <a href={`${process.env.DEFAULT_URL}/assign/featured-activity-packs/${row.original.id}`} target="_blank">preview</a>
          </div>
        )
      },
      {
        Header: 'Edit',
        Cell: (row) => (
          <div>
            <a href={`${process.env.DEFAULT_URL}/cms/unit_templates/${row.original.id}/edit`} target="_blank">edit</a>
          </div>
        )
      }
    ];
  }

  tableOrEmptyMessage() {
    const { fetchedData } = this.state

    let tableOrEmptyMessage

    if (fetchedData) {
      console.log("data is fetched")
      // let dataToUse = this.getFilteredData()
      let dataToUse = fetchedData
      tableOrEmptyMessage = (<ReactTable
        className='records-table'
        columns={this.columnDefinitions()}
        data={dataToUse}
        defaultFilterMethod={(filter, row) =>
          String(row[filter.id]) === filter.value}
        defaultPageSize={dataToUse.length}
        defaultSorted={[{id: 'name', desc: false}]}
        loading={false}
        pages={1}
        ref={(r) => this.reactTable = r}
        showPageSizeOptions={false}
        showPagination={false}
        style={{height: "600px"}}
        // SubComponent={row => {
        //   return (
        //     <PromptHealth
        //       dataResults={row.original.prompt_healths}
        //     />
        //   );
        // }}
      />)
    } else {
      tableOrEmptyMessage = NO_DATA_FOUND_MESSAGE
    }
      return (
        <div>
          {tableOrEmptyMessage}
        </div>
      )
  }

  renderTable() {
    const { loadingTableData } = this.state
    if(loadingTableData) {
      return <LoadingSpinner />
    }
    return (this.tableOrEmptyMessage())
  }


  render() {
    console.log(this.props)
    console.log(this.state)
    return (
      <div className="cms-unit-templates">
        <div className="standard-columns">
          {this.renderTable()}
        </div>

        {/* <Cms
          resourceComponentGenerator={this.resourceComponentGenerator}
          resourceNamePlural='unit_templates'
          resourceNameSingular='unit_template'
        /> */}
      </div>

    )
  }
}
