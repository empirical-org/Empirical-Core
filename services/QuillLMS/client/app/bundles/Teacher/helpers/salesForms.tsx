import { requestFailed } from "../../Staff/helpers/evidence/routingHelpers";
import Fuse from 'fuse.js';

const fetchDefaults = require("fetch-defaults");
const baseUrl = process.env.DEFAULT_URL;
const headerHash = {
  headers: {
    "Accept": "application/JSON",
    "Content-Type": "application/json"
  }
};
const apiFetch = fetchDefaults(fetch, baseUrl, headerHash);
export const SCHOOL_NOT_LISTED = "My school isn’t listed";
export const DISTRICT_NOT_LISTED = "My district isn’t listed";

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

export function districtSearch(options) {
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
