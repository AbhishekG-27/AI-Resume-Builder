"use client";

import React from "react";
import {
  FileText,
  Shield,
  Eye,
  Users,
  AlertCircle,
  Mail,
  UserCircle,
} from "lucide-react";
import Footer from "@/components/Footer";

const Terms = () => {
  return (
    <div>
      <div className="w-full min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
        {/* Hero Section */}
        <section className="relative overflow-hidden mb-8">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-600/10 to-indigo-600/10"></div>
          <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-16">
            <div className="text-center animate-in zoom-in-95 duration-700">
              <div className="flex justify-center mb-6">
                <div className="p-4 bg-blue-100 rounded-full">
                  <Shield className="h-12 w-12 text-blue-600" />
                </div>
              </div>
              <h1 className="text-5xl lg:text-6xl font-bold text-gray-900 mb-6">
                Terms & Conditions
              </h1>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
                Welcome to AutoCv. Please read these terms and conditions
                carefully before using our AI-powered resume building service.
              </p>
            </div>
          </div>
        </section>

        {/* Main Content */}
        <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
          <div className="space-y-12">
            {/* Section 1: Acceptance of Terms */}
            <div className="animate-in slide-in-from-left-5 duration-700 delay-200">
              <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100">
                <div className="flex items-center mb-6">
                  <FileText className="h-8 w-8 text-blue-600 mr-4" />
                  <h2 className="text-3xl font-semibold text-gray-900">
                    1. Acceptance of Terms
                  </h2>
                </div>
                <div className="prose prose-lg text-gray-700 space-y-4">
                  <p>
                    By accessing and using AutoCv's resume building platform,
                    you accept and agree to be bound by the terms and provision
                    of this agreement. If you do not agree to abide by the
                    above, please do not use this service.
                  </p>
                  <p>
                    These terms apply to all visitors, users, and others who
                    access or use our service. Our service is offered subject to
                    your acceptance without modification of all of the terms and
                    conditions contained herein.
                  </p>
                </div>
              </div>
            </div>

            {/* Section 2: Service Description */}
            <div className="animate-in slide-in-from-left-5 duration-700 delay-300">
              <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100">
                <div className="flex items-center mb-6">
                  <Users className="h-8 w-8 text-blue-600 mr-4" />
                  <h2 className="text-3xl font-semibold text-gray-900">
                    2. Service Description
                  </h2>
                </div>
                <div className="prose prose-lg text-gray-700 space-y-4">
                  <p>
                    AutoCv provides an AI-powered resume building and analysis
                    platform that helps users create, optimize, and manage their
                    professional resumes. Our services include:
                  </p>
                  <ul className="list-disc pl-6 space-y-2">
                    <li>AI-powered resume analysis and scoring</li>
                    <li>Resume optimization suggestions</li>
                    <li>PDF generation and download capabilities</li>
                    <li>Account management and resume storage</li>
                  </ul>
                  <p>
                    We reserve the right to modify, suspend, or discontinue any
                    part of our service with or without notice.
                  </p>
                </div>
              </div>
            </div>

            {/* Section 3: User Accounts */}
            <div className="animate-in slide-in-from-left-5 duration-700 delay-400">
              <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100">
                <div className="flex items-center mb-6">
                  <UserCircle className="h-8 w-8 text-blue-600 mr-4" />
                  <h2 className="text-3xl font-semibold text-gray-900">
                    3. User Accounts
                  </h2>
                </div>
                <div className="prose prose-lg text-gray-700 space-y-4">
                  <p>
                    To access certain features of our service, you may be
                    required to create an account. You agree to:
                  </p>
                  <ul className="list-disc pl-6 space-y-2">
                    <li>
                      Provide accurate and complete information during
                      registration
                    </li>
                    <li>Maintain the security of your password and account</li>
                    <li>
                      Promptly update any changes to your account information
                    </li>
                    <li>
                      Accept responsibility for all activities under your
                      account
                    </li>
                    <li>
                      Notify us immediately of any unauthorized access to your
                      account
                    </li>
                  </ul>
                  <p>
                    You are responsible for safeguarding the password and all
                    activities that occur under your account.
                  </p>
                </div>
              </div>
            </div>

            {/* Section 4: Privacy Policy */}
            <div className="animate-in slide-in-from-left-5 duration-700 delay-500">
              <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100">
                <div className="flex items-center mb-6">
                  <Eye className="h-8 w-8 text-blue-600 mr-4" />
                  <h2 className="text-3xl font-semibold text-gray-900">
                    4. Privacy & Data Protection
                  </h2>
                </div>
                <div className="prose prose-lg text-gray-700 space-y-4">
                  <p>
                    Your privacy is important to us. We collect and use your
                    personal information in accordance with our Privacy Policy,
                    which is incorporated into these terms by reference.
                  </p>
                  <p>
                    By using our service, you consent to the collection and use
                    of your information as outlined in our Privacy Policy. We
                    implement appropriate security measures to protect your
                    personal data.
                  </p>
                  <p>
                    We do not sell, trade, or otherwise transfer your personal
                    information to third parties without your consent, except as
                    described in our Privacy Policy.
                  </p>
                </div>
              </div>
            </div>

            {/* Section 5: Prohibited Uses */}
            <div className="animate-in slide-in-from-left-5 duration-700 delay-600">
              <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100">
                <div className="flex items-center mb-6">
                  <AlertCircle className="h-8 w-8 text-red-600 mr-4" />
                  <h2 className="text-3xl font-semibold text-gray-900">
                    5. Prohibited Uses
                  </h2>
                </div>
                <div className="prose prose-lg text-gray-700 space-y-4">
                  <p>
                    You may not use our service for any unlawful purpose or to
                    solicit others to perform acts that violate these terms.
                    Prohibited uses include:
                  </p>
                  <ul className="list-disc pl-6 space-y-2">
                    <li>Violating any applicable laws or regulations</li>
                    <li>
                      Transmitting harmful, offensive, or inappropriate content
                    </li>
                    <li>
                      Attempting to gain unauthorized access to our systems
                    </li>
                    <li>
                      Using automated systems to access our service without
                      permission
                    </li>
                    <li>
                      Interfering with or disrupting our service or servers
                    </li>
                    <li>Creating false or misleading resume content</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Section 6: Intellectual Property */}
            <div className="animate-in slide-in-from-left-5 duration-700 delay-700">
              <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100">
                <div className="flex items-center mb-6">
                  <Shield className="h-8 w-8 text-blue-600 mr-4" />
                  <h2 className="text-3xl font-semibold text-gray-900">
                    6. Intellectual Property
                  </h2>
                </div>
                <div className="prose prose-lg text-gray-700 space-y-4">
                  <p>
                    The service and its original content, features, and
                    functionality are and will remain the exclusive property of
                    AutoCv and its licensors. The service is protected by
                    copyright, trademark, and other laws.
                  </p>
                  <p>
                    You retain ownership of the content you upload to create
                    your resume. However, you grant us a non-exclusive license
                    to use, modify, and display this content for the purpose of
                    providing our service.
                  </p>
                </div>
              </div>
            </div>

            {/* Section 7: Limitation of Liability */}
            <div className="animate-in slide-in-from-left-5 duration-700 delay-800">
              <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100">
                <div className="flex items-center mb-6">
                  <AlertCircle className="h-8 w-8 text-amber-600 mr-4" />
                  <h2 className="text-3xl font-semibold text-gray-900">
                    7. Limitation of Liability
                  </h2>
                </div>
                <div className="prose prose-lg text-gray-700 space-y-4">
                  <p>
                    In no event shall AutoCv, nor its directors, employees,
                    partners, agents, suppliers, or affiliates, be liable for
                    any indirect, incidental, special, consequential, or
                    punitive damages, including without limitation, loss of
                    profits, data, use, goodwill, or other intangible losses,
                    resulting from your use of the service.
                  </p>
                  <p>
                    We provide our service "as is" and "as available" without
                    any warranties, express or implied.
                  </p>
                </div>
              </div>
            </div>

            {/* Section 8: Contact Information */}
            <div className="animate-in slide-in-from-left-5 duration-700 delay-900">
              <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl p-8 border border-blue-200">
                <div className="flex items-center mb-6">
                  <Mail className="h-8 w-8 text-blue-600 mr-4" />
                  <h2 className="text-3xl font-semibold text-gray-900">
                    8. Contact Us
                  </h2>
                </div>
                <div className="prose prose-lg text-gray-700 space-y-4">
                  <p>
                    If you have any questions about these Terms and Conditions,
                    please contact us:
                  </p>
                  <div className="bg-white rounded-xl p-6 border border-blue-100">
                    <div className="space-y-2">
                      <p>
                        <strong>Email:</strong> gargabhishek1255@gmail.com
                      </p>
                    </div>
                  </div>
                  <p className="text-sm text-gray-600">
                    We reserve the right to update these terms at any time.
                    Changes will be effective immediately upon posting to our
                    website.
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

export default Terms;
