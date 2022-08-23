import dayjs from 'dayjs'
import postApi from './API/postApi'
import { setBackgrourdImage, setTextContent } from './Util'
import localizedFormat from 'dayjs/plugin/localizedFormat'
dayjs.extend(localizedFormat)

function renderPostDetail(post) {
  if (!post) return
  console.log(post)
  setTextContent(document, '#postDetailTitle', post.title)
  setTextContent(document, '#postDetailAuthor', post.author)
  setTextContent(document, '#postDetailDescription', post.description)
  setTextContent(document, '#postDetailTimeSpan', ` - ${dayjs(post.updatedAt).format('- DD/MM/YYYY HH/mm')}`)
  setBackgrourdImage(document, '#postHeroImage', post.imageUrl)

  // render edit page link
  const editPageLink = document.getElementById('goToEditPageLink')
  if (editPageLink) {
    editPageLink.href = `/add-edit-post.html?id=${post.id}`
    // editPageLink.textContent = 'Edit Post'
    editPageLink.innerHTML = '<i class="fas fa-edit"></i> Edit Post'
  }
}
;(async () => {
  try {
    const searchParams = new URLSearchParams(window.location.search)
    const postId = searchParams.get('id')
    if (!postId) return

    const post = await postApi.getById(postId)
    renderPostDetail(post)
  } catch (error) {
    console.log(error)
  }
})()
