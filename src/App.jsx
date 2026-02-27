import { useState, useEffect } from "react"

const API = "https://kep.uz/api/users"

const App = () => {
  const [users, setUsers] = useState([])
  const [total, setTotal] = useState(0)
  const [pagesCount, setPagesCount] = useState(0)
  const [loading, setLoading] = useState(false)
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(10)
  const [ordering, setOrdering] = useState("-skills_rating")
  const [search, setSearch] = useState("")
  const [country, setCountry] = useState("")
  const [ageMin, setAgeMin] = useState("")
  const [ageMax, setAgeMax] = useState("")
  const [localSearch, setLocalSearch] = useState("")
  const [localCountry, setLocalCountry] = useState("")
  const [localAgeMin, setLocalAgeMin] = useState("")
  const [localAgeMax, setLocalAgeMax] = useState("")

  useEffect(() => {
    setLoading(true)
    const params = new URLSearchParams({ page, page_size: pageSize, ordering })
    if (search) params.set("search", search)
    if (country) params.set("country", country)
    if (ageMin) params.set("age_min", ageMin)
    if (ageMax) params.set("age_max", ageMax)
    fetch(`${API}?${params}`)
      .then(r => r.json())
      .then(d => {
        setUsers(d.data ?? [])
        setTotal(d.total ?? 0)
        setPagesCount(d.pagesCount ?? 0)
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }, [page, pageSize, ordering, search, country, ageMin, ageMax])

  const handleFilter = () => {
    setSearch(localSearch)
    setCountry(localCountry)
    setAgeMin(localAgeMin)
    setAgeMax(localAgeMax)
    setPage(1)
  }

  const handleSort = (field) => {
    setOrdering(ordering === field ? `-${field}` : field)
    setPage(1)
  }

  const flag = (code) => code
    ? code.toUpperCase().replace(/./g, c => String.fromCodePoint(c.charCodeAt(0) + 127397))
    : "🌐"

  const from = total === 0 ? 0 : (page - 1) * pageSize + 1
  const to = Math.min(page * pageSize, total)

  const inp = "border border-gray-300 rounded-lg px-3 py-2 text-sm bg-white focus:outline-none focus:border-blue-400"

  const cols = [
    { label: "Foydalanuvchi" },
    { label: "Nomi" },
    { label: "Davlat" },
    { label: "Yosh" },
    { label: "Ko'nikmalar", field: "skills_rating" },
    { label: "Faollik", field: "activity_rating" },
    { label: "Kontestlar" },
    { label: "Bellashuvlar" },
    { label: "Streak" },
    { label: "Kepcoin", field: "kepcoin" },
    { label: "Oxirgi kirish" },
  ]

  const getPages = () => {
    const set = new Set([1, pagesCount])
    for (let i = Math.max(1, page - 1); i <= Math.min(pagesCount, page + 1); i++) set.add(i)
    const sorted = [...set].sort((a, b) => a - b)
    const result = []
    for (let i = 0; i < sorted.length; i++) {
      if (i > 0 && sorted[i] - sorted[i - 1] > 1) result.push("...")
      result.push(sorted[i])
    }
    return result
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-screen-xl mx-auto px-4 py-8">

        <h1 className="text-center text-2xl font-bold mb-6">User List</h1>
        <div className="flex flex-wrap items-center gap-3 mb-5">
          <input type="text" placeholder="search username or name" value={localSearch}
            onChange={e => setLocalSearch(e.target.value)}
            onKeyDown={e => e.key === "Enter" && handleFilter()}
            className={`${inp} min-w-[200px]`} />
          <div className="flex flex-wrap items-center gap-3 ml-auto">
            <select value={localCountry} onChange={e => setLocalCountry(e.target.value)} className={inp}>
              <option value="">All countries</option>
              <option value="UZ">🇺🇿 Uzbekistan</option>
              <option value="RU">🇷🇺 Russia</option>
              <option value="KZ">🇰🇿 Kazakhstan</option>
              <option value="KG">🇰🇬 Kyrgyzstan</option>
              <option value="US">🇺🇸 USA</option>
              <option value="DE">🇩🇪 Germany</option>
              <option value="JP">🇯🇵 Japan</option>
              <option value="KR">🇰🇷 South Korea</option>
            </select>
            <div className="flex items-center gap-2">
              <input type="number" placeholder="start age" value={localAgeMin} onChange={e => setLocalAgeMin(e.target.value)} className={`${inp} w-24`} />
              <span className="text-gray-400">-</span>
              <input type="number" placeholder="end age" value={localAgeMax} onChange={e => setLocalAgeMax(e.target.value)} className={`${inp} w-24`} />
            </div>
            <button onClick={handleFilter} className="px-5 py-2 bg-gray-900 text-white text-sm font-semibold rounded-lg hover:bg-gray-700 cursor-pointer">
              Filter
            </button>
          </div>
        </div>
        <div className="hidden md:block overflow-x-auto rounded-xl shadow-sm bg-white">
          <table className="w-full border-collapse">
            <thead>
              <tr className="border-b border-gray-200 bg-gray-50">
                {cols.map(col => (
                  <th key={col.label} onClick={() => col.field && handleSort(col.field)}
                    className={`px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase whitespace-nowrap select-none ${col.field ? "cursor-pointer hover:text-gray-800" : ""}`}>
                    {col.label}
                    {col.field && <span className="ml-1 text-gray-400">
                      {ordering === col.field ? "▲" : ordering === `-${col.field}` ? "▼" : "▲▼"}
                    </span>}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {loading ? (
                Array.from({ length: pageSize }).map((_, i) => (
                  <tr key={i} className="border-b border-gray-100">
                    <td className="px-4 py-3">
                      <div className="flex gap-3 items-center">
                        <div className="w-10 h-10 rounded-full bg-gray-200 animate-pulse shrink-0" />
                        <div className="h-3 w-24 bg-gray-200 animate-pulse rounded" />
                      </div>
                    </td>
                    {Array.from({ length: 10 }).map((_, j) => (
                      <td key={j} className="px-4 py-3"><div className="h-3 w-16 bg-gray-200 animate-pulse rounded" /></td>
                    ))}
                  </tr>
                ))
              ) : users.length === 0 ? (
                <tr><td colSpan={11} className="text-center py-16 text-gray-400">🔍 Hech narsa topilmadi</td></tr>
              ) : (
                users.map(u => {
                  const name = [u.firstName, u.lastName].filter(Boolean).join(" ") || "- -"
                  return (
                    <tr key={u.id} className="border-b border-gray-100 hover:bg-blue-50/40 transition-colors">
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-3 min-w-[160px]">
                          <img src={u.avatar || "/default-avatar.png"} onError={e => e.target.src = "/default-avatar.png"} className="w-10 h-10 rounded-full object-cover shrink-0" />
                          <div>
                            <div className="font-semibold text-sm">{u.username}</div>
                            <div className="text-xs text-gray-400">{name}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-sm whitespace-nowrap">{name}</td>
                      <td className="px-4 py-3 text-lg">{flag(u.country)}</td>
                      <td className="px-4 py-3 text-sm">{u.age ?? "—"}</td>
                      <td className="px-4 py-3"><span className="bg-blue-500 text-white text-xs font-bold px-3 py-1 rounded-full">{u.skillsRating ?? "—"}</span></td>
                      <td className="px-4 py-3"><span className="bg-orange-400 text-white text-xs font-bold px-3 py-1 rounded-full">{u.activityRating ?? "—"}</span></td>
                      <td className="px-4 py-3 text-sm">🏆 {u.contestsCount ?? 0}</td>
                      <td className="px-4 py-3 text-sm">⚔️ {u.bellashuvlarCount ?? 0}</td>
                      <td className="px-4 py-3 text-sm">🔥 {u.streak ?? 0}</td>
                      <td className="px-4 py-3 text-sm font-semibold">⭐ {u.kepcoin ?? 0}</td>
                      <td className="px-4 py-3 text-xs text-gray-400 whitespace-nowrap">{u.lastSeen ?? "—"}</td>
                    </tr>
                  )
                })
              )}
            </tbody>
          </table>
        </div>
        <div className="md:hidden space-y-3">
          {loading ? (
            <p className="text-center text-gray-400 py-10">Yuklanmoqda...</p>
          ) : users.length === 0 ? (
            <p className="text-center text-gray-400 py-10">🔍 Hech narsa topilmadi</p>
          ) : (
            users.map(u => {
              const name = [u.firstName, u.lastName].filter(Boolean).join(" ") || "—"
              return (
                <div key={u.id} className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
                  <div className="flex items-center gap-3 mb-3">
                    <img src={u.avatar || "/default-avatar.png"} onError={e => e.target.src = "/default-avatar.png"} className="w-12 h-12 rounded-full object-cover shrink-0" />
                    <div>
                      <div className="font-bold">{u.username}</div>
                      <div className="text-xs text-gray-400">{name}</div>
                      <div className="text-lg">{flag(u.country)}</div>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-2 mb-3">
                    <div><div className="text-xs text-gray-400">Ko'nikmalar</div><span className="bg-blue-500 text-white text-xs font-bold px-2.5 py-0.5 rounded-full">{u.skillsRating ?? "—"}</span></div>
                    <div><div className="text-xs text-gray-400">Faollik</div><span className="bg-orange-400 text-white text-xs font-bold px-2.5 py-0.5 rounded-full">{u.activityRating ?? "—"}</span></div>
                    <div><div className="text-xs text-gray-400">Kepcoin</div><div className="text-sm font-semibold">⭐ {u.kepcoin ?? 0}</div></div>
                    <div><div className="text-xs text-gray-400">Streak</div><div className="text-sm">🔥 {u.streak ?? 0}</div></div>
                  </div>
                  <div className="text-xs text-gray-400 border-t pt-2">{u.lastSeen ?? "—"}</div>
                </div>
              )
            })
          )}
        </div>
        <div className="flex flex-wrap items-center gap-4 mt-5">
          <span className="text-sm text-gray-500">Showing {from}–{to} of {total}</span>
          <div className="mx-auto flex items-center gap-1">
            {pagesCount > 1 && (
              <>
                <button onClick={() => setPage(page - 1)} disabled={page === 1}
                  className={`min-w-[34px] h-[34px] px-2 text-sm rounded-lg border cursor-pointer ${page === 1 ? "text-gray-300 border-gray-200" : "bg-white border-gray-300 hover:border-blue-400"}`}>
                  Prev
                </button>
                {getPages().map((p, i) => p === "..." ? (
                  <span key={i} className="px-1 text-gray-400">...</span>
                ) : (
                  <button key={p} onClick={() => setPage(p)}
                    className={`min-w-[34px] h-[34px] px-2 text-sm rounded-lg border cursor-pointer ${p === page ? "bg-blue-500 border-blue-500 text-white font-bold" : "bg-white border-gray-300 hover:border-blue-400"}`}>
                    {p}
                  </button>
                ))}
                <button onClick={() => setPage(page + 1)} disabled={page === pagesCount}
                  className={`min-w-[34px] h-[34px] px-2 text-sm rounded-lg border cursor-pointer ${page === pagesCount ? "text-gray-300 border-gray-200" : "bg-white border-gray-300 hover:border-blue-400"}`}>
                  Next
                </button>
              </>
            )}
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-500 ml-auto">
            <span>Per page:</span>
            <select value={pageSize} onChange={e => { setPageSize(Number(e.target.value)); setPage(1) }}
              className="border border-gray-300 rounded-lg px-2 py-1 bg-white focus:outline-none">
              {[10, 20, 50].map(n => <option key={n} value={n}>{n}</option>)}
            </select>
          </div>
        </div>

      </div>
    </div>
  )
}

export default App
