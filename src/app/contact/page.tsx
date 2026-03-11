"use client";

import { useState } from "react";
import Link from "next/link";
import PageHeader from "@/components/PageHeader";

type FormType = "list-provider" | "suggestion";

export default function ContactPage() {
  const [formType, setFormType] = useState<FormType>("list-provider");
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState({
    name: "",
    email: "",
    business: "",
    category: "",
    phone: "",
    message: "",
  });

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitted(true);
  }

  if (submitted) {
    return (
      <>
        <PageHeader title="Get in touch" backHref="/" backLabel="Back to all businesses" />
        <main className="max-w-xl mx-auto px-4 py-16 text-center">
          <div className="bg-[#0f2236] rounded-2xl border border-white/10 p-10">
            <div className="text-5xl mb-4">✅</div>
            <h2 className="text-2xl font-black text-white mb-2">Thanks for reaching out!</h2>
            <p className="text-slate-400 text-sm">
              We&apos;ve received your message and will get back to you as soon as possible.
            </p>
            <Link
              href="/"
              className="mt-6 inline-block bg-gradient-to-r from-[#125a40] to-[#a5de57] text-white px-6 py-2.5 rounded-full text-sm font-medium hover:opacity-90 transition-opacity"
            >
              Back to search
            </Link>
          </div>
        </main>
      </>
    );
  }

  return (
    <>
      <PageHeader
        title="Get in touch"
        subtitle="Want to be listed on NewBi, or have a suggestion? We'd love to hear from you."
        backHref="/"
        backLabel="Back to all businesses"
      />
    <main className="max-w-xl mx-auto px-4 py-8">

      {/* Toggle */}
      <div className="flex bg-white/5 rounded-xl p-1 mb-6 text-sm font-medium">
        <button
          onClick={() => setFormType("list-provider")}
          className={`flex-1 py-2 rounded-lg transition-all ${
            formType === "list-provider" ? "bg-white/10 shadow text-white" : "text-slate-400 hover:text-slate-300"
          }`}
        >
          List my business
        </button>
        <button
          onClick={() => setFormType("suggestion")}
          className={`flex-1 py-2 rounded-lg transition-all ${
            formType === "suggestion" ? "bg-white/10 shadow text-white" : "text-slate-400 hover:text-slate-300"
          }`}
        >
          Leave a suggestion
        </button>
      </div>

      <div className="bg-[#0f2236] rounded-2xl border border-white/10 p-6">
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1" htmlFor="name">
                Your name <span className="text-red-400">*</span>
              </label>
              <input
                id="name"
                name="name"
                type="text"
                required
                value={form.name}
                onChange={handleChange}
                placeholder="Jane Smith"
                className="w-full text-sm bg-[#091624] border border-white/10 text-white placeholder-slate-500 rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#a5de57]/40 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1" htmlFor="email">
                Email address <span className="text-red-400">*</span>
              </label>
              <input
                id="email"
                name="email"
                type="email"
                required
                value={form.email}
                onChange={handleChange}
                placeholder="jane@example.com"
                className="w-full text-sm bg-[#091624] border border-white/10 text-white placeholder-slate-500 rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#a5de57]/40 focus:border-transparent"
              />
            </div>
          </div>

          {formType === "list-provider" && (
            <>
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1" htmlFor="business">
                  Business name <span className="text-red-400">*</span>
                </label>
                <input
                  id="business"
                  name="business"
                  type="text"
                  required
                  value={form.business}
                  onChange={handleChange}
                  placeholder="Sheffield Plumbing Co."
                  className="w-full text-sm bg-[#091624] border border-white/10 text-white placeholder-slate-500 rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#a5de57]/40 focus:border-transparent"
                />
              </div>
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1" htmlFor="category">
                    Service category <span className="text-red-400">*</span>
                  </label>
                  <input
                    id="category"
                    name="category"
                    type="text"
                    required
                    value={form.category}
                    onChange={handleChange}
                    placeholder="e.g. Hair, Nails, Braiding"
                    className="w-full text-sm bg-[#091624] border border-white/10 text-white placeholder-slate-500 rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#a5de57]/40 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1" htmlFor="phone">
                    Phone number
                  </label>
                  <input
                    id="phone"
                    name="phone"
                    type="tel"
                    value={form.phone}
                    onChange={handleChange}
                    placeholder="0114 000 0000"
                    className="w-full text-sm bg-[#091624] border border-white/10 text-white placeholder-slate-500 rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#a5de57]/40 focus:border-transparent"
                  />
                </div>
              </div>
            </>
          )}

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1" htmlFor="message">
              {formType === "list-provider" ? "Tell us about your business" : "Your suggestion"}{" "}
              <span className="text-red-400">*</span>
            </label>
            <textarea
              id="message"
              name="message"
              rows={4}
              required
              value={form.message}
              onChange={handleChange}
              placeholder={
                formType === "list-provider"
                  ? "Describe your services, coverage area, and anything else you'd like on your listing..."
                  : "Share your idea, feedback, or recommendation..."
              }
              className="w-full text-sm bg-[#091624] border border-white/10 text-white placeholder-slate-500 rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#a5de57]/40 focus:border-transparent resize-none"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-gradient-to-r from-[#125a40] to-[#a5de57] text-white py-2.5 rounded-xl text-sm font-semibold hover:opacity-90 active:scale-95 transition-all"
          >
            {formType === "list-provider" ? "Submit listing request" : "Send suggestion"}
          </button>
        </form>
      </div>
    </main>
    </>
  );
}
