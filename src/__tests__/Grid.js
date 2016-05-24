jest.unmock('../lib')
jest.unmock('../lib/components/createGrid')
jest.unmock('../lib/helpers/FakeObjectDataListStore')

import React from 'react'
import { findDOMNode } from 'react-dom'
import { Simulate, renderIntoDocument, findRenderedDOMComponentWithTag } from 'react-addons-test-utils'
import reduxGrid from '../lib'

const { Grid } = reduxGrid({ React })

let goodData = null
const validTitles = ['This is a good title', 'Also_VALID_TITLE']

describe('Grid', () => {
  beforeEach(() => {
    goodData = [{ id: 0
                , name: 'Mayer Leonard'
                , city: 'Kapowsin'
                , state: 'Hawaii'
                , country: 'United Kingdom'
                , company: 'Ovolo'
                , favoriteNumber: 7
                }]
  })

  validTitles.map(title => {
    it(`renders the title '${title}' correctly`, () => {
      // Render a checkbox with label in the document
      const grid = renderIntoDocument(<Grid title={title} data={goodData} />)
      const gridNode = findDOMNode(grid)
      const titleNode = findRenderedDOMComponentWithTag(grid, 'h2')
      // Verify that it's Off by default
      expect(titleNode.textContent).toEqual(title)
    })
  })

/*
  it('renders the correct number of columns', () => {

  })

*/

})

      // Simulate a click and verify that it is now On
      /*
      Simulate.change(findRenderedDOMComponentWithTag(checkbox, 'input'))
      expect(checkboxNode.textContent).toEqual('On')
      */
