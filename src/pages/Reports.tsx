import React, { useState, useEffect } from 'react';
import { Layout } from '@/components/layout/Layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { 
  FileText, 
  Download, 
  Eye, 
  Calendar, 
  Upload, 
  Search, 
  Filter, 
  Lock, 
  CheckCircle, 
  Activity,
  Heart,
  Plus,
  RefreshCw
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { storageService } from '@/services/storage';
import { HealthRecord } from '@/types/medical';
import { useToast } from '@/hooks/use-toast';

export const Reports = () => {
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  const [records, setRecords] = useState<HealthRecord[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [typeFilter, setTypeFilter] = useState<string>('all');
  const [selectedRecord, setSelectedRecord] = useState<HealthRecord | null>(null);
  const [isUploadOpen, setIsUploadOpen] = useState(false);

  // Upload Form State
  const [uploadTitle, setUploadTitle] = useState('');
  const [uploadType, setUploadType] = useState<HealthRecord['type']>('Lab Test');
  const [uploadSummary, setUploadSummary] = useState('');
  const [uploadNotes, setUploadNotes] = useState('');

  const loadRecords = () => {
    if (!user) return;
    const userRecords = storageService.getHealthRecords(user);
    setRecords(userRecords);
  };

  useEffect(() => {
    loadRecords();
  }, [user]);

  if (!isAuthenticated || !user) {
    return (
      <Layout>
        <div className="py-16 text-center max-w-md mx-auto space-y-4">
          <div className="w-12 h-12 bg-amber-100 text-amber-800 rounded-full flex items-center justify-center mx-auto">
            <Lock className="h-6 w-6" />
          </div>
          <h2 className="text-xl font-bold text-stone-900">Protected Health Information</h2>
          <p className="text-xs text-stone-600">
            Digital health records and clinical test results are strictly restricted to authorized patients and care providers. Please sign in to verify your identity.
          </p>
          <Button 
            className="bg-emerald-800 hover:bg-emerald-900 text-white text-xs"
            onClick={() => navigate('/')}
          >
            Go to Sign In
          </Button>
        </div>
      </Layout>
    );
  }

  const handleUploadSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!uploadTitle.trim() || !uploadSummary.trim()) {
      toast({
        title: "Incomplete Details",
        description: "Please specify title and summary for the clinical report.",
        variant: "destructive"
      });
      return;
    }

    try {
      storageService.addHealthRecord({
        patientId: user.role === 'patient' ? user.id : '1',
        patientName: user.role === 'patient' ? user.name : 'Krishna (Patient)',
        doctorId: user.role === 'doctor' ? user.id : '2',
        doctorName: user.role === 'doctor' ? user.name : 'Dr. Rachit Kumar',
        title: uploadTitle.trim(),
        type: uploadType,
        date: new Date().toISOString().split('T')[0],
        status: 'ready',
        fileSize: '1.2 MB',
        summary: uploadSummary.trim(),
        doctorNotes: uploadNotes.trim() || undefined
      }, user);

      toast({
        title: "Record Added",
        description: `Clinical record "${uploadTitle}" has been saved securely.`,
      });

      setIsUploadOpen(false);
      setUploadTitle('');
      setUploadSummary('');
      setUploadNotes('');
      loadRecords();
    } catch (err: unknown) {
      toast({
        title: "Upload Denied",
        description: err instanceof Error ? err.message : "Failed to add record.",
        variant: "destructive"
      });
    }
  };

  const downloadRecordFile = (record: HealthRecord) => {
    const content = `HEALTHBRIDGE TELEMEDICINE - CLINICAL RECORD SUMMARY
---------------------------------------------------------
Record ID: ${record.id}
Date: ${record.date}
Patient ID: ${record.patientId} (${record.patientName})
Attending Physician: ${record.doctorName}
Title: ${record.title}
Category: ${record.type}
Status: ${record.status.toUpperCase()}

CLINICAL FINDINGS & SUMMARY:
${record.summary}

DOCTOR NOTES:
${record.doctorNotes || 'No additional notes provided.'}

${record.vitalSigns ? `VITAL SIGNS:
Blood Pressure: ${record.vitalSigns.bloodPressure || 'N/A'}
Heart Rate: ${record.vitalSigns.heartRate || 'N/A'} bpm
Temperature: ${record.vitalSigns.temperature || 'N/A'} F
SpO2: ${record.vitalSigns.spo2 || 'N/A'}%` : ''}

${record.medicines && record.medicines.length > 0 ? `PRESCRIBED MEDICATIONS:
${record.medicines.map(m => `- ${m.name} (${m.dosage}): ${m.frequency} for ${m.duration}`).join('\n')}` : ''}
---------------------------------------------------------
Generated via HealthBridge Nabha Telemedicine Platform
Confidential Medical Record
`;

    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `HealthBridge_Report_${record.id}_${record.date}.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    toast({
      title: "Download Initiated",
      description: `Downloaded summary for ${record.title}.`,
    });
  };

  const downloadAllRecords = () => {
    if (records.length === 0) {
      toast({
        title: "No Records",
        description: "There are no health records to download.",
        variant: "destructive"
      });
      return;
    }

    records.forEach((r, idx) => {
      setTimeout(() => downloadRecordFile(r), idx * 200);
    });
  };

  const filteredRecords = records.filter(r => {
    const matchesSearch = 
      r.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.doctorName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.summary.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesType = typeFilter === 'all' || r.type === typeFilter;
    return matchesSearch && matchesType;
  });

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'Lab Test': return 'text-emerald-700 bg-emerald-50 border-emerald-200';
      case 'Radiology': return 'text-purple-700 bg-purple-50 border-purple-200';
      case 'Cardiology': return 'text-red-700 bg-red-50 border-red-200';
      case 'Prescription': return 'text-amber-800 bg-amber-50 border-amber-200';
      default: return 'text-stone-700 bg-stone-50 border-stone-200';
    }
  };

  return (
    <Layout>
      <div className="space-y-6">
        {/* Header bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-stone-200">
          <div>
            <div className="flex items-center space-x-2">
              <h1 className="text-2xl font-bold text-stone-900 tracking-tight">Digital Health Records (PHR)</h1>
              <Badge variant="outline" className="text-[10px] text-emerald-800 border-emerald-700/50 bg-emerald-50">
                RBAC Protected
              </Badge>
            </div>
            <p className="text-xs text-stone-500 mt-0.5">
              Authorized Patient: <span className="font-semibold text-stone-800">{user.name}</span> • Medical Records Archive
            </p>
          </div>

          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={loadRecords}
              className="text-xs border-stone-300"
            >
              <RefreshCw className="h-3.5 w-3.5 mr-1" />
              Refresh
            </Button>
            {(user.role === 'doctor' || user.role === 'admin') && (
              <Button 
                size="sm" 
                className="bg-emerald-800 hover:bg-emerald-900 text-white text-xs"
                onClick={() => setIsUploadOpen(true)}
              >
                <Plus className="h-3.5 w-3.5 mr-1" />
                Upload Clinical Record
              </Button>
            )}
            <Button
              variant="outline"
              size="sm"
              onClick={downloadAllRecords}
              className="text-xs border-stone-300"
            >
              <Download className="h-3.5 w-3.5 mr-1" />
              Export Records
            </Button>
          </div>
        </div>

        {/* Search & Filter Bar */}
        <div className="grid sm:grid-cols-12 gap-3">
          <div className="sm:col-span-8 relative">
            <Search className="h-4 w-4 absolute left-3 top-2.5 text-stone-400" />
            <Input
              placeholder="Search reports by title, doctor or clinical findings..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 text-xs bg-white border-stone-200"
            />
          </div>
          <div className="sm:col-span-4">
            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className="w-full rounded-md border border-stone-200 bg-white px-3 py-2 text-xs text-stone-700"
            >
              <option value="all">All Report Categories</option>
              <option value="Lab Test">Lab Tests</option>
              <option value="Radiology">Radiology & X-Ray</option>
              <option value="Cardiology">Cardiology</option>
              <option value="Prescription">Prescriptions & Advice</option>
            </select>
          </div>
        </div>

        {/* Records Grid */}
        {filteredRecords.length === 0 ? (
          <Card className="border-stone-200 bg-white text-center py-12">
            <CardContent className="space-y-3">
              <FileText className="h-12 w-12 text-stone-400 mx-auto" />
              <h3 className="text-base font-semibold text-stone-800">No Records Found</h3>
              <p className="text-xs text-stone-500 max-w-sm mx-auto">
                {searchQuery || typeFilter !== 'all' 
                  ? "No clinical records match your current search or filter query." 
                  : "No medical reports have been recorded for your patient profile yet."}
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid md:grid-cols-2 gap-4">
            {filteredRecords.map((record) => (
              <Card 
                key={record.id}
                className="border-stone-200 bg-white hover:border-emerald-600 transition-all shadow-sm flex flex-col justify-between"
              >
                <div>
                  <CardHeader className="p-4 pb-2">
                    <div className="flex justify-between items-start gap-2">
                      <div className="flex items-start space-x-3">
                        <div className="p-2.5 bg-emerald-50 rounded-lg text-emerald-800 shrink-0 border border-emerald-200/60">
                          <FileText className="h-5 w-5" />
                        </div>
                        <div>
                          <CardTitle className="text-sm font-bold text-stone-900 leading-snug">
                            {record.title}
                          </CardTitle>
                          <div className="flex items-center space-x-2 mt-1">
                            <span className={`text-[10px] font-semibold px-2 py-0.5 rounded border ${getTypeColor(record.type)}`}>
                              {record.type}
                            </span>
                            <span className="text-[11px] text-stone-400">•</span>
                            <span className="text-[11px] text-stone-500">{record.fileSize}</span>
                          </div>
                        </div>
                      </div>
                      <Badge variant="success" className="text-[10px]">Verified</Badge>
                    </div>
                  </CardHeader>

                  <CardContent className="p-4 pt-2 space-y-2.5 text-xs text-stone-600">
                    <p className="text-stone-700 leading-relaxed bg-stone-50/70 p-2.5 rounded border border-stone-100 text-[11px]">
                      {record.summary}
                    </p>

                    <div className="flex justify-between text-[11px] text-stone-500 pt-1 border-t border-stone-100">
                      <div className="flex items-center space-x-1">
                        <Calendar className="h-3 w-3 text-stone-400" />
                        <span>Date: {record.date}</span>
                      </div>
                      <span>Prescribed by: <strong className="text-stone-700">{record.doctorName}</strong></span>
                    </div>

                    {record.vitalSigns && (
                      <div className="grid grid-cols-3 gap-1.5 pt-1 text-[10px]">
                        <div className="p-1.5 bg-stone-50 rounded border border-stone-100 text-center">
                          <span className="text-stone-400 block">BP</span>
                          <span className="font-semibold text-stone-800">{record.vitalSigns.bloodPressure || 'N/A'}</span>
                        </div>
                        <div className="p-1.5 bg-stone-50 rounded border border-stone-100 text-center">
                          <span className="text-stone-400 block">Pulse</span>
                          <span className="font-semibold text-stone-800">{record.vitalSigns.heartRate || 'N/A'} bpm</span>
                        </div>
                        <div className="p-1.5 bg-stone-50 rounded border border-stone-100 text-center">
                          <span className="text-stone-400 block">SpO2</span>
                          <span className="font-semibold text-stone-800">{record.vitalSigns.spo2 || 'N/A'}%</span>
                        </div>
                      </div>
                    )}
                  </CardContent>
                </div>

                <div className="p-4 pt-0 border-t border-stone-100 flex gap-2 mt-2">
                  <Button 
                    size="sm" 
                    variant="outline" 
                    className="flex-1 text-xs h-8 border-stone-300"
                    onClick={() => setSelectedRecord(record)}
                  >
                    <Eye className="h-3.5 w-3.5 mr-1" />
                    View Details
                  </Button>
                  <Button 
                    size="sm" 
                    className="flex-1 bg-emerald-800 hover:bg-emerald-900 text-white text-xs h-8"
                    onClick={() => downloadRecordFile(record)}
                  >
                    <Download className="h-3.5 w-3.5 mr-1" />
                    Download
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>

      {/* Clinical Record Viewer Modal */}
      <Dialog open={!!selectedRecord} onOpenChange={() => setSelectedRecord(null)}>
        <DialogContent className="max-w-lg max-h-[85vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-base font-bold">{selectedRecord?.title}</DialogTitle>
            <DialogDescription className="text-xs text-stone-500">
              Reference: {selectedRecord?.id} • Dated {selectedRecord?.date}
            </DialogDescription>
          </DialogHeader>

          {selectedRecord && (
            <div className="space-y-4 text-xs">
              <div className="p-3 bg-stone-50 rounded-lg space-y-1.5 border border-stone-200">
                <div className="flex justify-between">
                  <span className="text-stone-500">Patient:</span>
                  <span className="font-semibold">{selectedRecord.patientName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-stone-500">Attending Physician:</span>
                  <span className="font-semibold">{selectedRecord.doctorName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-stone-500">Category:</span>
                  <span className="font-medium">{selectedRecord.type}</span>
                </div>
              </div>

              <div>
                <h4 className="font-bold text-stone-800 mb-1">Clinical Findings & Summary</h4>
                <div className="p-3 bg-white border border-stone-200 rounded-lg text-stone-700 leading-relaxed">
                  {selectedRecord.summary}
                </div>
              </div>

              {selectedRecord.doctorNotes && (
                <div>
                  <h4 className="font-bold text-stone-800 mb-1">Attending Physician Remarks</h4>
                  <div className="p-3 bg-emerald-50/50 border border-emerald-200 rounded-lg text-stone-700 leading-relaxed">
                    {selectedRecord.doctorNotes}
                  </div>
                </div>
              )}

              {selectedRecord.medicines && selectedRecord.medicines.length > 0 && (
                <div>
                  <h4 className="font-bold text-stone-800 mb-1">Prescription Items</h4>
                  <div className="space-y-1.5">
                    {selectedRecord.medicines.map((med, i) => (
                      <div key={i} className="p-2.5 bg-stone-50 border border-stone-200 rounded flex justify-between">
                        <div>
                          <p className="font-semibold text-stone-900">{med.name} ({med.dosage})</p>
                          <p className="text-[11px] text-stone-500">{med.instructions}</p>
                        </div>
                        <span className="text-emerald-800 font-medium">{med.frequency}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="flex justify-end pt-2">
                <Button 
                  size="sm" 
                  className="bg-emerald-800 hover:bg-emerald-900 text-white text-xs"
                  onClick={() => downloadRecordFile(selectedRecord)}
                >
                  <Download className="h-3.5 w-3.5 mr-1" />
                  Download Summary File
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Upload Modal (Doctor/Admin Only) */}
      <Dialog open={isUploadOpen} onOpenChange={setIsUploadOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="text-base font-bold">Upload Clinical Report</DialogTitle>
            <DialogDescription className="text-xs text-stone-500">
              Attach authenticated lab or radiology reports to patient profile.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleUploadSubmit} className="space-y-3 text-xs pt-2">
            <div>
              <label className="font-medium text-stone-700">Report Title</label>
              <Input
                placeholder="e.g. Fasting Blood Glucose Panel"
                value={uploadTitle}
                onChange={(e) => setUploadTitle(e.target.value)}
                className="text-xs mt-1"
                required
              />
            </div>

            <div>
              <label className="font-medium text-stone-700">Category</label>
              <select
                value={uploadType}
                onChange={(e) => setUploadType(e.target.value as HealthRecord['type'])}
                className="w-full rounded-md border border-input bg-background px-3 py-2 text-xs mt-1"
              >
                <option value="Lab Test">Lab Test</option>
                <option value="Radiology">Radiology</option>
                <option value="Cardiology">Cardiology</option>
                <option value="General Consultation">General Consultation</option>
                <option value="Prescription">Prescription</option>
              </select>
            </div>

            <div>
              <label className="font-medium text-stone-700">Clinical Findings / Summary</label>
              <textarea
                placeholder="Detailed findings and test values..."
                value={uploadSummary}
                onChange={(e) => setUploadSummary(e.target.value)}
                rows={3}
                className="w-full rounded-md border border-input bg-background px-3 py-2 text-xs mt-1"
                required
              />
            </div>

            <div>
              <label className="font-medium text-stone-700">Physician Remarks</label>
              <textarea
                placeholder="Guidance or follow-up instructions..."
                value={uploadNotes}
                onChange={(e) => setUploadNotes(e.target.value)}
                rows={2}
                className="w-full rounded-md border border-input bg-background px-3 py-2 text-xs mt-1"
              />
            </div>

            <div className="flex justify-end space-x-2 pt-2">
              <Button variant="outline" size="sm" onClick={() => setIsUploadOpen(false)} className="text-xs">
                Cancel
              </Button>
              <Button type="submit" size="sm" className="bg-emerald-800 hover:bg-emerald-900 text-white text-xs">
                Save Record
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </Layout>
  );
};

export default Reports;
