import { getCategories, setCategories, getMenu, setMenu } from '@/lib/kv'
import type { Kategori } from '@/lib/types'

export const dynamic = 'force-dynamic'

export async function GET() {
  try {
    const categories = await getCategories()
    return Response.json(categories)
  } catch (err) {
    console.error('[GET /api/categories]', err)
    return Response.json({ error: 'Kategoriler alınamadı' }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const newCategories = await request.json() as Kategori[]
    if (!Array.isArray(newCategories)) {
      return Response.json({ error: 'Geçersiz veri formatı' }, { status: 400 })
    }

    const oldCategories = await getCategories()
    const menu = await getMenu()
    let menuUpdated = false

    // 1. Silinen kategorileri tespit et (oldCategories'te olup newCategories'te olmayanlar)
    const deletedCategories = oldCategories.filter(
      (oldCat) => !newCategories.some((newCat) => newCat.id === oldCat.id)
    )

    // 2. İsmi güncellenen kategorileri tespit et (id'leri aynı ama ad'ları farklı olanlar)
    const renamedCategoriesMap = new Map<string, string>() // oldName -> newName
    for (const oldCat of oldCategories) {
      const matchingNew = newCategories.find((newCat) => newCat.id === oldCat.id)
      if (matchingNew && matchingNew.ad !== oldCat.ad) {
        renamedCategoriesMap.set(oldCat.ad, matchingNew.ad)
      }
    }

    // 3. Menü elemanlarını güncelle
    const updatedMenu = menu.map((item) => {
      // Silinen kategoriye ait ürünler 'diğer' olur
      const isDeleted = deletedCategories.some((cat) => cat.ad === item.kategori)
      if (isDeleted) {
        menuUpdated = true
        return { ...item, kategori: 'diğer' }
      }

      // Adı değişen kategorileri güncelle
      if (renamedCategoriesMap.has(item.kategori)) {
        menuUpdated = true
        return { ...item, kategori: renamedCategoriesMap.get(item.kategori)! }
      }

      return item
    })

    // 4. Redis'e kaydet
    await setCategories(newCategories)
    if (menuUpdated) {
      await setMenu(updatedMenu)
    }

    return Response.json({ ok: true, menuUpdated })
  } catch (err) {
    console.error('[POST /api/categories]', err)
    return Response.json({ error: 'Kategoriler kaydedilemedi' }, { status: 500 })
  }
}
