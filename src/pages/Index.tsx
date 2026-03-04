import { useState, useCallback } from "react";
import CourseSidebar from "@/components/CourseSidebar";
import ModuleContent from "@/components/ModuleContent";
import { courseModules } from "@/data/courseData";

const Index = () => {
  const [currentModule, setCurrentModule] = useState(1);
  const [completedModules, setCompletedModules] = useState<number[]>([]);

  const module = courseModules.find((m) => m.id === currentModule)!;

  const handleComplete = useCallback(() => {
    setCompletedModules((prev) =>
      prev.includes(currentModule) ? prev : [...prev, currentModule]
    );
  }, [currentModule]);

  const handlePrev = () => {
    if (currentModule > 1) setCurrentModule(currentModule - 1);
  };

  const handleNext = () => {
    if (currentModule < courseModules.length) setCurrentModule(currentModule + 1);
  };

  return (
    <div className="flex min-h-screen w-full bg-background">
      <CourseSidebar
        currentModule={currentModule}
        completedModules={completedModules}
        onSelectModule={setCurrentModule}
      />
      <ModuleContent
        key={currentModule}
        module={module}
        onComplete={handleComplete}
        onPrev={handlePrev}
        onNext={handleNext}
        isFirst={currentModule === 1}
        isLast={currentModule === courseModules.length}
        isCompleted={completedModules.includes(currentModule)}
      />
    </div>
  );
};

export default Index;
