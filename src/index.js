import _ from 'lodash'

import axios from 'axios'

// 连续
async function fetchSeries(results = [], acc = [], url, options = {}, config = {}) {

  const index = config.pageIndexAmount += 1

  _.set(options, `params.${config.pageIndexField}`, index)
  _.set(options, `params.${config.perPageField}`, config.perPageAmount)

  acc = _.concat(acc, results)

  const request = await axios(url, options)

  const _results = _.get(request, config.resultField, [])

  return _results.length ? await fetchSeries(_results, acc, url, options, config) : acc

}

// 连续并发
async function fetchParallel(results = [], acc = [], url, options = {}, config = {}) {

  acc = _.concat(acc, results)

  const parallel = _.times(config.concurrent, n => {
    const index = config.pageIndexAmount += 1

    const _options = {}

    _.set(_options, config.pageIndexField, index)
    _.set(_options, config.perPageField, config.perPageAmount)

    return axios(url, _options)
  })

  const request = await axios.all(parallel)

  const unflattenResults = _.map(request, config.resultField)

  const findEmptyData = _.find(unflattenResults, _.isEmpty)

  const _results = _.compact(_.flatten(unflattenResults))

  return findEmptyData
    ? _.concat(acc, _results)
    : await fetchParallel(_results, acc, url, options, config)

}

(async function () {

  console.time('连续')

  const dataFetchSeries = await fetchSeries([], [], 'http://localhost:4000/api/test', {}, {
    resultField: 'data',
    pageIndexField: 'page',
    pageIndexAmount: 0,
    perPageField: 'per_page',
    perPageAmount: 10,
    concurrent: 3,
  })

  console.timeEnd('连续')

  console.log(dataFetchSeries.length)

  console.time('连续并发')

  const dataFetchParallel = await fetchParallel([], [], 'http://localhost:4000/api/test', {}, {
    resultField: 'data',
    pageIndexField: 'params.page',
    pageIndexAmount: 0,
    perPageField: 'params.per_page',
    perPageAmount: 10,
    concurrent: 3,
  })

  console.timeEnd('连续并发')

  console.log(dataFetchParallel.length)

})()
