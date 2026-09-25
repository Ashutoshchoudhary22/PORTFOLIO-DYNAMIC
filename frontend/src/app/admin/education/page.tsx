"use client";

import { SimpleCrudPage } from "@/components/admin/simple-crud-page";
import { adminApi } from "@/lib/api";
import type { EducationItem } from "@/lib/types";

export default function AdminEducationPage() {
  return (
    <SimpleCrudPage<EducationItem>
      title="Education"
      emptyItem={{
        degree: "",
        institution: "",
        period: "",
        description: "",
        sortOrder: 0,
        isActive: true,
      }}
      fields={[
        { name: "degree", label: "Degree" },
        { name: "institution", label: "Institution" },
        { name: "period", label: "Period" },
        { name: "description", label: "Description", type: "textarea" },
        { name: "sortOrder", label: "Sort Order", type: "number" },
        { name: "isActive", label: "Active", type: "checkbox" },
      ]}
      listLabel={(item) => `${item.degree} • ${item.institution}`}
      fetchItems={adminApi.getEducation}
      createItem={adminApi.createEducation}
      updateItem={adminApi.updateEducation}
      deleteItem={adminApi.deleteEducation}
    />
  );
}
