"use client"

import { useEffect, useMemo, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Plus, Save, Trash2, X, Edit, RefreshCcw, Search } from "lucide-react"
import { supabase } from "@/lib/supabase/client"
import clsx from "clsx"

type Row = {
  id: number
  [key: string]: any
}

const TABLE = "web_content_informasi_desa"

// Kolom inti yang terlihat di screenshot Anda (lengkap)
const NUMERIC_FIELDS = [
  "penduduk_pria",
  "penduduk_wanita",
  "jumlah_dusun",
  "jumlah_rt",
  "jumlah_rw",
  "luas_tanah_pertanian",
  "luas_ladang",
  "luas_hutan_negara",
  "luas_pemukiman",
] as const

const TEXT_FIELDS = [
  "visi_desa",
  "kecamatan",
  "kabupaten",
  "provinsi",
  "nomor_pos",
  "email",
  "facebook",
  "instagram",
  "youtube",
] as const

const CORE_FIELDS = new Set<string>([
  ...NUMERIC_FIELDS,
  ...TEXT_FIELDS,
])

function toNumberOrNull(v: string): number | null {
  if (v === undefined || v === null) return null
  const trimmed = String(v).trim()
  if (trimmed === "") return null
  const n = Number(trimmed)
  return Number.isFinite(n) ? n : null
}

function emptyForm(): Omit<Row, "id"> {
  const base: Record<string, any> = {}
  NUMERIC_FIELDS.forEach((f) => (base[f] = null))
  TEXT_FIELDS.forEach((f) => (base[f] = ""))
  return base
}

