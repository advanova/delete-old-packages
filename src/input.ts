import { getBooleanInput, getInput, getMultilineInput } from "@actions/core"
import { Range } from "semver"
import { Input, PackageType } from "./types"

const DEFAULT_KEEP = 2

function getRegExpInput(name: string): RegExp | undefined {
  const input = getInput(name)

  if (input !== "") {
    try {
      return new RegExp(input)
    } catch (error) {
      throw new Error(`${name} must be a valid regex: ${error}`)
    }
  } else {
    return undefined
  }
}

function genSemVerInput(name: string): Range | undefined {
  const input = getInput(name)

  if (input !== "") {
    try {
      return new Range(input)
    } catch (error) {
      throw new Error(
        `${name} must be a valid semver pattern (see https://www.npmjs.com/package/semver for examples): ${error}`
      )
    }
  } else {
    return undefined
  }
}

function getTypeInput(name: string): PackageType {
  const packageTypes = Object.values(PackageType).map((it) => it.toString())
  const input = getInput(name).toLowerCase()

  if (!input) {
    throw new Error(`${name} is required and must be one of the supported types: ${packageTypes.join(", ")}`)
  } else if (packageTypes.includes(input)) {
    return input as PackageType
  } else {
    throw new Error(`${name} must be one of the supported types: ${packageTypes.join(", ")}`)
  }
}

export function getActionInput(): Input {
  return {
    names: getMultilineInput("names"),
    namePattern: getRegExpInput("name-pattern"),
    versionPattern: getRegExpInput("version-pattern"),
    semverPattern: genSemVerInput("semver-pattern"),
    keep: Number(getInput("keep") || DEFAULT_KEEP),
    type: getTypeInput("type"),
    token: getInput("token"),
    dryRun: getBooleanInput("dry-run"),
    user: getInput("user"),
    organization: getInput("organization"),
  }
}

export function validateInput(input: Input): Input {
  if (input.namePattern && input.names && input.names.length > 0) {
    throw new Error("Only one of name-pattern and names can be specified")
  }

  if (!input.namePattern && (!input.names || input.names.length <= 0)) {
    throw new Error("names cannot be empty")
  }

  if (input.versionPattern && input.semverPattern) {
    throw new Error("Only one of version-pattern and semver-pattern can be specified")
  }

  if (input.user && input.organization) {
    throw new Error("Only one of user and organization can be specified")
  }

  if (!Number.isInteger(input.keep) || input.keep < 0 || input.keep > 100) {
    throw new Error("keep must be an integer between 0 and 100 (inclusive)")
  }

  if (input.token === "") {
    throw new Error("token cannot be empty")
  }

  return input
}
