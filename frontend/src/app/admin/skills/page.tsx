"use client";

import { SimpleCrudPage } from "@/components/admin/simple-crud-page";
import { adminApi } from "@/lib/api";
import type { SkillItem } from "@/lib/types";

export default function AdminSkillsPage() {
  return (
    <SimpleCrudPage<SkillItem>
      title="Skill"
      emptyItem={{
        name: "",
        description: "",
        category: "",
        iconUrl: "",
        bgColor: "",
        sortOrder: 0,
        isActive: true,
      }}
      fields={[
        { name: "name", label: "Name" },
        { name: "category", label: "Category" },
        { name: "description", label: "Description", type: "textarea" },
        { name: "iconUrl", label: "Icon URL" },
        { name: "bgColor", label: "Background Color" },
        { name: "sortOrder", label: "Sort Order", type: "number" },
        { name: "isActive", label: "Active", type: "checkbox" },
      ]}
      listLabel={(item) => `${item.category} • ${item.name}`}
      fetchItems={adminApi.getSkills}
      createItem={adminApi.createSkill}
      updateItem={adminApi.updateSkill}
      deleteItem={adminApi.deleteSkill}
    />
  );
}
