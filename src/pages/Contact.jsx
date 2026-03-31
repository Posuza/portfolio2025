import React, { useState } from "react";
import Container from "../components/Container";
import { useTheme } from "../context/ThemeContext";
import usePortfolioStore from "../store/store";
import showToast from "../utils/toast";

const Contact = () => {
  const { colors } = useTheme();
  const createContactRemote = usePortfolioStore((s) => s.createContactRemote);
  const [form, setForm] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (submitting) return;

    const payload = {
      ...form,
      createdAt: new Date().toISOString(),
    };

    setSubmitting(true);
    try {
      const result = await createContactRemote(payload);
      if (result?.success) {
        showToast.success("Message sent successfully.");
        setForm({ name: "", email: "", subject: "", message: "" });
      } else {
        showToast.error(result?.error?.message || "Failed to send message.");
      }
    } catch (err) {
      showToast.error(err?.message || "Failed to send message.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Container>
      <div className="max-w-3xl mx-auto py-12 px-4 sm:px-6">
        <h1 className={`text-2xl sm:text-3xl font-semibold ${colors.text.primary} mb-4`}>Contact</h1>
        <p className={`text-sm sm:text-base ${colors.text.secondary} mb-6`}>
          Feel free to reach out — email me or use the form below.
        </p>

        <div className={`bg-white dark:bg-gray-800 rounded-lg p-4 sm:p-6 border ${colors.border}`}>
          <a
            href="mailto:you@example.com"
            className={`inline-block mb-4 text-sm sm:text-base ${colors.button.primary} px-4 py-2 rounded-lg`}
          >
            Email: you@example.com
          </a>

          <form
            onSubmit={handleSubmit}
            className="space-y-3"
          >
            <input
              name="name"
              placeholder="Your name"
              value={form.name}
              onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))}
              className="w-full px-3 py-2 border rounded-md bg-transparent"
              required
            />
            <input
              name="email"
              type="email"
              placeholder="Your email"
              value={form.email}
              onChange={(e) => setForm((p) => ({ ...p, email: e.target.value }))}
              className="w-full px-3 py-2 border rounded-md bg-transparent"
              required
            />
            <input
              name="subject"
              type="text"
              placeholder="Subject"
              value={form.subject}
              onChange={(e) => setForm((p) => ({ ...p, subject: e.target.value }))}
              className="w-full px-3 py-2 border rounded-md bg-transparent"
            />
            <textarea
              name="message"
              placeholder="Message"
              rows={5}
              value={form.message}
              onChange={(e) => setForm((p) => ({ ...p, message: e.target.value }))}
              className="w-full px-3 py-2 border rounded-md bg-transparent"
              required
            />
            <button
              type="submit"
              disabled={submitting}
              className={`inline-block ${colors.button.primary} px-4 py-2 rounded-lg text-sm`}
            >
              {submitting ? "Sending..." : "Send"}
            </button>
          </form>
        </div>
      </div>
    </Container>
  );
};

export default Contact;
