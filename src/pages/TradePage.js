import React, { Component } from 'react'
import { inject, observer } from 'mobx-react'
import { compose } from 'recompose'
import { NoPaddingCol } from '../components/Common/Common'

import { Grid, Row, Col } from 'react-bootstrap'
import { ProgressBar } from 'react-bootstrap'
import TokenInfo from '../components/Trade/TokenInfo'
import Resource from '../components/Trade/Resource'
import OrderList from '../components/Trade/OrderList'
import Order from '../components/Trade/Order'
import TradingChart from '../components/Trade/TradingChart'
import Market from '../components/Trade/Market'
import Wallet from '../components/Trade/Wallet'
import OrderHistory from '../components/Trade/OrderHistory'
import OpenOrder from '../components/Trade/OpenOrder'
import { PAGE_SIZE_TEN } from '../constants/Values'

class TradePage extends Component {
  constructor(props) {
    super(props)
    const { token } = this.props.match.params

    this.state = {
      token: token,
      chartIntervalId: 0
    }
  }

  componentDidMount = async () => {
    const { marketStore, tradeStore, accountStore } = this.props

    tradeStore.setTokenSymbol(this.state.token)
    await marketStore.getTokenBySymbol(this.state.token)

    this.disposer = accountStore.subscribeLoginState(changed => {
      if (changed.oldValue !== changed.newValue) {
        this.forceUpdate()
      }
    })
  }

  componentWillUnmount = () => {
    if (this.disposer) {
      this.disposer()
    }
  }

  render() {
    const { accountStore, marketStore, tradeStore, eosioStore } = this.props

    const token = marketStore.token
      ? marketStore.token.data
        ? marketStore.token.data.token
        : null
      : null

    const tokens = marketStore.tokens
      ? marketStore.tokens.data
        ? marketStore.tokens.data.tokens
        : null
      : null

    return (
      <section>
        {token && (
          <Grid style={{ minWidth: '1440px' }}>
            <Row className="bg-white content-heading" style={{ height: '116px' }}>
              <Col xs={12} md={7} style={{ borderRight: 'solid 1px #d9d9d9' }}>
                <TokenInfo marketStore={marketStore} symbol={token.symbol} />
              </Col>
              <Col xs={12} md={5} style={{ margin: 'auto' }}>
                <Resource accountStore={accountStore} />
              </Col>
            </Row>
            <Row style={{ height: '660px' }}>
              <NoPaddingCol className="col-md-3" border>
                <OrderList
                  token={token}
                  tradeStore={tradeStore}
                  buyOrdersList={tradeStore.buyOrdersList}
                  sellOrdersList={tradeStore.sellOrdersList}
                />
              </NoPaddingCol>
              <Col md={6} style={{ height: '660px' }}>
                <Row
                  style={{
                    height: '510px',
                    background: 'white',
                    borderTop: 'solid 1px #d9d9d9',
                    borderBottom: 'solid 1px #d9d9d9'
                  }}
                >
                  <Col md={12}>{/* <TradingChart /> */}</Col>
                </Row>
                <Row
                  style={{
                    height: '150px',
                    background: 'white',
                    borderBottom: 'solid 1px #d9d9d9'
                  }}
                >
                  <Col xs={12}>
                    <Order
                      token={token}
                      accountStore={accountStore}
                      tradeStore={tradeStore}
                      eosioStore={eosioStore}
                    />
                  </Col>
                </Row>
              </Col>
              <Col md={3} style={{ height: '660px' }}>
                <Row
                  style={{
                    height: '410px',
                    borderBottom: 'solid 1px #d9d9d9',
                    background: 'white',
                    border: 'solid 1px #d9d9d9'
                  }}
                >
                  <NoPaddingCol className="col-md-12">
                    <Market tokens={tokens} />
                  </NoPaddingCol>
                </Row>
                <Row>
                  <NoPaddingCol className="col-md-12">
                    <Wallet
                      accountStore={accountStore}
                      marketStore={marketStore}
                      eosioStore={eosioStore}
                    />
                  </NoPaddingCol>
                </Row>
              </Col>
            </Row>
            <Row>
              <Col xs={12} md={12}>
                <Row
                  style={{
                    background: 'white',
                    borderLeft: 'solid 1px #d9d9d9',
                    borderRight: 'solid 1px #d9d9d9'
                  }}
                >
                  <Col xs={12}>
                    <OpenOrder
                      tradeStore={tradeStore}
                      openOrdersList={tradeStore.openOrdersList}
                      openOrdersCount={tradeStore.openOrdersCount}
                      openOrdersLoading={tradeStore.openOrdersLoading}
                      openOrdersError={tradeStore.openOrdersError}
                      accountStore={accountStore}
                    />
                  </Col>
                </Row>
                <Row
                  style={{
                    overflow: 'hidden scroll',
                    background: 'white',
                    border: 'solid 1px #d9d9d9'
                  }}
                >
                  <Col xs={12}>
                    <OrderHistory
                      accountStore={accountStore}
                      tradeStore={tradeStore}
                      ordersHistoryList={tradeStore.ordersHistoryList}
                      ordersHistoryCount={tradeStore.ordersHistoryCount}
                      ordersHistoryLoading={tradeStore.ordersHistoryLoading}
                      ordersHistoryError={tradeStore.ordersHistoryError}
                    />
                  </Col>
                </Row>
              </Col>
            </Row>
          </Grid>
        )}
      </section>
    )
  }
}

export default compose(
  inject('marketStore', 'eosioStore', 'tradeStore', 'accountStore'),
  observer
)(TradePage)
