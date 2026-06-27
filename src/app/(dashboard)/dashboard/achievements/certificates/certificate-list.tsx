"use client";

import type { Certificate } from "@/db/schema/certificates";
import { formatDate } from "@/lib/utils";
import { Trash2, GraduationCap, ExternalLink } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

interface CertificateListProps {
  certificates: Certificate[];
}

export function CertificateList({ certificates }: CertificateListProps) {
  const router = useRouter();
  const [deleting, setDeleting] = useState<string | null>(null);

  async function handleDelete(id: string) {
    if (!confirm("确定删除这条记录？")) return;
    setDeleting(id);

    try {
      await fetch(`/api/certificates/${id}`, { method: "DELETE" });
      router.refresh();
    } catch {
      alert("删除失败");
    } finally {
      setDeleting(null);
    }
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {certificates.map((cert) => (
        <div
          key={cert.id}
          className="rounded-xl border bg-white p-5 shadow-sm transition-shadow hover:shadow-md"
        >
          <div className="flex items-start justify-between">
            <div className="rounded-lg bg-rose-50 p-2">
              <GraduationCap className="h-5 w-5 text-rose-600" />
            </div>
            <button
              onClick={() => handleDelete(cert.id)}
              disabled={deleting === cert.id}
              className="rounded p-1 text-gray-400 hover:bg-red-50 hover:text-red-500"
            >
              <Trash2 className="h-4 w-4" />
            </button>
          </div>

          <h3 className="mt-3 font-semibold text-gray-900">{cert.name}</h3>

          <div className="mt-2 space-y-1 text-xs text-gray-500">
            {cert.issuer && <p>颁发机构：{cert.issuer}</p>}
            {cert.certNumber && <p>证书编号：{cert.certNumber}</p>}
            {cert.issueDate && <p>颁发日期：{formatDate(cert.issueDate)}</p>}
          </div>

          {cert.imageUrl && (
            <a
              href={cert.imageUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-3 inline-flex items-center gap-1 text-xs text-primary-600 hover:text-primary-700"
            >
              <ExternalLink className="h-3 w-3" />
              查看证书
            </a>
          )}
        </div>
      ))}
    </div>
  );
}
