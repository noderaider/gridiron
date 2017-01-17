import React, { Component } from 'react'
import { BrowserRouter, Match, Miss, Link } from 'react-router'

import Gridiron from './modules/Gridiron'
import TopBar from './components/nav/TopBar'
import PagerSandbox from './components/PagerSandbox'
import GridSandbox from './components/GridSandbox'
import AccordionSandbox from './components/AccordionSandbox'
import CardsSandbox from './components/CardsSandbox'
import ColumnsSandbox from './components/ColumnsSandbox'

const Home = () => (
  <div>
    <PagerSandbox />
    <GridSandbox />
    <AccordionSandbox />
    <CardsSandbox />
    <ColumnsSandbox />
  </div>
)

export default () => (
  <BrowserRouter>
    <div>
      <TopBar logo={<Gridiron.Logo />} />
      <Match pattern="/pager" component={PagerSandbox} />
      <Match pattern="/grid" component={GridSandbox} />
      <Match pattern="/accordion" component={AccordionSandbox} />
      <Match pattern="/cards" component={CardsSandbox} />
      <Match pattern="/columns" component={ColumnsSandbox} />
      <Miss component={Home} />
    </div>
  </BrowserRouter>
)
