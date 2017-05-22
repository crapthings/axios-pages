import isEqual from 'lodash/isEqual'

import {
  fetchSerial,
  fetchParallel,
} from './src'

(async function () {

  console.time('10000条记录，每次10条')

  const dataFetchSerial = await fetchSerial('http://localhost:4000/api/test', {}, {
    pageIndexField: 'page',
    perPageField: 'per_page',
    perPageAmount: 5,
  })

  console.timeEnd('10000条记录，每次10条')

  console.log('数量', dataFetchSerial.length, '\n')

  //

  console.time('10000条记录，每次10条，并发3')

  const dataFetchParallel1 = await fetchParallel('http://localhost:4000/api/test', {}, {
    pageIndexField: 'page',
    perPageField: 'per_page',
    perPageAmount: 10,
  })

  console.timeEnd('10000条记录，每次10条，并发3')

  console.log('数量', dataFetchParallel1.length, '\n')

  //

  console.time('10000条记录，每次10条，并发5')

  const dataFetchParallel2 = await fetchParallel('http://localhost:4000/api/test', {}, {
    pageIndexField: 'page',
    perPageField: 'per_page',
    perPageAmount: 10,
    concurrent: 5,
  })

  console.timeEnd('10000条记录，每次10条，并发5')

  console.log('数量', dataFetchParallel2.length, '\n')

  //

  console.time('10000条记录，每次100条，并发10')

  const dataFetchParallel3 = await fetchParallel('http://localhost:4000/api/test', {}, {
    pageIndexField: 'page',
    perPageField: 'per_page',
    perPageAmount: 100,
    concurrent: 10,
  })

  console.timeEnd('10000条记录，每次100条，并发10')

  console.log('数量', dataFetchParallel3.length, '\n')

  //

  console.log('is equal', isEqual(dataFetchSerial, dataFetchParallel1))
  console.log('is equal', isEqual(dataFetchParallel1, dataFetchParallel2))
  console.log('is equal', isEqual(dataFetchParallel2, dataFetchParallel3))

})()
