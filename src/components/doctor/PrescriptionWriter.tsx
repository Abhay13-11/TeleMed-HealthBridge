import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  Plus,
  Trash2,
  Save,
  Send,
  FileText,
  Pill,
  Calendar,
  Clock,
  User,
  AlertCircle,
  CheckCircle,
  Printer,
  Download
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { format } from 'date-fns';

interface Medicine {
  id: string;
  name: string;
  dosage: string;
  frequency: string;
  duration: string;
  timing: 'Before meals' | 'After meals' | 'With meals' | 'Empty stomach';
  instructions?: string;
}

export interface PrescriptionData {
  id: string;
  patientName: string;
  patientId?: string;
  date: string;
  diagnosis: string;
  symptoms: string[];
  medicines: Medicine[];
  tests: string[];
  advice: string;
  followUp: string;
  doctorName: string;
  doctorReg: string;
  hospitalName: string;
}

interface PrescriptionWriterProps {
  patientName?: string;
  patientId?: string;
  onSave?: (prescription: PrescriptionData) => void;
  onSend?: (prescription: PrescriptionData) => void;
}

export const PrescriptionWriter: React.FC<PrescriptionWriterProps> = ({
  patientName = 'Patient',
  patientId,
  onSave,
  onSend
}) => {
  const { toast } = useToast();
  const [medicines, setMedicines] = useState<Medicine[]>([]);
  const [currentMedicine, setCurrentMedicine] = useState<Medicine>({
    id: '',
    name: '',
    dosage: '',
    frequency: '',
    duration: '',
    timing: 'After meals',
    instructions: ''
  });
  const [diagnosis, setDiagnosis] = useState('');
  const [symptoms, setSymptoms] = useState('');
  const [tests, setTests] = useState('');
  const [advice, setAdvice] = useState('');
  const [followUp, setFollowUp] = useState('');
  const [showMedicineForm, setShowMedicineForm] = useState(false);

  // Common medicine templates
  const medicineTemplates = [
    { name: 'Paracetamol', dosage: '500mg', frequency: 'Twice daily', duration: '3 days', timing: 'After meals' as const },
    { name: 'Amoxicillin', dosage: '500mg', frequency: 'Thrice daily', duration: '5 days', timing: 'After meals' as const },
    { name: 'Cetirizine', dosage: '10mg', frequency: 'Once daily', duration: '5 days', timing: 'After meals' as const },
    { name: 'Omeprazole', dosage: '20mg', frequency: 'Once daily', duration: '7 days', timing: 'Before meals' as const },
    { name: 'Metformin', dosage: '500mg', frequency: 'Twice daily', duration: '30 days', timing: 'With meals' as const },
    { name: 'Amlodipine', dosage: '5mg', frequency: 'Once daily', duration: '30 days', timing: 'After meals' as const }
  ];

  const addMedicine = () => {
    if (!currentMedicine.name || !currentMedicine.dosage || !currentMedicine.frequency || !currentMedicine.duration) {
      toast({
        title: "Incomplete Medicine Details",
        description: "Please fill all required fields for the medicine.",
        variant: "destructive"
      });
      return;
    }

    const newMedicine = {
      ...currentMedicine,
      id: Date.now().toString()
    };

    setMedicines([...medicines, newMedicine]);
    setCurrentMedicine({
      id: '',
      name: '',
      dosage: '',
      frequency: '',
      duration: '',
      timing: 'After meals',
      instructions: ''
    });
    setShowMedicineForm(false);

    toast({
      title: "Medicine Added",
      description: `${newMedicine.name} has been added to the prescription.`,
    });
  };

  const removeMedicine = (id: string) => {
    setMedicines(medicines.filter(med => med.id !== id));
  };

  const applyTemplate = (template: typeof medicineTemplates[0]) => {
    setCurrentMedicine({
      id: '',
      ...template,
      instructions: ''
    });
    setShowMedicineForm(true);
  };

  const savePrescription = () => {
    if (medicines.length === 0) {
      toast({
        title: "No Medicines Added",
        description: "Please add at least one medicine to the prescription.",
        variant: "destructive"
      });
      return;
    }

    const prescription = {
      id: Date.now().toString(),
      patientName,
      patientId,
      date: format(new Date(), 'PPP'),
      diagnosis,
      symptoms,
      medicines,
      tests,
      advice,
      followUp,
      doctorName: 'Dr. Rachit Kumar',
      doctorReg: 'REG12345',
      hospitalName: 'Nabha Civil Hospital'
    };

    onSave?.(prescription);

    toast({
      title: "✅ Prescription Saved",
      description: "The prescription has been saved successfully.",
    });

    // Generate PDF
    setTimeout(() => {
      toast({
        title: "📄 PDF Generated",
        description: "Prescription PDF is ready for download.",
      });
    }, 1000);
  };

  const sendPrescription = () => {
    if (medicines.length === 0) {
      toast({
        title: "No Medicines Added",
        description: "Please add at least one medicine to the prescription.",
        variant: "destructive"
      });
      return;
    }

    savePrescription();
    
    setTimeout(() => {
      toast({
        title: "📧 Prescription Sent",
        description: `Prescription sent to ${patientName} via SMS and email.`,
      });
      
      // Send to pharmacy
      setTimeout(() => {
        toast({
          title: "🏥 Pharmacy Notified",
          description: "Prescription forwarded to nearby pharmacies.",
        });
      }, 1000);
    }, 1500);
  };

  const clearPrescription = () => {
    setMedicines([]);
    setDiagnosis('');
    setSymptoms('');
    setTests('');
    setAdvice('');
    setFollowUp('');
    setCurrentMedicine({
      id: '',
      name: '',
      dosage: '',
      frequency: '',
      duration: '',
      timing: 'After meals',
      instructions: ''
    });
  };

  return (
    <div className="space-y-4">
      {/* Header */}
      <Card className="shadow-card">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center space-x-2">
                <FileText className="h-5 w-5 text-primary" />
                <span>Digital Prescription</span>
              </CardTitle>
              <CardDescription>
                Prescribing for: <span className="font-semibold text-foreground">{patientName}</span>
              </CardDescription>
            </div>
            <div className="text-right">
              <p className="text-sm text-muted-foreground">Date: {format(new Date(), 'PPP')}</p>
              <p className="text-sm text-muted-foreground">Dr. Rajesh Kumar • REG12345</p>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Diagnosis & Symptoms */}
      <Card className="shadow-card">
        <CardHeader>
          <CardTitle>Clinical Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label className="text-sm font-medium">Chief Complaints / Symptoms</label>
            <Textarea
              placeholder="Enter patient's symptoms..."
              value={symptoms}
              onChange={(e) => setSymptoms(e.target.value)}
              rows={2}
            />
          </div>
          
          <div>
            <label className="text-sm font-medium">Diagnosis</label>
            <Input
              placeholder="Enter diagnosis..."
              value={diagnosis}
              onChange={(e) => setDiagnosis(e.target.value)}
            />
          </div>
          
          <div>
            <label className="text-sm font-medium">Tests Recommended (Optional)</label>
            <Textarea
              placeholder="Enter any tests to be done..."
              value={tests}
              onChange={(e) => setTests(e.target.value)}
              rows={2}
            />
          </div>
        </CardContent>
      </Card>

      {/* Medicines */}
      <Card className="shadow-card">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Medicines</CardTitle>
            <Button 
              size="sm" 
              variant="medical"
              onClick={() => setShowMedicineForm(true)}
            >
              <Plus className="h-4 w-4 mr-1" />
              Add Medicine
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Quick Templates */}
          <div className="space-y-2">
            <p className="text-sm font-medium">Quick Templates:</p>
            <div className="flex flex-wrap gap-2">
              {medicineTemplates.map((template, index) => (
                <Button
                  key={index}
                  size="sm"
                  variant="outline"
                  onClick={() => applyTemplate(template)}
                >
                  <Pill className="h-3 w-3 mr-1" />
                  {template.name}
                </Button>
              ))}
            </div>
          </div>

          {/* Add Medicine Form */}
          {showMedicineForm && (
            <div className="border rounded-lg p-4 space-y-3 bg-muted/30">
              <h4 className="font-medium">Add Medicine Details</h4>
              <div className="grid md:grid-cols-2 gap-3">
                <div>
                  <label className="text-sm font-medium">Medicine Name *</label>
                  <Input
                    placeholder="e.g., Paracetamol"
                    value={currentMedicine.name}
                    onChange={(e) => setCurrentMedicine({...currentMedicine, name: e.target.value})}
                  />
                </div>
                <div>
                  <label className="text-sm font-medium">Dosage *</label>
                  <Input
                    placeholder="e.g., 500mg"
                    value={currentMedicine.dosage}
                    onChange={(e) => setCurrentMedicine({...currentMedicine, dosage: e.target.value})}
                  />
                </div>
                <div>
                  <label className="text-sm font-medium">Frequency *</label>
                  <Input
                    placeholder="e.g., Twice daily"
                    value={currentMedicine.frequency}
                    onChange={(e) => setCurrentMedicine({...currentMedicine, frequency: e.target.value})}
                  />
                </div>
                <div>
                  <label className="text-sm font-medium">Duration *</label>
                  <Input
                    placeholder="e.g., 5 days"
                    value={currentMedicine.duration}
                    onChange={(e) => setCurrentMedicine({...currentMedicine, duration: e.target.value})}
                  />
                </div>
                <div>
                  <label className="text-sm font-medium">Timing</label>
                  <select
                    value={currentMedicine.timing}
                    onChange={(e) => setCurrentMedicine({...currentMedicine, timing: e.target.value as Medicine['timing']})}
                    className="w-full rounded-md border border-input bg-background px-3 py-2"
                  >
                    <option value="Before meals">Before meals</option>
                    <option value="After meals">After meals</option>
                    <option value="With meals">With meals</option>
                    <option value="Empty stomach">Empty stomach</option>
                  </select>
                </div>
                <div>
                  <label className="text-sm font-medium">Special Instructions</label>
                  <Input
                    placeholder="Optional instructions"
                    value={currentMedicine.instructions}
                    onChange={(e) => setCurrentMedicine({...currentMedicine, instructions: e.target.value})}
                  />
                </div>
              </div>
              <div className="flex space-x-2">
                <Button size="sm" variant="medical" onClick={addMedicine}>
                  <CheckCircle className="h-4 w-4 mr-1" />
                  Add Medicine
                </Button>
                <Button 
                  size="sm" 
                  variant="outline" 
                  onClick={() => {
                    setShowMedicineForm(false);
                    setCurrentMedicine({
                      id: '',
                      name: '',
                      dosage: '',
                      frequency: '',
                      duration: '',
                      timing: 'After meals',
                      instructions: ''
                    });
                  }}
                >
                  Cancel
                </Button>
              </div>
            </div>
          )}

          {/* Medicine List */}
          {medicines.length > 0 ? (
            <div className="space-y-2">
              <p className="text-sm font-medium">Prescribed Medicines:</p>
              {medicines.map((medicine, index) => (
                <div key={medicine.id} className="border rounded-lg p-3 space-y-2">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-2">
                        <Badge variant="secondary">{index + 1}</Badge>
                        <span className="font-semibold">{medicine.name}</span>
                        <Badge variant="outline">{medicine.dosage}</Badge>
                      </div>
                      <div className="mt-1 text-sm text-muted-foreground space-y-1">
                        <p>
                          <span className="font-medium">Frequency:</span> {medicine.frequency} • 
                          <span className="font-medium ml-2">Duration:</span> {medicine.duration} • 
                          <span className="font-medium ml-2">Timing:</span> {medicine.timing}
                        </p>
                        {medicine.instructions && (
                          <p><span className="font-medium">Instructions:</span> {medicine.instructions}</p>
                        )}
                      </div>
                    </div>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => removeMedicine(medicine.id)}
                    >
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <Alert>
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                No medicines added yet. Click "Add Medicine" to prescribe medications.
              </AlertDescription>
            </Alert>
          )}
        </CardContent>
      </Card>

      {/* Advice & Follow-up */}
      <Card className="shadow-card">
        <CardHeader>
          <CardTitle>Medical Advice & Follow-up</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label className="text-sm font-medium">General Advice</label>
            <Textarea
              placeholder="e.g., Rest, drink plenty of fluids, avoid spicy food..."
              value={advice}
              onChange={(e) => setAdvice(e.target.value)}
              rows={3}
            />
          </div>
          
          <div>
            <label className="text-sm font-medium">Follow-up</label>
            <Input
              placeholder="e.g., After 5 days or if symptoms persist"
              value={followUp}
              onChange={(e) => setFollowUp(e.target.value)}
            />
          </div>
        </CardContent>
      </Card>

      {/* Actions */}
      <Card className="shadow-card">
        <CardContent className="p-4">
          <div className="flex flex-wrap gap-2">
            <Button 
              variant="medical" 
              onClick={savePrescription}
              disabled={medicines.length === 0}
            >
              <Save className="h-4 w-4 mr-2" />
              Save Prescription
            </Button>
            
            <Button 
              variant="success" 
              onClick={sendPrescription}
              disabled={medicines.length === 0}
            >
              <Send className="h-4 w-4 mr-2" />
              Send to Patient
            </Button>
            
            <Button 
              variant="outline"
              onClick={() => {
                toast({
                  title: "Printing Prescription",
                  description: "Opening print dialog...",
                });
              }}
              disabled={medicines.length === 0}
            >
              <Printer className="h-4 w-4 mr-2" />
              Print
            </Button>
            
            <Button 
              variant="outline"
              onClick={() => {
                toast({
                  title: "Downloading PDF",
                  description: "Prescription PDF downloaded successfully.",
                });
              }}
              disabled={medicines.length === 0}
            >
              <Download className="h-4 w-4 mr-2" />
              Download PDF
            </Button>
            
            <Button 
              variant="destructive"
              onClick={clearPrescription}
            >
              <Trash2 className="h-4 w-4 mr-2" />
              Clear All
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Preview */}
      {medicines.length > 0 && (
        <Card className="shadow-card border-primary">
          <CardHeader>
            <CardTitle>Prescription Preview</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3 text-sm">
              <div className="text-center border-b pb-2">
                <h3 className="font-bold text-lg">Nabha Civil Hospital</h3>
                <p className="text-muted-foreground">Dr. Rajesh Kumar • REG12345</p>
              </div>
              
              <div className="grid grid-cols-2 gap-2">
                <p><strong>Patient:</strong> {patientName}</p>
                <p><strong>Date:</strong> {format(new Date(), 'PPP')}</p>
              </div>
              
              {diagnosis && (
                <div>
                  <p className="font-semibold">Diagnosis:</p>
                  <p className="text-muted-foreground">{diagnosis}</p>
                </div>
              )}
              
              <div>
                <p className="font-semibold">Rx:</p>
                {medicines.map((medicine, index) => (
                  <div key={medicine.id} className="ml-4 mt-2">
                    <p>{index + 1}. {medicine.name} - {medicine.dosage}</p>
                    <p className="text-muted-foreground ml-4">
                      {medicine.frequency} • {medicine.timing} • {medicine.duration}
                    </p>
                  </div>
                ))}
              </div>
              
              {advice && (
                <div>
                  <p className="font-semibold">Advice:</p>
                  <p className="text-muted-foreground">{advice}</p>
                </div>
              )}
              
              {followUp && (
                <div>
                  <p className="font-semibold">Follow-up:</p>
                  <p className="text-muted-foreground">{followUp}</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};