"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createOrUpdateProfile } from "@/app/actions/profile";

// Comprehensive list of countries
const COUNTRIES = [
  "Afghanistan", "Albania", "Algeria", "Argentina", "Australia", "Austria",
  "Bangladesh", "Belgium", "Brazil", "Bulgaria",
  "Canada", "Chile", "China", "Colombia", "Costa Rica", "Croatia", "Cyprus", "Czech Republic",
  "Denmark",
  "Egypt", "Estonia", "Ethiopia",
  "Finland", "France",
  "Germany", "Ghana", "Greece",
  "Hong Kong", "Hungary",
  "Iceland", "India", "Indonesia", "Iran", "Iraq", "Ireland", "Israel", "Italy",
  "Japan", "Jordan",
  "Kenya", "Kuwait",
  "Latvia", "Lebanon", "Libya", "Lithuania", "Luxembourg",
  "Malaysia", "Mexico", "Morocco",
  "Nepal", "Netherlands", "New Zealand", "Nigeria", "Norway",
  "Pakistan", "Peru", "Philippines", "Poland", "Portugal",
  "Qatar",
  "Romania", "Russia",
  "Saudi Arabia", "Singapore", "Slovakia", "Slovenia", "South Africa", "South Korea", "Spain", "Sri Lanka", "Sweden", "Switzerland", "Syria",
  "Taiwan", "Thailand", "Turkey",
  "Ukraine", "United Arab Emirates", "United Kingdom", "United States", "Uruguay",
  "Venezuela", "Vietnam",
  "Yemen",
  "Zimbabwe"
];

// Fields of study options
const FIELDS_OF_STUDY = [
  "Computer Science",
  "Data Science",
  "Software Engineering",
  "Artificial Intelligence",
  "Information Technology",
  "Cybersecurity",
  "Business Administration",
  "Finance",
  "Economics",
  "Accounting",
  "Marketing",
  "Engineering (General)",
  "Mechanical Engineering",
  "Electrical Engineering",
  "Civil Engineering",
  "Chemical Engineering",
  "Medicine",
  "Nursing",
  "Public Health",
  "Pharmacy",
  "Biology",
  "Chemistry",
  "Physics",
  "Mathematics",
  "Psychology",
  "Sociology",
  "Political Science",
  "International Relations",
  "Law",
  "Education",
  "Architecture",
  "Graphic Design",
  "Fine Arts",
  "Communications",
  "Journalism",
  "Environmental Science",
  "Agriculture",
];

