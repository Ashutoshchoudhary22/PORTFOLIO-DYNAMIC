"use client";

import { useEffect, useState } from "react";
import { Mail } from "lucide-react";
import { AdminShell } from "@/components/admin/admin-shell";
import { AdminPageHeader } from "@/components/admin/admin-page-header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { adminApi } from "@/lib/api";
import { getAdminToken } from "@/lib/admin-auth";
import type { ContactMessage } from "@/lib/types";
import { Spinner } from "@/components/loading";
import { adminBorderClass, adminCardClass, adminFaintClass, adminMutedClass } from "@/lib/admin-styles";

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
      <div className="space-y-6">
        <AdminPageHeader
          title="Contact Messages"
          description="View and manage messages sent from your portfolio contact form."
          icon={Mail}
          iconClassName="bg-cyan-100 text-cyan-600 admin-dark:bg-cyan-900/30 admin-dark:text-cyan-400"
          quote="Every message is a new opportunity."
          quoteEmoji="💬"
        />

        <Card className={adminCardClass}>
          <CardHeader>
            <CardTitle>Messages Inbox</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex flex-col sm:flex-row gap-2">
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
              <p className={adminMutedClass}>No messages found.</p>
            ) : (
              messages.map((message) => (
                <div key={message._id} className={`border rounded-md p-4 space-y-2 ${adminBorderClass}`}>
                  <div className="flex flex-col sm:flex-row sm:justify-between gap-3">
                    <div>
                      <p className="font-medium">{message.name}</p>
                      <p className={`text-sm ${adminMutedClass}`}>{message.email}</p>
                    </div>
                    <div className="flex flex-wrap gap-2">
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
                  <p className={`text-xs ${adminFaintClass}`}>
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
