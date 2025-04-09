import { useEffect, useState } from 'react';
import { StyleSheet, View, Text, ScrollView, Dimensions, ActivityIndicator } from 'react-native';
import { LineChart } from 'react-native-chart-kit';
import { Battery, Zap, TriangleAlert as AlertTriangle, CircleCheck as CheckCircle } from 'lucide-react-native';

interface BatteryData {
  timestamp: number;
  voltage: number;
  temperature: number;
  cycleCount: number;
  healthScore: number;
}

const generateHistoricalData = (): BatteryData[] => {
  const data: BatteryData[] = [];
  const now = Date.now();
  const dayInMs = 24 * 60 * 60 * 1000;

  for (let i = 30; i >= 0; i--) {
    const timestamp = now - (i * dayInMs);
    const baseVoltage = 3.7;
    const baseTemp = 25;
    const noise = Math.random() * 0.2 - 0.1;

    data.push({
      timestamp,
      voltage: baseVoltage + noise,
      temperature: baseTemp + (Math.random() * 10 - 5),
      cycleCount: Math.floor(100 + (30 - i) * 2),
      healthScore: Math.max(0, Math.min(100, 95 - (i * 0.3) + (Math.random() * 5 - 2.5)))
    });
  }

  return data;
};

const predictHealthScores = (data: BatteryData[]): number[] => {
  const n = data.length;
  const x = Array.from({ length: n }, (_, i) => i);
  const y = data.map(d => d.healthScore);

  const meanX = x.reduce((a, b) => a + b, 0) / n;
  const meanY = y.reduce((a, b) => a + b, 0) / n;

  let numerator = 0;
  let denominator = 0;
  for (let i = 0; i < n; i++) {
    numerator += (x[i] - meanX) * (y[i] - meanY);
    denominator += Math.pow(x[i] - meanX, 2);
  }
  const slope = numerator / denominator;
  const intercept = meanY - slope * meanX;

  return Array.from({ length: 7 }, (_, i) => {
    const predictedValue = slope * (n + i) + intercept;
    return Math.max(0, Math.min(100, predictedValue));
  });
};

