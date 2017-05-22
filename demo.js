import {
  fetchSeries,
  fetchParallel,
} from './src'

(async function () {

  console.time('连续')

  const dataFetchSeries = await fetchSeries([], [], 'http://localhost:4000/api/test', {}, {
    resultField: 'data',
    pageIndexField: 'params.page',
    pageIndexAmount: 0,
    perPageField: 'params.per_page',
    perPageAmount: 6,
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
