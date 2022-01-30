export type PluginOptions = {
  debug?: boolean
  verbose?: boolean
  cargoArgs?: string[]
  watchPatterns?: string[]
  include?: (string | RegExp)[] | string | RegExp | null
  exclude?: (string | RegExp)[] | string | RegExp | null
}

export type InternalPluginOptions = Required<PluginOptions>
