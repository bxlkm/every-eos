import React, { Component, Fragment } from 'react'
import { GET_BALANCE_INTERVAL } from '../../constants/Values'
import { FormattedMessage } from 'react-intl'
import { Table } from 'reactstrap'
import { PriceRow, TokenPrice } from '../Common/Common'

class Wallet extends Component {
  constructor(props) {
    super(props)

    this.state = {
      balanceIntervalId: 0,
      tokens: []
    }
  }
  componentDidMount = async () => {
    const { accountStore } = this.props

    if (accountStore.isLogin) {
      const balanceIntervalId = setInterval(this.getWalletBalace, GET_BALANCE_INTERVAL)

      this.setState({
        balanceIntervalId: balanceIntervalId
      })
    }

    this.disposer = accountStore.subscribeLoginState(changed => {
      if (changed.oldValue !== changed.newValue) {
        if (changed.newValue) {
          this.getWalletBalace()
          const balanceIntervalId = setInterval(this.getWalletBalace, GET_BALANCE_INTERVAL)

          this.setState({
            balanceIntervalId: balanceIntervalId
          })
        } else {
          clearInterval(this.state.balanceIntervalId)
        }
      }
    })
  }

  getWalletBalace = async () => {
    const { accountStore, marketStore, eosioStore } = this.props

    const tokens = marketStore.tokens
      ? marketStore.tokens.data
        ? marketStore.tokens.data.tokens
        : null
      : null

    let tokenBalance = []

    const accountName = accountStore.loginAccountInfo
      ? accountStore.loginAccountInfo.account_name
      : null

    if (accountName && tokens) {
      // eos
      const balance = await eosioStore.getCurrencyBalance({
        code: 'eosio.token',
        account: accountStore.loginAccountInfo.account_name,
        symbol: 'EOS'
      })

      tokenBalance.push({
        id: 0,
        name: 'EOS',
        balance: balance.length > 0 ? balance[0].split(' ')[0] : 0.0
      })

      for (let i = 0; i < tokens.length; i++) {
        const token = tokens[i]
        const balance = await eosioStore.getCurrencyBalance({
          code: token.contract,
          account: accountStore.loginAccountInfo.account_name,
          symbol: token.symbol
        })

        tokenBalance.push({
          id: token.id,
          name: token.name,
          balance: balance.length > 0 ? balance[0].split(' ')[0] : 0.0
        })
      }
    }

    this.setState({
      tokens: tokenBalance
    })
  }

  componentWillUnmount = () => {
    if (this.state.balanceIntervalId > 0) {
      clearInterval(this.state.balanceIntervalId)
    }

    this.disposer()
  }

  render() {
    const { accountStore } = this.props

    return (
      <Fragment>
        <TokenPrice className="table-responsive">
          <FormattedMessage id="Wallet" />
        </TokenPrice>
        <div
          className="table-responsive"
          style={{
            height: '220px',
            borderLeft: 'solid 1px #d9d9d9',
            borderRight: 'solid 1px #d9d9d9',
            borderBottom: 'solid 1px #d9d9d9',
            background: 'white',
            overflow: 'hidden scroll'
          }}
        >
          <Table className="order-list-table">
            <tbody>
              {!accountStore.isLogin && <FormattedMessage id="Please Login" />}
              {accountStore.isLogin &&
                this.state.tokens.map((token, idx) => {
                  return (
                    <tr key={idx}>
                      <td style={{ width: '50%' }}>
                        <PriceRow>{token.name}</PriceRow>
                      </td>
                      <td style={{ width: '50%' }}>
                        <PriceRow>{token.balance}</PriceRow>
                      </td>
                    </tr>
                  )
                })}
            </tbody>
          </Table>
        </div>
      </Fragment>
    )
  }
}

export default Wallet
