import { Range } from "semver"

export enum PackageType {
  Npm = "npm",
  Maven = "maven",
  Rubygems = "rubygems",
  Docker = "docker",
  Nuget = "nuget",
  Container = "container",
}

export type Input = {
  names?: string[]
  namePattern?: RegExp
  versionPattern?: RegExp
  semverPattern?: Range
  keep: number
  type: PackageType
  token: string
  dryRun: boolean
  user: string
  organization: string
}

export type RestInput = Input & {
  type: PackageType
}

export type Package = {
  name: string
  versions: PackageVersion[]
  totalVersions: number
}

export type PackageVersion = {
  id: string
  names: string[]
}

export interface QueryStrategy {
  queryPackages(input: Input): Promise<Package[]>
  queryPackageNames(input: Input): Promise<string[]>
}

export interface DeleteStrategy {
  deletePackageVersion(input: Input, name: string, id: string): Promise<void>
  deletePackage(input: Input, name: string): Promise<void>
}
