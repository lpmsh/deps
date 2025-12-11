// generated types
export interface NPMResponse {
  _id: string;
  _rev: string;
  name: string;
  "dist-tags": DistTags;
  versions: Versions;
  time: Time;
  bugs: Bugs2;
  author: Author2;
  license: string;
  homepage: string;
  repository: Repository2;
  description: string;
  maintainers: Maintainer2[];
  readme: string;
  readmeFilename: string;
}

interface DistTags {
  [tag: string]: string;
}

interface Versions {
  [version: string]: VersionInfo;
}

interface VersionInfo {
  name: string;
  version: string;
  author: Author;
  license: string;
  _id: string;
  maintainers: Maintainer[];
  homepage: string;
  bugs: Bugs;
  dist: Dist;
  main: string;
  type: string;
  types: string;
  module: string;
  gitHead: string;
  scripts: Scripts;
  _npmUser: NpmUser;
  repository: Repository;
  _npmVersion: string;
  description: string;
  directories: Directories;
  _nodeVersion: string;
  dependencies: Dependencies;
  _hasShrinkwrap: boolean;
  devDependencies: DevDependencies;
  _npmOperationalInternal: NpmOperationalInternal;
}

interface Author {
  name: string;
}

interface Maintainer {
  name: string;
  email: string;
}

interface Bugs {
  url: string;
}

interface Dist {
  shasum: string;
  tarball: string;
  fileCount: number;
  integrity: string;
  signatures: Signature[];
  unpackedSize: number;
}

interface Signature {
  sig: string;
  keyid: string;
}

interface Scripts {
  lint: string;
  test: string;
  build: string;
  format: string;
}

interface NpmUser {
  name: string;
  email: string;
}

interface Repository {
  url: string;
  type: string;
}

interface Directories {}

interface Dependencies {
  [packageName: string]: string;
}

interface DevDependencies {
  [packageName: string]: string;
}

interface NpmOperationalInternal {
  tmp: string;
  host: string;
}

interface Time {
  created: string;
  modified: string;
  [version: string]: string;
}

interface Bugs2 {
  url: string;
}

interface Author2 {
  name: string;
}

interface Repository2 {
  type: string;
  url: string;
}

interface Maintainer2 {
  name: string;
  email: string;
}
