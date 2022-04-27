import * as React from 'react';
import SelectSearch from 'react-select-search';
import Fuse from 'fuse.js';

import { Input } from '../../Shared';
import { requestFailed } from "../../Staff/helpers/evidence/routingHelpers";
import { SCHOOL, DISTRICT, SCHOOL_NOT_LISTED, DISTRICT_NOT_LISTED } from '../../../constants/salesForm';

const fetchDefaults = require("fetch-defaults");
const baseUrl = process.env.DEFAULT_URL;
const headerHash = {
  headers: {
    "Accept": "application/JSON",
    "Content-Type": "application/json"
  }
};
const apiFetch = fetchDefaults(fetch, baseUrl, headerHash);

export const getSchoolsAndDistricts = async (type: string) => {
  const url = `/get_options_for_sales_form?type=${type}`;
  const response = await apiFetch(url);
  const { status } = response;

  if(requestFailed(status)) {
    return { error: 'Failed to fetch school and districts. Please refresh the page.' };
  } else {
    const schoolOrDistrictOptions = await response.json();
    const { options } = schoolOrDistrictOptions;
    return { options: options };
  }
}

export function schoolSearch(options) {
  const fuse = new Fuse(options, {
      keys: ['name', 'groupName', 'items.name'],
      threshold: 0.3,
  });

  return (value) => {
    if (!value.length) {
      return options;
    }
    const results = fuse.search(value)
    if(value && !results.length) {
      return [{ name: SCHOOL_NOT_LISTED, value: SCHOOL_NOT_LISTED}];
    }
    return fuse.search(value);
  };
}

export const districtSearch = (options) => {
  const fuse = new Fuse(options, {
      keys: ['name', 'groupName', 'items.name'],
      threshold: 0.3,
  });

  return (value) => {
    if (!value.length) {
      return options;
    }
    const results = fuse.search(value)
    if(value && !results.length) {
      return [{ name: DISTRICT_NOT_LISTED, value: DISTRICT_NOT_LISTED}];
    }
    return fuse.search(value);
  };
}

export const renderSchoolOrDistrictSelect = ({
  schoolIsSelected,
  districtIsSelected,
  schoolNotListed,
  districtNotListed,
  selectedSchool,
  selectedDistrict,
  schools,
  districts,
  handleUpdateField,
  handleSchoolSearchChange,
  handleDistrictSearchChange
}) => {
  if(schoolIsSelected && !schoolNotListed) {
    return(
      <div>
        <SelectSearch
          filterOptions={schoolSearch}
          onChange={handleSchoolSearchChange}
          options={schools}
          placeholder="Search for your school"
          search={true}
        />
      </div>
    );
  }
  if(schoolNotListed) {
    return(
      <Input
        className="school"
        handleChange={handleUpdateField}
        id={SCHOOL}
        label={SCHOOL}
        placeholder=""
        value={selectedSchool}
      />
    );
  }
  if(districtIsSelected && !districtNotListed) {
    return(
      <div>
        <SelectSearch
          filterOptions={districtSearch}
          onChange={handleDistrictSearchChange}
          options={districts}
          placeholder="Search for your district"
          search={true}
        />
      </div>
    );
  }
  if(districtNotListed) {
    return(
      <Input
        className="district"
        handleChange={handleUpdateField}
        id={DISTRICT}
        label={DISTRICT}
        placeholder=""
        value={selectedDistrict}
      />
    );
  }
}
