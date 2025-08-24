import { useState, useEffect } from 'react';
import { GitBranch, Star, GitCommit, Users } from 'lucide-react';

function Loading() {
  const [currentStep, setCurrentStep] = useState(0);

  const steps = [
    { icon: GitBranch, text: "Initializing repository..." },
    { icon: GitCommit, text: "Loading commits..." },
    { icon: Star, text: "Fetching stars..." },
    { icon: Users, text: "Connecting to GitHub..." }
  ];

  useEffect(() => {
    const stepTimer = setInterval(() => {
      setCurrentStep(prev => (prev + 1) % steps.length);
    }, 1200);

    return () => clearInterval(stepTimer);
  }, [steps.length]);

  const CurrentIcon = steps[currentStep].icon;

  return (
    <div 
      className="min-h-screen flex items-center justify-center p-4"
      style={{ backgroundColor: '#111827' }}
    >
      <div className="w-full max-w-md">
        <div className="bg-gray-800 rounded-2xl p-8 shadow-2xl border border-gray-700">
          <div className="flex items-center justify-center mb-8">
            <div className="flex items-center justify-center w-16 h-16 bg-blue-600 rounded-full mb-4 animate-pulse">
              <CurrentIcon className="w-8 h-8 text-white" />
            </div>
          </div>
          
          <div className="text-center mb-8">
            <p className="text-white text-lg font-medium mb-2">
              {steps[currentStep].text}
            </p>
            <div className="flex items-center justify-center">
              <div className="animate-spin rounded-full h-6 w-6 border-2 border-gray-600 border-t-blue-500"></div>
            </div>
          </div>

          <div className="flex justify-center space-x-3">
            {steps.map((step, index) => {
              const StepIcon = step.icon;
              return (
                <div
                  key={index}
                  className={`flex items-center justify-center w-10 h-10 rounded-full border-2 transition-all duration-300 ${
                    index === currentStep
                      ? 'border-blue-500 bg-blue-500 text-white scale-110'
                      : index < currentStep
                      ? 'border-green-500 bg-green-500 text-white'
                      : 'border-gray-600 text-gray-600'
                  }`}
                >
                  <StepIcon className="w-5 h-5" />
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Loading;