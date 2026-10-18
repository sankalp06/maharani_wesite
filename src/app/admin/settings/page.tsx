"use client";

import { useEffect, useState } from "react";
import toast from "react-hot-toast";

export default function AdminSettingsPage() {
  const [form, setForm] = useState({
    phone: "",
    email: "",
    address: "",
    instagram: "",
    facebook: "",
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetch("/api/settings")
      .then((res) => res.json())
      .then((data) =>
        setForm({
          phone: data.phone || "",
          email: data.email || "",
          address: data.address || "",
          instagram: data.instagram || "",
          facebook: data.facebook || "",
        })
      )
      .finally(() => setLoading(false));
  }, []);

  function update<K extends keyof typeof form>(key: K, value: string) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  async function save() {
    setSaving(true);
    try {
      const res = await fetch("/api/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (!res.ok) throw new Error("Failed to save");
      toast.success("Settings updated");
    } catch {
      toast.error("Failed to save settings");
    } finally {
      setSaving(false);
    }
  }

  if (loading) return <p className="text-ink/50 text-sm">Loading...</p>;

  return (
    <div className="max-w-xl">
      <h1 className="font-serif text-2xl text-maroon mb-6">Site Settings</h1>
      <div className="bg-white rounded-xl border border-gold/20 p-6 space-y-4">
        <p className="text-sm text-ink/60">
          These contact details are shown on the storefront header and footer.
        </p>
        <Field label="Phone Number" value={form.phone} onChange={(v) => update("phone", v)} />
        <Field label="Email Address" value={form.email} onChange={(v) => update("email", v)} type="email" />
        <Field label="Business Address" value={form.address} onChange={(v) => update("address", v)} textarea />
        <Field label="Instagram URL" value={form.instagram} onChange={(v) => update("instagram", v)} />
        <Field label="Facebook URL" value={form.facebook} onChange={(v) => update("facebook", v)} />
        <button
          onClick={save}
          disabled={saving}
          className="bg-maroon text-cream px-6 py-2.5 rounded-full text-sm hover:bg-maroon-dark disabled:opacity-50"
        >
          {saving ? "Saving..." : "Save Settings"}
        </button>
      </div>
    </div>
  );
}

function Field({
  label,
  value,
  onChange,
  type = "text",
  textarea = false,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  type?: string;
  textarea?: boolean;
}) {
  return (
    <label className="block">
      <span className="text-xs font-sans text-ink/60 mb-1.5 block">{label}</span>
      {textarea ? (
        <textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          rows={2}
          className="w-full rounded-lg border border-gold/30 p-2.5 text-sm focus:outline-none focus:ring-1 focus:ring-maroon"
        />
      ) : (
        <input
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-full rounded-lg border border-gold/30 p-2.5 text-sm focus:outline-none focus:ring-1 focus:ring-maroon"
        />
      )}
    </label>
  );
}