export default function BatteryAIScreen() {
  const [isLoading, setIsLoading] = useState(true);
  const [batteryData, setBatteryData] = useState<BatteryData[]>([]);
  const [predictions, setPredictions] = useState<number[]>([]);
  const [healthStatus, setHealthStatus] = useState<string>('');
  const [recommendations, setRecommendations] = useState<string[]>([]);

  useEffect(() => {
    const initializeAnalysis = () => {
      try {
        const historicalData = generateHistoricalData();
        setBatteryData(historicalData);

        const predictedValues = predictHealthScores(historicalData);
        setPredictions(predictedValues);

        const currentHealth = historicalData[historicalData.length - 1].healthScore;
        if (currentHealth > 90) {
          setHealthStatus('Excellent');
        } else if (currentHealth > 80) {
          setHealthStatus('Good');
        } else if (currentHealth > 70) {
          setHealthStatus('Fair');
        } else {
          setHealthStatus('Poor');
        }

        const newRecommendations = [];
        if (currentHealth < 85) {
          newRecommendations.push('Consider reducing fast charging frequency');
        }
        if (Math.max(...historicalData.map(d => d.temperature)) > 35) {
          newRecommendations.push('Avoid charging in high-temperature conditions');
        }
        if (historicalData[historicalData.length - 1].cycleCount > 500) {
          newRecommendations.push('Schedule a battery health check');
        }
        setRecommendations(newRecommendations);

        setIsLoading(false);
      } catch (error) {
        console.error('Error initializing analysis:', error);
        setIsLoading(false);
      }
    };

    initializeAnalysis();
  }, []);

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#8B5CF6" />
        <Text style={styles.loadingText}>Analyzing battery data...</Text>
      </View>
    );
  }

  const healthScoreData = {
    labels: ['25d', '20d', '15d', '10d', '5d', 'Now'],
    datasets: [{
      data: batteryData.filter((_, i) => i % 5 === 0).map(d => d.healthScore)
    }]
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Battery size={24} color="#8B5CF6" />
        <Text style={styles.headerTitle}>Battery Health Analysis</Text>
      </View>

      <View style={styles.statusCard}>
        <Text style={styles.statusTitle}>Current Health Status</Text>
        <View style={styles.statusContent}>
          {healthStatus === 'Excellent' && <CheckCircle size={32} color="#22C55E" />}
          {healthStatus === 'Good' && <CheckCircle size={32} color="#3B82F6" />}
          {healthStatus === 'Fair' && <AlertTriangle size={32} color="#F59E0B" />}
          {healthStatus === 'Poor' && <AlertTriangle size={32} color="#EF4444" />}
          <Text style={[
            styles.statusText,
            healthStatus === 'Excellent' && styles.statusExcellent,
            healthStatus === 'Good' && styles.statusGood,
            healthStatus === 'Fair' && styles.statusFair,
            healthStatus === 'Poor' && styles.statusPoor,
          ]}>{healthStatus}</Text>
        </View>
      </View>

      <View style={styles.chartContainer}>
        <Text style={styles.chartTitle}>Health Score Trend</Text>
        <LineChart
          data={healthScoreData}
          width={Dimensions.get('window').width - 40}
          height={220}
          chartConfig={{
            backgroundColor: '#ffffff',
            backgroundGradientFrom: '#ffffff',
            backgroundGradientTo: '#ffffff',
            decimalPlaces: 0,
            color: (opacity = 1) => `rgba(139, 92, 246, ${opacity})`,
            style: {
              borderRadius: 16,
            },
          }}
          bezier
          style={styles.chart}
        />
      </View>

      <View style={styles.predictionsCard}>
        <View style={styles.cardHeader}>
          <Zap size={24} color="#8B5CF6" />
          <Text style={styles.cardTitle}>AI Predictions</Text>
        </View>
        <Text style={styles.predictionText}>
          Based on your usage patterns, your battery health is predicted to be{' '}
          <Text style={styles.highlightText}>
            {predictions[predictions.length - 1]?.toFixed(1)}%
          </Text>{' '}
          in 7 days.
        </Text>
      </View>

      <View style={styles.recommendationsCard}>
        <Text style={styles.recommendationsTitle}>Smart Recommendations</Text>
        {recommendations.map((recommendation, index) => (
          <View key={index} style={styles.recommendationItem}>
            <CheckCircle size={20} color="#22C55E" />
            <Text style={styles.recommendationText}>{recommendation}</Text>
          </View>
        ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: '#8B5CF6',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#F9FAFB',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginLeft: 10,
    color: '#1F2937',
  },
  statusCard: {
    margin: 20,
    padding: 20,
    backgroundColor: '#fff',
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  statusTitle: {
    fontSize: 16,
    color: '#6B7280',
    marginBottom: 10,
  },
  statusContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statusText: {
    fontSize: 24,
    fontWeight: 'bold',
    marginLeft: 10,
  },
  statusExcellent: { color: '#22C55E' },
  statusGood: { color: '#3B82F6' },
  statusFair: { color: '#F59E0B' },
  statusPoor: { color: '#EF4444' },
  chartContainer: {
    margin: 20,
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  chartTitle: {
    fontSize: 16,
    color: '#6B7280',
    marginBottom: 10,
  },
  chart: {
    marginVertical: 8,
    borderRadius: 16,
  },
  predictionsCard: {
    margin: 20,
    padding: 20,
    backgroundColor: '#F9FAFB',
    borderRadius: 16,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginLeft: 10,
    color: '#1F2937',
  },
  predictionText: {
    fontSize: 16,
    color: '#4B5563',
    lineHeight: 24,
  },
  highlightText: {
    color: '#8B5CF6',
    fontWeight: 'bold',
  },
  recommendationsCard: {
    margin: 20,
    padding: 20,
    backgroundColor: '#fff',
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  recommendationsTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 15,
  },
  recommendationItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  recommendationText: {
    marginLeft: 10,
    fontSize: 14,
    color: '#4B5563',
  },
});