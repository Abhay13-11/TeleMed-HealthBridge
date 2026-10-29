import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { ScrollArea } from '@/components/ui/scroll-area';
import { 
  Brain, 
  Thermometer, 
  Activity,
  AlertCircle,
  CheckCircle,
  Info,
  Calendar,
  Pill,
  Stethoscope,
  ChevronRight,
  Loader2
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface SymptomAnalysis {
  possibleConditions: {
    name: string;
    probability: number;
    severity: 'low' | 'medium' | 'high' | 'critical';
    description: string;
  }[];
  recommendations: string[];
  urgency: 'routine' | 'soon' | 'urgent' | 'emergency';
  suggestedSpecialist: string;
  homeRemedies: string[];
  medicines: string[];
  tests: string[];
}

interface SymptomCheckerProps {
  onBookAppointment?: () => void;
}

export const SymptomChecker: React.FC<SymptomCheckerProps> = ({ onBookAppointment }) => {
  const { toast } = useToast();
  const [symptoms, setSymptoms] = useState({
    fever: false,
    cough: false,
    headache: false,
    bodyPain: false,
    nausea: false,
    fatigue: false,
    breathingDifficulty: false,
    chestPain: false,
    soreThroat: false,
    runnyNose: false,
    diarrhea: false,
    vomiting: false,
    rash: false,
    dizziness: false,
    other: ''
  });
  
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysis, setAnalysis] = useState<SymptomAnalysis | null>(null);
  const [symptomDuration, setSymptomDuration] = useState('');
  const [symptomSeverity, setSymptomSeverity] = useState<'mild' | 'moderate' | 'severe'>('mild');

  const analyzeSymptoms = async () => {
    const selectedSymptoms = Object.entries(symptoms)
      .filter(([key, value]) => key !== 'other' && value)
      .map(([key]) => key);
    
    if (selectedSymptoms.length === 0 && !symptoms.other.trim()) {
      toast({
        title: "No Symptoms Selected",
        description: "Please select at least one symptom or describe your condition.",
        variant: "destructive"
      });
      return;
    }

    setIsAnalyzing(true);

    // Simulate AI analysis with realistic delay
    setTimeout(() => {
      const result = generateDiagnosis(selectedSymptoms, symptoms.other, symptomSeverity);
      setAnalysis(result);
      setIsAnalyzing(false);
      
      if (result.urgency === 'emergency') {
        toast({
          title: "⚠️ Emergency Attention Required",
          description: "Based on your symptoms, immediate medical attention is recommended.",
          variant: "destructive"
        });
      }
    }, 2000);
  };

  const generateDiagnosis = (
    selectedSymptoms: string[], 
    otherSymptoms: string,
    severity: 'mild' | 'moderate' | 'severe'
  ): SymptomAnalysis => {
    // AI-like diagnosis logic based on symptom combinations
    const analysis: SymptomAnalysis = {
      possibleConditions: [],
      recommendations: [],
      urgency: 'routine',
      suggestedSpecialist: 'General Physician',
      homeRemedies: [],
      medicines: [],
      tests: []
    };

    // Check for emergency symptoms
    if (selectedSymptoms.includes('chestPain') || selectedSymptoms.includes('breathingDifficulty')) {
      analysis.urgency = 'emergency';
      analysis.possibleConditions.push({
        name: 'Cardiac Emergency',
        probability: 85,
        severity: 'critical',
        description: 'Chest pain with breathing difficulty requires immediate medical attention'
      });
      analysis.recommendations = [
        'Call National Emergency 112 or Medical Ambulance 108 immediately',
        'Do not drive yourself to the hospital',
        'Take aspirin if available and not allergic',
        'Stay calm and sit upright'
      ];
      analysis.suggestedSpecialist = 'Cardiologist';
      return analysis;
    }

    // Common cold/flu pattern
    if (selectedSymptoms.includes('fever') && selectedSymptoms.includes('cough')) {
      if (selectedSymptoms.includes('runnyNose') || selectedSymptoms.includes('soreThroat')) {
        analysis.possibleConditions.push({
          name: 'Common Cold',
          probability: 70,
          severity: 'low',
          description: 'Viral infection of the upper respiratory tract'
        });
        analysis.possibleConditions.push({
          name: 'Influenza (Flu)',
          probability: 60,
          severity: 'medium',
          description: 'More severe viral infection that may require antiviral medication'
        });
      }
      
      if (selectedSymptoms.includes('bodyPain') && selectedSymptoms.includes('fatigue')) {
        analysis.possibleConditions.push({
          name: 'Viral Fever',
          probability: 75,
          severity: 'medium',
          description: 'General viral infection causing systemic symptoms'
        });
      }

      analysis.homeRemedies = [
        'Rest and get plenty of sleep',
        'Drink warm fluids (tea, soup, warm water)',
        'Gargle with warm salt water for sore throat',
        'Use a humidifier or breathe steam',
        'Take vitamin C supplements'
      ];
      
      analysis.medicines = [
        'Paracetamol 500mg for fever (every 6 hours)',
        'Cetirizine 10mg for runny nose (once daily)',
        'Throat lozenges for sore throat',
        'Cough syrup (as directed)'
      ];
      
      analysis.tests = ['Complete Blood Count (CBC)', 'COVID-19 RT-PCR test if symptoms persist'];
    }

    // Gastric issues
    if (selectedSymptoms.includes('nausea') || selectedSymptoms.includes('vomiting') || selectedSymptoms.includes('diarrhea')) {
      analysis.possibleConditions.push({
        name: 'Gastroenteritis',
        probability: 80,
        severity: 'medium',
        description: 'Inflammation of the stomach and intestines, often due to infection or food poisoning'
      });
      
      analysis.possibleConditions.push({
        name: 'Food Poisoning',
        probability: 65,
        severity: 'medium',
        description: 'Illness caused by consuming contaminated food or water'
      });
      
      analysis.homeRemedies = [
        'Stay hydrated with ORS solution',
        'Eat bland foods (BRAT diet: Bananas, Rice, Applesauce, Toast)',
        'Avoid dairy products',
        'Rest and avoid solid foods initially',
        'Ginger tea for nausea'
      ];
      
      analysis.medicines = [
        'ORS packets for rehydration',
        'Ondansetron 4mg for severe nausea',
        'Probiotics for gut health',
        'Loperamide for diarrhea (if no fever)'
      ];
      
      analysis.tests = ['Stool test', 'Electrolyte panel if dehydration suspected'];
      analysis.urgency = severity === 'severe' ? 'urgent' : 'soon';
    }

    // Headache patterns
    if (selectedSymptoms.includes('headache')) {
      if (selectedSymptoms.includes('nausea') || selectedSymptoms.includes('dizziness')) {
        analysis.possibleConditions.push({
          name: 'Migraine',
          probability: 70,
          severity: 'medium',
          description: 'Severe headache often accompanied by nausea and sensitivity to light'
        });
      } else {
        analysis.possibleConditions.push({
          name: 'Tension Headache',
          probability: 80,
          severity: 'low',
          description: 'Common headache caused by stress, poor posture, or eye strain'
        });
      }
      
      analysis.homeRemedies = [
        'Rest in a dark, quiet room',
        'Apply cold compress to head',
        'Practice relaxation techniques',
        'Maintain good posture',
        'Stay hydrated'
      ];
      
      analysis.medicines = [
        'Ibuprofen 400mg or Paracetamol 500mg',
        'Aspirin 325mg for migraine',
        'Sumatriptan for severe migraine (prescription required)'
      ];
    }

    // Skin issues
    if (selectedSymptoms.includes('rash')) {
      analysis.possibleConditions.push({
        name: 'Allergic Reaction',
        probability: 60,
        severity: 'medium',
        description: 'Skin reaction to allergens, medications, or irritants'
      });
      
      analysis.possibleConditions.push({
        name: 'Dermatitis',
        probability: 50,
        severity: 'low',
        description: 'Skin inflammation causing redness and itching'
      });
      
      analysis.medicines = [
        'Cetirizine 10mg for itching',
        'Calamine lotion for topical relief',
        'Hydrocortisone cream 1% for inflammation'
      ];
      
      analysis.suggestedSpecialist = 'Dermatologist';
    }

    // Set urgency based on severity and symptom count
    if (severity === 'severe' || selectedSymptoms.length > 5) {
      analysis.urgency = 'urgent';
    } else if (severity === 'moderate' || selectedSymptoms.length > 3) {
      analysis.urgency = 'soon';
    }

    // General recommendations
    analysis.recommendations = [
      'Monitor your symptoms closely',
      'Maintain a symptom diary',
      'Stay hydrated and get adequate rest',
      'Avoid self-medication without consultation',
      selectedSymptoms.length > 3 ? 'Book a doctor consultation within 24-48 hours' : 'Consider teleconsultation if symptoms persist'
    ];

    // If no specific conditions matched, provide general assessment
    if (analysis.possibleConditions.length === 0) {
      analysis.possibleConditions.push({
        name: 'General Malaise',
        probability: 50,
        severity: 'low',
        description: 'Non-specific symptoms that may require further evaluation'
      });
    }

    return analysis;
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'low': return 'text-green-600';
      case 'medium': return 'text-yellow-600';
      case 'high': return 'text-orange-600';
      case 'critical': return 'text-red-600';
      default: return 'text-gray-600';
    }
  };

  const getUrgencyBadge = (urgency: string) => {
    switch (urgency) {
      case 'emergency': return <Badge variant="destructive" className="animate-pulse">Emergency</Badge>;
      case 'urgent': return <Badge variant="destructive">Urgent</Badge>;
      case 'soon': return <Badge variant="default">Soon</Badge>;
      case 'routine': return <Badge variant="secondary">Routine</Badge>;
      default: return null;
    }
  };

  const resetAnalysis = () => {
    setAnalysis(null);
    setSymptoms({
      fever: false,
      cough: false,
      headache: false,
      bodyPain: false,
      nausea: false,
      fatigue: false,
      breathingDifficulty: false,
      chestPain: false,
      soreThroat: false,
      runnyNose: false,
      diarrhea: false,
      vomiting: false,
      rash: false,
      dizziness: false,
      other: ''
    });
    setSymptomDuration('');
    setSymptomSeverity('mild');
  };

  return (
    <div className="space-y-4">
      {!analysis ? (
        <>
          <Card className="shadow-card">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Brain className="h-5 w-5 text-primary" />
                <span>AI Symptom Checker</span>
              </CardTitle>
              <CardDescription>
                Select your symptoms and get AI-powered health insights
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <label className="text-sm font-medium">Common Symptoms</label>
                <div className="grid md:grid-cols-3 gap-3">
                  {Object.entries(symptoms).filter(([key]) => key !== 'other').map(([symptom, checked]) => (
                    <label key={symptom} className="flex items-center space-x-2 cursor-pointer p-2 rounded hover:bg-muted">
                      <input
                        type="checkbox"
                        checked={checked as boolean}
                        onChange={(e) => setSymptoms(prev => ({ ...prev, [symptom]: e.target.checked }))}
                        className="rounded border-border text-primary focus:ring-primary"
                      />
                      <span className="text-sm capitalize">
                        {symptom.replace(/([A-Z])/g, ' $1').trim()}
                      </span>
                    </label>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Symptom Duration</label>
                <select
                  value={symptomDuration}
                  onChange={(e) => setSymptomDuration(e.target.value)}
                  className="w-full rounded-md border border-input bg-background px-3 py-2"
                >
                  <option value="">Select duration</option>
                  <option value="today">Started today</option>
                  <option value="2-3days">2-3 days</option>
                  <option value="week">About a week</option>
                  <option value="2weeks">More than 2 weeks</option>
                  <option value="month">More than a month</option>
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Symptom Severity</label>
                <div className="flex space-x-2">
                  {(['mild', 'moderate', 'severe'] as const).map(level => (
                    <Button
                      key={level}
                      variant={symptomSeverity === level ? 'medical' : 'outline'}
                      size="sm"
                      onClick={() => setSymptomSeverity(level)}
                      className="flex-1 capitalize"
                    >
                      {level}
                    </Button>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Additional Symptoms or Details</label>
                <Textarea
                  placeholder="Describe any other symptoms or provide more details..."
                  value={symptoms.other}
                  onChange={(e) => setSymptoms(prev => ({ ...prev, other: e.target.value }))}
                  rows={3}
                />
              </div>

              <Button 
                onClick={analyzeSymptoms} 
                variant="medical" 
                className="w-full"
                disabled={isAnalyzing}
              >
                {isAnalyzing ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Analyzing Symptoms...
                  </>
                ) : (
                  <>
                    <Brain className="h-4 w-4 mr-2" />
                    Get AI Analysis
                  </>
                )}
              </Button>
            </CardContent>
          </Card>
        </>
      ) : (
        <>
          <Card className="shadow-card">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center space-x-2">
                  <Stethoscope className="h-5 w-5 text-primary" />
                  <span>AI Health Analysis</span>
                </CardTitle>
                {getUrgencyBadge(analysis.urgency)}
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Possible Conditions */}
              <div className="space-y-3">
                <h3 className="font-semibold">Possible Conditions</h3>
                {analysis.possibleConditions.map((condition, index) => (
                  <div key={index} className="border rounded-lg p-3 space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <span className="font-medium">{condition.name}</span>
                        <Badge variant="outline" className={getSeverityColor(condition.severity)}>
                          {condition.severity}
                        </Badge>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Progress value={condition.probability} className="w-20" />
                        <span className="text-sm font-medium">{condition.probability}%</span>
                      </div>
                    </div>
                    <p className="text-sm text-muted-foreground">{condition.description}</p>
                  </div>
                ))}
              </div>

              {/* Recommendations */}
              <Alert>
                <Info className="h-4 w-4" />
                <AlertTitle>Recommendations</AlertTitle>
                <AlertDescription>
                  <ul className="list-disc list-inside space-y-1 mt-2">
                    {analysis.recommendations.map((rec, index) => (
                      <li key={index} className="text-sm">{rec}</li>
                    ))}
                  </ul>
                </AlertDescription>
              </Alert>

              {/* Home Remedies */}
              {analysis.homeRemedies.length > 0 && (
                <div className="space-y-2">
                  <h3 className="font-semibold flex items-center space-x-2">
                    <Activity className="h-4 w-4 text-green-600" />
                    <span>Home Remedies</span>
                  </h3>
                  <div className="bg-muted p-3 rounded-lg">
                    <ul className="list-disc list-inside space-y-1">
                      {analysis.homeRemedies.map((remedy, index) => (
                        <li key={index} className="text-sm">{remedy}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              )}

              {/* Suggested Medicines */}
              {analysis.medicines.length > 0 && (
                <div className="space-y-2">
                  <h3 className="font-semibold flex items-center space-x-2">
                    <Pill className="h-4 w-4 text-blue-600" />
                    <span>Suggested Medicines</span>
                  </h3>
                  <Alert className="border-blue-200 bg-blue-50">
                    <AlertCircle className="h-4 w-4 text-blue-600" />
                    <AlertDescription>
                      <p className="text-sm font-medium text-blue-800 mb-2">
                        Consult a doctor before taking any medication
                      </p>
                      <ul className="list-disc list-inside space-y-1">
                        {analysis.medicines.map((medicine, index) => (
                          <li key={index} className="text-sm">{medicine}</li>
                        ))}
                      </ul>
                    </AlertDescription>
                  </Alert>
                </div>
              )}

              {/* Recommended Tests */}
              {analysis.tests.length > 0 && (
                <div className="space-y-2">
                  <h3 className="font-semibold">Recommended Tests</h3>
                  <div className="flex flex-wrap gap-2">
                    {analysis.tests.map((test, index) => (
                      <Badge key={index} variant="secondary">{test}</Badge>
                    ))}
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex space-x-2 pt-4">
                <Button 
                  variant="medical" 
                  className="flex-1"
                  onClick={onBookAppointment}
                >
                  <Calendar className="h-4 w-4 mr-2" />
                  Book Appointment with {analysis.suggestedSpecialist}
                </Button>
                <Button 
                  variant="outline"
                  onClick={resetAnalysis}
                >
                  New Analysis
                </Button>
              </div>
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );
};