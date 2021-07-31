import React, { PureComponent, Component  } from 'react'
import PropTypes from 'prop-types'
import abcjsObj from 'abcjs'


// source from
// https://github.com/rigobauer/react-abcjs

class Abcjs extends Component {

  uniqueNumber = Date.now() + Math.random()

  renderAbcNotation(notation, parserParams, engraverParams, renderParams) {
    const res = abcjsObj.renderAbc(
      'abcjs-result-' + this.uniqueNumber,
      notation,
      parserParams,
      engraverParams,
      renderParams
    )
  }

  componentDidMount() {
    const { notation, parserParams, engraverParams, renderParams } = this.props
    this.renderAbcNotation(notation, parserParams, engraverParams, renderParams)
  }

  componentDidUpdate() {
    const { notation, parserParams, engraverParams, renderParams } = this.props
    this.renderAbcNotation(notation, parserParams, engraverParams, renderParams)
  }

  render() {
    return (
      <div style={{ width: '100%' }}>
        <div id={'abcjs-result-' + this.uniqueNumber} style={{ width: '100%' }} />
      </div>
    )
  }
}

Abcjs.propTypes = {
  notation: PropTypes.string,
  parserParams: PropTypes.object,
  engraverParams: PropTypes.object,
  renderParams: PropTypes.object,
}

Abcjs.defaultProps = {
  notation: '',
  parserParams: {},
  engraverParams: { responsive: 'resize' },
  renderParams: { viewportHorizontal: true },
}

export default Abcjs