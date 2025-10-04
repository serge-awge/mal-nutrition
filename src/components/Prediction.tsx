import { useState } from 'react';
import { motion } from 'framer-motion';
import { Send, CheckCircle, AlertTriangle, XCircle } from 'lucide-react';
import { PredictionInput, PredictionResult } from '../types';

interface PredictionProps {
  onPredictionComplete: (result: PredictionResult) => void;
}

export default function Prediction({ onPredictionComplete }: PredictionProps) {
  const [formData, setFormData] = useState<PredictionInput>({
    childAge: 0,
    householdIncome: 0,
    foodInsecurity: 0,
    waterAccess: 0,
    sanitationAccess: 0,
    educationLevel: '',
    region: '',
    householdSize: 0,
  });

  const [result, setResult] = useState<PredictionResult | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    await new Promise((resolve) => setTimeout(resolve, 1500));

    const riskScore =
      formData.childAge * 0.1 +
      (100 - formData.householdIncome) * 0.3 +
      formData.foodInsecurity * 0.4 +
      (100 - formData.waterAccess) * 0.1 +
      (100 - formData.sanitationAccess) * 0.1;

    let riskCategory: 'Low' | 'Medium' | 'High';
    let notes = '';

    if (riskScore < 30) {
      riskCategory = 'Low';
      notes = 'Child shows low risk indicators. Continue monitoring basic health metrics.';
    } else if (riskScore < 60) {
      riskCategory = 'Medium';
      notes = 'Moderate risk detected. Consider intervention programs and regular follow-ups.';
    } else {
      riskCategory = 'High';
      notes =
        'High risk indicators detected. Immediate intervention recommended. Prioritize nutrition and healthcare access.';
    }

    const probability = Math.min(95, Math.max(5, riskScore + Math.random() * 10));
    const confidence = Math.min(98, Math.max(75, 85 + Math.random() * 10));

    const predictionResult: PredictionResult = {
      id: Date.now().toString(),
      childAge: formData.childAge,
      region: formData.region,
      riskCategory,
      probability: Math.round(probability * 10) / 10,
      confidence: Math.round(confidence * 10) / 10,
      notes,
      date: new Date().toISOString(),
      input: formData,
    };

    setResult(predictionResult);
    onPredictionComplete(predictionResult);
    setLoading(false);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === 'educationLevel' || name === 'region' ? value : parseFloat(value) || 0,
    }));
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-800">Health Risk Prediction</h2>
        <p className="text-gray-600 mt-1">Enter child and household information to predict health risk</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="bg-white rounded-xl shadow-md p-6"
        >
          <h3 className="text-lg font-semibold text-gray-800 mb-6">Input Data</h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Child Age (months)
                </label>
                <input
                  type="number"
                  name="childAge"
                  value={formData.childAge || ''}
                  onChange={handleChange}
                  required
                  min="0"
                  max="60"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Household Size
                </label>
                <input
                  type="number"
                  name="householdSize"
                  value={formData.householdSize || ''}
                  onChange={handleChange}
                  required
                  min="1"
                  max="20"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Household Income Score (0-100)
              </label>
              <input
                type="number"
                name="householdIncome"
                value={formData.householdIncome || ''}
                onChange={handleChange}
                required
                min="0"
                max="100"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Food Insecurity Score (0-100)
              </label>
              <input
                type="number"
                name="foodInsecurity"
                value={formData.foodInsecurity || ''}
                onChange={handleChange}
                required
                min="0"
                max="100"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Water Access (0-100)
                </label>
                <input
                  type="number"
                  name="waterAccess"
                  value={formData.waterAccess || ''}
                  onChange={handleChange}
                  required
                  min="0"
                  max="100"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Sanitation Access (0-100)
                </label>
                <input
                  type="number"
                  name="sanitationAccess"
                  value={formData.sanitationAccess || ''}
                  onChange={handleChange}
                  required
                  min="0"
                  max="100"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Parent Education Level
              </label>
              <select
                name="educationLevel"
                value={formData.educationLevel}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">Select education level</option>
                <option value="None">None</option>
                <option value="Primary">Primary</option>
                <option value="Secondary">Secondary</option>
                <option value="Higher">Higher Education</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Region</label>
              <select
                name="region"
                value={formData.region}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">Select region</option>
                <option value="North">North</option>
                <option value="South">South</option>
                <option value="East">East</option>
                <option value="West">West</option>
                <option value="Central">Central</option>
              </select>
            </div>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 text-white py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Processing...
                </>
              ) : (
                <>
                  <Send size={20} />
                  Generate Prediction
                </>
              )}
            </motion.button>
          </form>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="bg-white rounded-xl shadow-md p-6"
        >
          <h3 className="text-lg font-semibold text-gray-800 mb-6">Prediction Result</h3>

          {result ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="space-y-6"
            >
              <div className="text-center">
                {result.riskCategory === 'High' && (
                  <div className="inline-flex items-center justify-center w-20 h-20 bg-red-100 rounded-full mb-4">
                    <XCircle size={40} className="text-red-600" />
                  </div>
                )}
                {result.riskCategory === 'Medium' && (
                  <div className="inline-flex items-center justify-center w-20 h-20 bg-yellow-100 rounded-full mb-4">
                    <AlertTriangle size={40} className="text-yellow-600" />
                  </div>
                )}
                {result.riskCategory === 'Low' && (
                  <div className="inline-flex items-center justify-center w-20 h-20 bg-green-100 rounded-full mb-4">
                    <CheckCircle size={40} className="text-green-600" />
                  </div>
                )}

                <h4 className="text-2xl font-bold text-gray-800 mb-2">
                  {result.riskCategory} Risk
                </h4>
                <p className="text-sm text-gray-600">Prediction ID: {result.id}</p>
              </div>

              <div className="space-y-4">
                <div className="bg-gray-50 rounded-lg p-4">
                  <p className="text-sm text-gray-600 mb-1">Risk Probability</p>
                  <div className="flex items-baseline gap-2">
                    <p className="text-3xl font-bold text-gray-800">{result.probability}%</p>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                    <div
                      className={`h-2 rounded-full ${
                        result.riskCategory === 'High'
                          ? 'bg-red-500'
                          : result.riskCategory === 'Medium'
                          ? 'bg-yellow-500'
                          : 'bg-green-500'
                      }`}
                      style={{ width: `${result.probability}%` }}
                    ></div>
                  </div>
                </div>

                <div className="bg-gray-50 rounded-lg p-4">
                  <p className="text-sm text-gray-600 mb-1">Model Confidence</p>
                  <p className="text-2xl font-bold text-gray-800">{result.confidence}%</p>
                </div>

                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <p className="text-sm font-medium text-blue-800 mb-2">Recommendations</p>
                  <p className="text-sm text-blue-700">{result.notes}</p>
                </div>

                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-gray-600">Child Age</p>
                    <p className="font-semibold text-gray-800">{result.childAge} months</p>
                  </div>
                  <div>
                    <p className="text-gray-600">Region</p>
                    <p className="font-semibold text-gray-800">{result.region}</p>
                  </div>
                </div>
              </div>
            </motion.div>
          ) : (
            <div className="flex items-center justify-center h-96 text-gray-400">
              <div className="text-center">
                <Send size={48} className="mx-auto mb-4 opacity-50" />
                <p>Submit the form to generate a prediction</p>
              </div>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
}
