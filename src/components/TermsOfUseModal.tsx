import { X, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";

interface TermsOfUseModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function TermsOfUseModal({ isOpen, onClose }: TermsOfUseModalProps) {
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
              <FileText className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-bold tracking-tight text-white">
                Terms of Use
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
            aria-label="Close Terms of Use"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="p-6 sm:p-8 overflow-y-auto space-y-6 text-xs sm:text-sm leading-relaxed text-neutral-600 dark:text-neutral-300">
          <div className="p-4 rounded-xl bg-neutral-100/80 dark:bg-neutral-900/80 border border-neutral-200/70 dark:border-neutral-800/70 text-neutral-700 dark:text-neutral-300">
            Welcome to <strong className="text-foreground">Coding Basics for Instructional Design</strong>, the online and mobile interactive learning service of <strong className="text-foreground">Mabasa eLearning</strong> (“Mabasa eLearning,” “we,” or “us”). These Terms of Use (“Terms”) govern your access to and use of our instructional design and coding education platform, including our course modules, Live Code Lab, knowledge checks, and Certificate Verification Portal (collectively, the “Service”). By accessing or using the Service, you agree to be bound by these Terms and our Privacy &amp; Cookie Policy. If you do not agree to these Terms in general or any part of them, you should not use our Service.
          </div>

          {/* Section 1 */}
          <section className="space-y-3">
            <h3 className="text-sm sm:text-base font-bold text-foreground">
              1. Access &amp; Eligibility
            </h3>
            <p>
              The Service is designed for instructional designers, e-learning developers, educators, and learners seeking to build practical HTML, CSS, and JavaScript skills for e-learning authoring tools:
            </p>

            <div className="space-y-2 pl-2 border-l-2 border-primary/30">
              <h4 className="font-semibold text-foreground">
                (a) Eligibility to use the Service
              </h4>
              <p>
                By using the Service, you affirm that you are capable of forming a binding agreement with Mabasa eLearning and that you will comply with these Terms and all applicable local, national, and international laws and regulations.
              </p>
            </div>

            <div className="space-y-2 pl-2 border-l-2 border-primary/30">
              <h4 className="font-semibold text-foreground">
                (b)Learner Accounts &amp; Quick Start Mode
              </h4>
              <p>
                You may access the Service either by registering for a full learner account (via email and password or Google Authentication) or by using the Quick Start guest mode with your first name and surname.
              </p>
              <p>
                You are responsible for providing accurate information (including your full name as it will appear on your Completion Certificate) and for maintaining the confidentiality of your account credentials.
              </p>
            </div>
          </section>

          {/* Section 2 */}
          <section className="space-y-2">
            <h3 className="text-sm sm:text-base font-bold text-foreground">
              2. Permitted Use of the Service
            </h3>
            <p>
              Mabasa eLearning grants you a personal, non-exclusive, non-transferable, revocable license to access and use the Coding Basics for Instructional Design Service for your personal or professional learning and instructional design development, including:
            </p>
            <ul className="list-disc pl-5 space-y-1">
              <li>Completing interactive modules on HTML, CSS, JavaScript, and Storyline/Captivate integration.</li>
              <li>Writing, testing, and previewing code snippets inside the built-in Live Code Lab.</li>
              <li>Taking module knowledge checks to validate your understanding of coding concepts.</li>
              <li>Adapting code snippets learned in the course for use in your own instructional design and e-learning projects.</li>
              <li>Generating, downloading, and sharing your verified Course Completion Certificate upon completing all modules.</li>
            </ul>
          </section>

          {/* Section 3 */}
          <section className="space-y-3">
            <h3 className="text-sm sm:text-base font-bold text-foreground">
              3. Intellectual Property &amp; Course Content
            </h3>

            <div className="space-y-1.5">
              <h4 className="font-semibold text-foreground">
                (a) Mabasa eLearning Ownership
              </h4>
              <p>
                All course curricula, instructional text, visual illustrations, interface designs, assessment questions, certificates, and branding associated with Coding Basics for Instructional Design and Mabasa eLearning are protected by copyright, trademark, and intellectual property laws and remain the exclusive property of Mabasa eLearning.
              </p>
            </div>

            <div className="space-y-1.5">
              <h4 className="font-semibold text-foreground">
                (b) Use of Instructional Code Snippets
              </h4>
              <p>
                Practice code examples and templates provided within the modules and Live Code Lab may be used and modified by learners within their own instructional design projects (such as Articulate Storyline triggers or web objects). However, you may not republish, resell, or redistribute the course curriculum itself as a competing course or training product without prior written permission from Mabasa eLearning.
              </p>
            </div>

            <div className="space-y-1.5">
              <h4 className="font-semibold text-foreground">
                (c) User Content in the Live Code Lab
              </h4>
              <p>
                You retain ownership of any original code or content (“User Content”) you write in the Live Code Lab. By submitting or running User Content through the Service, you grant Mabasa eLearning a limited license to process, render, and store that content solely as needed to provide the Service to you.
              </p>
            </div>
          </section>

          {/* Section 4 */}
          <section className="space-y-1.5">
            <h3 className="text-sm sm:text-base font-bold text-foreground">
              4. Completion Certificates &amp; Academic Integrity
            </h3>
            <p>
              Certificates of Completion are issued to learners who legitimately complete all required modules and knowledge checks within the Service. Each certificate includes a unique verification identifier. Falsifying completion records, tampering with certificate verification data, or misrepresenting certification status is strictly prohibited and may result in revocation of your certificate and account access.
            </p>
          </section>

          {/* Section 5 */}
          <section className="space-y-1.5">
            <h3 className="text-sm sm:text-base font-bold text-foreground">
              5. Prohibited Conduct
            </h3>
            <p>You agree not to engage in any of the following prohibited activities while using the Service:</p>
            <ul className="list-disc pl-5 space-y-1">
              <li>Using the Live Code Lab or any part of the Service to execute malicious scripts, cryptocurrency miners, or harmful payloads.</li>
              <li>Attempting to bypass authentication, security rules, or administrative access controls.</li>
              <li>Scraping, copying, or redistributing the course structure, illustrations, or proprietary learning materials without authorization.</li>
              <li>Interfering with or disrupting the integrity or performance of the Service or third-party cloud infrastructure.</li>
            </ul>
          </section>

          {/* Section 6 */}
          <section className="space-y-1.5">
            <h3 className="text-sm sm:text-base font-bold text-foreground">
              6. Product Updates &amp; Promotional Communications
            </h3>
            <p>
              By continuing to use the Service, you agree to receive important service notifications (such as account and certificate updates) as well as educational product updates, new course announcements, and promotions from Mabasa eLearning. You may opt out of promotional communications at any time by contacting us.
            </p>
          </section>

          {/* Section 7 */}
          <section className="space-y-1.5">
            <h3 className="text-sm sm:text-base font-bold text-foreground">
              7. Third-Party Services &amp; Authoring Tools
            </h3>
            <p>
              The Service references third-party authoring platforms and technologies (such as Articulate Storyline, JavaScript frameworks, and Google authentication services). Mabasa eLearning is an independent educational provider and is not endorsed by or affiliated with third-party authoring tool vendors unless explicitly stated.
            </p>
          </section>

          {/* Section 8 */}
          <section className="space-y-1.5">
            <h3 className="text-sm sm:text-base font-bold text-foreground">
              8. Disclaimers &amp; Educational Use Notice
            </h3>
            <p>
              The Service and all instructional content, code examples, and live previews are provided on an “as is” and “as available” basis for educational and training purposes. Learners remain solely responsible for testing and validating any custom JavaScript, HTML, or CSS code within their own target authoring tools and Learning Management Systems (LMS) before production deployment.
            </p>
          </section>

          {/* Section 9 */}
          <section className="space-y-1.5">
            <h3 className="text-sm sm:text-base font-bold text-foreground">
              9. Limitation of Liability
            </h3>
            <p>
              To the maximum extent permitted by applicable law, Mabasa eLearning and its instructors, developers, and affiliates shall not be liable for any indirect, incidental, special, consequential, or punitive damages arising out of or relating to your use of, or inability to use, the Service or any code examples provided therein.
            </p>
          </section>

          {/* Section 13 */}
          <section className="space-y-1.5">
            <h3 className="text-sm sm:text-base font-bold text-foreground">
              13. Changes to these Terms
            </h3>
            <p>
              We may revise these Terms of Use from time to time to reflect improvements to the Coding Basics for Instructional Design platform or changes in legal requirements. Continued use of the Service after any updates constitutes acceptance of the revised Terms.
            </p>
          </section>

          {/* Section 14 */}
          <section className="space-y-1.5">
            <h3 className="text-sm sm:text-base font-bold text-foreground">
              14. How to contact us
            </h3>
            <p>
              If you have questions regarding these Terms of Use or the Coding Basics for Instructional Design Service developed by Mabasa eLearning, please contact us at:{" "}
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
              Mabasa eLearning Terms &amp; Learner Agreement
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
