import { useRef } from "react";
import { Award, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";

interface CompletionCertificateProps {
  userName: string;
}

const CompletionCertificate = ({ userName }: CompletionCertificateProps) => {
  const certRef = useRef<HTMLDivElement>(null);

  const handleDownload = async () => {
    if (!certRef.current) return;
    const canvas = await html2canvas(certRef.current, {
      scale: 2,
      backgroundColor: "#ffffff",
      useCORS: true,
    });
    const imgData = canvas.toDataURL("image/png");
    const pdf = new jsPDF({ orientation: "landscape", unit: "px", format: [canvas.width, canvas.height] });
    pdf.addImage(imgData, "PNG", 0, 0, canvas.width, canvas.height);
    pdf.save(`Certificate_${userName.replace(/\s+/g, "_")}.pdf`);
  };

  const today = new Date().toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-accent/10 flex items-center justify-center shrink-0">
            <Award className="w-5 h-5 text-accent" />
          </div>
          <div>
            <h3 className="text-lg font-bold">Course Completion Certificate</h3>
            <p className="text-sm text-muted-foreground">Congratulations on completing the course!</p>
          </div>
        </div>
        <Button onClick={handleDownload} className="gap-2 w-full sm:w-auto">
          <Download className="w-4 h-4" />
          Download PDF
        </Button>
      </div>

      {/* Certificate Preview - scrollable on mobile */}
      <div className="flex justify-center overflow-x-auto">
        <div
          ref={certRef}
          className="w-[800px] min-w-[800px] bg-white text-gray-900 p-0 rounded-none"
          style={{ fontFamily: "'Inter', sans-serif" }}
        >
          <div
            className="relative border-[6px] m-4 p-12"
            style={{ borderColor: "hsl(213, 72%, 40%)" }}
          >
            {/* Corner accents */}
            <div
              className="absolute top-0 left-0 w-16 h-16"
              style={{
                background: "linear-gradient(135deg, hsl(213, 72%, 40%) 50%, transparent 50%)",
              }}
            />
            <div
              className="absolute top-0 right-0 w-16 h-16"
              style={{
                background: "linear-gradient(225deg, hsl(213, 72%, 40%) 50%, transparent 50%)",
              }}
            />
            <div
              className="absolute bottom-0 left-0 w-16 h-16"
              style={{
                background: "linear-gradient(45deg, hsl(213, 72%, 40%) 50%, transparent 50%)",
              }}
            />
            <div
              className="absolute bottom-0 right-0 w-16 h-16"
              style={{
                background: "linear-gradient(315deg, hsl(213, 72%, 40%) 50%, transparent 50%)",
              }}
            />

            <div className="text-center space-y-6">
              <p
                className="text-sm tracking-[0.3em] uppercase font-semibold"
                style={{ color: "hsl(168, 55%, 42%)" }}
              >
                Certificate of Completion
              </p>

              <div className="space-y-1">
                <p className="text-gray-500 text-sm">This is to certify that</p>
                <h1
                  className="text-4xl font-bold"
                  style={{
                    color: "hsl(213, 72%, 40%)",
                    fontFamily: "'Inter', sans-serif",
                  }}
                >
                  {userName}
                </h1>
              </div>

              <p className="text-gray-600 text-sm max-w-md mx-auto leading-relaxed">
                has successfully completed the{" "}
                <strong className="text-gray-900">
                  Coding Basics for Instructional Designers
                </strong>{" "}
                course, demonstrating proficiency in HTML, CSS, JavaScript, and
                building interactive learning experiences.
              </p>

              <div className="flex justify-center">
                <Award
                  className="w-14 h-14"
                  style={{ color: "hsl(38, 92%, 50%)" }}
                />
              </div>

              <div className="flex justify-between items-end pt-6 max-w-lg mx-auto">
                <div className="text-center">
                  <div
                    className="w-32 border-t-2 mb-1"
                    style={{ borderColor: "hsl(213, 72%, 40%)" }}
                  />
                  <p className="text-xs text-gray-500">Date</p>
                  <p className="text-sm font-medium text-gray-700">{today}</p>
                </div>
                <div className="text-center">
                  <div
                    className="w-32 border-t-2 mb-1"
                    style={{ borderColor: "hsl(213, 72%, 40%)" }}
                  />
                  <p className="text-xs text-gray-500">Instructor</p>
                  <p className="text-sm font-medium text-gray-700">
                    Coding Basics Academy
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CompletionCertificate;
