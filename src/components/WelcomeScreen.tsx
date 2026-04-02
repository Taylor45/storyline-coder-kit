import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import welcomeIllustration from "@/assets/javascript-frameworks.png";

interface WelcomeScreenProps {
  onStart: (name: string, surname: string) => void;
}

const WelcomeScreen = ({ onStart }: WelcomeScreenProps) => {
  const [name, setName] = useState("");
  const [surname, setSurname] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim() && surname.trim()) {
      onStart(name.trim(), surname.trim());
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <div className="w-full max-w-4xl bg-card rounded-2xl shadow-xl overflow-hidden flex flex-col md:flex-row">
        {/* Left Panel */}
        <div className="md:w-1/2 bg-[hsl(var(--sidebar-background))] text-sidebar-foreground p-8 md:p-12 flex flex-col items-center justify-center relative overflow-hidden">
          {/* Decorative circles */}

          <h2 className="text-2xl md:text-3xl font-bold text-center mb-2 relative z-10 italic text-primary-foreground">
            JavaScript Coding Basics for Instructional Design
          </h2>

          <img
            src={welcomeIllustration}
            alt="Developer working on code"
            className="w-64 h-64 object-contain my-6 relative z-10"
          />

          <p className="text-sm text-center opacity-80 relative z-10">
            Add custom interactivity without becoming a developer
          </p>
        </div>

        {/* Right Panel */}
        <div className="md:w-1/2 p-8 md:p-12 flex flex-col items-center justify-center">
          <h1 className="text-2xl md:text-3xl font-bold text-foreground mb-2">
            Hello! Welcome
          </h1>
          <p className="text-muted-foreground text-center mb-8 text-sm">
            Fill in your details to start the course. Once you complete the
            course, you will receive a certificate.
          </p>

          <form onSubmit={handleSubmit} className="w-full max-w-xs space-y-5">
            <div className="space-y-1.5">
              <Label htmlFor="name" className="font-semibold text-foreground">
                Name
              </Label>
              <Input
                id="name"
                placeholder="e.g Thabelo"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                maxLength={100}
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="surname" className="font-semibold text-foreground">
                Surname
              </Label>
              <Input
                id="surname"
                placeholder="e.g Maluleke"
                value={surname}
                onChange={(e) => setSurname(e.target.value)}
                required
                maxLength={100}
              />
            </div>

            <Button
              type="submit"
              className="w-full mt-4"
              size="lg"
              disabled={!name.trim() || !surname.trim()}
            >
              Start Course
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default WelcomeScreen;
