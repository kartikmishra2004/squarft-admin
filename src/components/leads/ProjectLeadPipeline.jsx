import { useEffect, useMemo, useState } from "react";
import {
  Building2,
  CalendarDays,
  Headphones,
  MapPin,
  Mic2,
  Phone,
  RefreshCw,
  Search,
  UserRound,
  X,
} from "lucide-react";
import { fetchProjectLeads } from "../../services/projectLeadService";

const stageLabels = {
  new_lead: "New Lead",
  first_contact: "First Contact",
  follow_up: "Follow-up",
  meeting_scheduled: "Meeting Scheduled",
  interested: "Interested",
  in_review: "In Review",
  project_live: "Project Live",
  rejected: "Rejected",
};
const stages = [
  "all",
  "new_lead",
  "first_contact",
  "follow_up",
  "meeting_scheduled",
  "interested",
  "in_review",
  "project_live",
  "rejected",
];
const label = (value) =>
  stageLabels[value] || String(value || "").replaceAll("_", " ");
const dateTime = (value) =>
  value
    ? new Date(value).toLocaleString("en-IN", {
        dateStyle: "medium",
        timeStyle: "short",
      })
    : "—";
const duration = (ms) => {
  const seconds = Math.round(Number(ms || 0) / 1000);
  return `${Math.floor(seconds / 60)}:${String(seconds % 60).padStart(2, "0")}`;
};

const ActivityHistory = ({ lead }) => (
  <div className="space-y-4 border-t border-slate-200 pt-4">
    <div>
      <p className="text-[11px] font-black uppercase tracking-wider text-slate-500">
        Follow-ups ({lead.follow_ups?.length || 0})
      </p>
      <div className="mt-2 space-y-2">
        {(lead.follow_ups || []).map((item) => (
          <div key={item.id} className="rounded-lg border border-slate-200 p-3">
            <div className="flex justify-between gap-2">
              <p className="text-xs font-black capitalize">
                {label(item.follow_up_type)}
              </p>
              <span className="text-[10px] font-black capitalize text-orange-700">
                {label(item.follow_up_status)}
              </span>
            </div>
            <p className="mt-1 text-[11px] text-slate-500">
              {dateTime(item.next_follow_up_at)} · {label(item.outcome)}
            </p>
            {item.remarks && (
              <p className="mt-2 whitespace-pre-wrap text-xs leading-5 text-slate-700">
                {item.remarks}
              </p>
            )}
            <p className="mt-1 text-[11px] text-slate-500">
              Next: {label(item.next_action)}
            </p>
            {item.voice_note_url && (
              <audio
                controls
                preload="metadata"
                className="mt-2 w-full"
                src={item.voice_note_url}
              />
            )}
            {item.site_photo_url && (
              <a
                href={item.site_photo_url}
                target="_blank"
                rel="noreferrer"
                className="mt-2 block"
              >
                <img
                  src={item.site_photo_url}
                  alt="Site proof"
                  className="h-28 w-full rounded-lg object-cover"
                />
                <span className="mt-1 block text-[10px] font-bold text-indigo-600">
                  {item.site_photo_address || "Open site proof"}
                </span>
                {item.site_photo_captured_at && (
                  <span className="mt-0.5 block text-[10px] text-slate-400">
                    Captured {dateTime(item.site_photo_captured_at)}
                  </span>
                )}
              </a>
            )}
          </div>
        ))}
        {!lead.follow_ups?.length && (
          <p className="text-xs text-slate-400">No follow-ups yet.</p>
        )}
      </div>
    </div>
    <div>
      <p className="text-[11px] font-black uppercase tracking-wider text-slate-500">
        Meetings ({lead.meetings?.length || 0})
      </p>
      <div className="mt-2 space-y-2">
        {(lead.meetings || []).map((item) => (
          <div key={item.id} className="rounded-lg border border-slate-200 p-3">
            <div className="flex justify-between gap-2">
              <p className="text-xs font-black capitalize">
                {label(item.meeting_type)}
              </p>
              <span className="text-[10px] font-black capitalize text-indigo-700">
                {label(item.meeting_status)}
              </span>
            </div>
            <p className="mt-1 text-[11px] text-slate-500">
              {dateTime(item.meeting_at)}
            </p>
            <p className="mt-1 text-xs text-slate-700">
              {item.location_address}
            </p>
            {item.agenda?.length > 0 && (
              <p className="mt-2 text-[11px] text-slate-500">
                Agenda: {item.agenda.map(label).join(", ")}
              </p>
            )}
            {item.notes_preparation && (
              <p className="mt-1 whitespace-pre-wrap text-xs text-slate-700">
                {item.notes_preparation}
              </p>
            )}
            <p className="mt-1 text-[10px] text-slate-400">
              Reminder:{" "}
              {item.reminder_minutes
                ? `${item.reminder_minutes} minutes before`
                : "None"}
            </p>
          </div>
        ))}
        {!lead.meetings?.length && (
          <p className="text-xs text-slate-400">No meetings yet.</p>
        )}
      </div>
    </div>
  </div>
);

