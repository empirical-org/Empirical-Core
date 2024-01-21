import * as React from "react";
import { render } from "@testing-library/react";

import DataTable from "../dataTable";

const props = {
  headers: [
    {
      attribute: "attribute_one",
      isSortable: false,
      name: "Attribute One",
      width: "200px"
    },
    {
      attribute: "attribute_two",
      isSortable: false,
      name: "Attribute Two",
      width: "200px"
    },
    {
      attribute: "attribute_three",
      isSortable: false,
      name: "Attribute Three",
      width: "200px"
    }
  ],
  rows: [
    {
      id: 1,
      attribute_one: "A",
      attribute_two: "1",
      attribute_three: "red",
    },
    {
      id: 2,
      attribute_one: "B",
      attribute_two: "2",
      attribute_three: "orange",
    },
    {
      id: 3,
      attribute_one: "C",
      attribute_two: "3",
      attribute_three: "yellow",
    },
    {
      id: 4,
      attribute_one: "D",
      attribute_two: "4",
      attribute_three: "green",
    },
    {
      id: 5,
      attribute_one: "E",
      attribute_two: "5",
      attribute_three: "blue",
    },
    {
      id: 6,
      attribute_one: "F",
      attribute_two: "6",
      attribute_three: "indigo",
    },
    {
      id: 7,
      attribute_one: "G",
      attribute_two: "7",
      attribute_three: "violet",
    }
  ]
}

describe('DataTable', () => {
  test('it should render', () => {
    const { asFragment } = render(<DataTable {...props} />);
    expect(asFragment()).toMatchSnapshot();
  })
})
