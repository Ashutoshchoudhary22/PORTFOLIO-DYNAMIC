"use client";

import { useEffect, useState } from "react";
import { AdminShell } from "@/components/admin/admin-shell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { adminApi } from "@/lib/api";
import { getAdminToken } from "@/lib/admin-auth";
import type { ContactMessage } from "@/lib/types";
import { Spinner } from "@/components/loading";

export default function AdminMessagesPage() {
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  async function loadMessages(query = "") {
    const token = getAdminToken();
    if (!token) return;
    const result = await adminApi.getMessages(token, query ? { search: query } : undefined);
    setMessages(result.messages);
  }

  useEffect(() => {
    loadMessages().finally(() => setLoading(false));
  }, []);

  return (
    <AdminShell>
      <div className="space-y-4">
        <Card className="bg-slate-900 border-white/10">
          <CardHeader>
            <CardTitle>Contact Messages</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex gap-2">
              <Input
                placeholder="Search messages..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
              <Button onClick={() => loadMessages(search)}>Search</Button>
            </div>
            {loading ? (
              <Spinner />
            ) : messages.length === 0 ? (
              <p className="text-white/60">No messages found.</p>
            ) : (
              messages.map((message) => (
                <div key={message._id} className="border border-white/10 rounded-md p-4 space-y-2">
                  <div className="flex justify-between gap-3">
                    <div>
                      <p className="font-medium">{message.name}</p>
                      <p className="text-sm text-white/60">{message.email}</p>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={async () => {
                          const token = getAdminToken();
                          if (!token) return;
                          await adminApi.updateMessage(token, message._id, {
                            isRead: !message.isRead,
                          });
                          await loadMessages(search);
                        }}
                      >
                        {message.isRead ? "Mark Unread" : "Mark Read"}
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={async () => {
                          const token = getAdminToken();
                          if (!token) return;
                          await adminApi.updateMessage(token, message._id, {
                            isReplied: !message.isReplied,
                          });
                          await loadMessages(search);
                        }}
                      >
                        {message.isReplied ? "Unmark Replied" : "Mark Replied"}
                      </Button>
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={async () => {
                          const token = getAdminToken();
                          if (!token) return;
                          if (!confirm("Delete message?")) return;
                          await adminApi.deleteMessage(token, message._id);
                          await loadMessages(search);
                        }}
                      >
                        Delete
                      </Button>
                    </div>
                  </div>
                  <p className="text-sm">{message.message}</p>
                  <p className="text-xs text-white/50">
                    {new Date(message.createdAt).toLocaleString()}
                  </p>
                </div>
              ))
            )}
          </CardContent>
        </Card>
      </div>
    </AdminShell>
  );
}