export default function ProjectLeadPipeline() {
  const [leads, setLeads] = useState([]);
  const [selectedId, setSelectedId] = useState(null);
  const [stage, setStage] = useState("all");
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const load = async () => {
    try {
      setLoading(true);
      setError("");
      const result = await fetchProjectLeads();
      setLeads(result.leads);
      setSelectedId((current) =>
        current && result.leads.some((item) => item.id === current)
          ? current
          : result.leads[0]?.id || null,
      );
    } catch (loadError) {
      setError(loadError?.message || "Could not load project leads.");
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    let mounted = true;
    fetchProjectLeads()
      .then((result) => {
        if (!mounted) return;
        setLeads(result.leads);
        setSelectedId(result.leads[0]?.id || null);
      })
      .catch((loadError) => {
        if (mounted)
          setError(loadError?.message || "Could not load project leads.");
      })
      .finally(() => {
        if (mounted) setLoading(false);
      });
    return () => {
      mounted = false;
    };
  }, []);

  const visible = useMemo(() => {
    const query = search.trim().toLowerCase();
    return leads.filter(
      (item) =>
        (stage === "all" || item.stage === stage) &&
        (!query ||
          [
            item.project_name,
            item.builder_name,
            item.officer_name,
            item.location,
          ].some((value) =>
            String(value || "")
              .toLowerCase()
              .includes(query),
          )),
    );
  }, [leads, search, stage]);
  const selected = leads.find((item) => item.id === selectedId) || null;
  const metrics = useMemo(
    () => ({
      total: leads.length,
      new: leads.filter((item) => item.stage === "new_lead").length,
      active: leads.filter(
        (item) => !["project_live", "rejected"].includes(item.stage),
      ).length,
      audio: leads.filter((item) => item.voice_note_url).length,
    }),
    [leads],
  );

  return (
    <div className="space-y-5">
      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        {[
          [
            "Total project leads",
            metrics.total,
            Building2,
            "bg-indigo-50 text-indigo-600",
          ],
          ["New leads", metrics.new, UserRound, "bg-blue-50 text-blue-600"],
          [
            "Active pipeline",
            metrics.active,
            CalendarDays,
            "bg-emerald-50 text-emerald-600",
          ],
          [
            "With voice notes",
            metrics.audio,
            Mic2,
            "bg-orange-50 text-orange-600",
          ],
        ].map(([title, value, Icon, tone]) => (
          <div
            key={title}
            className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[11px] font-black uppercase tracking-widest text-slate-400">
                  {title}
                </p>
                <p className="mt-2 text-2xl font-black text-slate-950">
                  {value}
                </p>
              </div>
              <div
                className={`flex h-10 w-10 items-center justify-center rounded-xl ${tone}`}
              >
                <Icon className="h-5 w-5" />
              </div>
            </div>
          </div>
        ))}
      </div>
      <div className="flex flex-col gap-5 xl:flex-row xl:items-start">
        <section className="min-w-0 flex-1 overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
          <div className="flex flex-col gap-3 border-b border-slate-200 bg-slate-50 p-4 md:flex-row md:items-center">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <input
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Search project, builder or field officer"
                className="h-10 w-full rounded-lg border border-slate-300 bg-white pl-10 pr-3 text-sm outline-none focus:border-indigo-500"
              />
            </div>
            <select
              value={stage}
              onChange={(event) => setStage(event.target.value)}
              className="h-10 rounded-lg border border-slate-300 bg-white px-3 text-sm font-bold text-slate-700 outline-none focus:border-indigo-500"
            >
              {stages.map((item) => (
                <option key={item} value={item}>
                  {item === "all" ? "All stages" : label(item)}
                </option>
              ))}
            </select>
            <button
              type="button"
              onClick={load}
              className="flex h-10 items-center justify-center gap-2 rounded-lg border border-slate-300 bg-white px-3 text-sm font-bold text-slate-700 hover:border-indigo-400"
            >
              <RefreshCw
                className={`h-4 w-4 ${loading ? "animate-spin" : ""}`}
              />{" "}
              Refresh
            </button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[850px] text-left">
              <thead>
                <tr className="border-b border-slate-200 bg-[#F3F1FB] text-[11px] font-black uppercase tracking-wider text-slate-700">
                  <th className="px-5 py-4">Project & builder</th>
                  <th className="px-5 py-4">Field officer</th>
                  <th className="px-5 py-4">Stage</th>
                  <th className="px-5 py-4">Notes</th>
                  <th className="px-5 py-4">Added</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {visible.map((item) => (
                  <tr
                    key={item.id}
                    onClick={() => setSelectedId(item.id)}
                    className={`cursor-pointer align-top hover:bg-indigo-50/40 ${selectedId === item.id ? "bg-indigo-50/50" : ""}`}
                  >
                    <td className="px-5 py-4">
                      <p className="font-black text-slate-950">
                        {item.project_name || "Unlinked legacy lead"}
                      </p>
                      <p className="mt-1 text-xs font-bold text-slate-500">
                        {item.builder_name || "Builder unavailable"}
                      </p>
                      {item.location && (
                        <p className="mt-2 flex items-center gap-1 text-xs text-slate-500">
                          <MapPin className="h-3.5 w-3.5" />
                          {item.location}
                        </p>
                      )}
                    </td>
                    <td className="px-5 py-4">
                      <p className="text-sm font-bold text-slate-800">
                        {item.officer_name || "Unassigned"}
                      </p>
                      <p className="mt-1 text-xs text-slate-500">
                        {item.officer_phone || ""}
                      </p>
                    </td>
                    <td className="px-5 py-4">
                      <span className="inline-flex rounded-full bg-indigo-100 px-2.5 py-1 text-[11px] font-black text-indigo-700">
                        {label(item.stage)}
                      </span>
                    </td>
                    <td className="max-w-[280px] px-5 py-4">
                      <p className="line-clamp-3 whitespace-pre-wrap text-sm leading-5 text-slate-700">
                        {item.remarks || "—"}
                      </p>
                      {item.voice_note_url && (
                        <p className="mt-2 flex items-center gap-1 text-xs font-bold text-orange-600">
                          <Headphones className="h-3.5 w-3.5" /> Voice note
                        </p>
                      )}
                    </td>
                    <td className="px-5 py-4 text-xs font-medium text-slate-600">
                      {dateTime(item.created_at)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {!loading && !error && visible.length === 0 && (
            <div className="px-6 py-16 text-center text-sm font-bold text-slate-400">
              No project leads match these filters.
            </div>
          )}
          {loading && (
            <div className="px-6 py-16 text-center text-sm font-bold text-slate-400">
              Loading project leads…
            </div>
          )}
          {error && (
            <div className="px-6 py-16 text-center">
              <p className="text-sm font-bold text-red-600">{error}</p>
              <button
                type="button"
                onClick={load}
                className="mt-3 text-sm font-black text-indigo-600"
              >
                Try again
              </button>
            </div>
          )}
        </section>
        {selected && (
          <aside className="w-full shrink-0 overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm xl:w-[390px]">
            <div className="flex items-center justify-between border-b border-slate-200 bg-[#F9F7FF] px-4 py-3">
              <p className="text-[11px] font-black uppercase tracking-widest text-indigo-600">
                Project lead details
              </p>
              <button
                type="button"
                onClick={() => setSelectedId(null)}
                className="rounded-lg p-1.5 hover:bg-white"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
            <div className="max-h-[calc(100vh-230px)] space-y-5 overflow-y-auto p-5">
              <div>
                <h3 className="text-lg font-black text-slate-950">
                  {selected.project_name}
                </h3>
                <p className="mt-1 text-sm font-bold text-slate-500">
                  {selected.builder_name || "Builder unavailable"}
                </p>
                <span className="mt-3 inline-flex rounded-full bg-indigo-100 px-2.5 py-1 text-[11px] font-black text-indigo-700">
                  {label(selected.stage)}
                </span>
              </div>
              <div className="space-y-2 rounded-lg bg-slate-50 p-4 text-sm">
                <p className="flex items-center gap-2 text-slate-700">
                  <UserRound className="h-4 w-4 text-slate-400" />
                  {selected.builder_contact_person ||
                    selected.builder_name ||
                    "—"}
                </p>
                <p className="flex items-center gap-2 text-slate-700">
                  <Phone className="h-4 w-4 text-slate-400" />
                  {selected.builder_phone || "—"}
                </p>
                <p className="flex items-center gap-2 text-slate-700">
                  <MapPin className="h-4 w-4 text-slate-400" />
                  {selected.location || "—"}
                </p>
              </div>
              <div>
                <p className="text-[11px] font-black uppercase tracking-wider text-slate-500">
                  Field officer
                </p>
                <p className="mt-2 text-sm font-black text-slate-900">
                  {selected.officer_name || "Unassigned"}
                </p>
                <p className="text-xs text-slate-500">
                  {selected.officer_phone || ""}
                </p>
              </div>
              <div>
                <p className="text-[11px] font-black uppercase tracking-wider text-slate-500">
                  Initial notes
                </p>
                <p className="mt-2 whitespace-pre-wrap rounded-lg border border-slate-200 p-3 text-sm leading-6 text-slate-700">
                  {selected.remarks || "No notes provided."}
                </p>
              </div>
              {selected.voice_note_url && (
                <div>
                  <p className="mb-2 flex items-center gap-2 text-[11px] font-black uppercase tracking-wider text-slate-500">
                    <Mic2 className="h-4 w-4" />
                    Voice note · {duration(selected.voice_note_duration_ms)}
                  </p>
                  <audio
                    controls
                    preload="metadata"
                    className="w-full"
                    src={selected.voice_note_url}
                  >
                    Your browser does not support audio playback.
                  </audio>
                </div>
              )}
              <ActivityHistory lead={selected} />
              <p className="text-xs text-slate-400">
                Added {dateTime(selected.created_at)}
              </p>
            </div>
          </aside>
        )}
      </div>
    </div>
  );
}
