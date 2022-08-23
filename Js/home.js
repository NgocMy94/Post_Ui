import postApi from './API/postApi'
import { renderPostList, initSearch, renderPagination, initPagination, toast } from './Util'

async function handleFiterChange(filterName, filterValue) {
  try {
    const url = new URL(window.location)
    if (filterName) url.searchParams.set(filterName, filterValue)
    history.pushState({}, '', url)

    if (filterName === 'title_like') url.searchParams.set('_page', 1)

    // gọi lại API
    const queryParams = url.searchParams
    const { data, pagination } = await postApi.getAll(queryParams)
    renderPostList(data)
    renderPagination(pagination)
  } catch (error) {
    console.log(error)
  }
}

// function registerPostDeleteEvent() {
//   document.addEventListener('post-delete', async (event) => {
//     console.log('remove post click', event.detail)
//     try {
//       const post = event.detail
//       const message = `Bạn muốn xoá "${post.title}`
//       if (window.confirm(message)) {
//         await postApi.remove(post)
//         await handleFiterChange()
//         toast.success('Xoá thành công')
//       }
//     } catch (error) {
//       console.log(error)
//       toast.error(error.message)
//     }

//     // call API to remove post by id
//     // refetch data
//   })
// }
function registerPostDeleteEvent() {
  document.addEventListener('post-delete', async (event) => {
    try {
      const post = event.detail
      await postApi.remove(post.id)
      toast.success('Xoá thành công')

      await handleFiterChange()
    } catch (error) {
      toast.error(error.message)
    }
  })
}

;(async () => {
  try {
    const url = new URL(window.location)
    if (!url.searchParams.get('_page')) url.searchParams.set('_page', 1)
    if (!url.searchParams.get('_limit')) url.searchParams.set('_limit', 6)
    history.pushState({}, '', url)

    const queryParams = url.searchParams

    registerPostDeleteEvent()

    const { data, pagination } = await postApi.getAll(queryParams)

    initSearch({
      elementId: 'searchInput',
      defaultParams: queryParams,
      onChange: (value) => handleFiterChange('title_like', value),
    })

    initPagination({
      elementId: 'postsPagination',
      defaultParams: queryParams,
      onChange: (page) => handleFiterChange('_page', page),
    })
    renderPostList(data)
    renderPagination(pagination)
  } catch (error) {
    console.log('get all failed', error)
  }
})()
