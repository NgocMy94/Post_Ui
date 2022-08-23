export function renderPagination(pagination) {
  const ulPagination = document.getElementById('postsPagination')
  console.log(ulPagination)
  if (!pagination || !ulPagination) return

  const { _page, _limit, _totalRows } = pagination
  const totalPages = Math.ceil(_totalRows / _limit)

  // gắn dataset vào thẻ ulPagination
  ulPagination.dataset.page = _page
  ulPagination.dataset.totalPages = totalPages

  if (_page <= 1) ulPagination.firstElementChild?.classList.add('disabled')
  else ulPagination.firstElementChild?.classList.remove('disabled')

  if (_page >= totalPages) ulPagination.lastElementChild?.classList.add('disabled')
  else ulPagination.lastElementChild?.classList.remove('disabled')
}

export function initPagination({ elementId, defaultParams, onChange }) {
  const ulPagination = document.getElementById(elementId)
  console.log(ulPagination)
  if (!ulPagination) return

  const prevClick = ulPagination.firstElementChild?.firstElementChild
  if (prevClick) {
    prevClick.addEventListener('click', (event) => {
      event.preventDefault()
      const page = Number.parseInt(ulPagination.dataset.page)
      if (page >= 2) onChange?.(page - 1)
    })
  }

  const nextClick = ulPagination.lastElementChild?.lastElementChild
  if (nextClick) {
    nextClick.addEventListener('click', (event) => {
      event.preventDefault()
      const page = Number.parseInt(ulPagination.dataset.page)
      const totalPages = ulPagination.dataset.totalPages
      if (page < totalPages) onChange?.(page + 1)
    })
  }
}
