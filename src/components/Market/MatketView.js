import React, { Component } from 'react'
import { FormattedMessage } from 'react-intl'
import { inject, observer } from 'mobx-react'
import { compose } from 'recompose'
import { Grid, Row, Col } from 'react-bootstrap'
import { ProgressBar } from 'react-bootstrap'
import { withRouter } from 'react-router'
import { Header6, FavoriteIcon } from '../Common/Common'

class MarketView extends Component {
  constructor(props) {
    super(props)

    this.state = {
      intervalId: 0
    }

    this.goTrade = this.goTrade.bind(this)
  }

  componentDidMount = async () => {
    const { marketStore } = this.props

    const id = setInterval(async () => {
      await marketStore.getTokens()
    }, 2000)

    this.setState({
      intervalId: id
    })
  }

  componentWillUnmount = async () => {
    if (this.state.intervalId > 0) {
      clearInterval(this.state.intervalId)
    }
  }

  goTrade = symbol => {
    this.props.history.push('/trades/' + symbol)
  }

  render() {
    const { marketStore } = this.props
    const { tokenList } = marketStore

    return !tokenList ? (
      <ProgressBar striped bsStyle="success" now={40} />
    ) : (
      <Grid fluid>
        <Row>
          <Col xs={12}>
            <div className="card">
              <div className="table-responsive">
                <table className="table table-hover ">
                  <thead>
                    <tr>
                      <th style={{ width: '5%' }} />
                      <th className="text-center" style={{ width: '10%' }}>
                        <FormattedMessage id="Name" />
                      </th>
                      <th className="text-right">
                        <FormattedMessage id="Last Price" />
                      </th>
                      <th className="text-center" style={{ width: '25%' }}>
                        <FormattedMessage id="Today Change" />
                      </th>
                      <th className="text-right">
                        <FormattedMessage id="Today High" />
                      </th>
                      <th className="text-right">
                        <FormattedMessage id="Today Low" />
                      </th>
                      <th className="text-center" style={{ width: '20%' }}>
                        <FormattedMessage id="Today Volume" />
                      </th>
                      <th className="text-center">
                        <FormattedMessage id="Trend" />
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {tokenList.map(token => {
                      const todayChanged = token.last_day_price - token.last_price
                      return (
                        <tr
                          key={token.id}
                          className="msg-display clickable"
                          onClick={() => this.goTrade(token.symbol)}>
                          <td className="va-middle text-center">
                            <FavoriteIcon className="ion-android-favorite-outline" />
                          </td>
                          <td className="va-middle text-center">
                            <Header6>{token.name}</Header6>
                          </td>
                          <td className="va-middle text-right">
                            <Header6 color={todayChanged > 0 ? 'Red' : 'Blue'}>
                              {token.last_price.toFixed(4)}
                            </Header6>
                          </td>
                          <td className="va-middle text-center">
                            <Header6 color={todayChanged > 0 ? 'Red' : 'Blue'}>
                              {todayChanged.toFixed(4)}
                            </Header6>
                          </td>
                          <td className="va-middle text-right">
                            <Header6>{token.high_price_24h.toFixed(4)}</Header6>
                          </td>
                          <td className="va-middle text-right">
                            <Header6>{token.low_price_24h.toFixed(4)}</Header6>
                          </td>
                          <td className="va-middle text-right">
                            <Header6>{token.volume_24h.toFixed(4)}</Header6>
                          </td>
                          <td className="va-middle text-center">
                            {todayChanged < 0 ? (
                              <em className="ion-arrow-graph-down-right text-warning" />
                            ) : (
                              <em className="ion-arrow-graph-up-right text-success" />
                            )}
                          </td>
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </Col>
        </Row>
      </Grid>
    )
  }
}

export default withRouter(
  compose(
    inject('marketStore'),
    observer
  )(MarketView)
)
