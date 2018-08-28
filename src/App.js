import React, { Component } from 'react'
import componentQueries from 'react-component-queries'
import { BrowserRouter, Redirect, Switch, Route } from 'react-router-dom'
import { EmptyLayout, LayoutRoute, MainLayout } from './components/Layout'

import { Home } from './pages'

const getBasename = () => {
  return `/${process.env.PUBLIC_URL.split('/').pop()}`
}

class App extends Component {
  render() {
    return (
      <BrowserRouter basename={getBasename()}>
        <Switch>
          <LayoutRoute exact path="/" layout={MainLayout} component={Home} />
        </Switch>
      </BrowserRouter>
    )
  }
}

const query = ({ width }) => {
  if (width < 575) {
    return { breakpoint: 'xs' }
  }

  if (576 < width && width < 767) {
    return { breakpoint: 'sm' }
  }

  if (768 < width && width < 991) {
    return { breakpoint: 'md' }
  }

  if (992 < width && width < 1199) {
    return { breakpoint: 'lg' }
  }

  if (width > 1200) {
    return { breakpoint: 'xl' }
  }

  return { breakpoint: 'xs' }
}

export default componentQueries(query)(App)
