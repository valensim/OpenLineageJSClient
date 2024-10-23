import {DatasetFacets} from "./facets/DatasetFacets";

/**
 * @class
 */
class Dataset {
  /**
   *
   * @param {string} name
   * @param {string} namespace
   * @param {DatasetFacets | {}} facets
   */
  constructor(name, namespace, facets = {}) {
    this.name = name;
    this.namespace = namespace;
    this.facets = facets;
  }
}
export {Dataset};