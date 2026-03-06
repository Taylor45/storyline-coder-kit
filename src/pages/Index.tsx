import { useState, useCallback } from "react";
import CourseSidebar from "@/components/CourseSidebar";
import ModuleContent from "@/components/ModuleContent";
import WelcomeScreen from "@/components/WelcomeScreen";
import CompletionPage from "@/components/CompletionPage";
import { courseModules } from "@/data/courseData";

const Index = () => {
  const [userName, setUserName] = useState<string | null>(null);
  const [currentModule, setCurrentModule] = useState(1);
  const [completedModules, setCompletedModules] = useState<number[]>([]);
  const [showCompletion, setShowCompletion] = useState(false);

  const module = courseModules.find((m) => m.id === currentModule)!;

  const handleStart = (name: string, surname: string) => {
    setUserName(`${name} ${surname}`);
  };

  const handleComplete = useCallback(() => {
    setCompletedModules((prev) =>
      prev.includes(currentModule) ? prev : [...prev, currentModule]
    );
  }, [currentModule]);

  const handlePrev = () => {
    if (currentModule > 1) {
      setShowCompletion(false);
      setCurrentModule(currentModule - 1);
    }
  };

  const handleNext = () => {
    if (currentModule < courseModules.length) {
      setShowCompletion(false);
      setCurrentModule(currentModule + 1);
    }
  };

  const handleSelectModule = (id: number) => {
    setShowCompletion(false);
    setCurrentModule(id);
  };

  if (!userName) {
    return <WelcomeScreen onStart={handleStart} />;
  }

  const allCompleted = completedModules.length === courseModules.length;

  return (
    <div className="flex min-h-screen w-full bg-background">
      <CourseSidebar
        currentModule={currentModule}
        completedModules={completedModules}
        onSelectModule={handleSelectModule}
        showCompletion={allCompleted}
        isCompletionView={showCompletion}
        onSelectCompletion={() => setShowCompletion(true)}
      />
      {showCompletion && allCompleted ? (
        <CompletionPage userName={userName} />
      ) : (
        <ModuleContent
          key={currentModule}
          module={module}
          onComplete={handleComplete}
          onPrev={handlePrev}
          onNext={handleNext}
          isFirst={currentModule === 1}
          isLast={currentModule === courseModules.length}
          isCompleted={completedModules.includes(currentModule)}
          allCompleted={allCompleted}
          userName={userName}
        />
      )}
    </div>
  );
};

export default Index;
