'use strict'

import React from 'react'

import MarkdownParser from '../../../shared/markdown_parser.jsx'

const UnitTemplateProfileDescription = (
  {
    data,
  },
) => {
  return <MarkdownParser markdownText={data.activity_info} />;
};

export default UnitTemplateProfileDescription;
