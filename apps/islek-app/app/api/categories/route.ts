import { NextResponse } from 'next/server'
import { getCategories, setCategories, getMenu, setMenu } from '@islek/db'
import type { Kategori } from '@islek/db'
import { getTenantId } from '@/lib/auth'


export const dynamic = 'force-dynamic'

export async function GET() {
  const tenantId = await getTenantId()
  if (!tenantId) return NextResponse.json({ error: 'Oturum açmanız gerekiyor' }, { status: 401 })


  try {
    const categories = await getCategories(tenantId)
    return Response.json(categories)
  } catch (err) {
    console.error('[GET /api/categories]', err)
    return Response.json({ error: 'Kategoriler alınamadı' }, { status: 500 })
  }
}

export async function POST(request: Request) {
  const tenantId = await getTenantId()
  if (!tenantId) return NextResponse.json({ error: 'Oturum açmanız gerekiyor' }, { status: 401 })


  try {
    const newCategories = await request.json() as Kategori[]
    if (!Array.isArray(newCategories)) {
      return Response.json({ error: 'Geçersiz veri formatı' }, { status: 400 })
    }

    const oldCategories = await getCategories(tenantId)
    const menu = await getMenu(tenantId)
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
    await setCategories(tenantId, newCategories)
    if (menuUpdated) {
      await setMenu(tenantId, updatedMenu)
    }

    return Response.json({ ok: true, menuUpdated })
  } catch (err) {
    console.error('[POST /api/categories]', err)
    return Response.json({ error: 'Kategoriler kaydedilemedi' }, { status: 500 })
  }
}
