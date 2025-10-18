import React, { useState, useRef, useEffect, useCallback } from "react";
import usePortfolioStore from "../store/store";

export default function UserProfile() {
  const [name, setName] = useState("");
  const [desc, setDesc] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [preview, setPreview] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [query, setQuery] = useState("");
  const [proxiedImages, setProxiedImages] = useState({})

  // ref for file input
  const fileRef = useRef(null);

  const items = usePortfolioStore((s) => s.items) || [];
  const fetchRemote = usePortfolioStore((s) => s.fetchRemote);
  const saveProfileWithImage = usePortfolioStore((s) => s.saveProfileWithImage);
  const deleteRemote = usePortfolioStore((s) => s.deleteRemote);

  useEffect(() => {
    if (typeof fetchRemote === "function") fetchRemote().catch(() => {});
  }, [fetchRemote]);

  useEffect(() => {
    if (!success) return;
    const t = setTimeout(() => setSuccess(null), 2500);
    return () => clearTimeout(t);
  }, [success]);

  function setPreviewFromFile(file) {
    if (!file) {
      setPreview(null);
      return;
    }
    const r = new FileReader();
    r.onload = () => setPreview(r.result);
    r.onerror = () => setPreview(null);
    r.readAsDataURL(file);
  }

  function handleFileChange(e) {
    const file = e?.target?.files?.[0] || null;
    setSelectedFile(file);
    setPreviewFromFile(file);
  }

  function handleDrop(e) {
    e.preventDefault();
    const file = e.dataTransfer?.files?.[0] || null;
    if (!file) return;
    setSelectedFile(file);
    setPreviewFromFile(file);
    if (fileRef.current) fileRef.current.files = e.dataTransfer.files;
  }

  function handleDragOver(e) {
    e.preventDefault();
  }

  function resetForm() {
    setName("");
    setDesc("");
    setEditingId(null);
    setPreview(null);
    setSelectedFile(null);
    setError(null);
    if (fileRef.current) fileRef.current.value = "";
  }

  async function handleSubmit(e) {
    e?.preventDefault?.();
    if (!name.trim()) {
      setError("Name is required");
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const item = editingId
        ? { id: editingId, name: name.trim(), bio: desc.trim() }
        : { name: name.trim(), bio: desc.trim() };
      await saveProfileWithImage(item, selectedFile);
      setSuccess(editingId ? "Profile updated" : "Profile created");
      resetForm();
    } catch (err) {
      setError(err?.message || "Save failed");
    } finally {
      setLoading(false);
    }
  }

  function startEdit(p) {
    setEditingId(p.id);
    setName(p.name || "");
    setDesc(p.bio || "");
    setPreview(p.profileImageUrl || null);
    setSelectedFile(null);
    setError(null);
    if (fileRef.current) fileRef.current.value = "";
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  const handleDelete = useCallback(async (id) => {
    if (!window.confirm("Delete this profile?")) return;
    setLoading(true);
    try {
      await deleteRemote(id);
      setSuccess("Profile deleted");
      if (editingId === id) resetForm();
    } catch (err) {
      setError("Delete failed");
    } finally {
      setLoading(false);
    }
  }, [deleteRemote, editingId]);

  // reference handleDelete so eslint doesn't mark it as unused (keeps code simple)
  useEffect(() => { /* no-op; reference to satisfy linter */ void handleDelete; }, [handleDelete]);

  const filtered = items.filter(
    (p) =>
      !query ||
      (p.name && p.name.toLowerCase().includes(query.toLowerCase())) ||
      (p.bio && p.bio.toLowerCase().includes(query.toLowerCase())) ||
      String(p.id || "").includes(query)
  );

  function normalizeDriveUrl(url) {
    if (!url) return ''
    if (url.startsWith('data:')) return url
    const m = url.match(/\/d\/([a-zA-Z0-9_-]+)/) || url.match(/[?&]id=([a-zA-Z0-9_-]+)/)
    if (m) return `https://drive.google.com/uc?export=view&id=${m[1]}`
    return url
  }

  async function fetchProxyForProfile(p) {
    if (!process.env.REACT_APP_APPS_SCRIPT_URL) return
    try {
      // try to determine fileId
      const fid = p.imageId ||
        (p.profileImageUrl && ((p.profileImageUrl.match(/\/d\/([a-zA-Z0-9_-]+)/) || p.profileImageUrl.match(/[?&]id=([a-zA-Z0-9_-]+)/)) || [])[1])
      if (!fid) return
      const url = `${process.env.REACT_APP_APPS_SCRIPT_URL}?action=getImage&fileId=${encodeURIComponent(fid)}`
      const res = await fetch(url)
      const j = await res.json()
      if (j && j.dataUrl) setProxiedImages((s) => ({ ...s, [p.id]: j.dataUrl }))
    } catch (err) {
      // silent fail — leave original URL (and optionally log)
      console.error('proxy fetch failed for', p.id, err)
    }
  }

  useEffect(() => {
    try {
      // inspect entire store and key functions
      const st = usePortfolioStore.getState ? usePortfolioStore.getState() : undefined;
      console.log('ZUSTAND STORE STATE:', st);
      console.log('fetchRemote type:', st && typeof st.fetchRemote);
      console.log('saveProfileWithImage type:', st && typeof st.saveProfileWithImage);
    } catch (e) {
      console.error('store debug failed', e);
    }
  }, []);

  return (
    <div className="max-w-6xl mx-auto p-8 font-sans text-gray-800">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-3xl font-extrabold tracking-tight text-gray-900">
            User Profiles
          </h2>
          <p className="mt-1 text-sm text-gray-500 max-w-xl">
            Create and manage user profiles. Upload a profile image, edit
            details, and sync with Google Sheets & Drive.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <input
            aria-label="Search profiles"
            className="px-4 py-2 border rounded-lg w-72 text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-300"
            placeholder="Search name, description or id"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          <button
            onClick={() => fetchRemote && fetchRemote()}
            className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-sm shadow"
            disabled={loading}
          >
            Refresh
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Form card */}
        <form
          onSubmit={handleSubmit}
          className="bg-white rounded-2xl shadow-md p-6 border border-gray-100 space-y-5"
          aria-label="Profile form"
        >
          <div className="flex items-center gap-4">
            <div className="relative w-24 h-24 rounded-full overflow-hidden bg-gradient-to-br from-gray-100 to-gray-50 flex items-center justify-center ring-1 ring-gray-200">
              {preview ? (
                <img
                  src={preview}
                  alt="preview"
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="text-3xl text-indigo-200">
                  {(name && name[0]) || "👤"}
                </div>
              )}
              <label
                title="Change photo"
                className="absolute -right-1 -bottom-1 inline-flex items-center justify-center w-9 h-9 bg-white border border-gray-200 rounded-full shadow-sm cursor-pointer"
              >
                <input
                  ref={fileRef}
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="hidden"
                />
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-4 h-4 text-gray-600"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="1.5"
                    d="M3 7v10a2 2 0 002 2h10l4 4V7a2 2 0 00-2-2H5a2 2 0 00-2 2z"
                  />
                </svg>
              </label>
            </div>

            <div className="flex-1">
              <div className="text-sm font-medium text-gray-700">
                {editingId ? "Editing profile" : "Create profile"}
              </div>
              <div className="text-xs text-gray-400">
                Add name, bio and an optional photo
              </div>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">
              Full name
            </label>
            <input
              className="w-full p-3 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Jane Doe"
              disabled={loading}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">
              Short bio
            </label>
            <textarea
              className="w-full p-3 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300"
              value={desc}
              onChange={(e) => setDesc(e.target.value)}
              placeholder="Role, skills or short description"
              rows="4"
              disabled={loading}
            />
          </div>

          <div>
            <label className="text-sm font-medium text-gray-600 mb-2 inline-block">
              Photo (drag & drop supported)
            </label>
            <div
              onDrop={handleDrop}
              onDragOver={handleDragOver}
              className="flex items-center justify-between gap-4 p-3 border-2 border-dashed border-gray-200 rounded-lg bg-gray-50"
            >
              <div className="flex items-center gap-3">
                <svg
                  className="w-6 h-6 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M7 16V4m0 0L3 8m4-4 4 4M21 20v-6a2 2 0 00-2-2h-6"
                  />
                </svg>
                <div className="text-sm text-gray-600">
                  {selectedFile
                    ? selectedFile.name
                    : "Drop an image or click avatar to choose"}
                </div>
              </div>
              <div className="text-sm text-gray-400">Max 5MB</div>
            </div>
          </div>

          {(error || success) && (
            <div className="rounded-md p-3 text-sm">
              {error && <div className="text-red-600">{error}</div>}
              {success && <div className="text-green-600">{success}</div>}
            </div>
          )}

          <div className="flex gap-3">
            <button
              type="submit"
              className="flex-1 px-4 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-sm shadow"
              disabled={loading}
            >
              {loading
                ? "Saving..."
                : editingId
                ? "Update profile"
                : "Create profile"}
            </button>
            <button
              type="button"
              onClick={resetForm}
              className="px-4 py-3 border rounded-lg text-sm text-gray-700 bg-white"
              disabled={loading}
            >
              Clear
            </button>
          </div>
        </form>

        {/* List / cards */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-2xl shadow-md p-5 border border-gray-100">
            <div className="flex items-center justify-between mb-4">
              <div className="text-sm text-gray-600">
                Profiles · {filtered.length}
              </div>
              <div className="flex items-center gap-2">
                <input
                  placeholder="Quick load id"
                  className="px-3 py-2 border rounded-lg text-sm"
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      const id = e.target.value.trim();
                      if (id) {
                        const found = items.find(
                          (x) => String(x.id) === String(id)
                        );
                        if (found) startEdit(found);
                      }
                    }
                  }}
                />
                <button
                  className="px-3 py-2 bg-gray-800 text-white rounded-lg text-sm"
                  onClick={() => fetchRemote && fetchRemote()}
                >
                  Refresh
                </button>
              </div>
            </div>

            {/* active grid of profile cards */}
            <div className="grid gap-4 sm:grid-cols-2">
              {filtered.length === 0 ? (
                <div className="p-6 text-gray-500">No profiles yet — create one.</div>
              ) : (
                filtered.map((p) => {
                  const src = proxiedImages[p.id] || normalizeDriveUrl(p.profileImageUrl)
                  return (
                    <div
                      key={p.id}
                      className="flex items-center justify-between p-4 border rounded-lg hover:shadow-lg transition-shadow duration-150"
                    >
                      <div className="flex items-center gap-4">
                        <div className="w-14 h-14 rounded-full overflow-hidden bg-gradient-to-br from-gray-100 to-white flex items-center justify-center">
                          {src ? (
                            <img
                              src={src}
                              alt={p.name}
                              className="w-full h-full object-cover"
                              onError={async (e) => {
                                // try proxy once if available and not already proxied
                                if (process.env.REACT_APP_APPS_SCRIPT_URL && !proxiedImages[p.id]) {
                                  await fetchProxyForProfile(p)
                                  return
                                }
                                // fallback visual if image cannot load
                                e.currentTarget.onerror = null
                                e.currentTarget.style.display = 'none'
                              }}
                            />
                          ) : (
                            <div className="placeholder text-gray-400 text-xs">No image</div>
                          )}
                        </div>
                        <div className="min-w-0">
                          <div className="font-semibold text-gray-900 text-base truncate">{p.name}</div>
                          <div className="text-sm text-gray-500 truncate">{p.bio}</div>
                          <div className="text-xs text-gray-400 mt-1">id: {p.id}</div>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => startEdit(p)}
                          className="px-3 py-1 bg-yellow-400 hover:bg-yellow-500 rounded-md text-sm"
                          title="Edit"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(p.id)}
                          className="px-3 py-1 bg-red-500 hover:bg-red-600 text-white rounded-md text-sm"
                          disabled={loading}
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  )
                })
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
