import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { 
  Users, 
  Activity, 
  Building2, 
  TrendingUp, 
  Download, 
  UserCheck, 
  AlertCircle, 
  ShieldAlert, 
  Calendar, 
  RefreshCw,
  Clock,
  ShieldCheck
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { demoUsers } from '@/data/mockData';
import { storageService } from '@/services/storage';
import { useToast } from '@/hooks/use-toast';
import { AuditEvent, Appointment, MedicineStock } from '@/types/medical';
import { Layout } from '@/components/layout/Layout';

export const AdminDashboard = () => {
  const { user, logout } = useAuth();
  const { toast } = useToast();

  const [auditLogs, setAuditLogs] = useState<AuditEvent[]>([]);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [inventory, setInventory] = useState<MedicineStock[]>([]);
  const [realAnalytics, setRealAnalytics] = useState({
    totalConsultations: 0,
    pendingConsultations: 0,
    confirmedConsultations: 0,
    inStockCount: 0,
    outOfStockCount: 0,
    lowStockCount: 0,
    totalInventoryItems: 0,
    appointmentsCount: 0
  });

  const loadData = () => {
    setAuditLogs(storageService.getAuditLogs());
    setAppointments(storageService.getAppointments());
    setInventory(storageService.getInventory());
    setRealAnalytics(storageService.getRealAnalytics());
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleLogout = () => {
    logout();
    toast({
      title: "Logged Out",
      description: "Admin session ended.",
    });
  };

  const exportAuditCSV = () => {
    if (auditLogs.length === 0) {
      toast({
        title: "No Audit Data",
        description: "There are currently no recorded audit events to export.",
        variant: "destructive"
      });
      return;
    }

    const headers = ["Timestamp", "Actor ID", "Actor Name", "Role", "Action", "Resource Type", "Resource ID", "Details"];
    const rows = auditLogs.map(l => [
      `"${l.timestamp}"`,
      `"${l.actorId}"`,
      `"${l.actorName}"`,
      `"${l.actorRole}"`,
      `"${l.action}"`,
      `"${l.resourceType}"`,
      `"${l.resourceId}"`,
      `"${l.details || ''}"`
    ]);

    const csvContent = [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `HealthBridge_AuditTrail_${new Date().toISOString().split('T')[0]}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    toast({
      title: "Audit Log Exported",
      description: `Downloaded ${auditLogs.length} audit events as CSV.`,
    });
  };

  return (
    <Layout>
      <div className="space-y-6">
        {/* Top Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-white/[0.08]">
          <div>
            <div className="flex items-center space-x-2">
              <h1 className="text-2xl font-bold text-white tracking-tight">Platform Operations & Oversight</h1>
              <Badge variant="outline" className="text-[10px] text-emerald-800 border-emerald-700/50 bg-emerald-50">
                Administrator
              </Badge>
            </div>
            <p className="text-xs text-stone-500 mt-0.5">
              Nabha Regional Telemedicine Pilot • System Metrics & Clinical Governance
            </p>
          </div>

          <div className="flex items-center space-x-2">
            <Button variant="outline" size="sm" onClick={loadData} className="text-xs border-stone-300">
              <RefreshCw className="h-3.5 w-3.5 mr-1" />
              Refresh
            </Button>
            <Button 
              size="sm" 
              className="bg-emerald-800 hover:bg-emerald-900 text-white text-xs"
              onClick={exportAuditCSV}
            >
              <Download className="h-3.5 w-3.5 mr-1" />
              Export Audit Trail
            </Button>
          </div>
        </div>

        {/* Real Metrics Overview Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="border-white/[0.08] bg-[#080d1a] shadow-sm">
            <CardHeader className="p-3.5 pb-1">
              <CardTitle className="text-xs font-semibold text-stone-500">Total Scheduled Visits</CardTitle>
            </CardHeader>
            <CardContent className="p-3.5 pt-0">
              <p className="text-2xl font-bold text-white">{realAnalytics.appointmentsCount}</p>
              <p className="text-[11px] text-stone-500 mt-0.5">Across all 5 clinical departments</p>
            </CardContent>
          </Card>

          <Card className="border-white/[0.08] bg-[#080d1a] shadow-sm">
            <CardHeader className="p-3.5 pb-1">
              <CardTitle className="text-xs font-semibold text-stone-500">Completed Consultations</CardTitle>
            </CardHeader>
            <CardContent className="p-3.5 pt-0">
              <p className="text-2xl font-bold text-emerald-800">{realAnalytics.totalConsultations}</p>
              <p className="text-[11px] text-stone-500 mt-0.5">With generated digital records</p>
            </CardContent>
          </Card>

          <Card className="border-white/[0.08] bg-[#080d1a] shadow-sm">
            <CardHeader className="p-3.5 pb-1">
              <CardTitle className="text-xs font-semibold text-stone-500">Pending Review</CardTitle>
            </CardHeader>
            <CardContent className="p-3.5 pt-0">
              <p className="text-2xl font-bold text-amber-700">{realAnalytics.pendingConsultations}</p>
              <p className="text-[11px] text-stone-500 mt-0.5">Awaiting physician acceptance</p>
            </CardContent>
          </Card>

          <Card className="border-white/[0.08] bg-[#080d1a] shadow-sm">
            <CardHeader className="p-3.5 pb-1">
              <CardTitle className="text-xs font-semibold text-stone-500">Dispensary Stock Alert</CardTitle>
            </CardHeader>
            <CardContent className="p-3.5 pt-0">
              <p className="text-2xl font-bold text-red-700">
                {realAnalytics.outOfStockCount + realAnalytics.lowStockCount}
              </p>
              <p className="text-[11px] text-stone-500 mt-0.5">
                {realAnalytics.outOfStockCount} out of stock, {realAnalytics.lowStockCount} low
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Tabbed Views */}
        <Tabs defaultValue="audit" className="space-y-4">
          <TabsList className="bg-stone-100 p-1 border border-white/[0.08]">
            <TabsTrigger value="audit" className="text-xs">Operational Audit Trail</TabsTrigger>
            <TabsTrigger value="appointments" className="text-xs">Live Appointments ({appointments.length})</TabsTrigger>
            <TabsTrigger value="inventory" className="text-xs">Dispensary Stock ({inventory.length})</TabsTrigger>
            <TabsTrigger value="users" className="text-xs">Registered Accounts</TabsTrigger>
          </TabsList>

          {/* Audit Logs Content */}
          <TabsContent value="audit" className="space-y-3">
            <Card className="border-white/[0.08] bg-[#080d1a] shadow-sm">
              <CardHeader className="p-4 pb-2 border-b border-stone-100">
                <CardTitle className="text-sm font-bold text-white flex items-center justify-between">
                  <span>Clinical & Administrative Event Log</span>
                  <Badge variant="outline" className="text-[10px] text-stone-500">{auditLogs.length} Events</Badge>
                </CardTitle>
                <CardDescription className="text-xs text-stone-500">
                  Immutable client-side log tracking state transitions, inventory updates, and clinical record generation.
                </CardDescription>
              </CardHeader>
              <CardContent className="p-0">
                {auditLogs.length === 0 ? (
                  <div className="p-8 text-center text-xs text-stone-400">
                    No administrative audit events recorded yet. Perform actions across doctor/patient tabs to view log entries.
                  </div>
                ) : (
                  <Table className="text-xs">
                    <TableHeader className="bg-[#090e1a]">
                      <TableRow>
                        <TableHead className="py-2.5">Time</TableHead>
                        <TableHead className="py-2.5">Actor</TableHead>
                        <TableHead className="py-2.5">Role</TableHead>
                        <TableHead className="py-2.5">Action</TableHead>
                        <TableHead className="py-2.5">Details</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {auditLogs.map((log) => (
                        <TableRow key={log.id} className="hover:bg-[#090e1a]/50">
                          <TableCell className="py-2 text-[11px] text-stone-500">
                            {new Date(log.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                          </TableCell>
                          <TableCell className="py-2 font-medium text-stone-800">{log.actorName}</TableCell>
                          <TableCell className="py-2">
                            <Badge variant="outline" className="text-[10px] uppercase">{log.actorRole}</Badge>
                          </TableCell>
                          <TableCell className="py-2 font-mono text-[11px] text-emerald-800 font-semibold">{log.action}</TableCell>
                          <TableCell className="py-2 text-stone-600 max-w-xs truncate">{log.details || '—'}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Appointments View */}
          <TabsContent value="appointments" className="space-y-3">
            <Card className="border-white/[0.08] bg-[#080d1a] shadow-sm">
              <CardContent className="p-0">
                <Table className="text-xs">
                  <TableHeader className="bg-[#090e1a]">
                    <TableRow>
                      <TableHead>Ref ID</TableHead>
                      <TableHead>Patient</TableHead>
                      <TableHead>Attending Doctor</TableHead>
                      <TableHead>Date & Time</TableHead>
                      <TableHead>Mode</TableHead>
                      <TableHead>Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {appointments.map((apt) => (
                      <TableRow key={apt.id}>
                        <TableCell className="font-mono text-[11px] text-stone-500">{apt.id}</TableCell>
                        <TableCell className="font-medium text-white">{apt.patientName}</TableCell>
                        <TableCell className="text-stone-700">{apt.doctorName} ({apt.specialty})</TableCell>
                        <TableCell className="text-stone-600">{apt.date} • {apt.time}</TableCell>
                        <TableCell className="capitalize text-stone-600">{apt.type}</TableCell>
                        <TableCell>
                          <Badge variant={
                            ['CONFIRMED', 'approved'].includes(apt.status) ? 'success' :
                            ['REQUESTED', 'pending'].includes(apt.status) ? 'warning' :
                            apt.status === 'COMPLETED' ? 'secondary' : 'destructive'
                          } className="text-[10px]">
                            {apt.status}
                          </Badge>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Dispensary Stock View */}
          <TabsContent value="inventory" className="space-y-3">
            <Card className="border-white/[0.08] bg-[#080d1a] shadow-sm">
              <CardContent className="p-0">
                <Table className="text-xs">
                  <TableHeader className="bg-[#090e1a]">
                    <TableRow>
                      <TableHead>Medicine Name</TableHead>
                      <TableHead>Category</TableHead>
                      <TableHead>Current Stock</TableHead>
                      <TableHead>Location</TableHead>
                      <TableHead>Subsidized Price</TableHead>
                      <TableHead>Expiry Date</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {inventory.map((item) => (
                      <TableRow key={item.id}>
                        <TableCell className="font-semibold text-white">{item.name}</TableCell>
                        <TableCell className="text-stone-600">{item.category}</TableCell>
                        <TableCell>
                          <Badge variant={
                            item.stock === 0 ? 'destructive' :
                            item.stock <= (item.minStock || 25) ? 'warning' : 'success'
                          } className="text-[10px]">
                            {item.stock} Units
                          </Badge>
                        </TableCell>
                        <TableCell className="text-stone-600">{item.rackNumber || 'Dispensary'}</TableCell>
                        <TableCell className="font-medium text-stone-800">₹{item.price}</TableCell>
                        <TableCell className="text-stone-500 text-[11px]">{item.expiryDate}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Accounts View */}
          <TabsContent value="users" className="space-y-3">
            <Card className="border-white/[0.08] bg-[#080d1a] shadow-sm">
              <CardContent className="p-0">
                <Table className="text-xs">
                  <TableHeader className="bg-[#090e1a]">
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Role</TableHead>
                      <TableHead>Assigned Region</TableHead>
                      <TableHead>Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {demoUsers.map((u) => (
                      <TableRow key={u.id}>
                        <TableCell className="font-medium text-white">{u.name}</TableCell>
                        <TableCell className="text-stone-600">{u.email}</TableCell>
                        <TableCell>
                          <Badge variant="outline" className="text-[10px] uppercase">{u.role}</Badge>
                        </TableCell>
                        <TableCell className="text-stone-600">{u.location}</TableCell>
                        <TableCell>
                          <Badge variant="success" className="text-[10px]">Active</Badge>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
};

export default AdminDashboard;
