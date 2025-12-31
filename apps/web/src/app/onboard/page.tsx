'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  TemplateSelector,
  NAICSSelector,
  CRMPreviewStep,
  FeatureToggleGrid,
  CRMConfigProvider,
  Button,
} from '@crm/ui';
import { configurationRegistry } from '@crm/config';
import type { IndustryTemplate, MergedConfiguration } from '@crm/types';
import { ArrowLeft, ArrowRight, Check, Building2 } from 'lucide-react';

type OnboardingStep = 'template' | 'naics' | 'features' | 'preview' | 'complete';

export default function OnboardPage() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState<OnboardingStep>('template');
  const [selectedTemplate, setSelectedTemplate] = useState<IndustryTemplate | undefined>();
  const [selectedNaicsCode, setSelectedNaicsCode] = useState<string | undefined>();
  const [enabledFeatures, setEnabledFeatures] = useState<Record<string, boolean>>({});
  const [configuration, setConfiguration] = useState<MergedConfiguration | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Update configuration when template or NAICS changes
  useEffect(() => {
    if (selectedTemplate) {
      const config = selectedNaicsCode
        ? configurationRegistry.getConfiguration(selectedNaicsCode)
        : configurationRegistry.getTemplateConfiguration(selectedTemplate);
      setConfiguration(config);
    }
  }, [selectedTemplate, selectedNaicsCode]);

  const steps = [
    { key: 'template', label: 'Business Type' },
    { key: 'naics', label: 'Industry' },
    { key: 'features', label: 'Features' },
    { key: 'preview', label: 'Preview' },
  ];

  const currentStepIndex = steps.findIndex((s) => s.key === currentStep);

  const handleNext = () => {
    const nextIndex = currentStepIndex + 1;
    if (nextIndex < steps.length) {
      setCurrentStep(steps[nextIndex].key as OnboardingStep);
    } else {
      handleComplete();
    }
  };

  const handleBack = () => {
    const prevIndex = currentStepIndex - 1;
    if (prevIndex >= 0) {
      setCurrentStep(steps[prevIndex].key as OnboardingStep);
    }
  };

  const handleComplete = async () => {
    setIsLoading(true);
    // In a real app, this would call the API to initialize the tenant
    await new Promise((resolve) => setTimeout(resolve, 1500));
    setCurrentStep('complete');
    setIsLoading(false);
  };

  const handleFeatureToggle = (featureKey: string, enabled: boolean) => {
    setEnabledFeatures((prev) => ({ ...prev, [featureKey]: enabled }));
  };

  const canProceed = () => {
    switch (currentStep) {
      case 'template':
        return !!selectedTemplate;
      case 'naics':
        return true; // NAICS is optional
      case 'features':
        return true;
      case 'preview':
        return !!configuration;
      default:
        return false;
    }
  };

  if (currentStep === 'complete') {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white rounded-lg shadow-sm border border-gray-200 p-8 text-center">
          <div className="w-16 h-16 rounded-full bg-green-100 text-green-600 flex items-center justify-center mx-auto mb-4">
            <Check className="h-8 w-8" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Your CRM is Ready!
          </h1>
          <p className="text-gray-600 mb-6">
            We've configured your CRM with {configuration?.pipelines.length} pipelines,{' '}
            {configuration?.customFields.length} custom fields, and{' '}
            {configuration?.modules.filter((m) => m.isEnabled).length} modules.
          </p>
          <Link
            href="/crm"
            className="inline-flex items-center gap-2 px-6 py-3 text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Go to CRM Dashboard
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    );
  }

  return (
    <CRMConfigProvider initialConfig={configuration || undefined}>
      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <header className="bg-white border-b border-gray-200">
          <div className="max-w-5xl mx-auto px-4 py-4 flex items-center justify-between">
            <Link href="/" className="flex items-center gap-2">
              <Building2 className="h-8 w-8 text-blue-600" />
              <span className="font-bold text-xl">CRM SaaS</span>
            </Link>
            <div className="text-sm text-gray-500">
              Step {currentStepIndex + 1} of {steps.length}
            </div>
          </div>
        </header>

        {/* Progress Bar */}
        <div className="bg-white border-b border-gray-200">
          <div className="max-w-5xl mx-auto px-4 py-4">
            <div className="flex items-center gap-2">
              {steps.map((step, idx) => (
                <div key={step.key} className="flex items-center flex-1">
                  <div
                    className={`flex items-center justify-center w-8 h-8 rounded-full text-sm font-medium ${
                      idx < currentStepIndex
                        ? 'bg-blue-600 text-white'
                        : idx === currentStepIndex
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-200 text-gray-500'
                    }`}
                  >
                    {idx < currentStepIndex ? (
                      <Check className="h-4 w-4" />
                    ) : (
                      idx + 1
                    )}
                  </div>
                  <span
                    className={`ml-2 text-sm font-medium ${
                      idx <= currentStepIndex ? 'text-gray-900' : 'text-gray-500'
                    }`}
                  >
                    {step.label}
                  </span>
                  {idx < steps.length - 1 && (
                    <div
                      className={`flex-1 h-0.5 mx-4 ${
                        idx < currentStepIndex ? 'bg-blue-600' : 'bg-gray-200'
                      }`}
                    />
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Content */}
        <main className="max-w-5xl mx-auto px-4 py-8">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 md:p-8">
            {currentStep === 'template' && (
              <TemplateSelector
                value={selectedTemplate}
                onChange={(template) => {
                  setSelectedTemplate(template);
                  // Reset NAICS when template changes
                  setSelectedNaicsCode(undefined);
                }}
              />
            )}

            {currentStep === 'naics' && (
              <NAICSSelector
                value={selectedNaicsCode}
                onChange={setSelectedNaicsCode}
                onBack={() => setCurrentStep('template')}
              />
            )}

            {currentStep === 'features' && (
              <FeatureToggleGrid
                enabledFeatures={enabledFeatures}
                onChange={handleFeatureToggle}
              />
            )}

            {currentStep === 'preview' && configuration && (
              <CRMPreviewStep configuration={configuration} />
            )}
          </div>

          {/* Navigation */}
          <div className="flex items-center justify-between mt-6">
            <Button
              variant="outline"
              onClick={handleBack}
              disabled={currentStepIndex === 0}
              leftIcon={<ArrowLeft className="h-4 w-4" />}
            >
              Back
            </Button>

            <Button
              onClick={handleNext}
              disabled={!canProceed()}
              isLoading={isLoading}
              rightIcon={
                currentStepIndex === steps.length - 1 ? (
                  <Check className="h-4 w-4" />
                ) : (
                  <ArrowRight className="h-4 w-4" />
                )
              }
            >
              {currentStepIndex === steps.length - 1
                ? 'Complete Setup'
                : 'Continue'}
            </Button>
          </div>
        </main>
      </div>
    </CRMConfigProvider>
  );
}
