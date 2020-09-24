import React from 'react';
import { Input, } from '../../../../../Shared/index'

const searchIconSrc = `${process.env.CDN_URL}/images/icons/search.svg`

const SearchActivitiesInput = ({ searchQuery, updateSearchQuery, }) => (
  <div className="search-activities">
    <img alt="Magnifying glass" src={searchIconSrc} />
    <Input
      handleChange={updateSearchQuery}
      label="Search concepts and activities"
      placeholder="e.g., Adjectives"
      value={searchQuery}
    />
  </div>
)

export default SearchActivitiesInput
