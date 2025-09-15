"use client";

import React from "react";
import {
  Shield,
  Eye,
  Lock,
  Database,
  UserCheck,
  Cookie,
  Settings,
  Mail,
  AlertTriangle,
} from "lucide-react";
import Footer from "@/components/Footer";

const Privacy = () => {
  return (
    <div>
      <div className="w-full min-h-screen bg-gradient-to-br from-green-50 via-white to-emerald-50">
        {/* Hero Section */}
        <section className="relative overflow-hidden mb-8">
          <div className="absolute inset-0 bg-gradient-to-r from-green-600/10 to-emerald-600/10"></div>
          <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-16">
            <div className="text-center animate-in zoom-in-95 duration-700">
              <div className="flex justify-center mb-6">
                <div className="p-4 bg-green-100 rounded-full">
                  <Shield className="h-12 w-12 text-green-600" />
                </div>
              </div>
              <h1 className="text-5xl lg:text-6xl font-bold text-gray-900 mb-6">
                Privacy Policy
              </h1>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
                Your privacy is our priority. Learn how AutoCv collects, uses,
                and protects your personal information when you use our
                AI-powered resume building service.
              </p>
            </div>
          </div>
        </section>

        {/* Main Content */}
        <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
          <div className="space-y-12">
            {/* Section 1: Information We Collect */}
            <div className="animate-in slide-in-from-left-5 duration-700 delay-200">
              <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100">
                <div className="flex items-center mb-6">
                  <Database className="h-8 w-8 text-green-600 mr-4" />
                  <h2 className="text-3xl font-semibold text-gray-900">
                    1. Information We Collect
                  </h2>
                </div>
                <div className="prose prose-lg text-gray-700 space-y-4">
                  <p>
                    We collect information you provide directly to us,
                    information we obtain automatically when you use our
                    services, and information from third-party sources.
                  </p>

                  <h3 className="text-xl font-semibold text-gray-800 mt-6 mb-3">
                    Personal Information You Provide:
                  </h3>
                  <ul className="list-disc pl-6 space-y-2">
                    <li>Account information (name, email address, password)</li>
                    <li>
                      Resume content (work experience, education, skills,
                      contact details)
                    </li>
                    <li>
                      Payment information (processed securely through
                      third-party providers)
                    </li>
                    <li>Communication data (support inquiries, feedback)</li>
                    <li>Profile preferences and settings</li>
                  </ul>

                  <h3 className="text-xl font-semibold text-gray-800 mt-6 mb-3">
                    Information Collected Automatically:
                  </h3>
                  <ul className="list-disc pl-6 space-y-2">
                    <li>
                      Device information (IP address, browser type, operating
                      system)
                    </li>
                    <li>
                      Usage data (pages visited, features used, time spent)
                    </li>
                    <li>Log files and analytics data</li>
                    <li>Cookies and similar tracking technologies</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Section 2: How We Use Your Information */}
            <div className="animate-in slide-in-from-left-5 duration-700 delay-300">
              <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100">
                <div className="flex items-center mb-6">
                  <Settings className="h-8 w-8 text-green-600 mr-4" />
                  <h2 className="text-3xl font-semibold text-gray-900">
                    2. How We Use Your Information
                  </h2>
                </div>
                <div className="prose prose-lg text-gray-700 space-y-4">
                  <p>
                    We use the information we collect to provide, maintain, and
                    improve our services. Specifically, we use your information
                    to:
                  </p>
                  <ul className="list-disc pl-6 space-y-2">
                    <li>Create and manage your AutoCv account</li>
                    <li>
                      Generate, analyze, and optimize your resume content using
                      AI
                    </li>
                    <li>Process payments and manage subscriptions</li>
                    <li>Provide customer support and respond to inquiries</li>
                    <li>Send important updates about our service</li>
                    <li>Improve our AI algorithms and service functionality</li>
                    <li>Ensure security and prevent fraud</li>
                    <li>Comply with legal obligations</li>
                  </ul>
                  <div className="bg-green-50 border border-green-200 rounded-xl p-4 mt-6">
                    <p className="text-green-800 font-medium">
                      🔒 We never sell your personal information to third
                      parties or use your resume content for advertising
                      purposes.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Section 3: Information Sharing */}
            <div className="animate-in slide-in-from-left-5 duration-700 delay-400">
              <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100">
                <div className="flex items-center mb-6">
                  <UserCheck className="h-8 w-8 text-green-600 mr-4" />
                  <h2 className="text-3xl font-semibold text-gray-900">
                    3. Information Sharing and Disclosure
                  </h2>
                </div>
                <div className="prose prose-lg text-gray-700 space-y-4">
                  <p>
                    We only share your personal information in the following
                    limited circumstances:
                  </p>

                  <h3 className="text-xl font-semibold text-gray-800 mt-6 mb-3">
                    With Your Consent:
                  </h3>
                  <ul className="list-disc pl-6 space-y-2">
                    <li>
                      When you explicitly authorize us to share information
                    </li>
                    <li>When you choose to export or share your resume</li>
                  </ul>

                  <h3 className="text-xl font-semibold text-gray-800 mt-6 mb-3">
                    Service Providers:
                  </h3>
                  <ul className="list-disc pl-6 space-y-2">
                    <li>Cloud hosting and infrastructure providers</li>
                    <li>Payment processing services</li>
                    <li>Analytics and performance monitoring tools</li>
                    <li>Customer support platforms</li>
                  </ul>

                  <h3 className="text-xl font-semibold text-gray-800 mt-6 mb-3">
                    Legal Requirements:
                  </h3>
                  <ul className="list-disc pl-6 space-y-2">
                    <li>To comply with applicable laws and regulations</li>
                    <li>To respond to legal process or government requests</li>
                    <li>To protect our rights, property, or safety</li>
                    <li>To prevent fraud or abuse</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Section 4: Data Security */}
            <div className="animate-in slide-in-from-left-5 duration-700 delay-500">
              <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100">
                <div className="flex items-center mb-6">
                  <Lock className="h-8 w-8 text-green-600 mr-4" />
                  <h2 className="text-3xl font-semibold text-gray-900">
                    4. Data Security
                  </h2>
                </div>
                <div className="prose prose-lg text-gray-700 space-y-4">
                  <p>
                    We implement robust security measures to protect your
                    personal information against unauthorized access,
                    alteration, disclosure, or destruction.
                  </p>

                  <h3 className="text-xl font-semibold text-gray-800 mt-6 mb-3">
                    Security Measures Include:
                  </h3>
                  <ul className="list-disc pl-6 space-y-2">
                    <li>End-to-end encryption for data transmission</li>
                    <li>
                      Secure data storage with industry-standard encryption
                    </li>
                    <li>
                      Regular security audits and vulnerability assessments
                    </li>
                    <li>Multi-factor authentication options</li>
                    <li>Access controls and employee training</li>
                    <li>Secure payment processing (PCI DSS compliant)</li>
                  </ul>

                  <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 mt-6">
                    <div className="flex items-start">
                      <AlertTriangle className="h-5 w-5 text-amber-600 mr-2 mt-0.5 flex-shrink-0" />
                      <p className="text-amber-800 text-sm">
                        While we implement strong security measures, no method
                        of transmission over the internet is 100% secure. We
                        cannot guarantee absolute security but are committed to
                        protecting your data.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Section 5: Cookies and Tracking */}
            <div className="animate-in slide-in-from-left-5 duration-700 delay-600">
              <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100">
                <div className="flex items-center mb-6">
                  <Cookie className="h-8 w-8 text-green-600 mr-4" />
                  <h2 className="text-3xl font-semibold text-gray-900">
                    5. Cookies and Tracking Technologies
                  </h2>
                </div>
                <div className="prose prose-lg text-gray-700 space-y-4">
                  <p>
                    We use cookies and similar technologies to enhance your
                    experience, analyze usage, and provide personalized content.
                  </p>

                  <h3 className="text-xl font-semibold text-gray-800 mt-6 mb-3">
                    Types of Cookies We Use:
                  </h3>
                  <ul className="list-disc pl-6 space-y-2">
                    <li>
                      <strong>Essential Cookies:</strong> Required for basic
                      site functionality
                    </li>
                    <li>
                      <strong>Analytics Cookies:</strong> Help us understand how
                      you use our service
                    </li>
                    <li>
                      <strong>Preference Cookies:</strong> Remember your
                      settings and preferences
                    </li>
                    <li>
                      <strong>Security Cookies:</strong> Protect against fraud
                      and ensure security
                    </li>
                  </ul>

                  <p>
                    You can control cookie settings through your browser
                    preferences. However, disabling certain cookies may limit
                    some features of our service.
                  </p>
                </div>
              </div>
            </div>

            {/* Section 6: Your Rights and Choices */}
            <div className="animate-in slide-in-from-left-5 duration-700 delay-700">
              <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100">
                <div className="flex items-center mb-6">
                  <Eye className="h-8 w-8 text-green-600 mr-4" />
                  <h2 className="text-3xl font-semibold text-gray-900">
                    6. Your Rights and Choices
                  </h2>
                </div>
                <div className="prose prose-lg text-gray-700 space-y-4">
                  <p>
                    You have several rights regarding your personal information.
                    Depending on your location, these may include:
                  </p>

                  <ul className="list-disc pl-6 space-y-2">
                    <li>
                      <strong>Access:</strong> Request a copy of your personal
                      information
                    </li>
                    <li>
                      <strong>Correction:</strong> Update or correct inaccurate
                      information
                    </li>
                    <li>
                      <strong>Deletion:</strong> Request deletion of your
                      personal information
                    </li>
                    <li>
                      <strong>Portability:</strong> Export your data in a
                      machine-readable format
                    </li>
                    <li>
                      <strong>Restriction:</strong> Limit how we process your
                      information
                    </li>
                    <li>
                      <strong>Objection:</strong> Object to certain types of
                      processing
                    </li>
                  </ul>

                  <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mt-6">
                    <p className="text-blue-800 font-medium">
                      💡 You can exercise most of these rights directly through
                      your account settings or by contacting our support team.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Section 7: Data Retention */}
            <div className="animate-in slide-in-from-left-5 duration-700 delay-800">
              <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100">
                <div className="flex items-center mb-6">
                  <Database className="h-8 w-8 text-green-600 mr-4" />
                  <h2 className="text-3xl font-semibold text-gray-900">
                    7. Data Retention
                  </h2>
                </div>
                <div className="prose prose-lg text-gray-700 space-y-4">
                  <p>
                    We retain your personal information only as long as
                    necessary to provide our services and fulfill the purposes
                    outlined in this policy.
                  </p>

                  <h3 className="text-xl font-semibold text-gray-800 mt-6 mb-3">
                    Retention Periods:
                  </h3>
                  <ul className="list-disc pl-6 space-y-2">
                    <li>
                      <strong>Account Data:</strong> Until you delete your
                      account
                    </li>
                    <li>
                      <strong>Resume Content:</strong> Until you delete specific
                      resumes
                    </li>
                    <li>
                      <strong>Usage Analytics:</strong> Typically 2-3 years in
                      aggregated form
                    </li>
                    <li>
                      <strong>Support Communications:</strong> 3 years for
                      quality assurance
                    </li>
                    <li>
                      <strong>Payment Records:</strong> As required by law
                      (typically 7 years)
                    </li>
                  </ul>

                  <p>
                    When you delete your account, we will delete or anonymize
                    your personal information within 30 days, except where we
                    are required to retain certain information for legal
                    compliance.
                  </p>
                </div>
              </div>
            </div>

            {/* Section 8: International Data Transfers */}
            <div className="animate-in slide-in-from-left-5 duration-700 delay-900">
              <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100">
                <div className="flex items-center mb-6">
                  <Shield className="h-8 w-8 text-green-600 mr-4" />
                  <h2 className="text-3xl font-semibold text-gray-900">
                    8. International Data Transfers
                  </h2>
                </div>
                <div className="prose prose-lg text-gray-700 space-y-4">
                  <p>
                    AutoCv operates globally, and your information may be
                    transferred to and processed in countries other than your
                    own. We ensure appropriate safeguards are in place for
                    international transfers.
                  </p>

                  <h3 className="text-xl font-semibold text-gray-800 mt-6 mb-3">
                    Transfer Safeguards:
                  </h3>
                  <ul className="list-disc pl-6 space-y-2">
                    <li>
                      Standard contractual clauses approved by relevant
                      authorities
                    </li>
                    <li>Adequacy decisions for certain countries</li>
                    <li>Certification schemes and codes of conduct</li>
                    <li>Regular compliance reviews and audits</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Section 9: Contact Us */}
            <div className="animate-in slide-in-from-left-5 duration-700 delay-1000">
              <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-2xl p-8 border border-green-200">
                <div className="flex items-center mb-6">
                  <Mail className="h-8 w-8 text-green-600 mr-4" />
                  <h2 className="text-3xl font-semibold text-gray-900">
                    9. Contact Us
                  </h2>
                </div>
                <div className="prose prose-lg text-gray-700 space-y-4">
                  <p>
                    If you have any questions about this Privacy Policy or our
                    data practices, please contact us:
                  </p>
                  <div className="bg-white rounded-xl p-6 border border-green-100">
                    <div className="space-y-2">
                      <p>
                        <strong>Privacy Officer:</strong> privacy@autocv.com
                      </p>
                      <p>
                        <strong>Support Team:</strong> support@autocv.com
                      </p>
                      <p>
                        <strong>Address:</strong> AutoCv Privacy Department
                      </p>
                    </div>
                  </div>
                  <p className="text-sm text-gray-600">
                    We will respond to your privacy-related inquiries within 30
                    days. This Privacy Policy may be updated periodically to
                    reflect changes in our practices or applicable law.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
      <Footer />
    </div>
  );
};

export default Privacy;