export function InformasiDesaManagement() {
  const [rows, setRows] = useState<Row[]>([])
  const [loading, setLoading] = useState(true)
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null)

  const [isFormOpen, setIsFormOpen] = useState(false)
  const [editingId, setEditingId] = useState<number | null>(null)
  const [formData, setFormData] = useState<Omit<Row, "id">>(emptyForm())

  const [q, setQ] = useState("")

  useEffect(() => {
    load()
  }, [])

  async function load() {
    setLoading(true)
    const { data, error } = await supabase.from(TABLE).select("*").order("id", { ascending: true })
    if (error) {
      console.error(error)
      setMessage({ type: "error", text: "Gagal memuat data" })
    } else {
      setRows(data as Row[] ?? [])
    }
    setLoading(false)
  }

  function openCreate() {
    setEditingId(null)
    setFormData(emptyForm())
    setIsFormOpen(true)
  }

  function openEdit(r: Row) {
    // isi form dengan semua field yang ada pada row
    const next: Record<string, any> = { ...emptyForm() }
    // bawa serta kolom yang mungkin di luar CORE_FIELDS
    Object.keys(r).forEach((k) => {
      if (k === "id") return
      next[k] = r[k]
    })
    setFormData(next)
    setEditingId(r.id)
    setIsFormOpen(true)
  }

  function cancelForm() {
    setEditingId(null)
    setIsFormOpen(false)
    setFormData(emptyForm())
  }

  async function save() {
    try {
      // Bersihkan payload: ubah "" → null untuk kolom numeric; "" biarkan untuk text
      const payload: Record<string, any> = {}
      Object.entries(formData).forEach(([k, v]) => {
        if (NUMERIC_FIELDS.includes(k as any)) {
          payload[k] = typeof v === "number" ? v : toNumberOrNull(String(v ?? ""))
        } else {
          payload[k] = v === undefined ? null : v
        }
      })

      if (editingId != null) {
        const { error } = await supabase.from(TABLE).update(payload).eq("id", editingId)
        if (error) throw error
        setMessage({ type: "success", text: "Data berhasil diperbarui" })
      } else {
        const { error } = await supabase.from(TABLE).insert(payload)
        if (error) throw error
        setMessage({ type: "success", text: "Data berhasil ditambahkan" })
      }
      cancelForm()
      load()
    } catch (e) {
      console.error(e)
      setMessage({ type: "error", text: "Gagal menyimpan data" })
    }
  }

  async function remove(id: number) {
    if (!confirm("Yakin ingin menghapus baris ini?")) return
    try {
      const { error } = await supabase.from(TABLE).delete().eq("id", id)
      if (error) throw error
      setMessage({ type: "success", text: "Data berhasil dihapus" })
      load()
    } catch (e) {
      console.error(e)
      setMessage({ type: "error", text: "Gagal menghapus data" })
    }
  }

  // Deteksi kolom ekstra yang mungkin ada di tabel namun tidak tercakup di daftar inti
  const extraColumns: string[] = useMemo(() => {
    const keys = new Set<string>()
    rows.forEach((r) => Object.keys(r).forEach((k) => keys.add(k)))
    keys.delete("id")
    const extras = Array.from(keys).filter((k) => !CORE_FIELDS.has(k))
    // konsisten urutan alfabet
    return extras.sort((a, b) => a.localeCompare(b))
  }, [rows])

  // Semua kolom untuk tampilan tabel
  const allColumns = useMemo(() => {
    return ["id", ...NUMERIC_FIELDS, ...TEXT_FIELDS, ...extraColumns]
  }, [extraColumns])

  const filtered = useMemo(() => {
    const needle = q.trim().toLowerCase()
    if (!needle) return rows
    return rows.filter((r) => {
      // cari di beberapa kolom umum + semua kolom text
      const hay = [
        r.visi_desa,
        r.kecamatan,
        r.kabupaten,
        r.provinsi,
        r.email,
        r.facebook,
        r.instagram,
        r.youtube,
        ...allColumns.map((c) => (typeof r[c] === "string" ? r[c] : "")),
      ]
      return hay.some((v) => String(v ?? "").toLowerCase().includes(needle))
    })
  }, [rows, q, allColumns])

  if (loading) {
    return (
      <div className="p-6">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-600 mx-auto"></div>
      </div>
    )
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between gap-3 flex-wrap">
        <div>
          <h2 className="text-2xl font-bold">Manajemen Informasi Desa</h2>
          <p className="text-muted-foreground">Tampilkan, tambah, edit, dan hapus data pada tabel {TABLE}</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" onClick={load}>
            <RefreshCcw className="mr-2 h-4 w-4" />
            Muat Ulang
          </Button>
        </div>
      </div>

      {message && (
        <Alert variant={message.type === "error" ? "destructive" : "default"}>
          <AlertDescription>{message.text}</AlertDescription>
        </Alert>
      )}

      {/* Form Tambah / Edit */}
      {isFormOpen && (
        <Card>
          <CardHeader>
            <CardTitle>{editingId != null ? "Edit Row" : "Tambah Row Baru"}</CardTitle>
            <CardDescription>
              Kolom numeric akan disimpan sebagai angka / <span className="font-medium">NULL</span> bila kosong.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* DEMOGRAFI */}
            <section className="space-y-3">
              <h3 className="font-semibold">Demografi</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {NUMERIC_FIELDS.slice(0, 5).map((f) => (
                  <div key={f}>
                    <Label htmlFor={f}>{f.replaceAll("_", " ")}</Label>
                    <Input
                      id={f}
                      type="number"
                      value={formData[f] ?? ""}
                      onChange={(e) => setFormData((p) => ({ ...p, [f]: toNumberOrNull(e.target.value) }))}
                      placeholder="angka…"
                    />
                  </div>
                ))}
              </div>
            </section>

            {/* LUAS WILAYAH */}
            <section className="space-y-3">
              <h3 className="font-semibold">Luas Wilayah (ha)</h3>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                {NUMERIC_FIELDS.slice(5).map((f) => (
                  <div key={f}>
                    <Label htmlFor={f}>{f.replaceAll("_", " ")}</Label>
                    <Input
                      id={f}
                      type="number"
                      value={formData[f] ?? ""}
                      onChange={(e) => setFormData((p) => ({ ...p, [f]: toNumberOrNull(e.target.value) }))}
                      placeholder="angka…"
                    />
                  </div>
                ))}
              </div>
            </section>

            {/* ADMINISTRASI / KONTAK */}
            <section className="space-y-3">
              <h3 className="font-semibold">Administrasi & Kontak</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {["kecamatan", "kabupaten", "provinsi", "nomor_pos", "email", "facebook", "instagram", "youtube"].map(
                  (f) => (
                    <div key={f}>
                      <Label htmlFor={f}>{f.replaceAll("_", " ")}</Label>
                      <Input
                        id={f}
                        value={formData[f] ?? ""}
                        onChange={(e) => setFormData((p) => ({ ...p, [f]: e.target.value }))}
                        placeholder="teks…"
                      />
                    </div>
                  )
                )}
              </div>
              <div>
                <Label htmlFor="visi_desa">visi_desa</Label>
                <Textarea
                  id="visi_desa"
                  rows={4}
                  value={formData["visi_desa"] ?? ""}
                  onChange={(e) => setFormData((p) => ({ ...p, ["visi_desa"]: e.target.value }))}
                  placeholder="visi desa…"
                />
              </div>
            </section>

            {/* KOLOM EKSTRA (jika ada di tabel) */}
            {extraColumns.length > 0 && (
              <section className="space-y-3">
                <h3 className="font-semibold">Kolom Tambahan</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {extraColumns.map((f) => (
                    <div key={f}>
                      <Label htmlFor={f}>{f.replaceAll("_", " ")}</Label>
                      <Input
                        id={f}
                        value={formData[f] ?? ""}
                        onChange={(e) => setFormData((p) => ({ ...p, [f]: e.target.value }))}
                        placeholder="teks…"
                      />
                    </div>
                  ))}
                </div>
                <p className="text-xs text-muted-foreground">
                  Bidang ini muncul otomatis dari kolom yang ada di tabel namun tidak tercakup dalam daftar inti.
                </p>
              </section>
            )}

            <div className="flex gap-2">
              <Button onClick={save}>
                <Save className="mr-2 h-4 w-4" />
                {editingId != null ? "Update" : "Simpan"}
              </Button>
              <Button variant="outline" onClick={cancelForm}>
                <X className="mr-2 h-4 w-4" />
                Batal
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* TABEL DATA */}
      <div className="overflow-x-auto border rounded-xl">
        <table className="min-w-[900px] w-full text-sm">
          <thead className="bg-muted/40">
            <tr>
              {allColumns.map((c) => (
                <th key={c} className="text-left px-3 py-2 font-semibold whitespace-nowrap">
                  {c}
                </th>
              ))}
              <th className="px-3 py-2 text-right">Aksi</th>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 && (
              <tr>
                <td className="px-3 py-4 text-center text-muted-foreground" colSpan={allColumns.length + 1}>
                  Tidak ada data.
                </td>
              </tr>
            )}
            {filtered.map((r) => (
              <tr key={r.id} className="border-t">
                {allColumns.map((c) => (
                  <td key={c} className={clsx("px-3 py-2", c === "visi_desa" && "max-w-[420px]")}>
                    {r[c] ?? ""}
                  </td>
                ))}
                <td className="px-3 py-2">
                  <div className="flex justify-end gap-2">
                    <Button variant="outline" size="sm" onClick={() => openEdit(r)}>
                      <Edit className="h-4 w-4" />
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
