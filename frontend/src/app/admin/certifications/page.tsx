"use client";

import { SimpleCrudPage } from "@/components/admin/simple-crud-page";
import { adminApi } from "@/lib/api";
import type { CertificationItem } from "@/lib/types";

export default function AdminCertificationsPage() {
  return (
    <SimpleCrudPage<CertificationItem>
      title="Certification"
      emptyItem={{
        title: "",
        issuer: "",
        sortOrder: 0,
        isActive: true,
      }}
      fields={[
        { name: "title", label: "Title" },
        { name: "issuer", label: "Issuer" },
        { name: "sortOrder", label: "Sort Order", type: "number" },
        { name: "isActive", label: "Active", type: "checkbox" },
      ]}
      listLabel={(item) => `${item.title} • ${item.issuer}`}
      fetchItems={adminApi.getCertifications}
      createItem={adminApi.createCertification}
      updateItem={adminApi.updateCertification}
      deleteItem={adminApi.deleteCertification}
    />
  );
}
