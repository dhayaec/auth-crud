"use client";

import { useEffect, useState, FormEvent } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

type Profile = {
  id: string;
  email: string;
  name: string | null;
  bio: string | null;
  avatarUrl: string | null;
  createdAt: string;
  updatedAt: string;
};

export default function ProfilePage() {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [name, setName] = useState("");
  const [bio, setBio] = useState("");
  const [avatarUrl, setAvatarUrl] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const router = useRouter();

  useEffect(() => {
    fetch("/api/profile")
      .then((res) => {
        if (!res.ok) throw new Error("Not authenticated");
        return res.json();
      })
      .then((data) => {
        setProfile(data.profile);
        setName(data.profile.name || "");
        setBio(data.profile.bio || "");
        setAvatarUrl(data.profile.avatarUrl || "");
      })
      .catch(() => {
        router.push("/login");
      })
      .finally(() => setLoading(false));
  }, [router]);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError("");
    setSuccess("");
    setSaving(true);

    const res = await fetch("/api/profile", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: name || null,
        bio: bio || null,
        avatarUrl: avatarUrl || null,
      }),
    });

    const data = await res.json();
    setSaving(false);

    if (!res.ok) {
      setError(data.error || "Something went wrong");
      return;
    }

    setProfile(data.profile);
    setSuccess("Profile updated");
  }

  async function handleLogout() {
    document.cookie = "token=; path=/; max-age=0";
    router.push("/login");
  }

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-zinc-50">
        <p className="text-zinc-500">Loading...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-50 px-4 py-12">
      <div className="mx-auto max-w-md">
        <div className="mb-8 flex items-center justify-between">
          <h1 className="text-2xl font-semibold text-zinc-900">Profile</h1>
          <button
            onClick={handleLogout}
            className="text-sm text-zinc-500 hover:text-zinc-900"
          >
            Log out
          </button>
        </div>

        {profile && (
          <div className="mb-6 rounded-xl bg-white p-6 shadow-sm">
            <p className="text-sm text-zinc-500">
              Email:{" "}
              <span className="text-zinc-900">{profile.email}</span>
            </p>
            <p className="mt-1 text-sm text-zinc-500">
              Joined:{" "}
              <span className="text-zinc-900">
                {new Date(profile.createdAt).toLocaleDateString()}
              </span>
            </p>
          </div>
        )}

        <form
          onSubmit={handleSubmit}
          className="rounded-xl bg-white p-6 shadow-sm"
        >
          <h2 className="mb-4 text-lg font-medium text-zinc-900">
            Edit profile
          </h2>

          {error && (
            <p className="mb-4 rounded-lg bg-red-50 p-3 text-sm text-red-600">
              {error}
            </p>
          )}
          {success && (
            <p className="mb-4 rounded-lg bg-green-50 p-3 text-sm text-green-600">
              {success}
            </p>
          )}

          <div className="mb-4">
            <label
              htmlFor="name"
              className="mb-1 block text-sm font-medium text-zinc-700"
            >
              Name
            </label>
            <input
              id="name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full rounded-lg border border-zinc-300 px-3 py-2 text-sm focus:border-zinc-500 focus:outline-none"
            />
          </div>

          <div className="mb-4">
            <label
              htmlFor="bio"
              className="mb-1 block text-sm font-medium text-zinc-700"
            >
              Bio
            </label>
            <textarea
              id="bio"
              rows={3}
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              className="w-full resize-none rounded-lg border border-zinc-300 px-3 py-2 text-sm focus:border-zinc-500 focus:outline-none"
            />
          </div>

          <div className="mb-6">
            <label
              htmlFor="avatarUrl"
              className="mb-1 block text-sm font-medium text-zinc-700"
            >
              Avatar URL
            </label>
            <input
              id="avatarUrl"
              type="url"
              value={avatarUrl}
              onChange={(e) => setAvatarUrl(e.target.value)}
              placeholder="https://example.com/avatar.jpg"
              className="w-full rounded-lg border border-zinc-300 px-3 py-2 text-sm focus:border-zinc-500 focus:outline-none"
            />
          </div>

          <button
            type="submit"
            disabled={saving}
            className="w-full rounded-lg bg-zinc-900 py-2 text-sm font-medium text-white hover:bg-zinc-800 disabled:opacity-50"
          >
            {saving ? "Saving..." : "Save changes"}
          </button>
        </form>

        <p className="mt-6 text-center">
          <Link href="/" className="text-sm text-zinc-500 hover:text-zinc-900">
            &larr; Back to home
          </Link>
        </p>
      </div>
    </div>
  );
}