export default function ProfilePage() {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  // Store form data in state
  const [formData, setFormData] = useState({
    name: "",
    citizenshipCountry: "",
    residenceCountry: "",
    targetCountries: [] as string[],
    degreeLevel: "",
    majorInterests: [] as string[],
    gpa: "",
    gpaScale: "4.0",
    englishTestType: "",
    englishScore: "",
    satScore: "",
    actScore: "",
    greVerbal: "",
    greQuant: "",
    gmatScore: "",
    budgetMin: "",
    budgetMax: "",
    intakeTerm: "Fall",
    intakeYear: "2025",
  });

  function handleInputChange(field: string, value: string | string[]) {
    setFormData((prev) => ({ ...prev, [field]: value }));
  }

  function handleCheckboxChange(country: string, checked: boolean) {
    setFormData((prev) => ({
      ...prev,
      targetCountries: checked
        ? [...prev.targetCountries, country]
        : prev.targetCountries.filter((c) => c !== country),
    }));
  }

  function handleFieldOfStudyChange(field: string, checked: boolean) {
    setFormData((prev) => ({
      ...prev,
      majorInterests: checked
        ? [...prev.majorInterests, field]
        : prev.majorInterests.filter((f) => f !== field),
    }));
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);

    // Create FormData from state
    const data = new FormData();
    data.append("name", formData.name);
    data.append("citizenshipCountry", formData.citizenshipCountry);
    data.append("residenceCountry", formData.residenceCountry);
    formData.targetCountries.forEach((country) => {
      data.append("targetCountries", country);
    });
    data.append("degreeLevel", formData.degreeLevel);
    data.append("majorInterests", formData.majorInterests.join(", "));
    data.append("gpa", formData.gpa);
    data.append("gpaScale", formData.gpaScale);
    data.append("englishTestType", formData.englishTestType);
    data.append("englishScore", formData.englishScore);
    
    // Add standardized test scores as JSON
    const standardizedTests: any = {};
    if (formData.satScore) standardizedTests.SAT = parseInt(formData.satScore);
    if (formData.actScore) standardizedTests.ACT = parseInt(formData.actScore);
    if (formData.greVerbal) standardizedTests.GRE_Verbal = parseInt(formData.greVerbal);
    if (formData.greQuant) standardizedTests.GRE_Quant = parseInt(formData.greQuant);
    if (formData.gmatScore) standardizedTests.GMAT = parseInt(formData.gmatScore);
    data.append("standardizedTests", JSON.stringify(standardizedTests));
    
    data.append("budgetMin", formData.budgetMin);
    data.append("budgetMax", formData.budgetMax);
    data.append("intakeTerm", formData.intakeTerm);
    data.append("intakeYear", formData.intakeYear);

    const result = await createOrUpdateProfile(data);

    if (result.success) {
      router.push("/dashboard");
    } else {
      alert(`Failed to save profile: ${result.error || "Please try again"}`);
      setLoading(false);
    }
  }

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Your Profile</h1>
        <p className="mt-2 text-gray-600">
          Tell us about yourself to find the perfect programs
        </p>
      </div>

      {/* Progress Indicator */}
      <div className="flex items-center justify-between">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="flex items-center">
            <div
              className={`flex h-10 w-10 items-center justify-center rounded-full border-2 font-semibold ${
                step >= i
                  ? "border-blue-600 bg-blue-600 text-white"
                  : "border-gray-300 text-gray-400"
              }`}
            >
              {i}
            </div>
            {i < 4 && (
              <div
                className={`h-1 w-24 ${
                  step > i ? "bg-blue-600" : "bg-gray-300"
                }`}
              />
            )}
          </div>
        ))}
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="rounded-lg border bg-white p-8 shadow-sm">
        {step === 1 && (
          <div className="space-y-6">
            <h2 className="text-2xl font-semibold text-gray-900">
              Personal & Geographic Information
            </h2>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Your Name
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => handleInputChange("name", e.target.value)}
                required
                placeholder="Enter your full name"
                className="mt-1 w-full rounded-lg border px-4 py-2"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Citizenship Country
              </label>
              <select
                value={formData.citizenshipCountry}
                onChange={(e) => handleInputChange("citizenshipCountry", e.target.value)}
                required
                className="mt-1 w-full rounded-lg border px-4 py-2"
              >
                <option value="">Select country...</option>
                {COUNTRIES.map((country) => (
                  <option key={country} value={country}>
                    {country}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Current Residence
              </label>
              <select
                value={formData.residenceCountry}
                onChange={(e) => handleInputChange("residenceCountry", e.target.value)}
                required
                className="mt-1 w-full rounded-lg border px-4 py-2"
              >
                <option value="">Select country...</option>
                {COUNTRIES.map((country) => (
                  <option key={country} value={country}>
                    {country}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Target Countries (Select multiple)
              </label>
              <div className="mt-2 space-y-2">
                {["USA", "Canada", "UK", "Germany", "Australia"].map((country) => (
                  <label key={country} className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={formData.targetCountries.includes(country)}
                      onChange={(e) => handleCheckboxChange(country, e.target.checked)}
                      className="h-4 w-4"
                    />
                    <span className="text-gray-700">{country}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-6">
            <h2 className="text-2xl font-semibold text-gray-900">
              Academic Information
            </h2>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Degree Level
              </label>
              <select
                value={formData.degreeLevel}
                onChange={(e) => handleInputChange("degreeLevel", e.target.value)}
                required
                className="mt-1 w-full rounded-lg border px-4 py-2"
              >
                <option value="">Select degree...</option>
                <option>Bachelors</option>
                <option>Masters</option>
                <option>PhD</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Field(s) of Study (Select at least one)
              </label>
              <div className="mt-2 grid max-h-64 grid-cols-2 gap-2 overflow-y-auto rounded-lg border p-4 md:grid-cols-3">
                {FIELDS_OF_STUDY.map((field) => (
                  <label key={field} className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={formData.majorInterests.includes(field)}
                      onChange={(e) => handleFieldOfStudyChange(field, e.target.checked)}
                      className="h-4 w-4"
                    />
                    <span className="text-sm text-gray-700">{field}</span>
                  </label>
                ))}
              </div>
              {formData.majorInterests.length > 0 && (
                <p className="mt-2 text-sm text-gray-600">
                  Selected: {formData.majorInterests.join(", ")}
                </p>
              )}
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  GPA
                </label>
                <input
                  type="number"
                  value={formData.gpa}
                  onChange={(e) => handleInputChange("gpa", e.target.value)}
                  step="0.01"
                  min="0"
                  max="100"
                  placeholder="3.7"
                  className="mt-1 w-full rounded-lg border px-4 py-2"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  GPA Scale
                </label>
                <select
                  value={formData.gpaScale}
                  onChange={(e) => handleInputChange("gpaScale", e.target.value)}
                  className="mt-1 w-full rounded-lg border px-4 py-2"
                >
                  <option>4.0</option>
                  <option>5.0</option>
                  <option>100</option>
                </select>
              </div>
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="space-y-6">
            <h2 className="text-2xl font-semibold text-gray-900">
              Test Scores & Budget
            </h2>

            {/* English Test */}
            <div>
              <h3 className="mb-3 font-medium text-gray-900">English Proficiency</h3>
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    English Test Type
                  </label>
                  <select
                    value={formData.englishTestType}
                    onChange={(e) => handleInputChange("englishTestType", e.target.value)}
                    className="mt-1 w-full rounded-lg border px-4 py-2"
                  >
                    <option value="">Select test...</option>
                    <option>IELTS</option>
                    <option>TOEFL</option>
                    <option>Duolingo</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Score
                  </label>
                  <input
                    type="number"
                    value={formData.englishScore}
                    onChange={(e) => handleInputChange("englishScore", e.target.value)}
                    step="0.5"
                    placeholder="7.5 (IELTS) or 100 (TOEFL)"
                    className="mt-1 w-full rounded-lg border px-4 py-2"
                  />
                </div>
              </div>
            </div>

            {/* Standardized Tests (Optional) */}
            <div>
              <h3 className="mb-3 font-medium text-gray-900">
                Standardized Tests <span className="text-sm font-normal text-gray-500">(Optional)</span>
              </h3>
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    SAT Score
                  </label>
                  <input
                    type="number"
                    value={formData.satScore}
                    onChange={(e) => handleInputChange("satScore", e.target.value)}
                    placeholder="1400 (out of 1600)"
                    min="400"
                    max="1600"
                    className="mt-1 w-full rounded-lg border px-4 py-2"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    ACT Score
                  </label>
                  <input
                    type="number"
                    value={formData.actScore}
                    onChange={(e) => handleInputChange("actScore", e.target.value)}
                    placeholder="30 (out of 36)"
                    min="1"
                    max="36"
                    className="mt-1 w-full rounded-lg border px-4 py-2"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    GRE Verbal
                  </label>
                  <input
                    type="number"
                    value={formData.greVerbal}
                    onChange={(e) => handleInputChange("greVerbal", e.target.value)}
                    placeholder="160 (out of 170)"
                    min="130"
                    max="170"
                    className="mt-1 w-full rounded-lg border px-4 py-2"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    GRE Quantitative
                  </label>
                  <input
                    type="number"
                    value={formData.greQuant}
                    onChange={(e) => handleInputChange("greQuant", e.target.value)}
                    placeholder="165 (out of 170)"
                    min="130"
                    max="170"
                    className="mt-1 w-full rounded-lg border px-4 py-2"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    GMAT Score
                  </label>
                  <input
                    type="number"
                    value={formData.gmatScore}
                    onChange={(e) => handleInputChange("gmatScore", e.target.value)}
                    placeholder="650 (out of 800)"
                    min="200"
                    max="800"
                    className="mt-1 w-full rounded-lg border px-4 py-2"
                  />
                </div>
              </div>
            </div>

            {/* Budget */}
            <div>
              <h3 className="mb-3 font-medium text-gray-900">Budget</h3>
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Min Budget (USD/year)
                  </label>
                  <input
                    type="number"
                    value={formData.budgetMin}
                    onChange={(e) => handleInputChange("budgetMin", e.target.value)}
                    placeholder="20000"
                    className="mt-1 w-full rounded-lg border px-4 py-2"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Max Budget (USD/year)
                  </label>
                  <input
                    type="number"
                    value={formData.budgetMax}
                    onChange={(e) => handleInputChange("budgetMax", e.target.value)}
                    placeholder="40000"
                    className="mt-1 w-full rounded-lg border px-4 py-2"
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {step === 4 && (
          <div className="space-y-6">
            <h2 className="text-2xl font-semibold text-gray-900">
              Timeline & Final Details
            </h2>

            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Target Intake Term
                </label>
                <select
                  value={formData.intakeTerm}
                  onChange={(e) => handleInputChange("intakeTerm", e.target.value)}
                  className="mt-1 w-full rounded-lg border px-4 py-2"
                >
                  <option>Fall</option>
                  <option>Spring</option>
                  <option>Summer</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Target Year
                </label>
                <select
                  value={formData.intakeYear}
                  onChange={(e) => handleInputChange("intakeYear", e.target.value)}
                  className="mt-1 w-full rounded-lg border px-4 py-2"
                >
                  <option>2025</option>
                  <option>2026</option>
                </select>
              </div>
            </div>

            <div className="rounded-lg bg-green-50 p-6">
              <h3 className="font-semibold text-green-900">
                🎉 Profile Complete!
              </h3>
              <p className="mt-2 text-sm text-green-800">
                Click "Find Programs" to discover programs that match your profile.
              </p>
            </div>
          </div>
        )}

        {/* Navigation Buttons */}
        <div className="mt-8 flex justify-between">
          <button
            type="button"
            onClick={() => setStep(Math.max(1, step - 1))}
            disabled={step === 1 || loading}
            className="rounded-lg border px-6 py-2 font-semibold text-gray-700 hover:bg-gray-50 disabled:opacity-50"
          >
            Back
          </button>
          {step < 4 ? (
            <button
              type="button"
              onClick={() => setStep(Math.min(4, step + 1))}
              disabled={loading}
              className="rounded-lg bg-blue-600 px-6 py-2 font-semibold text-white hover:bg-blue-700 disabled:opacity-50"
            >
              Next
            </button>
          ) : (
            <button
              type="submit"
              disabled={loading}
              className="rounded-lg bg-green-600 px-6 py-2 font-semibold text-white hover:bg-green-700 disabled:opacity-50"
            >
              {loading ? "Finding Programs..." : "Find Programs"}
            </button>
          )}
        </div>
      </form>
    </div>
  );
}

