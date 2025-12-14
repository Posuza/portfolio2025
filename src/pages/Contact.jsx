import React from "react";
import Container from "../components/Container";
import { useTheme } from "../context/ThemeContext";

const Contact = () => {
  const { colors } = useTheme();

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
            onSubmit={(e) => {
              e.preventDefault();
              // placeholder: implement submission
              alert("Form submission not configured.");
            }}
            className="space-y-3"
          >
            <input
              name="name"
              placeholder="Your name"
              className="w-full px-3 py-2 border rounded-md bg-transparent"
            />
            <input
              name="email"
              type="email"
              placeholder="Your email"
              className="w-full px-3 py-2 border rounded-md bg-transparent"
            />
            <textarea
              name="message"
              placeholder="Message"
              rows={5}
              className="w-full px-3 py-2 border rounded-md bg-transparent"
            />
            <button
              type="submit"
              className={`inline-block ${colors.button.primary} px-4 py-2 rounded-lg text-sm`}
            >
              Send
            </button>
          </form>
        </div>
      </div>
    </Container>
  );
};

export default Contact;