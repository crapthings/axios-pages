import compact from 'lodash/compact'
import concat from 'lodash/concat'
import extend from 'lodash/extend'
import find from 'lodash/find'
import flatten from 'lodash/flatten'
import get from 'lodash/get'
import isEmpty from 'lodash/isEmpty'
import map from 'lodash/map'
import set from 'lodash/set'
import times from 'lodash/times'

import axios from 'axios'

// 连续
async function fetchSeries(results = [], acc = [], url, options = {}, config = {}) {

  const _options = extend({}, options)

  const pageIndex = config.pageIndexAmount += 1

  set(_options, config.pageIndexField, pageIndex)
  set(_options, config.perPageField, config.perPageAmount)

  acc = concat(acc, results)

  const request = await axios(url, _options)

  const _results = get(request, config.resultField, [])

  return _results.length ? await fetchSeries(_results, acc, url, options, config) : acc

}

// 连续并发
async function fetchParallel(results = [], acc = [], url, options = {}, config = {}) {

  acc = concat(acc, results)

  const parallel = times(config.concurrent, n => {
    const index = config.pageIndexAmount += 1

    const _options = {}

    set(_options, config.pageIndexField, index)
    set(_options, config.perPageField, config.perPageAmount)

    return axios(url, _options)
  })

  const request = await axios.all(parallel)

  const unflattenResults = map(request, config.resultField)

  const findEmptyData = find(unflattenResults, isEmpty)

  const _results = compact(flatten(unflattenResults))

  return findEmptyData
    ? concat(acc, _results)
    : await fetchParallel(_results, acc, url, options, config)

}

export default {
  fetchSeries,
  fetchParallel,
}
