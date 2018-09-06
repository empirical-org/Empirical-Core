import React, {Component} from 'react'
import {Icon, Input, AutoComplete} from 'antd'
import { Concept } from '../containers/ConceptsEdit';
import { OptGroupProps } from 'antd/lib/select';
import Fuse from 'fuse.js';

const Option = AutoComplete.Option;
const OptGroup = AutoComplete.OptGroup;

export interface ConceptSearchProps {
  concepts: Array<Concept>
  searchValue: string
  updateSearchValue(string): null
}

export interface ConceptSearchState {
}

declare interface DataSourceChild {
  title: string
  id: string
}

declare interface DataSourceItem {
  title:string;
  children:Array<DataSourceChild>
}

function getGroupName(concept:Concept):string{
  return `${concept.parent && concept.parent.parent ? concept.parent.parent.name : 'NA'} > ${concept.parent ? concept.parent.name : 'NA'}`
}

function formatSearch(concepts:Array<Concept>):Array<DataSourceItem>{
  const groupings = {}
  concepts.forEach((concept) => {
    let group:Array<DataSourceChild>|null = groupings[getGroupName(concept)] 
    const newDataSourceChild:DataSourceChild = {
      title: concept.name,
      id: concept.id
    }
    group ? group.push(newDataSourceChild) : group = [newDataSourceChild];
    groupings[getGroupName(concept)] = group;
  })
  const dataSource =  Object.keys(groupings).map((group) => {
    return {
      title: group,
      children: groupings[group]
    }
  });
  return dataSource;
}

function getSearchableConceptName(concept: Concept):string {
  return getGroupName(concept) + ' > ' + concept.name;
}

function getAllSearchableConceptNames(concepts:Array<Concept>):Array<string>{
  return concepts.map(value => getSearchableConceptName(value))
}



function renderOptions(concepts:Array<Concept>, searchValue:string) {
  const dataSource = formatSearch(concepts);
  return dataSource.map((group) => {
    return (
      <OptGroup
        key={group.title}
        label={group.title}
      >
        {group.children.map(opt => (
          <Option key={opt.id} value={opt.title}>
            {opt.title}
          </Option>
        ))}
      </OptGroup>
    )
  });
}



class ConceptSearch extends React.Component<ConceptSearchProps, ConceptSearchState> {
  constructor(props) {
    super(props);
  }

  render() {
    const dataSource = renderOptions(this.props.concepts, this.props.searchValue);
    return (
      <div className="certain-category-search-wrapper" style={{ width: 250 }}>
        <AutoComplete
          className="certain-category-search"
          dropdownClassName="certain-category-search-dropdown"
          dropdownMatchSelectWidth={false}
          dropdownStyle={{ width: 300 }}
          size="large"
          style={{ width: '100%' }}
          dataSource={dataSource}
          onSearch={this.props.updateSearchValue}
          placeholder="input here"
          optionLabelProp="value"
        >
          <Input suffix={<Icon type="search" className="certain-category-icon" />} />
        </AutoComplete>
      </div>
    )
  }
  
}

export default ConceptSearch