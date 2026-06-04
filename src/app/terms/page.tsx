"use client";

import { LegalPageShell, LegalSection } from "@/components/legal/LegalPageShell";
import { HEALTH_DISCLAIMER } from "@/lib/constants";
import { LEGAL_CONTACT_EMAIL, SERVICE_NAME } from "@/lib/legal/config";

export default function TermsPage() {
  return (
    <LegalPageShell title="Terms & Conditions">
      <LegalSection title="Agreement to these terms">
        <p>
          These Terms & Conditions (&quot;Terms&quot;) govern your access to and use of{" "}
          {SERVICE_NAME} (the &quot;Service&quot;), a wellness dashboard operated by the{" "}
          {SERVICE_NAME} team (&quot;we,&quot; &quot;us,&quot; or &quot;our&quot;).
        </p>
        <p>
          By creating an account, connecting Google Health, or otherwise using the Service, you
          agree to these Terms and our{" "}
          <a href="/privacy">Privacy Policy</a>. If you do not agree, do not use the Service.
        </p>
      </LegalSection>

      <LegalSection title="Eligibility">
        <p>
          You must be at least 13 years old (or the minimum age required in your jurisdiction) to
          use the Service. By using {SERVICE_NAME}, you represent that you meet this requirement
          and have the legal capacity to enter into these Terms.
        </p>
        <p>
          If you use the Service on behalf of an organization, you represent that you have
          authority to bind that organization to these Terms.
        </p>
      </LegalSection>

      <LegalSection title="Description of the Service">
        <p>
          {SERVICE_NAME} allows you to sign in with Google, authorize access to Google
          Health-compatible wellness data, sync metrics such as sleep, heart rate, activity, and
          exercise, view trends and insights in a web dashboard, and export reports in CSV or
          PDF format.
        </p>
        <p>
          The Service is provided during an MVP and early-access period. Features, availability,
          and supported data sources may change without notice. We may offer demo or mock data
          when live Google Health API access is not configured.
        </p>
      </LegalSection>

      <LegalSection title="Account and authentication">
        <p>
          You sign in using Google OAuth. You are responsible for maintaining the security of
          your Google account and for all activity that occurs under your {SERVICE_NAME}{" "}
          account.
        </p>
        <p>
          You agree to provide accurate information and to notify us promptly if you suspect
          unauthorized access to your account at{" "}
          <a href={`mailto:${LEGAL_CONTACT_EMAIL}`}>{LEGAL_CONTACT_EMAIL}</a>.
        </p>
      </LegalSection>

      <LegalSection title="Google Health integration">
        <p>
          Connecting the Service requires you to authorize {SERVICE_NAME} to access certain
          Google APIs and wellness data scopes. Your use of Google services is also subject to
          Google&apos;s terms of service and privacy policies.
        </p>
        <p>
          You may revoke access at any time through Settings or your Google Account permissions.
          Revoking access stops future syncs but does not automatically delete data already stored
          in {SERVICE_NAME}; you may delete stored data from Settings.
        </p>
        <p>
          We are not affiliated with, endorsed by, or sponsored by Google, Fitbit, or other
          device manufacturers. Data accuracy depends on your devices, Google&apos;s APIs, and
          sync conditions.
        </p>
      </LegalSection>

      <LegalSection title="Not medical advice">
        <p>{HEALTH_DISCLAIMER}</p>
        <p>
          The Service is intended for personal wellness tracking and informational purposes
          only. Metrics, charts, insights, and exports are not a substitute for professional
          medical advice, diagnosis, or treatment. Never disregard or delay seeking medical advice
          because of something you read or see in {SERVICE_NAME}.
        </p>
        <p>
          If you think you may have a medical emergency, call your doctor or emergency services
          immediately.
        </p>
      </LegalSection>

      <LegalSection title="Acceptable use">
        <p>You agree not to:</p>
        <ul>
          <li>Use the Service for any unlawful purpose or in violation of applicable regulations</li>
          <li>Attempt to gain unauthorized access to the Service, other accounts, or our systems</li>
          <li>Reverse engineer, scrape, or interfere with the Service except as permitted by law</li>
          <li>Upload malware, abuse API endpoints, or overload our infrastructure</li>
          <li>Misrepresent health data or use exports to deceive healthcare providers or insurers</li>
          <li>Use the Service to provide medical care, clinical decision-making, or emergency monitoring</li>
        </ul>
        <p>
          We may suspend or terminate access if we reasonably believe you have violated these
          Terms or pose a risk to the Service or other users.
        </p>
      </LegalSection>

      <LegalSection title="Your data">
        <p>
          You retain ownership of your wellness data. You grant us a limited license to host,
          process, display, and export your data solely to operate and improve the Service as
          described in our Privacy Policy.
        </p>
        <p>
          You are responsible for ensuring you have the right to connect and sync any data you
          authorize through the Service, including compliance with applicable health-data and
          employment rules if relevant to you.
        </p>
      </LegalSection>

      <LegalSection title="Intellectual property">
        <p>
          The Service, including its software, design, branding, and documentation, is owned by
          us or our licensors and is protected by intellectual property laws. These Terms do not
          grant you any rights to our trademarks or proprietary materials except as needed to
          use the Service in accordance with these Terms.
        </p>
      </LegalSection>

      <LegalSection title="Disclaimers">
        <p>
          THE SERVICE IS PROVIDED &quot;AS IS&quot; AND &quot;AS AVAILABLE&quot; WITHOUT
          WARRANTIES OF ANY KIND, WHETHER EXPRESS, IMPLIED, OR STATUTORY, INCLUDING IMPLIED
          WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE, TITLE, AND
          NON-INFRINGEMENT.
        </p>
        <p>
          We do not warrant that the Service will be uninterrupted, error-free, secure, or that
          synced data will be complete, accurate, or up to date. Wellness metrics may be delayed,
          incomplete, or incorrect due to device, network, or third-party API limitations.
        </p>
      </LegalSection>

      <LegalSection title="Limitation of liability">
        <p>
          TO THE MAXIMUM EXTENT PERMITTED BY LAW, WE AND OUR OFFICERS, DIRECTORS, EMPLOYEES, AND
          SUPPLIERS WILL NOT BE LIABLE FOR ANY INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL, OR
          PUNITIVE DAMAGES, OR ANY LOSS OF PROFITS, DATA, GOODWILL, OR OTHER INTANGIBLE LOSSES,
          ARISING FROM OR RELATED TO YOUR USE OF THE SERVICE.
        </p>
        <p>
          TO THE MAXIMUM EXTENT PERMITTED BY LAW, OUR TOTAL LIABILITY FOR ANY CLAIM ARISING OUT
          OF OR RELATING TO THESE TERMS OR THE SERVICE WILL NOT EXCEED THE GREATER OF (A) THE
          AMOUNT YOU PAID US FOR THE SERVICE IN THE TWELVE MONTHS BEFORE THE CLAIM OR (B) ONE
          HUNDRED U.S. DOLLARS (USD $100).
        </p>
        <p>
          Some jurisdictions do not allow certain limitations of liability; in those cases, our
          liability is limited to the fullest extent permitted by law.
        </p>
      </LegalSection>

      <LegalSection title="Indemnification">
        <p>
          You agree to indemnify and hold harmless {SERVICE_NAME} and its operators from any
          claims, damages, losses, and expenses (including reasonable legal fees) arising from
          your use of the Service, your violation of these Terms, or your violation of any
          third-party rights, including Google&apos;s API terms.
        </p>
      </LegalSection>

      <LegalSection title="Termination">
        <p>
          You may stop using the Service at any time. You may delete your synced data from
          Settings and revoke Google access as described in our Privacy Policy.
        </p>
        <p>
          We may suspend or terminate your access at any time, with or without notice, for
          conduct that we believe violates these Terms, creates risk, or is otherwise harmful.
          Provisions that by their nature should survive termination (including disclaimers,
          limitations of liability, and indemnification) will survive.
        </p>
      </LegalSection>

      <LegalSection title="Changes to these Terms">
        <p>
          We may modify these Terms from time to time. When we do, we will update the &quot;Last
          updated&quot; date at the top of this page. Material changes may be communicated
          through the Service or by email where appropriate. Your continued use after changes
          become effective constitutes acceptance of the revised Terms.
        </p>
      </LegalSection>

      <LegalSection title="Governing law and disputes">
        <p>
          These Terms are governed by the laws of the State of Delaware, United States, without
          regard to conflict-of-law principles, except where mandatory consumer protection laws
          in your country of residence apply.
        </p>
        <p>
          Any dispute arising from these Terms or the Service will be resolved in the state or
          federal courts located in Delaware, unless applicable law requires otherwise. You and
          we consent to personal jurisdiction in those courts.
        </p>
      </LegalSection>

      <LegalSection title="General">
        <p>
          These Terms, together with the Privacy Policy, constitute the entire agreement between
          you and us regarding the Service. If any provision is found unenforceable, the
          remaining provisions remain in effect. Our failure to enforce a provision is not a
          waiver of our right to do so later.
        </p>
      </LegalSection>

      <LegalSection title="Contact">
        <p>
          Questions about these Terms? Contact us at{" "}
          <a href={`mailto:${LEGAL_CONTACT_EMAIL}`}>{LEGAL_CONTACT_EMAIL}</a>.
        </p>
      </LegalSection>
    </LegalPageShell>
  );
}
