import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  User,
  Shield,
  CheckCircle,
  AlertCircle,
  Loader2,
  Stethoscope,
  X,
  Upload,
  File,
  Plus,
  Pill,
  Activity,
} from "lucide-react";
import { patientSchema, type PatientFormData } from "../../schemas/patient";
import Layout from "../../components/Layout/Layout/Layout";

import { patientsAPI } from "../../services/patient";

const AddPatient: React.FC = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [conditions, setConditions] = useState<string[]>([]);
  const [symptoms, setSymptoms] = useState<string[]>([]);
  const [treatments, setTreatments] = useState<string[]>([]);
  const [currentCondition, setCurrentCondition] = useState("");
  const [currentSymptom, setCurrentSymptom] = useState("");
  const [currentTreatment, setCurrentTreatment] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors, isDirty },
    reset,
    setValue,
    watch,
  } = useForm<PatientFormData | any>({
    resolver: zodResolver(patientSchema),
    mode: "onChange",
    defaultValues: {
      conditions: [],
      symptoms: [],
      treatments: [],
    },
  });

  // Watch the encryptedData field for real-time validation
  const encryptedData = watch("encryptedData");

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    if (files.length > 0) {
      setSelectedFiles((prev) => [...prev, ...files]);
    }
  };

  const removeFile = (index: number) => {
    setSelectedFiles((prev) => prev.filter((_, i) => i !== index));
  };

  // Array management functions
  const addCondition = () => {
    if (
      currentCondition.trim() &&
      !conditions.includes(currentCondition.trim())
    ) {
      const newConditions = [...conditions, currentCondition.trim()];
      setConditions(newConditions);
      setValue("conditions", newConditions, { shouldValidate: true });
      setCurrentCondition("");
    }
  };

  const removeCondition = (index: number) => {
    const newConditions = conditions.filter((_, i) => i !== index);
    setConditions(newConditions);
    setValue("conditions", newConditions, { shouldValidate: true });
  };

  const addSymptom = () => {
    if (currentSymptom.trim() && !symptoms.includes(currentSymptom.trim())) {
      const newSymptoms = [...symptoms, currentSymptom.trim()];
      setSymptoms(newSymptoms);
      setValue("symptoms", newSymptoms, { shouldValidate: true });
      setCurrentSymptom("");
    }
  };

  const removeSymptom = (index: number) => {
    const newSymptoms = symptoms.filter((_, i) => i !== index);
    setSymptoms(newSymptoms);
    setValue("symptoms", newSymptoms, { shouldValidate: true });
  };

  const addTreatment = () => {
    if (
      currentTreatment.trim() &&
      !treatments.includes(currentTreatment.trim())
    ) {
      const newTreatments = [...treatments, currentTreatment.trim()];
      setTreatments(newTreatments);
      setValue("treatments", newTreatments, { shouldValidate: true });
      setCurrentTreatment("");
    }
  };

  const removeTreatment = (index: number) => {
    const newTreatments = treatments.filter((_, i) => i !== index);
    setTreatments(newTreatments);
    setValue("treatments", newTreatments, { shouldValidate: true });
  };

  const onSubmit = async (data: PatientFormData) => {
    setIsSubmitting(true);
    setSubmitError(null);

    try {
      console.log("Submitting patient data:", data);
      console.log("Files to upload:", selectedFiles);

      // Call the actual API
      const response = await patientsAPI.create(data, selectedFiles);

      console.log("Patient created successfully:", response);

      setSubmitSuccess(true);
      handleReset();

      // Reset success message after 5 seconds
      setTimeout(() => setSubmitSuccess(false), 5000);
    } catch (error: any) {
      console.error("Error adding patient:", error);

      // Handle different error types
      if (error.response?.data?.message) {
        setSubmitError(error.response.data.message);
      } else if (error.message) {
        setSubmitError(error.message);
      } else {
        setSubmitError("Failed to create patient. Please try again.");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReset = () => {
    reset();
    setSelectedFiles([]);
    setConditions([]);
    setSymptoms([]);
    setTreatments([]);
    setCurrentCondition("");
    setCurrentSymptom("");
    setCurrentTreatment("");
    setSubmitError(null);
  };

  return (
    <Layout>
      <div className="min-h-screen from-slate-50 to-blue-50 py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          {/* Header Section */}
          <div className="text-center mb-4">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Register New Patient
            </h1>
            <p className="text-lg text-gray-600">
              Create a secure patient record with encrypted data storage
            </p>
          </div>

          {/* Success Alert */}
          {submitSuccess && (
            <div className="mb-6 p-4 bg-emerald-50 border border-emerald-200 rounded-xl">
              <div className="flex items-center">
                <CheckCircle className="w-5 h-5 text-emerald-500" />
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-emerald-800">
                    Patient registered successfully
                  </h3>
                  <p className="text-sm text-emerald-700 mt-1">
                    Patient record and files have been securely stored.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Error Alert */}
          {submitError && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl">
              <div className="flex items-center">
                <AlertCircle className="w-5 h-5 text-red-500" />
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-red-800">
                    Failed to register patient
                  </h3>
                  <p className="text-sm text-red-700 mt-1">{submitError}</p>
                </div>
              </div>
            </div>
          )}

          {/* Main Form Card */}
          <div className="bg-white rounded-2xl shadow-lg border border-gray-200">
            {/* Form Content */}
            <div className="p-6">
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Left Column - Personal Details & Files */}
                  <div className="space-y-6">
                    {/* Personal Details */}
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-4 pb-2 border-b border-gray-200">
                        Personal Details
                      </h3>
                      <div className="space-y-4">
                        <div>
                          <label
                            htmlFor="name"
                            className="block text-sm font-medium text-gray-700 mb-2"
                          >
                            Full Name *
                          </label>
                          <input
                            {...register("name")}
                            type="text"
                            id="name"
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            placeholder="Enter patient's full name"
                          />
                          {errors.name && (
                            <p className="mt-1 text-sm text-red-600 flex items-center">
                              <AlertCircle className="w-4 h-4 mr-1" />
                              {errors.name.message}
                            </p>
                          )}
                        </div>

                        <div>
                          <label
                            htmlFor="dob"
                            className="block text-sm font-medium text-gray-700 mb-2"
                          >
                            Date of Birth *
                          </label>
                          <input
                            {...register("dob")}
                            type="date"
                            id="dob"
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          />
                          {errors.dob && (
                            <p className="mt-1 text-sm text-red-600 flex items-center">
                              <AlertCircle className="w-4 h-4 mr-1" />
                              {errors.dob.message}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Medical Data */}
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-4 pb-2 border-b border-gray-200">
                        Medical Data
                      </h3>
                      <div className="space-y-4">
                        <div>
                          <label
                            htmlFor="encryptedData"
                            className="block text-sm font-medium text-gray-700 mb-2"
                          >
                            Encrypted Medical Data *
                          </label>
                          <textarea
                            {...register("encryptedData")}
                            id="encryptedData"
                            rows={4}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none font-mono text-sm"
                            placeholder="Enter encrypted medical data or clinical notes"
                          />
                          {errors.encryptedData && (
                            <p className="mt-1 text-sm text-red-600 flex items-center">
                              <AlertCircle className="w-4 h-4 mr-1" />
                              {errors.encryptedData.message}
                            </p>
                          )}
                          {encryptedData && (
                            <p className="mt-1 text-xs text-gray-500">
                              {encryptedData.length} characters
                            </p>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* File Upload Section */}
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-4 pb-2 border-b border-gray-200">
                        Medical Documents
                      </h3>
                      <div className="space-y-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Upload Medical Files
                          </label>
                          <div className="flex items-center justify-center w-full">
                            <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100 transition-colors">
                              <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                <Upload className="w-8 h-8 mb-3 text-gray-400" />
                                <p className="mb-2 text-sm text-gray-500">
                                  <span className="font-semibold">
                                    Click to upload
                                  </span>{" "}
                                  or drag and drop
                                </p>
                                <p className="text-xs text-gray-500">
                                  PDF, DOC, DOCX, JPG, PNG (MAX. 10MB each)
                                </p>
                              </div>
                              <input
                                type="file"
                                className="hidden"
                                onChange={handleFileChange}
                                accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                                multiple
                              />
                            </label>
                          </div>

                          {selectedFiles.length > 0 && (
                            <div className="mt-3 space-y-2">
                              {selectedFiles.map((file, index) => (
                                <div
                                  key={index}
                                  className="flex items-center justify-between p-3 bg-blue-50 border border-blue-200 rounded-lg"
                                >
                                  <div className="flex items-center">
                                    <File className="w-5 h-5 text-blue-600 mr-2" />
                                    <span className="text-sm font-medium text-blue-800 truncate max-w-xs">
                                      {file.name}
                                    </span>
                                    <span className="text-xs text-blue-600 ml-2">
                                      ({(file.size / 1024 / 1024).toFixed(2)}{" "}
                                      MB)
                                    </span>
                                  </div>
                                  <button
                                    type="button"
                                    onClick={() => removeFile(index)}
                                    className="text-red-500 hover:text-red-700"
                                  >
                                    <X className="w-4 h-4" />
                                  </button>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Right Column - Medical Information */}
                  <div className="space-y-6">
                    {/* Conditions */}
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-4 pb-2 border-b border-gray-200">
                        <Activity className="w-5 h-5 inline mr-2" />
                        Medical Conditions
                      </h3>
                      <div className="space-y-3">
                        <div className="flex gap-2">
                          <input
                            type="text"
                            value={currentCondition}
                            onChange={(e) =>
                              setCurrentCondition(e.target.value)
                            }
                            className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            placeholder="Add medical condition"
                            onKeyPress={(e) =>
                              e.key === "Enter" &&
                              (e.preventDefault(), addCondition())
                            }
                          />
                          <button
                            type="button"
                            onClick={addCondition}
                            className="px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                          >
                            <Plus className="w-4 h-4" />
                          </button>
                        </div>
                        <div className="flex flex-wrap gap-2">
                          {conditions.map((condition, index) => (
                            <span
                              key={index}
                              className="inline-flex items-center px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm"
                            >
                              {condition}
                              <button
                                type="button"
                                onClick={() => removeCondition(index)}
                                className="ml-2 hover:text-blue-600"
                              >
                                <X className="w-3 h-3" />
                              </button>
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Symptoms */}
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-4 pb-2 border-b border-gray-200">
                        <Stethoscope className="w-5 h-5 inline mr-2" />
                        Symptoms
                      </h3>
                      <div className="space-y-3">
                        <div className="flex gap-2">
                          <input
                            type="text"
                            value={currentSymptom}
                            onChange={(e) => setCurrentSymptom(e.target.value)}
                            className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            placeholder="Add symptom"
                            onKeyPress={(e) =>
                              e.key === "Enter" &&
                              (e.preventDefault(), addSymptom())
                            }
                          />
                          <button
                            type="button"
                            onClick={addSymptom}
                            className="px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                          >
                            <Plus className="w-4 h-4" />
                          </button>
                        </div>
                        <div className="flex flex-wrap gap-2">
                          {symptoms.map((symptom, index) => (
                            <span
                              key={index}
                              className="inline-flex items-center px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm"
                            >
                              {symptom}
                              <button
                                type="button"
                                onClick={() => removeSymptom(index)}
                                className="ml-2 hover:text-green-600"
                              >
                                <X className="w-3 h-3" />
                              </button>
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Treatments */}
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-4 pb-2 border-b border-gray-200">
                        <Pill className="w-5 h-5 inline mr-2" />
                        Treatments
                      </h3>
                      <div className="space-y-3">
                        <div className="flex gap-2">
                          <input
                            type="text"
                            value={currentTreatment}
                            onChange={(e) =>
                              setCurrentTreatment(e.target.value)
                            }
                            className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            placeholder="Add treatment"
                            onKeyPress={(e) =>
                              e.key === "Enter" &&
                              (e.preventDefault(), addTreatment())
                            }
                          />
                          <button
                            type="button"
                            onClick={addTreatment}
                            className="px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                          >
                            <Plus className="w-4 h-4" />
                          </button>
                        </div>
                        <div className="flex flex-wrap gap-2">
                          {treatments.map((treatment, index) => (
                            <span
                              key={index}
                              className="inline-flex items-center px-3 py-1 bg-purple-100 text-purple-800 rounded-full text-sm"
                            >
                              {treatment}
                              <button
                                type="button"
                                onClick={() => removeTreatment(index)}
                                className="ml-2 hover:text-purple-600"
                              >
                                <X className="w-3 h-3" />
                              </button>
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Security Compliance Notice */}
                    <div className="bg-slate-50 border border-slate-200 rounded-lg p-4">
                      <div className="flex items-start">
                        <Shield className="w-5 h-5 text-blue-600 mt-0.5" />
                        <div className="ml-3">
                          <h4 className="text-sm font-semibold text-gray-900">
                            HIPAA Compliant Data Protection
                          </h4>
                          <p className="text-sm text-gray-600 mt-1">
                            All patient information is encrypted using AES-256
                            encryption. Files are securely stored in Google
                            Cloud Storage.
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Form Actions */}
                <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t border-gray-200">
                  <button
                    type="button"
                    onClick={handleReset}
                    disabled={!isDirty || isSubmitting}
                    className="flex-1 px-4 py-2.5 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 disabled:opacity-50"
                  >
                    Discard Changes
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting || !isDirty}
                    className="flex-1 bg-blue-600 text-white py-2.5 px-4 rounded-lg font-medium hover:bg-blue-700 disabled:opacity-50"
                  >
                    {isSubmitting ? (
                      <div className="flex items-center justify-center">
                        <Loader2 className="animate-spin -ml-1 mr-2 h-5 w-5" />
                        Registering Patient...
                      </div>
                    ) : (
                      "Register Patient"
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default AddPatient;
