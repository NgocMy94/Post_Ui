import postApi from './API/postApi'
import { initPostForm, toast } from './Util'

function removeUnusedFields(formValues) {
  const payload = { ...formValues }
  // imageSource = 'picsum' ---> remove image
  // imageSource = 'upload' ---> remove imageUrl
  // finally remove imageSource

  if (payload.imageSource === 'upload') {
    delete payload.imageUrl
  } else {
    delete payload.image
  }

  // finally remove imageSource
  delete payload.imageSource

  // remove id if it's add mode
  if (!payload.id) delete payload.id

  return payload
}

function jsonToFormData(jsonObject) {
  const formData = new FormData()

  for (const key in jsonObject) {
    formData.set(key, jsonObject[key])
  }

  return formData
}

async function handlePostFormSubmit(formValues) {
  try {
    const payload = removeUnusedFields(formValues)
    const formData = jsonToFormData(payload)
    console.log('submit form parent', { formValues, payload })

    const savedPost = formValues.id ? await postApi.updateFormData(formData) : await postApi.addFormData(formData)
    console.log(savedPost.id)

    // show success message
    toast.success('Save post successfully !')
    // redirect to detail page
    setTimeout(() => {
      window.location.assign(`/post-detail.html?id=${savedPost.id}`)
    }, 2000)
  } catch (error) {
    console.log(error)
    toast.error(`Error : ${error.message}`)
  }
}
;(async () => {
  try {
    const searchParams = new URLSearchParams(window.location.search)
    const postId = searchParams.get('id')

    const defaultValue = postId
      ? await postApi.getById(postId)
      : {
          title: '',
          description: '',
          author: '',
          imageUrl: '',
        }

    initPostForm({
      formId: 'postForm',
      defaultValue,
      onSubmit: handlePostFormSubmit,
    })
  } catch (error) {}
})()
