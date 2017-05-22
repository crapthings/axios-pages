import isEqual from 'lodash/isEqual'

import {
  fetchSerial,
  fetchParallel,
} from './src'

(async function () {

  console.time('连续')

  const dataFetchSerial = await fetchSerial('http://localhost:4000/api/test', {}, {
    pageIndexField: 'page',
    perPageField: 'per_page',
    perPageAmount: 3,
  })

  console.timeEnd('连续')

  console.log(dataFetchSerial.length)

  console.time('连续并发')

  const dataFetchParallel = await fetchParallel('http://localhost:4000/api/test', {}, {
    pageIndexField: 'page',
    perPageField: 'per_page',
    perPageAmount: 10,
  })

  console.timeEnd('连续并发')

  console.log(dataFetchParallel.length)

  console.log('is equal', isEqual(dataFetchSerial, dataFetchParallel))

})()
