import Link from 'next/link';
import {
  Building2,
  Users,
  Target,
  Settings,
  ArrowRight,
  Check,
  Zap,
  Shield,
  Globe,
} from 'lucide-react';

export default function Home() {
  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className="border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <div className="flex items-center gap-2">
              <Building2 className="h-8 w-8 text-blue-600" />
              <span className="font-bold text-xl">CRM SaaS</span>
            </div>
            <div className="flex items-center gap-4">
              <Link
                href="/login"
                className="text-gray-600 hover:text-gray-900 text-sm font-medium"
              >
                Sign In
              </Link>
              <Link
                href="/onboard"
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700"
              >
                Get Started
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-5xl font-bold text-gray-900 mb-6">
            CRM That Adapts to{' '}
            <span className="text-blue-600">Your Industry</span>
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            A universal CRM platform that auto-configures pipelines, fields, and
            workflows based on your NAICS industry classification.
          </p>
          <div className="flex items-center justify-center gap-4">
            <Link
              href="/onboard"
              className="inline-flex items-center gap-2 px-6 py-3 text-lg font-medium rounded-lg text-white bg-blue-600 hover:bg-blue-700 transition-colors"
            >
              Start Free Trial
              <ArrowRight className="h-5 w-5" />
            </Link>
            <Link
              href="#features"
              className="inline-flex items-center gap-2 px-6 py-3 text-lg font-medium rounded-lg text-gray-700 bg-gray-100 hover:bg-gray-200 transition-colors"
            >
              Learn More
            </Link>
          </div>
        </div>
      </section>

      {/* Industry Templates */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              8 Industry Templates, 20 NAICS Sectors
            </h2>
            <p className="text-lg text-gray-600">
              Pre-configured for construction, healthcare, finance, and more
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { name: 'Project-Based', examples: 'Construction, IT, Consulting' },
              { name: 'Sales-Focused', examples: 'Wholesale, Finance, Real Estate' },
              { name: 'Service-Based', examples: 'Healthcare, Repair, Cleaning' },
              { name: 'Inventory-Based', examples: 'Manufacturing, Retail' },
              { name: 'Asset-Based', examples: 'Trucking, Mining, Utilities' },
              { name: 'Membership-Based', examples: 'Education, Gyms' },
              { name: 'Hospitality', examples: 'Hotels, Restaurants' },
              { name: 'Case-Based', examples: 'Government, Legal' },
            ].map((template) => (
              <div
                key={template.name}
                className="bg-white p-4 rounded-lg border border-gray-200 hover:shadow-md transition-shadow"
              >
                <h3 className="font-semibold text-gray-900 mb-1">
                  {template.name}
                </h3>
                <p className="text-sm text-gray-500">{template.examples}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Everything You Need
            </h2>
            <p className="text-lg text-gray-600">
              Complete CRM with industry-specific customizations
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-12 h-12 rounded-lg bg-blue-100 text-blue-600 flex items-center justify-center mx-auto mb-4">
                <Users className="h-6 w-6" />
              </div>
              <h3 className="font-semibold text-lg text-gray-900 mb-2">
                Contact Management
              </h3>
              <p className="text-gray-600">
                Track contacts, accounts, and relationships with custom fields
                for your industry.
              </p>
            </div>

            <div className="text-center">
              <div className="w-12 h-12 rounded-lg bg-green-100 text-green-600 flex items-center justify-center mx-auto mb-4">
                <Target className="h-6 w-6" />
              </div>
              <h3 className="font-semibold text-lg text-gray-900 mb-2">
                Pipeline Management
              </h3>
              <p className="text-gray-600">
                Industry-specific pipelines with stages tailored to your sales
                process.
              </p>
            </div>

            <div className="text-center">
              <div className="w-12 h-12 rounded-lg bg-purple-100 text-purple-600 flex items-center justify-center mx-auto mb-4">
                <Settings className="h-6 w-6" />
              </div>
              <h3 className="font-semibold text-lg text-gray-900 mb-2">
                Module System
              </h3>
              <p className="text-gray-600">
                Add industry modules like Job Costing, Fleet Management, or
                Appointment Scheduling.
              </p>
            </div>

            <div className="text-center">
              <div className="w-12 h-12 rounded-lg bg-yellow-100 text-yellow-600 flex items-center justify-center mx-auto mb-4">
                <Zap className="h-6 w-6" />
              </div>
              <h3 className="font-semibold text-lg text-gray-900 mb-2">
                Auto-Configuration
              </h3>
              <p className="text-gray-600">
                Select your NAICS code and get instant configuration with
                relevant fields and workflows.
              </p>
            </div>

            <div className="text-center">
              <div className="w-12 h-12 rounded-lg bg-red-100 text-red-600 flex items-center justify-center mx-auto mb-4">
                <Shield className="h-6 w-6" />
              </div>
              <h3 className="font-semibold text-lg text-gray-900 mb-2">
                Multi-Tenant Security
              </h3>
              <p className="text-gray-600">
                Enterprise-grade security with role-based access control and
                data isolation.
              </p>
            </div>

            <div className="text-center">
              <div className="w-12 h-12 rounded-lg bg-cyan-100 text-cyan-600 flex items-center justify-center mx-auto mb-4">
                <Globe className="h-6 w-6" />
              </div>
              <h3 className="font-semibold text-lg text-gray-900 mb-2">
                API & Integrations
              </h3>
              <p className="text-gray-600">
                Connect with your existing tools through our REST API and
                integration marketplace.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 bg-blue-600">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">
            Ready to Get Started?
          </h2>
          <p className="text-xl text-blue-100 mb-8">
            Set up your industry-configured CRM in minutes.
          </p>
          <Link
            href="/onboard"
            className="inline-flex items-center gap-2 px-8 py-4 text-lg font-medium rounded-lg text-blue-600 bg-white hover:bg-gray-100 transition-colors"
          >
            Start Your Free Trial
            <ArrowRight className="h-5 w-5" />
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 bg-gray-900 text-gray-400">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Building2 className="h-6 w-6 text-white" />
              <span className="font-bold text-white">CRM SaaS</span>
            </div>
            <p className="text-sm">
              Industry-Configurable CRM Platform
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
