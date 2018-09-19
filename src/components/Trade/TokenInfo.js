import React, { Component, Fragment } from 'react'
import { Row, Col } from 'react-bootstrap'
import styled from 'styled-components'

const TokenInfoRow = styled.div`
  margintop: 25px;
`

class TokenInfo extends Component {
  componentDidMount = async () => {
    const { symbol, marketStore } = this.props

    await marketStore.getTokenBySymbol(symbol)
  }

  render() {
    const { marketStore } = this.props
    const token = marketStore.token ? marketStore.token.data.token : null
    const todayChanged = token ? token.last_day_price - token.last_price : 0.0

    return (
      <Fragment>
        {token ? (
          <Row style={{ marginTop: '25px' }}>
            <Col xs={2}>
              <h5 className="m0 text-thin">{token.name}</h5>
              <small>{token.symbol}</small>
            </Col>
            <Col xs={2}>
              <h6 className="m0 text-thin">Last Price</h6>
              {token.last_price} EOS
            </Col>
            <Col xs={2}>
              <h6 className="m0 text-thin">Today Changed</h6>
              {todayChanged} EOS
            </Col>
            <Col xs={2}>
              <h6 className="m0 text-thin">Today High</h6>
              {token.high_price_24h} EOS
            </Col>
            <Col xs={2}>
              <h6 className="m0 text-thin">Today Low</h6>
              {token.low_price_24h} EOS
            </Col>
            <Col xs={2}>
              <h6 className="m0 text-thin">Today Volume</h6>
              {token.volume_24h} EOS
            </Col>
          </Row>
        ) : (
          ''
        )}
      </Fragment>
    )
  }
}

export default TokenInfo
