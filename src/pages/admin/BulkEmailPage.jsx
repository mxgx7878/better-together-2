// src/pages/admin/BulkEmailPage.jsx
import { useState } from "react";
import { toast } from "sonner";
import { Send, Loader2 } from "lucide-react";
import api from "../../services/api";
import RecipientPicker from "../../components/admin/RecipientPicker";

export default function BulkEmailPage() {
  const [selection, setSelection] = useState(null);
  const [subject, setSubject] = useState("");
  const [body, setBody] = useState("");
  const [sending, setSending] = useState(false);

  const handleSend = async () => {
    if (!subject.trim() || !body.trim()) {
      toast.error("Subject and description are required.");
      return;
    }
    if (!selection) return;

    const payload = { audience: selection.audience, subject, body };

    if (selection.audience === "external") {
      if (selection.externalEmails.length === 0) {
        toast.error("Add at least one external email.");
        return;
      }
      payload.external_emails = selection.externalEmails;
    } else if (selection.selectAll) {
      payload.select_all = true;
      payload.excluded_user_ids = selection.excludedUserIds;
    } else {
      if (selection.userIds.length === 0) {
        toast.error("Select at least one recipient.");
        return;
      }
      payload.user_ids = selection.userIds;
    }

    setSending(true);
    try {
      const res = await api.post("/admin/email-broadcasts", payload);
      toast.success(res.message || "Broadcast queued.");
      setSubject(""); setBody("");
    } catch (err) {
      toast.error(err.message || "Failed to queue broadcast.");
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-800">Broadcast Email</h1>
        <p className="text-sm text-slate-500 mt-1">
          Send an announcement, newsletter, or promo to providers, participants, or custom emails. Emails send in the background.
        </p>
      </div>

      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 space-y-5">
        <RecipientPicker onChange={setSelection} />

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Subject</label>
          <input value={subject} onChange={(e) => setSubject(e.target.value)} className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:ring-2 focus:ring-purple-500 focus:outline-none" />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Description</label>
          <textarea rows={8} value={body} onChange={(e) => setBody(e.target.value)} className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:ring-2 focus:ring-purple-500 focus:outline-none" />
        </div>

        <button onClick={handleSend} disabled={sending} className="inline-flex items-center gap-2 bg-purple-600 hover:bg-purple-700 text-white font-medium px-5 py-2.5 rounded-lg disabled:opacity-60">
          {sending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
          Send
        </button>
      </div>
    </div>
  );
}