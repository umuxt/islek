import type { TableConfig, FloorConfig, PricingPolicy, MenuItem, Kategori } from '@islek/db'

class ClientCache {
  private cache: {
    tables: TableConfig[] | null
    floors: FloorConfig[] | null
    menu: MenuItem[] | null
    config: PricingPolicy | null
    categories: Kategori[] | null
  } = {
    tables: null,
    floors: null,
    menu: null,
    config: null,
    categories: null
  }

  setTables(tables: TableConfig[]) {
    this.cache.tables = tables
  }

  setFloors(floors: FloorConfig[]) {
    this.cache.floors = floors
  }

  setMenu(menu: MenuItem[]) {
    this.cache.menu = menu
  }

  setConfig(config: PricingPolicy) {
    this.cache.config = config
  }

  setCategories(categories: Kategori[]) {
    this.cache.categories = categories
  }

  getTables() {
    return this.cache.tables
  }

  getFloors() {
    return this.cache.floors
  }

  getMenu() {
    return this.cache.menu
  }

  getConfig() {
    return this.cache.config
  }

  getCategories() {
    return this.cache.categories
  }

  async fetchTables(force = false): Promise<TableConfig[]> {
    if (!force && this.cache.tables) return this.cache.tables
    const res = await fetch('/api/tables')
    const data = await res.json()
    this.cache.tables = data
    return data
  }

  async fetchFloors(force = false): Promise<FloorConfig[]> {
    if (!force && this.cache.floors) return this.cache.floors
    const res = await fetch('/api/floors')
    const data = await res.json()
    this.cache.floors = data
    return data
  }

  async fetchMenu(force = false): Promise<MenuItem[]> {
    if (!force && this.cache.menu) return this.cache.menu
    const res = await fetch('/api/menu')
    const data = await res.json()
    this.cache.menu = data
    return data
  }

  async fetchConfig(force = false): Promise<PricingPolicy> {
    if (!force && this.cache.config) return this.cache.config
    const res = await fetch('/api/config')
    const data = await res.json()
    this.cache.config = data
    return data
  }

  async fetchCategories(force = false): Promise<Kategori[]> {
    if (!force && this.cache.categories) return this.cache.categories
    const res = await fetch('/api/categories')
    const data = await res.json()
    this.cache.categories = data
    return data
  }

  clear() {
    this.cache = {
      tables: null,
      floors: null,
      menu: null,
      config: null,
      categories: null
    }
  }
}

export const clientCache = new ClientCache()
