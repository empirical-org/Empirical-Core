import React from 'react'
import {Icon, Input, AutoComplete} from 'antd'
import { Concept } from '../containers/ConceptsEdit';

const Option = AutoComplete.Option;
const OptGroup = AutoComplete.OptGroup;

export interface ConceptSearchProps {
  concepts: Array<Concept>
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
  })

  const dataSource =  Object.keys(groupings).map((group) => {
    return {
      title: group,
      children: groupings[group]
    }
  });
  console.log(dataSource);
  return dataSource;
}

function renderOptions(concepts){
  console.log("rendering options")
  const dataSource = formatSearch(concepts)

  return dataSource.map(group => (
    <OptGroup
      key={group.title}
      label={group.title}
    >
      {group.children.map(opt => (
        <Option key={opt.id} value={opt.id}>
          {opt.title}
        </Option>
      ))}
    </OptGroup>
  ));
}

const ConceptSearch: React.SFC<ConceptSearchProps> =  ({concepts}) => {
  return (
    <div className="certain-category-search-wrapper" style={{ width: 250 }}>
      <AutoComplete
        className="certain-category-search"
        dropdownClassName="certain-category-search-dropdown"
        dropdownMatchSelectWidth={false}
        dropdownStyle={{ width: 300 }}
        size="large"
        style={{ width: '100%' }}
        dataSource={renderOptions(concepts)}
        placeholder="input here"
        optionLabelProp="value"
      >
        <Input suffix={<Icon type="search" className="certain-category-icon" />} />
      </AutoComplete>
    </div>
  )
}

export default ConceptSearch