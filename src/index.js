import compact from 'lodash/compact'
import concat from 'lodash/concat'
import extend from 'lodash/extend'
import flatten from 'lodash/flatten'
import get from 'lodash/get'
import isEmpty from 'lodash/isEmpty'
import map from 'lodash/map'
import set from 'lodash/set'
import some from 'lodash/some'
import times from 'lodash/times'

import axios from 'axios'

// serial
export const fetchSerial = async function(url, options = {}, config = {}, acc = []) {

  config.pageIndexAmount = config.pageIndexAmount || 0

  const pageIndex = config.pageIndexAmount += 1
  const pageIndexField = 'params.' + config.pageIndexField
  const perPageField = 'params.' + config.perPageField

  set(options, pageIndexField, pageIndex)
  set(options, perPageField, config.perPageAmount)

  const request = await axios(url, options)

  const resultField = config.resultField ? 'data.' + config.resultField : 'data'

  const _results = get(request, resultField, [])

  acc = concat(acc, _results)

  return _results.length ? await fetchSerial(url, options, config, acc) : acc

}

// parallel
export const fetchParallel = async function(url, options = {}, config = {}, acc = []) {

  config.pageIndexAmount = config.pageIndexAmount || 0

  const pageIndexField = 'params.' + config.pageIndexField
  const perPageField = 'params.' + config.perPageField

  const parallel = times(config.concurrent || 3, () => {
    const pageIndex = config.pageIndexAmount += 1

    const _options = _.defaultsDeep({}, options)

    set(_options, pageIndexField, pageIndex)
    set(_options, perPageField, config.perPageAmount)

    return axios(url, _options)
  })

  const request = await axios.all(parallel)

  const resultField = config.resultField ? 'data.' + config.resultField : 'data'

  const unflattenResults = map(request, resultField)

  const findEmptyData = some(unflattenResults, isEmpty)

  const _results = compact(flatten(unflattenResults))

  acc = concat(acc, _results)

  return findEmptyData ? acc : await fetchParallel(url, options, config, acc)

}
