import React, { Component } from 'react'
import { BrowserRouter, Match, Miss, Link } from 'react-router'

import Gridiron from './modules/Gridiron'
import TopBar from './components/nav/TopBar'
import PagerSandbox from './components/PagerSandbox'
import GridSandbox from './components/GridSandbox'
import AccordionSandbox from './components/AccordionSandbox'
import CardsSandbox from './components/CardsSandbox'
import ColumnsSandbox from './components/ColumnsSandbox'

const Links = ({ style }) => (
  <aside style={style}>
    <Link to="/pager">Pager</Link>
    <Link to="/grid">Grid</Link>
    <Link to="/accordion">Accordion</Link>
    <Link to="/cards">Cards</Link>
    <Link to="/columns">Columns</Link>
  </aside>
)

const Home = () => (
  <span>Click a component</span>
)

export default () => (
  <BrowserRouter>
    <div>
      <TopBar logo={<Gridiron.Logo />} />
      <div
        style={
          { display: 'flex'
          , flexFlow: 'row nowrap'
          , justifyContent: 'flex-start'
          }
        }
      >
        <Links
          style={
            { display: 'flex'
            , flexFlow: 'column nowrap'
            , flex: '0 0 5rem'
            , justifyContent: 'space-around'
            , fontSize: '1.5rem'
            , padding: '1rem'
            , height: '20rem'
            }
          }
        />
        <section
          style={
            { display: 'flex'
            , flexFlow: 'column nowrap'
            , flex: '1 1 auto'
            , fontSize: '1.2rem'
            , padding: '1rem'
            }
          }
        >
          <Match pattern="/pager" component={PagerSandbox} />
          <Match pattern="/grid" component={GridSandbox} />
          <Match pattern="/accordion" component={AccordionSandbox} />
          <Match pattern="/cards" component={CardsSandbox} />
          <Match pattern="/columns" component={ColumnsSandbox} />
          <Miss component={Home} />
        </section>
      </div>
    </div>
  </BrowserRouter>
)
