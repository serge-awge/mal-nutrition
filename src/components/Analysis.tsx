import { motion } from 'framer-motion';
import {
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import { PredictionResult } from '../types';

interface AnalysisProps {
  predictions: PredictionResult[];
}

const COLORS = {
  High: '#EF4444',
  Medium: '#F59E0B',
  Low: '#10B981',
};

export default function Analysis({ predictions }: AnalysisProps) {
  const riskCategoryData = [
    {
      name: 'High',
      value: predictions.filter((p) => p.riskCategory === 'High').length,
    },
    {
      name: 'Medium',
      value: predictions.filter((p) => p.riskCategory === 'Medium').length,
    },
    {
      name: 'Low',
      value: predictions.filter((p) => p.riskCategory === 'Low').length,
    },
  ].filter((item) => item.value > 0);

  const regionData = predictions.reduce((acc, pred) => {
    const existing = acc.find((item) => item.name === pred.region);
    if (existing) {
      existing.High += pred.riskCategory === 'High' ? 1 : 0;
      existing.Medium += pred.riskCategory === 'Medium' ? 1 : 0;
      existing.Low += pred.riskCategory === 'Low' ? 1 : 0;
    } else {
      acc.push({
        name: pred.region,
        High: pred.riskCategory === 'High' ? 1 : 0,
        Medium: pred.riskCategory === 'Medium' ? 1 : 0,
        Low: pred.riskCategory === 'Low' ? 1 : 0,
      });
    }
    return acc;
  }, [] as { name: string; High: number; Medium: number; Low: number }[]);

  const timelineData = predictions
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
    .reduce((acc, pred) => {
      const date = new Date(pred.date).toLocaleDateString();
      const existing = acc.find((item) => item.date === date);
      if (existing) {
        existing.predictions += 1;
      } else {
        acc.push({ date, predictions: 1 });
      }
      return acc;
    }, [] as { date: string; predictions: number }[]);

  const educationData = predictions.reduce((acc, pred) => {
    const existing = acc.find((item) => item.name === pred.input.educationLevel);
    if (existing) {
      existing.High += pred.riskCategory === 'High' ? 1 : 0;
      existing.Medium += pred.riskCategory === 'Medium' ? 1 : 0;
      existing.Low += pred.riskCategory === 'Low' ? 1 : 0;
    } else {
      acc.push({
        name: pred.input.educationLevel,
        High: pred.riskCategory === 'High' ? 1 : 0,
        Medium: pred.riskCategory === 'Medium' ? 1 : 0,
        Low: pred.riskCategory === 'Low' ? 1 : 0,
      });
    }
    return acc;
  }, [] as { name: string; High: number; Medium: number; Low: number }[]);

  if (predictions.length === 0) {
    return (
      <div className="space-y-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Data Analysis</h2>
          <p className="text-gray-600 mt-1">Visualize prediction trends and patterns</p>
        </div>

        <div className="bg-white rounded-xl shadow-md p-12 text-center">
          <div className="max-w-md mx-auto">
            <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <BarChart size={40} className="text-gray-400" />
            </div>
            <h3 className="text-xl font-semibold text-gray-800 mb-2">No Data Available</h3>
            <p className="text-gray-600">
              Create predictions to see visualizations and analysis of your data.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-800">Data Analysis</h2>
        <p className="text-gray-600 mt-1">
          Visualize prediction trends and patterns across {predictions.length} predictions
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-xl shadow-md p-6"
        >
          <h3 className="text-lg font-semibold text-gray-800 mb-4">
            Risk Category Distribution
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={riskCategoryData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                outerRadius={100}
                fill="#8884d8"
                dataKey="value"
              >
                {riskCategoryData.map((entry) => (
                  <Cell key={`cell-${entry.name}`} fill={COLORS[entry.name as keyof typeof COLORS]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-xl shadow-md p-6"
        >
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Predictions Over Time</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={timelineData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
              <XAxis dataKey="date" stroke="#6B7280" style={{ fontSize: '12px' }} />
              <YAxis stroke="#6B7280" style={{ fontSize: '12px' }} />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#fff',
                  border: '1px solid #E5E7EB',
                  borderRadius: '8px',
                }}
              />
              <Line
                type="monotone"
                dataKey="predictions"
                stroke="#3B82F6"
                strokeWidth={2}
                dot={{ fill: '#3B82F6', r: 4 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white rounded-xl shadow-md p-6"
        >
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Risk by Region</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={regionData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
              <XAxis dataKey="name" stroke="#6B7280" style={{ fontSize: '12px' }} />
              <YAxis stroke="#6B7280" style={{ fontSize: '12px' }} />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#fff',
                  border: '1px solid #E5E7EB',
                  borderRadius: '8px',
                }}
              />
              <Legend />
              <Bar dataKey="High" fill="#EF4444" />
              <Bar dataKey="Medium" fill="#F59E0B" />
              <Bar dataKey="Low" fill="#10B981" />
            </BarChart>
          </ResponsiveContainer>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-white rounded-xl shadow-md p-6"
        >
          <h3 className="text-lg font-semibold text-gray-800 mb-4">
            Education Level vs Risk
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={educationData} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
              <XAxis type="number" stroke="#6B7280" style={{ fontSize: '12px' }} />
              <YAxis dataKey="name" type="category" stroke="#6B7280" style={{ fontSize: '12px' }} />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#fff',
                  border: '1px solid #E5E7EB',
                  borderRadius: '8px',
                }}
              />
              <Legend />
              <Bar dataKey="High" stackId="a" fill="#EF4444" />
              <Bar dataKey="Medium" stackId="a" fill="#F59E0B" />
              <Bar dataKey="Low" stackId="a" fill="#10B981" />
            </BarChart>
          </ResponsiveContainer>
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="bg-white rounded-xl shadow-md p-6"
      >
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Key Insights</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <p className="text-sm text-blue-600 font-medium mb-1">Most Common Risk</p>
            <p className="text-2xl font-bold text-blue-800">
              {riskCategoryData.sort((a, b) => b.value - a.value)[0]?.name || 'N/A'}
            </p>
          </div>
          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <p className="text-sm text-green-600 font-medium mb-1">Average Probability</p>
            <p className="text-2xl font-bold text-green-800">
              {predictions.length > 0
                ? (
                    predictions.reduce((sum, p) => sum + p.probability, 0) / predictions.length
                  ).toFixed(1)
                : 0}
              %
            </p>
          </div>
          <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
            <p className="text-sm text-purple-600 font-medium mb-1">Most Affected Region</p>
            <p className="text-2xl font-bold text-purple-800">
              {regionData.sort((a, b) => b.High + b.Medium + b.Low - (a.High + a.Medium + a.Low))[0]
                ?.name || 'N/A'}
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
