export class UploadAjaxError extends Error {
  name = 'UploadAjaxError'

  /** @type{number} */
  status

  /** @type{string} */
  method

  /** @type{string} */
  url

  /**
   * @param {string} message
   * @param {number} status
   * @param {string} method
   * @param {string} url
   */
  constructor(message, status, method, url) {
    super(message)
    this.status = status
    this.method = method
    this.url = url
  }
}
