import { randomNumber, setBackgrourdImage, setFieldValue, setTextContent } from './common'
import * as yup from 'yup'

const ImageSource = {
  PICSUM: 'picsum',
  UPLOAD: 'upload',
}

function setFormValues(form, formValues) {
  if (!form) return
  console.log(formValues)
  setFieldValue(form, '[name="title"]', formValues.title)
  setFieldValue(form, '[name="author"]', formValues.author)
  setFieldValue(form, '[name="description"]', formValues.description)
  setFieldValue(form, '[name="imageUrl"]', formValues.imageUrl)

  setBackgrourdImage(document, '#postHeroImage', formValues.imageUrl)
}

function getFormValue(form) {
  const formValues = {}

  const data = new FormData(form)
  for (const [key, value] of data) {
    formValues[key] = value
  }

  return formValues
}

function getPostSchema() {
  return yup.object().shape({
    title: yup.string().required('Please enter title'),
    author: yup
      .string()
      .required('Please enter author')
      .test(
        'at least tow words',
        ' Please enter at least two words',
        (value) => value.split(' ').filter((x) => !!x && x.length >= 3).length >= 2
      ),
    description: yup.string(),
    imageSource: yup
      .string()
      .required('Please select an image source')
      .oneOf([ImageSource.PICSUM, ImageSource.UPLOAD], 'Invalid image source'),
    imageUrl: yup.string().when('imageSource', {
      is: ImageSource.PICSUM,
      then: yup.string().required('Please random background image').url('Please enter a valid URL'),
    }),
    image: yup.mixed().when('imageSource', {
      is: ImageSource.UPLOAD,
      then: yup
        .mixed()
        .test('required', 'Please select an image to upload', (file) => {
          if (!file?.name) return false
          return true
        })
        .test('max-3mb', 'the image is too large (max 3mb)', (file) => {
          const fileSize = file?.size || 0
          // const MAX_SIZE = 10 * 1024 // 10kb
          const MAX_SIZE = 3 * 1024 * 1024 // 3mb
          return fileSize <= MAX_SIZE
        }),
    }),
  })
}

function setFieldError(form, name, errors) {
  const element = form.querySelector(`[name="${name}"]`)
  if (element) element.setCustomValidity(errors)
  setTextContent(element.parentElement, '.invalid-feedback', errors)
}

async function validatePostForm(form, formValues) {
  try {
    // reset previous errors
    ;['title', 'author', 'imageUrl', 'image'].forEach((name) => setFieldError(form, name, ''))

    const schema = getPostSchema()
    await schema.validate(formValues, { abortEarly: false })
  } catch (error) {
    console.log(error.name)
    console.log(error.inner)
    const errorLog = {}

    if (error.name === 'ValidationError' && Array.isArray(error.inner)) {
      for (const validationError of error.inner) {
        const name = validationError.path

        // ignore if the field is already logged
        if (errorLog[name]) continue

        // set field error and mark logged
        setFieldError(form, name, validationError.message)
        errorLog[name] = true
      }
    }
  }

  // add was-validated class to form
  const isValid = form.checkValidity()
  if (!isValid) form.classList.add('was-validated')

  return isValid
}

function showLoanding(form) {
  const button = form.querySelector('[name="submit"]')
  if (button) {
    button.disabled = true
    button.textContent = 'Saving...'
  }
}

function hidenLoanding(form) {
  const button = form.querySelector('[name="submit"]')
  if (button) {
    button.disabled = false
    button.textContent = 'Save'
  }
}

function renderImageSourceControl(form, selectedValue) {
  const controlList = form.querySelectorAll('[data-id="imageSource"]')
  controlList.forEach((control) => {
    control.hidden = control.dataset.imageSource !== selectedValue
  })
}

function initRandomImage(form) {
  const ramdomButton = document.getElementById('postChangeImage')
  if (!ramdomButton) return

  ramdomButton.addEventListener('click', () => {
    const imageUrl = `https://picsum.photos/id/${randomNumber(1000)}/1368/400`
    setFieldValue(form, "[name='imageUrl']", imageUrl)
    setBackgrourdImage(document, '#postHeroImage', imageUrl)
  })
}

function initRadioImageSource(form) {
  const radioList = form.querySelectorAll('[name="imageSource"]')
  radioList.forEach((radio) => {
    radio.addEventListener('change', (event) => renderImageSourceControl(form, event.target.value))
  })
}

function initUploadImage(form) {
  const uploadImage = form.querySelector('[name="image"]')
  if (!uploadImage) return

  uploadImage.addEventListener('change', (event) => {
    console.log('selected file', event.target.files[0])
    // get selected file
    // preview file
    const file = event.target.files[0]
    if (file) {
      const imageUrL = URL.createObjectURL(file)
      setBackgrourdImage(document, '#postHeroImage', imageUrL)
    }
  })
}

export function initPostForm({ formId, defaultValue, onSubmit }) {
  const form = document.getElementById(formId)
  if (!form) return

  setFormValues(form, defaultValue)
  // init events
  initRandomImage(form)
  initRadioImageSource(form)
  initUploadImage(form)

  form.addEventListener('submit', async (e) => {
    e.preventDefault()

    showLoanding(form)

    const formValues = getFormValue(form)
    formValues.id = defaultValue.id

    // validate
    const isValid = await validatePostForm(form, formValues)
    if (isValid) await onSubmit?.(formValues)

    hidenLoanding(form)
  })
}
