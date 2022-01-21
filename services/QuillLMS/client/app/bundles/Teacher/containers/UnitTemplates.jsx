import React from 'react'
import request from 'request'
import ReactTable from 'react-table'

import LoadingSpinner from '../../Connect/components/shared/loading_indicator.jsx'
import { SortableList, } from  '../../Shared/index'
import UnitTemplateRow from './unit_template_row'
import getAuthToken from '../components/modules/get_auth_token'

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

  updateOrder = (unitTemplates, ) => {
    request.put(`${process.env.DEFAULT_URL}/cms/unit_templates/update_order_numbers`, {
      json: {
        unit_templates: unitTemplates,
        authenticity_token: getAuthToken()
      }}, (e, r, response) => {
        if (e) {
          // to do, use Sentry to capture error
          alert(`We could not save the updated order. Here is the error: ${e}`);
          return;
        } else {
          // that.setState({[resourceName]: response[resourceName]});
          alert('The updated order has been saved.');
          return;
        }
    })
  };

  renderTableRow(blogPost) {

    const { id, name, diagnostic_names, flag } = blogPost
    return (<UnitTemplateRow
      id={id}
      flag={flag}
      diagnostics={diagnostic_names}
      name={name}
    />)
  }

  tableOrEmptyMessage() {
    const { fetchedData } = this.state

    let tableOrEmptyMessage

    if (fetchedData) {
      console.log("data is fetched")
      // let dataToUse = this.getFilteredData()
      let dataToUse = fetchedData
      const unitTemplateRows = dataToUse.map((ut) => this.renderTableRow(ut))
      tableOrEmptyMessage = (
      <div class="blog-post-table">
        <table>
          {this.renderTableHeader()}
          <SortableList data={unitTemplateRows} sortCallback={this.updateOrder} />
        </table>
      </div>)
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

  renderTableHeader() {
    return (<tr>
      <th>Name</th>
      <th>Flag</th>
      <th>Diagnostics</th>
      <th>Preview</th>
      <th>Edit</th>
    </tr>)
  }


  render() {


    return (
      <div className="cms-unit-templates">
        <div className="standard-columns">
          {this.tableOrEmptyMessage()}
        </div>
      </div>

    )
  }
}
