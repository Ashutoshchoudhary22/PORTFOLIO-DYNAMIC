"use client";

import { SimpleCrudPage } from "@/components/admin/simple-crud-page";
import { adminApi } from "@/lib/api";
import type { ExperienceItem } from "@/lib/types";

export default function AdminExperiencePage() {
  return (
    <SimpleCrudPage<ExperienceItem>
      title="Experience"
      emptyItem={{
        role: "",
        company: "",
        period: "",
        description: "",
        sortOrder: 0,
        isActive: true,
      }}
      fields={[
        { name: "role", label: "Role" },
        { name: "company", label: "Company" },
        { name: "period", label: "Period" },
        { name: "description", label: "Description", type: "textarea" },
        { name: "sortOrder", label: "Sort Order", type: "number" },
        { name: "isActive", label: "Active", type: "checkbox" },
      ]}
      listLabel={(item) => `${item.role} @ ${item.company}`}
      fetchItems={adminApi.getExperience}
      createItem={adminApi.createExperience}
      updateItem={adminApi.updateExperience}
      deleteItem={adminApi.deleteExperience}
    />
  );
}
