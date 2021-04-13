/**
 * @callback Resolver
 * @param {String} relativeUri
 * @returns {String} absoluteUrl
 */

/**
 * Create a resolver relative to a given URL
 * Typical usage:
 *   const resolver = makeResolver(import.meta.url);
 *   const pictureUrl = resolve('./pretty-picture.png');
 * 
 * @param {String} baseUrl base url to resolve to
 * @returns {Resolver} resolver to the given baseUrl
 */
 export const makeResolver = baseUrl => relativeUri => new URL(relativeUri, baseUrl).toString();
