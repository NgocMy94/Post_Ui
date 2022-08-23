import { setImage, setTextContent, truncateText } from './common'
import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'
dayjs.extend(relativeTime)

function createPostElement(post) {
  if (!post) return

  const postTemplate = document.getElementById('postTemplate')
  const liElement = postTemplate.content.firstElementChild.cloneNode(true)

  setTextContent(liElement, '[data-id="title"]', post.title)
  setTextContent(liElement, '[data-id="description"]', truncateText(post.description, 100))
  setTextContent(liElement, '[data-id="author"]', post.author)
  setTextContent(liElement, '[data-id="timeSpan"]', ` - ${dayjs(post.updatedAt).fromNow()}`)
  setImage(liElement, '[data-id="thumbnail"]', post.imageUrl)

  // attach events
  // go to post detail
  const divElement = liElement.firstElementChild
  if (divElement) {
    divElement.addEventListener('click', (event) => {
      // if event is triggered from menu ---> ignore
      const menu = liElement.querySelector('[data-id="menu"]')
      if (menu && menu.contains(event.target)) return
      console.log('parent click')
      window.location.assign(`/post-detail.html?id=${post.id}`)
    })
  }

  // add click event for edit button
  const editButton = liElement.querySelector('[data-id="edit"]')
  if (editButton) {
    editButton.addEventListener('click', (e) => {
      console.log('edit click')
      // prevent event bubbling to parent
      // e.stopPropagation()
      window.location.assign(`/add-edit-post.html?id=${post.id}`)
    })
  }

  // remove post list
  const removeButton = liElement.querySelector('[data-id="remove"]')
  if (removeButton) {
    removeButton.addEventListener('click', () => {
      const customEvent = new CustomEvent('post-delete', {
        bubbles: true,
        detail: post,
      })
      removeButton.dispatchEvent(customEvent)
    })
  }

  return liElement
}

export function renderPostList(postList) {
  if (!Array.isArray(postList) || postList.length === 0) return

  const ulElement = document.getElementById('postList')
  if (!ulElement) return
  ulElement.textContent = ''

  for (const post of postList) {
    const liElement = createPostElement(post)
    ulElement.appendChild(liElement)
  }
}
