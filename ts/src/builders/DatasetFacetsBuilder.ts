import {
  DatasetFacets,
  ColumnLineage,
  DataSource,
  DataQualityAssertions,
  LifecycleStateChange,
  Schema,
  Storage,
  Symlinks,
  Version,
} from '../facets/DatasetFacets.js';
import { Ownership } from '../facets/JobFacets.js';

/**
 * Builder for creating DatasetFacets instances.
 */
export class DatasetFacetsBuilder {
  private columnLineage: ColumnLineage | null = null;
  private dataSource: DataSource | null = null;
  private dataQualityAssertions: DataQualityAssertions | null = null;
  private lifecycleStateChange: LifecycleStateChange | null = null;
  private ownership: Ownership | null = null;
  private schema: Schema | null = null;
  private storage: Storage | null = null;
  private symlinks: Symlinks | null = null;
  private version: Version | null = null;

  setColumnLineage(columnLineage: ColumnLineage): this {
    this.columnLineage = columnLineage;
    return this;
  }

  setDataSource(dataSource: DataSource): this {
    this.dataSource = dataSource;
    return this;
  }

  setDataQualityAssertions(dataQualityAssertions: DataQualityAssertions): this {
    this.dataQualityAssertions = dataQualityAssertions;
    return this;
  }

  setLifecycleStateChange(lifecycleStateChange: LifecycleStateChange): this {
    this.lifecycleStateChange = lifecycleStateChange;
    return this;
  }

  setOwnership(ownership: Ownership): this {
    this.ownership = ownership;
    return this;
  }

  setSchema(schema: Schema): this {
    this.schema = schema;
    return this;
  }

  setStorage(storage: Storage): this {
    this.storage = storage;
    return this;
  }

  setSymlinks(symlinks: Symlinks): this {
    this.symlinks = symlinks;
    return this;
  }

  setVersion(version: Version): this {
    this.version = version;
    return this;
  }

  build(): DatasetFacets {
    return new DatasetFacets(
      this.columnLineage,
      this.dataSource,
      this.dataQualityAssertions,
      this.lifecycleStateChange,
      this.ownership,
      this.schema,
      this.storage,
      this.symlinks,
      this.version,
    );
  }
}
