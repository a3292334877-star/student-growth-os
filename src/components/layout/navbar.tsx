"use client";

import { useSession, signOut } from "next-auth/react";
import { LogOut, User } from "lucide-react";
import Link from "next/link";

export function Navbar() {
  const { data: session } = useSession();

  return (
    <header className="flex h-16 items-center justify-between border-b bg-white px-6">
      <div>
        <h1 className="text-lg font-semibold text-gray-900">大学生成长OS</h1>
      </div>

      <div className="flex items-center gap-4">
        <span className="text-sm text-gray-600">
          {session?.user?.name || session?.user?.email}
        </span>
        <Link
          href="/settings"
          className="rounded-full p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-600"
        >
          <User className="h-5 w-5" />
        </Link>
        <button
          onClick={() => signOut({ callbackUrl: "/login" })}
          className="rounded-full p-2 text-gray-400 hover:bg-gray-100 hover:text-red-500"
        >
          <LogOut className="h-5 w-5" />
        </button>
      </div>
    </header>
  );
}
