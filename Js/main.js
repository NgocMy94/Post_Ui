import postApi from './API/postApi'
;(async () => {
  try {
    const queryParams = {
      _page: 1,
      _limit: 5,
    }
    const data = await postApi.getAll(queryParams)
    console.log(data)
  } catch (error) {
    console.log('get all failed', error)
  }
})()
