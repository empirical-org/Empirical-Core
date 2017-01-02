import expect from 'expect';
import Levenshtein from 'levenshtein'
import {sortByLevenshteinAndOptimal} from '../../app/libs/responseTools.js'

const responses = [
  {
    key: 1,
    text: "Hannah never went home",
    optimal: false
  },
  {
    key: 2,
    text: "Hannah went home",
    optimal: true
  },
  {
    key: 3,
    text: "Hannah goes home",
    optimal: false
  },
  {
    key: 4,
    text: "Hannah never went home",
    optimal: true
  },
  {
    key: 5,
    text: "Hannah never went home",
    optimal: true
  },
];

describe("Calculating Levenshtein distances", () => {
  it("uses the external library correctly", () => {
    const userString = "one";
    const targetString = "two"
    const levenshteinObject = new Levenshtein(userString, targetString)
    expect(levenshteinObject.distance).toEqual(3)
  })
})

describe("Sorting responses by distance and status", () => {


  it("should sort first by Levenshtein distance and then by status", () => {
    const userString = "Hannah goe home";
    const keys = sortByLevenshteinAndOptimal(userString, responses).map((res)=>res.key)
    expect(keys).toEqual([3,2,4,5,1])
  })

})
