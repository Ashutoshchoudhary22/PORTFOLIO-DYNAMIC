import Link from "next/link";
import { Mail, Sparkles } from "lucide-react";
import type { ContactMessage } from "@/lib/types";
import { adminCardClass, adminMutedClass } from "@/lib/admin-styles";
import { cn } from "@/lib/utils";

type RecentMessagesPanelProps = {
  messages: ContactMessage[];
};

export function RecentMessagesPanel({ messages }: RecentMessagesPanelProps) {
  return (
    <div className={cn(adminCardClass, "rounded-2xl p-5 sm:p-6")}>
      <div className="flex items-center justify-between gap-3 mb-4">
        <h3 className="text-lg font-semibold">Recent Messages</h3>
        <Link
          href="/admin/messages"
          className="text-sm font-medium text-blue-600 hover:text-blue-700 admin-dark:text-blue-400"
        >
          View All
        </Link>
      </div>

      {messages.length === 0 ? (
        <div className="flex flex-col items-center justify-center text-center py-8 px-4">
          <div className="relative mb-4">
            <div className="h-20 w-20 rounded-2xl bg-gradient-to-br from-blue-100 to-cyan-100 flex items-center justify-center admin-dark:from-blue-900/40 admin-dark:to-cyan-900/40">
              <Mail className="h-9 w-9 text-blue-500" />
            </div>
            <Sparkles className="absolute -top-1 -right-1 h-5 w-5 text-amber-400" />
          </div>
          <p className={cn("text-sm", adminMutedClass)}>No messages yet.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {messages.slice(0, 3).map((message) => (
            <div
              key={message._id}
              className="rounded-xl border border-slate-100 bg-slate-50/70 p-3 admin-dark:border-white/10 admin-dark:bg-slate-800/50"
            >
              <p className="font-medium text-sm truncate">{message.name}</p>
              <p className={cn("text-xs truncate", adminMutedClass)}>{message.email}</p>
              <p className="text-sm mt-2 line-clamp-2">{message.message}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
