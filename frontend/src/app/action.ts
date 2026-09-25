import { z } from "zod";

const contactSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  message: z.string().min(10),
});

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

export async function handleContactSubmit(data: z.infer<typeof contactSchema>) {
  const parsedData = contactSchema.safeParse(data);

  if (!parsedData.success) {
    throw new Error("Invalid form data.");
  }

  const response = await fetch(`${API_BASE_URL}/contact`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(parsedData.data),
  });

  const payload = await response.json();

  if (!response.ok || !payload.success) {
    throw new Error(payload.message || "Failed to send message.");
  }

  return { success: true, message: payload.message };
}
