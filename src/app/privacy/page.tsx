"use client";

import { LegalPageShell, LegalSection } from "@/components/legal/LegalPageShell";
import { LEGAL_CONTACT_EMAIL, SERVICE_NAME } from "@/lib/legal/config";

export default function PrivacyPage() {
  return (
    <LegalPageShell title="Privacy Policy">
      <LegalSection title="Introduction">
        <p>
          {SERVICE_NAME} (&quot;we,&quot; &quot;us,&quot; or &quot;our&quot;) operates a wellness
          dashboard that lets you connect a Google account, sync health and fitness data from
          Google Health-compatible sources (such as Fitbit and Pixel Watch), and view trends,
          insights, and exports in your browser.
        </p>
        <p>
          This Privacy Policy explains what information we collect, how we use it, how we protect
          it, and the choices you have. By using {SERVICE_NAME}, you agree to the practices
          described here.
        </p>
      </LegalSection>

      <LegalSection title="Information we collect">
        <p>We collect information in the following categories:</p>
        <p>
          <strong>Account information.</strong> When you sign in with Google, we receive your
          name, email address, profile image, and Google account identifier. We store this
          information to authenticate you and associate synced data with your account.
        </p>
        <p>
          <strong>OAuth and connection data.</strong> To sync your wellness data, we store
          encrypted Google OAuth access and refresh tokens, granted API scopes, token expiration
          times, and the date and time of your last successful sync.
        </p>
        <p>
          <strong>Wellness and fitness metrics.</strong> After you connect and sync, we store
          daily summaries and exercise sessions derived from your Google Health data, which may
          include:
        </p>
        <ul>
          <li>Activity: steps, calories, distance, and active minutes</li>
          <li>Sleep: duration, stages (deep, REM, light, awake), and sleep scores</li>
          <li>Heart: resting, average, min, and max heart rate, HRV, SpO₂, and VO₂ max</li>
          <li>Exercise: workout type, title, duration, calories, distance, and average heart rate</li>
          <li>Body metrics such as weight, when available from your connected sources</li>
        </ul>
        <p>
          We may also store raw API payloads in a structured format to support accurate display
          and troubleshooting. We do not intentionally collect data categories beyond what is
          needed to provide the service.
        </p>
        <p>
          <strong>Technical and usage data.</strong> Like most web applications, our hosting
          infrastructure may automatically log standard request metadata (such as IP address,
          browser type, and timestamps) for security, reliability, and debugging. We use this
          data only as needed to operate and protect the service.
        </p>
      </LegalSection>

      <LegalSection title="How we use your information">
        <p>We use the information we collect to:</p>
        <ul>
          <li>Authenticate you and maintain your account session</li>
          <li>Connect to Google and sync your wellness data on your request</li>
          <li>Display dashboards, charts, trends, and generated wellness insights</li>
          <li>Generate CSV and PDF exports you request</li>
          <li>Record sync history and diagnose sync failures</li>
          <li>Improve reliability, security, and the overall user experience</li>
        </ul>
        <p>
          We do not sell your personal information or health data. We do not use your health
          data for advertising, and we do not share it with third parties for their own
          marketing purposes.
        </p>
      </LegalSection>

      <LegalSection title="Legal bases for processing (EEA/UK users)">
        <p>If you are located in the European Economic Area or the United Kingdom, we process your personal data on the following bases:</p>
        <ul>
          <li>
            <strong>Performance of a contract:</strong> to provide the service you sign up for,
            including syncing and displaying your data
          </li>
          <li>
            <strong>Consent:</strong> when you connect Google Health and authorize specific API
            scopes
          </li>
          <li>
            <strong>Legitimate interests:</strong> to secure our service, prevent abuse, and
            improve functionality, balanced against your rights
          </li>
          <li>
            <strong>Legal obligation:</strong> where required by applicable law
          </li>
        </ul>
      </LegalSection>

      <LegalSection title="How we share information">
        <p>We share information only in limited circumstances:</p>
        <ul>
          <li>
            <strong>Google:</strong> when you sign in or sync, data flows between your browser,
            our servers, and Google&apos;s APIs according to your authorization and Google&apos;s
            terms
          </li>
          <li>
            <strong>Service providers:</strong> we may use infrastructure providers (such as
            hosting and database services) that process data on our behalf under contractual
            obligations to protect it
          </li>
          <li>
            <strong>Legal requirements:</strong> we may disclose information if required by law,
            regulation, legal process, or to protect the rights, safety, and security of users
            and the public
          </li>
          <li>
            <strong>Business transfers:</strong> if we are involved in a merger, acquisition, or
            asset sale, your information may transfer as part of that transaction, subject to
            continued protection
          </li>
        </ul>
      </LegalSection>

      <LegalSection title="Data storage and security">
        <p>
          Your data is stored in a PostgreSQL database. Google OAuth tokens are encrypted at
          rest using AES-256-GCM before storage. Access to production systems is restricted and
          protected by industry-standard security practices.
        </p>
        <p>
          No method of transmission or storage is completely secure. While we work to protect
          your information, we cannot guarantee absolute security.
        </p>
      </LegalSection>

      <LegalSection title="Data retention">
        <p>
          We retain your account and synced wellness data for as long as your account is active
          or as needed to provide the service. Sync logs are retained to support troubleshooting
          and may be deleted or aggregated over time.
        </p>
        <p>
          You may delete your synced health data at any time from Settings. Disconnecting
          Google or deleting data removes associated wellness metrics and connection tokens from
          our systems, subject to limited backup retention periods.
        </p>
      </LegalSection>

      <LegalSection title="Your choices and rights">
        <p>You can:</p>
        <ul>
          <li>
            <strong>Export your data</strong> as CSV or PDF from the Reports section or Settings
          </li>
          <li>
            <strong>Delete synced data</strong> from Settings, which removes daily summaries,
            exercise sessions, sync logs, and stored connection tokens
          </li>
          <li>
            <strong>Revoke access</strong> by disconnecting Google in Settings or removing{" "}
            {SERVICE_NAME}&apos;s access from your Google Account permissions page
          </li>
          <li>
            <strong>Request access or correction</strong> by contacting us at{" "}
            <a href={`mailto:${LEGAL_CONTACT_EMAIL}`}>{LEGAL_CONTACT_EMAIL}</a>
          </li>
        </ul>
        <p>
          Depending on where you live, you may have additional rights under privacy laws (such
          as GDPR or CCPA), including the right to object to certain processing, request
          portability, or lodge a complaint with a supervisory authority. We will respond to
          verified requests within the timeframes required by applicable law.
        </p>
      </LegalSection>

      <LegalSection title="Children's privacy">
        <p>
          {SERVICE_NAME} is not directed to children under 13 (or the minimum age required in
          your jurisdiction). We do not knowingly collect personal information from children. If
          you believe a child has provided us with personal information, please contact us and
          we will take steps to delete it.
        </p>
      </LegalSection>

      <LegalSection title="International data transfers">
        <p>
          If you access {SERVICE_NAME} from outside the country where our servers are located,
          your information may be transferred to and processed in that country or other
          jurisdictions where our service providers operate. We take steps designed to ensure
          your data receives an adequate level of protection consistent with this policy.
        </p>
      </LegalSection>

      <LegalSection title="Changes to this policy">
        <p>
          We may update this Privacy Policy from time to time. When we do, we will revise the
          &quot;Last updated&quot; date at the top of this page. Material changes may be
          communicated through the app or by email where appropriate. Continued use of the
          service after changes take effect constitutes acceptance of the updated policy.
        </p>
      </LegalSection>

      <LegalSection title="Contact us">
        <p>
          If you have questions about this Privacy Policy or our data practices, contact us at{" "}
          <a href={`mailto:${LEGAL_CONTACT_EMAIL}`}>{LEGAL_CONTACT_EMAIL}</a>.
        </p>
      </LegalSection>
    </LegalPageShell>
  );
}
