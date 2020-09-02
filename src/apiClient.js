export class HttpError extends Error {
  constructor(status, statusText, data) {
    super(`HTTP ${status} ${statusText}`);
    this.status = status;
    this.statusText = statusText;
    this.data = data;
  }
}

const decodeResponse = async response => {
  const { headers } = response;
  const [type, subType] = headers.get('content-type').split(/; */)[0].split('/');
  const lang = subType.indexOf('+') === -1 ? subType : subType.split('+')[1];
  if (lang === 'json') return response.json();
  if (lang === 'xml') return new DOMParser().parseFromString(await response.text(), 'text/xml');
  if (type === 'text') return response.text();
  return response.arrayBuffer();
};

/**
 * @callback FetchDataImpl
 * @param {String} resource
 * @param {object} init
 * @return {Promise<*, Error>} The parsed response, or an Error describing the problem encountered
 */


/**
 * @implements FetchDataImpl
 */
export const fetchData = async (url, { body, headers, ...props } = {}) => {
  const response = await fetch(url, {
    ...props,
    ...(body && {
      body: typeof body === 'string' ? body : JSON.stringify(body),
      headers: {
        ...(typeof body !== 'string' && { 'content-type': 'application/json' }),
        ...headers
      },
    }),
    ...(!body && { headers })
  });
  const { ok, status, statusText } = response;
  const data = await decodeResponse(response);
  if (!ok) throw new HttpError(status, statusText, data);
  return data;
};

/**
 * Information about a request
 * @typedef {Object} RequestInfo
 * @see https://developer.mozilla.org/en-US/docs/Web/API/WindowOrWorkerGlobalScope/fetch
 * @property {String} requestInfo.resource
 * @property {object} requestInfo.init
 */

/**
 * This callback should decorate a request with API-specific information
 * @callback RequestDecorator
 * @param {RequestInfo} requestInfo The request to decorate
 * @return {RequestInfo} The decorated request
 */

/**
 * Construct an API client
 * @param {RequestDecorator}
 * @return {FetchDataImpl}
 */
export const apiClient = (decorator) => (resource, init) => {
  const base = { resource, init };
  const { resource: endpoint, init: initializer } = decorator(base) || base;
  return fetchData(endpoint, initializer);
};
