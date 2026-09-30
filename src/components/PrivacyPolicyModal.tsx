import { X, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";

interface PrivacyPolicyModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function PrivacyPolicyModal({ isOpen, onClose }: PrivacyPolicyModalProps) {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 md:p-6 bg-neutral-950/75 backdrop-blur-sm animate-fade-in"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="w-full max-w-3xl max-h-[88vh] bg-card border border-border rounded-2xl shadow-2xl flex flex-col overflow-hidden text-foreground">
        {/* Header */}
        <div className="px-6 py-4 bg-gradient-to-br from-[hsl(210,100%,45%)] to-[hsl(0,0%,5%)] text-white flex items-center justify-between border-b border-white/10 shrink-0 shadow-[0_4px_15px_rgba(0,100,255,0.3)]">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-white/20 border border-white/25 flex items-center justify-center">
              <ShieldCheck className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-bold tracking-tight text-white">
                Privacy &amp; Cookie Policy
              </h2>
              <p className="text-[11px] text-white/80">
                Coding Basics for Instructional Design • Developed by Mabasa eLearning
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg text-white/80 hover:text-white hover:bg-white/15 transition-colors"
            aria-label="Close Privacy Policy"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="p-6 sm:p-8 overflow-y-auto space-y-6 text-xs sm:text-sm leading-relaxed text-neutral-600 dark:text-neutral-300">
          <div className="p-4 rounded-xl bg-neutral-100/80 dark:bg-neutral-900/80 border border-neutral-200/70 dark:border-neutral-800/70 text-neutral-700 dark:text-neutral-300">
            Welcome to <strong className="text-foreground">Coding Basics for Instructional Design</strong>, the online and mobile interactive learning service of <strong className="text-foreground">Mabasa eLearning</strong> (“Mabasa eLearning,” “we,” or “us”). Our Privacy Policy explains how we collect, use, disclose, and protect information that applies to our instructional design and coding education platform (the “Service”), and your choices about the collection and use of your information. Capitalised terms that are not defined in this Privacy Policy have the meaning given to them in our Terms of Use. If you do not want your information processed in accordance with this Privacy Policy in general or any part of it, you should not use our Service. This policy applies to all users of the Service, including, but not limited to learners, guest users, and users of our Live Code Lab and Certificate Verification Portal.
          </div>

          {/* Section 1 */}
          <section className="space-y-3">
            <h3 className="text-sm sm:text-base font-bold text-foreground">
              1. Information we collect
            </h3>
            <p>We collect the following types of information about you:</p>

            <div className="space-y-2 pl-2 border-l-2 border-primary/30">
              <h4 className="font-semibold text-foreground">
                (a) Information you provide us directly
              </h4>
              <p>
                We may ask for certain information when you register for a learner account, start the course via Quick Start, or correspond with us (such as your first and last names and email address).
              </p>
              <p>
                We also collect any messages you send us through the Service, and may collect information you provide in User Content you submit to the Service (such as HTML, CSS, and JavaScript code snippets in the Live Code Lab, quiz responses, and certificate details). We use this information to operate, maintain, and provide the features and functionality of the Service to you, track your course progress, issue completion certificates, correspond with you, and address any issues you raise about the Service.
              </p>
              <p>
                If you don't provide your personal information to us, you may not be able to access or use our Service or your experience of using our Service may not be as enjoyable.
              </p>
            </div>

            <div className="space-y-2 pl-2 border-l-2 border-primary/30">
              <h4 className="font-semibold text-foreground">
                (b) Information we receive from third-party applications
              </h4>
              <p>
                We may receive information about you from third parties. For example:
              </p>
              <p>
                If you access the Service through a third-party connection or log-in, e.g., Google Authentication, we may receive information such as the user ID, name, and email address associated with your account.
              </p>
              <p>
                You may also unlink your third-party account from the Service by adjusting your settings on the third-party service.
              </p>
              <p>
                We could receive data from third-party applications if you choose to integrate these to enhance your instructional design workflow, share your completion certificate to social media, or incorporate elements into your e-learning projects.
              </p>
            </div>

            <div className="space-y-2 pl-2 border-l-2 border-primary/30">
              <h4 className="font-semibold text-foreground">
                (c) Information we receive from other third parties
              </h4>
              <p>
                We obtain information through sources like public domains, professional learning platforms, and data providers.
              </p>
              <p>
                We use this to understand your learner profile and instructional design interests for personalized learning services.
              </p>
              <p>
                You can opt out of Mabasa eLearning collecting more data about you from third-party providers by contacting us directly.
              </p>
            </div>

            <div className="space-y-2 pl-2 border-l-2 border-primary/30">
              <h4 className="font-semibold text-foreground">
                (d) Information we collect from you automatically
              </h4>
              <p>
                We collect learning analytics data (such as module completion, knowledge check scores, and progress metrics) to help us measure traffic and usage trends for the Service.
              </p>
            </div>

            <div className="space-y-2 pl-2 border-l-2 border-primary/30">
              <h4 className="font-semibold text-foreground">
                (e) Cookies and local storage information
              </h4>
              <p>
                We use cookies and browser local storage to enhance your navigation through the course, remember your preferences (including theme mode and saved course progress), and improve the learner experience.
              </p>
              <p>
                For more information on our use of cookies, please review the Cookie provisions within this Policy.
              </p>
            </div>

            <div className="space-y-2 pl-2 border-l-2 border-primary/30">
              <h4 className="font-semibold text-foreground">
                (f) Log file information
              </h4>
              <p>
                We collect information such as your web request, browser type, referring/exit pages and URLs, and how you interact with modules and links on the Service.
              </p>
            </div>

            <div className="space-y-2 pl-2 border-l-2 border-primary/30">
              <h4 className="font-semibold text-foreground">
                (g) Clear gifs/web beacons information
              </h4>
              <p>
                We use these to anonymously track online usage patterns and track which course updates or emails are opened by recipients.
              </p>
            </div>

            <div className="space-y-2 pl-2 border-l-2 border-primary/30">
              <h4 className="font-semibold text-foreground">
                (h) Device identifiers
              </h4>
              <p>
                We collect device and browser identifiers to optimize course delivery across desktop and mobile devices.
              </p>
            </div>

            <div className="space-y-2 pl-2 border-l-2 border-primary/30">
              <h4 className="font-semibold text-foreground">
                (i) Location data
              </h4>
              <p>
                We collect general location data to understand where our learners are located and to localize and personalize educational content.
              </p>
            </div>

            <div className="space-y-2 pl-2 border-l-2 border-primary/30">
              <h4 className="font-semibold text-foreground">
                (j) Content within your account
              </h4>
              <p>
                We receive content that you create within the Coding Basics for Instructional Design platform, such as code exercises, quiz completions, and generated certificates.
              </p>
            </div>
          </section>

          {/* Section 2 */}
          <section className="space-y-2">
            <h3 className="text-sm sm:text-base font-bold text-foreground">
              2. How we use your information
            </h3>
            <p>We use the information we collect for various purposes, such as:</p>
            <ul className="list-disc pl-5 space-y-1">
              <li>Providing you with the Coding Basics for Instructional Design Service.</li>
              <li>Learning data analytics and predictive analysis to improve our course and Service.</li>
              <li>Communicating with you about your course progress, certificates, and the Service.</li>
              <li>Promoting and driving engagement with the Mabasa eLearning Service.</li>
              <li>Improving the Service and curriculum based on learner engagement.</li>
              <li>Serving personalized course recommendations, product updates, and promotions.</li>
              <li>Ensuring learner happiness by resolving technical or instructional issues.</li>
              <li>For security, authentication, and certificate verification measures.</li>
              <li>For matters that you have consented to.</li>
              <li>Troubleshooting and improving the Service based on errors and learner experience.</li>
            </ul>
          </section>

          {/* Section 3 */}
          <section className="space-y-3">
            <h3 className="text-sm sm:text-base font-bold text-foreground">
              3. Sharing your information
            </h3>

            <div className="space-y-1.5">
              <h4 className="font-semibold text-foreground">
                (a) How we share your information
              </h4>
              <p>
                We may share your information with third-party service providers (such as cloud hosting and authentication providers) for the purpose of providing the Service.
              </p>
              <p>
                You may also choose to share your User Content, such as sharing your course completion certificate on professional networks and social media.
              </p>
            </div>

            <div className="space-y-1.5">
              <h4 className="font-semibold text-foreground">
                (b) Sharing in connection with business transactions
              </h4>
              <p>
                Your information may be transferred as part of business deals like mergers or acquisitions involving Mabasa eLearning.
              </p>
            </div>

            <div className="space-y-1.5">
              <h4 className="font-semibold text-foreground">
                (c) Sharing with authorities
              </h4>
              <p>
                We may share your information in accordance with our Terms of Use, or as required by law.
              </p>
            </div>

            <div className="space-y-1.5">
              <h4 className="font-semibold text-foreground">
                (d) Third-party tools &amp; interactive code environments
              </h4>
              <p>
                Certain interactive coding and preview features in our app are built on sandboxed execution environments and cloud services to process your code snippets and generate live previews in real time. We implement appropriate technical and organizational measures to protect data during this process.
              </p>
              <p>
                Please note that automated code previews and examples are intended solely for educational and instructional design training purposes and should not be relied upon without independent testing in your target authoring tool or LMS. Users remain responsible for independently evaluating any code or content created through the app.
              </p>
            </div>
          </section>

          {/* Section 4 */}
          <section className="space-y-1.5">
            <h3 className="text-sm sm:text-base font-bold text-foreground">
              4. Advertising &amp; Promotions
            </h3>
            <p>
              Mabasa eLearning may partner with educational platforms and communication services to deliver relevant product updates, e-learning promotions, and measure their effectiveness.
            </p>
          </section>

          {/* Section 5 */}
          <section className="space-y-1.5">
            <h3 className="text-sm sm:text-base font-bold text-foreground">
              5. How we transfer, store and protect your data
            </h3>
            <p>
              We transfer and store your data securely using modern cloud encryption and security rules in line with applicable data protection laws.
            </p>
          </section>

          {/* Section 6 */}
          <section className="space-y-1.5">
            <h3 className="text-sm sm:text-base font-bold text-foreground">
              6. Keeping your information safe
            </h3>
            <p>
              Mabasa eLearning uses administrative, technical, and physical safeguards to protect your personal information and learning records.
            </p>
          </section>

          {/* Section 7 */}
          <section className="space-y-1.5">
            <h3 className="text-sm sm:text-base font-bold text-foreground">
              7. Your choices about your information
            </h3>
            <ul className="list-disc pl-5 space-y-1">
              <li>You control your learner account information and settings.</li>
              <li>Opt-out of receiving marketing messages and control your tracking technologies preferences.</li>
              <li>Exercise your rights in respect of your personal information for applicable geographies.</li>
            </ul>
          </section>

          {/* Section 8 */}
          <section className="space-y-1.5">
            <h3 className="text-sm sm:text-base font-bold text-foreground">
              8. How long we keep your information
            </h3>
            <p>
              We retain your information and course completion records for a commercially reasonable time for certificate verification, legal, and audit purposes.
            </p>
          </section>

          {/* Section 9 */}
          <section className="space-y-1.5">
            <h3 className="text-sm sm:text-base font-bold text-foreground">
              9. Links to other websites and services
            </h3>
            <p>
              We are not responsible for third-party websites, authoring tools, or external services linked to or from our Service.
            </p>
          </section>

          {/* Section 13 */}
          <section className="space-y-1.5">
            <h3 className="text-sm sm:text-base font-bold text-foreground">
              13. Changes to this Policy
            </h3>
            <p>
              We may update this policy from time to time and will notify you of significant changes through the Coding Basics for Instructional Design platform.
            </p>
          </section>

          {/* Section 14 */}
          <section className="space-y-1.5">
            <h3 className="text-sm sm:text-base font-bold text-foreground">
              14. How to contact us
            </h3>
            <p>
              If you have questions or complaints regarding this Privacy Policy or the Coding Basics for Instructional Design Service developed by Mabasa eLearning, please contact us at:{" "}
              <a
                href="mailto:brucemabasa4@gmail.com"
                className="font-semibold text-primary underline underline-offset-2"
              >
                brucemabasa4@gmail.com
              </a>
            </p>
          </section>
        </div>

        {/* Footer */}
        <div className="px-6 py-3.5 bg-neutral-50 dark:bg-neutral-900/90 border-t border-border flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2">
            <div className="bg-[#030712] border border-white/10 px-2 py-0.5 flex items-center justify-center rounded">
              <span className="text-white font-black text-xs tracking-tight leading-none flex items-baseline">
                Mabasa
                <span className="w-1 h-1 rounded-full bg-[#60a5fa] ml-0.5 inline-block shrink-0"></span>
              </span>
            </div>
            <span className="text-[11px] text-neutral-500 dark:text-neutral-400">
              Mabasa eLearning Privacy &amp; Data Protection
            </span>
          </div>
          <Button size="sm" onClick={onClose} className="rounded-none px-5">
            I Consent &amp; Accept
          </Button>
        </div>
      </div>
    </div>
  );
}
