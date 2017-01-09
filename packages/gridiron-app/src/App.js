import React, { Component } from 'react'
import { Provider } from 'react-redux'
import { BrowserRouter, Match, Miss, Link } from 'react-router'
import './App.css'

import gridiron from 'gridiron'
import gridironModules from 'gridiron-modules'

import TopBar from './components/nav/TopBar'
import PagerSandbox from './components/PagerSandbox'

import configureStore from './redux/store/configureStore'
const store = configureStore()

const { Logo } = gridiron(gridironModules())

const Home = () => (
  <span>HOME</span>
)


const App = () => (
  <Provider store={store}>
    <BrowserRouter>
      <div>
        <TopBar logo={<Logo />} />
        <Match pattern="/pager" component={PagerSandbox} />
        <Miss component={Home} />
      </div>
    </BrowserRouter>
  </Provider>
)

export default App
