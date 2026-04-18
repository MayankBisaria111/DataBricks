import { motion } from "framer-motion";
import { useState } from "react";
import { FileText, Send, CloudUpload, AlertCircle, Edit3, CheckCircle2 } from "lucide-react";
import { useDarkMode } from "../contexts/DarkModeContext";

const COMPLAINT_CATEGORIES = [
  "Seat not clean",
  "Food issues",
  "AC malfunctioning",
  "Delay",
  "Other",
];

export default function ComplaintPage() {
  const { isDark } = useDarkMode();
  const [formData, setFormData] = useState({
    pnr: "K89-XTR-2",
    seatNumber: "Carriage 4, 12B",
    category: "",
    details: "",
  });
  const [files, setFiles] = useState<string[]>([]);
  const [draftPreview, setDraftPreview] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleCategorySelect = (category: string) => {
    setFormData((prev) => ({ ...prev, category }));
  };

  const generateDraft = () => {
    const draft = `To: Customer Relations Protocol Desk
Ref: Journey ${formData.pnr}

This report documents a passenger friction event recorded on the aforementioned service. The passenger assigned to ${formData.seatNumber}, has registered a complaint related to: ${formData.category || "General Issue"}.

${formData.details ? `Details: ${formData.details}` : "Awaiting elaboration text from operator to synthesize the precise nature of the anomaly."}

${files.length > 0 ? `Supporting evidence: ${files.length} file(s) attached.` : ""}

Please log this incident for review by the logistics oversight committee and initiate standard passenger compensation review if applicable.`;

    setDraftPreview(draft);
  };

  const handleSubmit = () => {
    if (!formData.category) {
      alert("Please select a complaint category");
      return;
    }
    generateDraft();
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      setFormData({ pnr: "", seatNumber: "", category: "", details: "" });
      setFiles([]);
      setDraftPreview("");
    }, 3000);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25 }}
      className={`space-y-8 ${isDark ? "bg-slate-900" : "bg-slate-50"}`}
    >
      {/* HEADER */}
      <div>
        <h1 className={`text-4xl font-bold tracking-tight ${isDark ? "text-white" : "text-slate-900"}`}>
          Log Incident
        </h1>
        <p className={`text-sm mt-2 max-w-2xl ${isDark ? "text-slate-400" : "text-slate-600"}`}>
          Rapid processing for passenger friction points. Artificial Intelligence will construct a formal report upon data entry.
        </p>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-12 gap-8">
        {/* LEFT COLUMN: Input Panel */}
        <div className="xl:col-span-7 space-y-6">
          {/* Journey Context Card */}
          <div className={`rounded-2xl p-6 lg:p-8 relative overflow-hidden ${isDark ? "bg-slate-800 border border-slate-700" : "bg-white border border-slate-200"}`}>
            <div className={`absolute -right-20 -top-20 w-64 h-64 bg-gradient-to-br rounded-full blur-3xl pointer-events-none ${isDark ? "from-indigo-600/10 to-transparent" : "from-indigo-500/10 to-transparent"}`}></div>

            <h2 className={`text-lg font-semibold mb-6 flex items-center gap-2 relative z-10 ${isDark ? "text-white" : "text-slate-900"}`}>
              <div className={`p-2 rounded-lg ${isDark ? "bg-indigo-900/50" : "bg-indigo-100"}`}>
                <FileText className={`h-5 w-5 ${isDark ? "text-indigo-400" : "text-indigo-600"}`} />
              </div>
              Journey Context
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="relative z-10">
                <label className={`block text-xs font-semibold uppercase tracking-wide mb-2 ${isDark ? "text-slate-400" : "text-slate-700"}`}>
                  PNR Number
                </label>
                <input
                  type="text"
                  name="pnr"
                  value={formData.pnr}
                  onChange={handleInputChange}
                  className={`w-full text-sm rounded-xl px-4 py-3 border transition-all outline-none ${isDark ? "bg-slate-700 border-slate-600 text-white focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/30" : "bg-slate-50 border-slate-300 text-slate-900 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"}`}
                  placeholder="e.g. 8A9B2C"
                />
              </div>
              <div className="relative z-10">
                <label className={`block text-xs font-semibold uppercase tracking-wide mb-2 ${isDark ? "text-slate-400" : "text-slate-700"}`}>
                  Seat Identifier
                </label>
                <input
                  type="text"
                  name="seatNumber"
                  value={formData.seatNumber}
                  onChange={handleInputChange}
                  className={`w-full text-sm rounded-xl px-4 py-3 border transition-all outline-none ${isDark ? "bg-slate-700 border-slate-600 text-white focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/30" : "bg-slate-50 border-slate-300 text-slate-900 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"}`}
                  placeholder="e.g. Coach B, 14A"
                />
              </div>
            </div>
          </div>

          {/* Friction Type Card */}
          <div className={`rounded-2xl p-6 lg:p-8 ${isDark ? "bg-slate-800 border border-slate-700" : "bg-white border border-slate-200"}`}>
            <h2 className={`text-lg font-semibold mb-6 flex items-center gap-2 ${isDark ? "text-white" : "text-slate-900"}`}>
              <div className={`p-2 rounded-lg ${isDark ? "bg-indigo-900/50" : "bg-indigo-100"}`}>
                <AlertCircle className={`h-5 w-5 ${isDark ? "text-indigo-400" : "text-indigo-600"}`} />
              </div>
              Friction Type
            </h2>

            <div className="flex flex-wrap gap-3">
              {COMPLAINT_CATEGORIES.map((category) => (
                <motion.button
                  key={category}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => handleCategorySelect(category)}
                  className={`px-5 py-2.5 rounded-xl text-sm font-medium transition-all ${
                    formData.category === category
                      ? isDark
                        ? "bg-indigo-600 text-white shadow-lg shadow-indigo-600/50"
                        : "bg-indigo-600 text-white shadow-lg shadow-indigo-600/30"
                      : isDark
                      ? "bg-slate-700 text-slate-300 hover:bg-slate-600"
                      : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                  }`}
                >
                  {category}
                </motion.button>
              ))}
            </div>

            {formData.category === "Other" && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-6 space-y-2"
              >
                <label className={`block text-xs font-semibold uppercase tracking-wide ${isDark ? "text-slate-400" : "text-slate-700"}`}>
                  Elaborate on the issue
                </label>
                <textarea
                  name="details"
                  value={formData.details}
                  onChange={handleInputChange}
                  placeholder="Provide specific details regarding the incident..."
                  rows={3}
                  className={`w-full text-sm rounded-xl px-4 py-3 border transition-all outline-none resize-none ${isDark ? "bg-slate-700 border-slate-600 text-white placeholder:text-slate-500 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/30" : "bg-slate-50 border-slate-300 text-slate-900 placeholder:text-slate-400 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"}`}
                />
              </motion.div>
            )}
          </div>

          {/* Visual Evidence Card */}
          <div className={`rounded-2xl p-6 lg:p-8 ${isDark ? "bg-slate-800 border border-slate-700" : "bg-white border border-slate-200"}`}>
            <h2 className={`text-lg font-semibold mb-6 flex items-center gap-2 ${isDark ? "text-white" : "text-slate-900"}`}>
              <div className={`p-2 rounded-lg ${isDark ? "bg-indigo-900/50" : "bg-indigo-100"}`}>
                <CloudUpload className={`h-5 w-5 ${isDark ? "text-indigo-400" : "text-indigo-600"}`} />
              </div>
              Visual Evidence
            </h2>

            <div className={`relative w-full rounded-2xl p-8 flex flex-col items-center justify-center text-center cursor-pointer transition-colors border-2 border-dashed ${isDark ? "border-slate-600 bg-slate-700/50 hover:bg-slate-700" : "border-slate-300 bg-slate-50 hover:bg-slate-100"}`}>
              <div className={`h-12 w-12 rounded-full flex items-center justify-center mb-4 transition-transform hover:scale-110 ${isDark ? "bg-slate-600" : "bg-slate-200"}`}>
                <CloudUpload className={`h-6 w-6 ${isDark ? "text-slate-400" : "text-slate-500"}`} />
              </div>
              <p className={`text-sm font-medium mb-1 ${isDark ? "text-slate-200" : "text-slate-900"}`}>
                Drag and drop media files here
              </p>
              <p className={`text-xs ${isDark ? "text-slate-400" : "text-slate-600"}`}>
                or click to browse from your device
              </p>
              <p className={`text-[10px] uppercase tracking-wide mt-4 ${isDark ? "text-slate-500" : "text-slate-500"}`}>
                Supports JPG, PNG, MP4
              </p>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: AI Output & Actions */}
        <div className="xl:col-span-5">
          <div className="sticky top-24 space-y-6">
            {/* Generate Button */}
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={generateDraft}
              className={`w-full py-4 rounded-xl font-semibold flex items-center justify-center gap-2 transition-all shadow-lg ${isDark ? "bg-indigo-600 hover:bg-indigo-700 text-white" : "bg-indigo-600 hover:bg-indigo-700 text-white"}`}
            >
              <motion.div animate={{ rotate: 360 }} transition={{ duration: 2, repeat: submitted ? 0 : Infinity }}>
                <FileText className="h-5 w-5" />
              </motion.div>
              {submitted ? "Report Submitted!" : "Generate Formal Complaint"}
            </motion.button>

            {/* AI Draft Card */}
            {draftPreview && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className={`rounded-2xl shadow-lg overflow-hidden border ${isDark ? "bg-slate-800 border-slate-700" : "bg-white border-slate-200"}`}
              >
                {/* Card Header */}
                <div className={`px-6 py-4 flex justify-between items-center border-b ${isDark ? "bg-slate-700 border-slate-600" : "bg-slate-100 border-slate-200"}`}>
                  <div className="flex items-center gap-2">
                    <motion.div
                      animate={{ scale: [1, 1.2, 1] }}
                      transition={{ duration: 2, repeat: Infinity }}
                      className={`h-2 w-2 rounded-full ${isDark ? "bg-indigo-400" : "bg-indigo-600"}`}
                    />
                    <span className={`text-xs font-semibold uppercase tracking-wider ${isDark ? "text-slate-400" : "text-slate-600"}`}>
                      Draft Preview
                    </span>
                  </div>
                  <Edit3 className={`h-4 w-4 cursor-pointer transition-colors ${isDark ? "text-slate-400 hover:text-indigo-400" : "text-slate-600 hover:text-indigo-600"}`} />
                </div>

                {/* Card Content */}
                <div className="p-6">
                  <p className={`text-sm leading-relaxed whitespace-pre-wrap font-body ${isDark ? "text-slate-300" : "text-slate-700"}`}>
                    {draftPreview}
                  </p>
                </div>

                {/* Card Footer */}
                <div className="p-6 pt-0 mt-4">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={handleSubmit}
                    className={`w-full py-3.5 rounded-xl font-semibold flex items-center justify-center gap-2 transition-all relative overflow-hidden group ${isDark ? "bg-indigo-600 hover:bg-indigo-700 text-white" : "bg-indigo-600 hover:bg-indigo-700 text-white"}`}
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700"></div>
                    <Send className="h-4 w-4" />
                    Submit Official Report
                  </motion.button>
                </div>
              </motion.div>
            )}

            {/* Success State */}
            {submitted && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className={`rounded-2xl p-8 text-center ${isDark ? "bg-emerald-900/30 border border-emerald-600/50" : "bg-emerald-100 border border-emerald-300"}`}
              >
                <motion.div animate={{ scale: [1, 1.1, 1] }} transition={{ duration: 0.6 }} className="flex justify-center mb-4">
                  <CheckCircle2 className={`h-12 w-12 ${isDark ? "text-emerald-400" : "text-emerald-600"}`} />
                </motion.div>
                <p className={`font-semibold ${isDark ? "text-emerald-200" : "text-emerald-900"}`}>
                  Report Submitted Successfully
                </p>
                <p className={`text-sm mt-1 ${isDark ? "text-emerald-300/70" : "text-emerald-700/70"}`}>
                  Your complaint has been logged and will be reviewed shortly.
                </p>
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
}
