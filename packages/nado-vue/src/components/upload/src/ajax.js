import { isNil } from 'lodash-unified'

import { throwError } from '../../../utils/error.js'
import { UploadAjaxError } from './UploadAjaxError.js'

const SCOPE = 'NUpload'

/**
 * @param {string} action
 * @param {import('./upload.types.js').UploadRequestOptions} option
 * @param {XMLHttpRequest} xhr
 * @returns
 */
function getError(action, option, xhr) {
  let msg = ''

  if (xhr.response) {
    msg = `${xhr.response.error || xhr.response}`
  } else if (xhr.responseText) {
    msg = `${xhr.responseText}`
  } else {
    msg = `fail to ${option.method} ${action} ${xhr.status}`
  }

  return new UploadAjaxError(msg, xhr.status, option.method, action)
}

/**
 * @param {XMLHttpRequest} xhr
 * @returns {XMLHttpRequestResponseType}
 */
function getBody(xhr) {
  const text = xhr.responseText || xhr.response

  if (!text) {
    return text
  }

  try {
    return JSON.parse(text)
  } catch {
    return text
  }
}

/**
 * @type{import('./upload.types.js').UploadRequestHandler}
 */
export const ajaxUpload = (option) => {
  if (typeof XMLHttpRequest === 'undefined') {
    throwError(SCOPE, 'XMLHttpRequest is undefined')
  }

  const xhr = new XMLHttpRequest()
  const { action, data, filename, file, method, withCredentials } = option

  if (xhr.upload) {
    xhr.upload.addEventListener('progress', (evt) => {
      /** @type{import('./upload.types.js').UploadProgressEvent} */
      // @ts-ignore
      const progressEvt = evt

      progressEvt.percent = evt.total > 0 ? (evt.loaded / evt.total) * 100 : 0
      option.onProgress(progressEvt)
    })
  }

  const formData = new FormData()

  if (data) {
    for (const [key, value] of Object.entries(data)) {
      if (Array.isArray(value)) {
        formData.append(key, ...value)
      } else {
        formData.append(key, value)
      }
    }
  }

  formData.append(filename, file, file.parsedUserName)

  xhr.addEventListener('error', () => {
    option.onError(getError(action, option, xhr))
  })

  xhr.addEventListener('load', () => {
    if (xhr.status < 200 || xhr.status >= 300) {
      return option.onError(getError(action, option, xhr))
    }

    option.onSuccess(getBody(xhr))
  })

  xhr.open(method, action, true)

  if (withCredentials && 'withCredentials' in xhr) {
    xhr.withCredentials = true
  }

  const headers = option.headers || {}

  if (headers instanceof Headers) {
    headers.forEach((value, key) => xhr.setRequestHeader(key, value))
  } else {
    for (const [key, value] of Object.entries(headers)) {
      if (isNil(value)) {
        // eslint-disable-next-line no-continue
        continue
      }

      xhr.setRequestHeader(key, String(value))
    }
  }

  xhr.send(formData)

  return xhr
}
