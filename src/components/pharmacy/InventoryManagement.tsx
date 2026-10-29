import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { 
  Package,
  AlertTriangle,
  TrendingUp,
  TrendingDown,
  Plus,
  Minus,
  Edit,
  Trash2,
  Search,
  Filter,
  Download,
  Upload,
  CheckCircle,
  XCircle,
  Clock,
  Calendar,
  IndianRupee,
  BarChart3,
  Pill,
  AlertCircle
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { storageService } from '@/services/storage';
import { format } from 'date-fns';

interface Medicine {
  id: string;
  name: string;
  genericName: string;
  category: string;
  manufacturer: string;
  batchNumber: string;
  stock: number;
  minStock: number;
  maxStock: number;
  price: number;
  purchasePrice: number;
  expiryDate: string;
  rackNumber: string;
  requiresPrescription: boolean;
  lastRestocked?: string;
  supplier?: string;
}

interface StockMovement {
  id: string;
  medicineId: string;
  medicineName: string;
  type: 'in' | 'out' | 'return' | 'expired';
  quantity: number;
  date: string;
  reason: string;
  performedBy: string;
  invoiceNumber?: string;
}

export const InventoryManagement: React.FC = () => {
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState('');
  const [filterCategory, setFilterCategory] = useState('all');
  const [showAddStock, setShowAddStock] = useState(false);
  const [selectedMedicine, setSelectedMedicine] = useState<Medicine | null>(null);
  const [stockUpdateAmount, setStockUpdateAmount] = useState('');
  const [stockUpdateType, setStockUpdateType] = useState<'add' | 'remove'>('add');

  // Mock inventory data
  const [inventory, setInventory] = useState<Medicine[]>([
    {
      id: '1',
      name: 'Paracetamol 500mg',
      genericName: 'Acetaminophen',
      category: 'Analgesic',
      manufacturer: 'Cipla Ltd',
      batchNumber: 'PCT2024001',
      stock: 250,
      minStock: 100,
      maxStock: 500,
      price: 2,
      purchasePrice: 1.5,
      expiryDate: '2025-06-30',
      rackNumber: 'A-12',
      requiresPrescription: false,
      lastRestocked: '2024-01-15',
      supplier: 'MedSupply Co.'
    },
    {
      id: '2',
      name: 'Amoxicillin 500mg',
      genericName: 'Amoxicillin',
      category: 'Antibiotic',
      manufacturer: 'GSK',
      batchNumber: 'AMX2024002',
      stock: 8,
      minStock: 50,
      maxStock: 200,
      price: 8,
      purchasePrice: 6,
      expiryDate: '2024-12-31',
      rackNumber: 'B-05',
      requiresPrescription: true,
      lastRestocked: '2024-01-10',
      supplier: 'PharmaDist'
    },
    {
      id: '3',
      name: 'Cetirizine 10mg',
      genericName: 'Cetirizine',
      category: 'Antihistamine',
      manufacturer: 'Dr. Reddy\'s',
      batchNumber: 'CTZ2024003',
      stock: 0,
      minStock: 30,
      maxStock: 150,
      price: 3,
      purchasePrice: 2,
      expiryDate: '2025-03-31',
      rackNumber: 'C-08',
      requiresPrescription: false,
      lastRestocked: '2023-12-20',
      supplier: 'MedSupply Co.'
    },
    {
      id: '4',
      name: 'Omeprazole 20mg',
      genericName: 'Omeprazole',
      category: 'PPI',
      manufacturer: 'Sun Pharma',
      batchNumber: 'OMP2024004',
      stock: 120,
      minStock: 40,
      maxStock: 200,
      price: 5,
      purchasePrice: 3.5,
      expiryDate: '2025-09-30',
      rackNumber: 'D-15',
      requiresPrescription: true,
      lastRestocked: '2024-01-20',
      supplier: 'PharmaDist'
    },
    {
      id: '5',
      name: 'Metformin 500mg',
      genericName: 'Metformin',
      category: 'Antidiabetic',
      manufacturer: 'USV',
      batchNumber: 'MET2024005',
      stock: 5,
      minStock: 60,
      maxStock: 250,
      price: 4,
      purchasePrice: 2.5,
      expiryDate: '2024-04-30',
      rackNumber: 'E-22',
      requiresPrescription: true,
      lastRestocked: '2024-01-05',
      supplier: 'DirectPharma'
    }
  ]);

  // Mock stock movements
  const stockMovements: StockMovement[] = [
    {
      id: '1',
      medicineId: '1',
      medicineName: 'Paracetamol 500mg',
      type: 'out',
      quantity: 20,
      date: format(new Date(), 'yyyy-MM-dd'),
      reason: 'Customer purchase',
      performedBy: 'Staff'
    },
    {
      id: '2',
      medicineId: '2',
      medicineName: 'Amoxicillin 500mg',
      type: 'in',
      quantity: 100,
      date: format(new Date(Date.now() - 86400000), 'yyyy-MM-dd'),
      reason: 'Stock replenishment',
      performedBy: 'Manager',
      invoiceNumber: 'INV-2024-001'
    }
  ];

  const getStockStatus = (medicine: Medicine) => {
    const percentage = (medicine.stock / medicine.maxStock) * 100;
    if (medicine.stock === 0) {
      return { label: 'Out of Stock', color: 'destructive', percentage: 0 };
    } else if (medicine.stock < medicine.minStock) {
      return { label: 'Low Stock', color: 'warning', percentage };
    } else if (medicine.stock > medicine.maxStock * 0.9) {
      return { label: 'Overstocked', color: 'secondary', percentage };
    }
    return { label: 'In Stock', color: 'success', percentage };
  };

  const getExpiryStatus = (expiryDate: string) => {
    const today = new Date();
    const expiry = new Date(expiryDate);
    const daysToExpiry = Math.floor((expiry.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
    
    if (daysToExpiry < 0) {
      return { label: 'Expired', color: 'destructive' };
    } else if (daysToExpiry < 30) {
      return { label: `Expires in ${daysToExpiry} days`, color: 'destructive' };
    } else if (daysToExpiry < 90) {
      return { label: `Expires in ${Math.floor(daysToExpiry / 30)} months`, color: 'warning' };
    }
    return { label: format(expiry, 'MMM yyyy'), color: 'default' };
  };

  const handleUpdateStock = (medicine: Medicine) => {
    const amount = parseInt(stockUpdateAmount);
    if (isNaN(amount) || amount <= 0) {
      toast({
        title: "Invalid Amount",
        description: "Please enter a valid quantity.",
        variant: "destructive"
      });
      return;
    }

    const newStock = stockUpdateType === 'add' 
      ? medicine.stock + amount 
      : Math.max(0, medicine.stock - amount);

    setInventory(inventory.map(item => 
      item.id === medicine.id 
        ? { ...item, stock: newStock, lastRestocked: format(new Date(), 'yyyy-MM-dd') }
        : item
    ));

    toast({
      title: "Stock Updated",
      description: `${medicine.name} stock ${stockUpdateType === 'add' ? 'increased' : 'decreased'} by ${amount} units.`,
    });

    setSelectedMedicine(null);
    setStockUpdateAmount('');
    setShowAddStock(false);
  };

  const handleDeleteMedicine = (medicine: Medicine) => {
    setInventory(inventory.filter(item => item.id !== medicine.id));
    toast({
      title: "Medicine Removed",
      description: `${medicine.name} has been removed from inventory.`,
      variant: "destructive"
    });
  };

  const filteredInventory = inventory.filter(medicine => {
    const matchesSearch = medicine.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          medicine.genericName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          medicine.manufacturer.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = filterCategory === 'all' || medicine.category === filterCategory;
    return matchesSearch && matchesCategory;
  });

  const lowStockItems = inventory.filter(med => med.stock < med.minStock && med.stock > 0);
  const outOfStockItems = inventory.filter(med => med.stock === 0);
  const expiringItems = inventory.filter(med => {
    const daysToExpiry = Math.floor((new Date(med.expiryDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));
    return daysToExpiry <= 90 && daysToExpiry > 0;
  });

  const totalValue = inventory.reduce((sum, med) => sum + (med.stock * med.price), 0);
  const totalPurchaseValue = inventory.reduce((sum, med) => sum + (med.stock * med.purchasePrice), 0);

  return (
    <div className="space-y-4">
      {/* Statistics Overview */}
      <div className="grid md:grid-cols-5 gap-4">
        <Card className="shadow-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Items</CardTitle>
            <Package className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{inventory.length}</div>
            <p className="text-xs text-muted-foreground">Unique medicines</p>
          </CardContent>
        </Card>

        <Card className="shadow-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Low Stock</CardTitle>
            <AlertTriangle className="h-4 w-4 text-orange-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">{lowStockItems.length}</div>
            <p className="text-xs text-muted-foreground">Need restock</p>
          </CardContent>
        </Card>

        <Card className="shadow-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Out of Stock</CardTitle>
            <XCircle className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{outOfStockItems.length}</div>
            <p className="text-xs text-muted-foreground">Urgent</p>
          </CardContent>
        </Card>

        <Card className="shadow-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Expiring Soon</CardTitle>
            <Clock className="h-4 w-4 text-yellow-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">{expiringItems.length}</div>
            <p className="text-xs text-muted-foreground">Within 90 days</p>
          </CardContent>
        </Card>

        <Card className="shadow-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Stock Value</CardTitle>
            <IndianRupee className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">₹{totalValue.toFixed(0)}</div>
            <p className="text-xs text-muted-foreground">Total inventory</p>
          </CardContent>
        </Card>
      </div>

      {/* Inventory Management */}
      <Card className="shadow-card">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Inventory Management</CardTitle>
              <CardDescription>Track and manage medicine stock levels</CardDescription>
            </div>
            <div className="flex space-x-2">
              <Button variant="outline" size="sm">
                <Upload className="h-4 w-4 mr-1" />
                Import
              </Button>
              <Button variant="outline" size="sm">
                <Download className="h-4 w-4 mr-1" />
                Export
              </Button>
              <Button variant="medical" size="sm">
                <Plus className="h-4 w-4 mr-1" />
                Add Medicine
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="all" className="space-y-4">
            <div className="flex items-center justify-between">
              <TabsList>
                <TabsTrigger value="all">All Stock</TabsTrigger>
                <TabsTrigger value="low">Low Stock ({lowStockItems.length})</TabsTrigger>
                <TabsTrigger value="expiring">Expiring ({expiringItems.length})</TabsTrigger>
                <TabsTrigger value="movements">Stock Movements</TabsTrigger>
              </TabsList>
              
              <div className="flex items-center space-x-2">
                <div className="relative">
                  <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                  <Input
                    placeholder="Search medicines..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-8 w-64"
                  />
                </div>
                <select
                  value={filterCategory}
                  onChange={(e) => setFilterCategory(e.target.value)}
                  className="rounded-md border border-input bg-background px-3 py-2"
                >
                  <option value="all">All Categories</option>
                  <option value="Analgesic">Analgesic</option>
                  <option value="Antibiotic">Antibiotic</option>
                  <option value="Antihistamine">Antihistamine</option>
                  <option value="PPI">PPI</option>
                  <option value="Antidiabetic">Antidiabetic</option>
                </select>
              </div>
            </div>

            <TabsContent value="all" className="space-y-4">
              <div className="rounded-md border">
                <table className="w-full">
                  <thead>
                    <tr className="border-b bg-muted/50">
                      <th className="text-left p-3">Medicine</th>
                      <th className="text-left p-3">Batch</th>
                      <th className="text-left p-3">Stock Level</th>
                      <th className="text-left p-3">Price</th>
                      <th className="text-left p-3">Expiry</th>
                      <th className="text-left p-3">Rack</th>
                      <th className="text-left p-3">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredInventory.map(medicine => {
                      const stockStatus = getStockStatus(medicine);
                      const expiryStatus = getExpiryStatus(medicine.expiryDate);
                      
                      return (
                        <tr key={medicine.id} className="border-b hover:bg-muted/30">
                          <td className="p-3">
                            <div>
                              <p className="font-medium">{medicine.name}</p>
                              <p className="text-sm text-muted-foreground">
                                {medicine.genericName} • {medicine.manufacturer}
                              </p>
                            </div>
                          </td>
                          <td className="p-3">
                            <p className="text-sm">{medicine.batchNumber}</p>
                          </td>
                          <td className="p-3">
                            <div className="space-y-2">
                              <div className="flex items-center space-x-2">
                                <span className="font-medium">{medicine.stock}</span>
                                <span className="text-sm text-muted-foreground">/ {medicine.maxStock}</span>
                                <Badge variant={stockStatus.color as 'default' | 'secondary' | 'destructive' | 'warning' | 'success'}>
                                  {stockStatus.label}
                                </Badge>
                              </div>
                              <Progress value={stockStatus.percentage} className="h-2 w-32" />
                            </div>
                          </td>
                          <td className="p-3">
                            <div>
                              <p className="font-medium">₹{medicine.price}</p>
                              <p className="text-xs text-muted-foreground">Cost: ₹{medicine.purchasePrice}</p>
                            </div>
                          </td>
                          <td className="p-3">
                            <Badge variant={expiryStatus.color as 'default' | 'secondary' | 'destructive' | 'warning' | 'success'}>
                              {expiryStatus.label}
                            </Badge>
                          </td>
                          <td className="p-3">
                            <Badge variant="outline">{medicine.rackNumber}</Badge>
                          </td>
                          <td className="p-3">
                            <div className="flex space-x-1">
                              <Button 
                                size="sm" 
                                variant="outline"
                                onClick={() => {
                                  setSelectedMedicine(medicine);
                                  setShowAddStock(true);
                                  setStockUpdateType('add');
                                }}
                              >
                                <Plus className="h-3 w-3" />
                              </Button>
                              <Button 
                                size="sm" 
                                variant="outline"
                                onClick={() => {
                                  setSelectedMedicine(medicine);
                                  setShowAddStock(true);
                                  setStockUpdateType('remove');
                                }}
                              >
                                <Minus className="h-3 w-3" />
                              </Button>
                              <Button 
                                size="sm" 
                                variant="outline"
                              >
                                <Edit className="h-3 w-3" />
                              </Button>
                              <Button 
                                size="sm" 
                                variant="destructive"
                                onClick={() => handleDeleteMedicine(medicine)}
                              >
                                <Trash2 className="h-3 w-3" />
                              </Button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </TabsContent>

            <TabsContent value="low" className="space-y-4">
              {lowStockItems.length === 0 ? (
                <Alert>
                  <CheckCircle className="h-4 w-4" />
                  <AlertDescription>
                    All medicines are adequately stocked.
                  </AlertDescription>
                </Alert>
              ) : (
                <div className="space-y-3">
                  {lowStockItems.map(medicine => (
                    <Card key={medicine.id} className="border-orange-200">
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                          <div>
                            <h4 className="font-semibold">{medicine.name}</h4>
                            <p className="text-sm text-muted-foreground">
                              Current: {medicine.stock} | Minimum: {medicine.minStock} | Supplier: {medicine.supplier}
                            </p>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Badge variant="warning">Low Stock</Badge>
                            <Button size="sm" variant="medical">
                              <Plus className="h-3 w-3 mr-1" />
                              Reorder
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </TabsContent>

            <TabsContent value="expiring" className="space-y-4">
              {expiringItems.length === 0 ? (
                <Alert>
                  <CheckCircle className="h-4 w-4" />
                  <AlertDescription>
                    No medicines expiring in the next 90 days.
                  </AlertDescription>
                </Alert>
              ) : (
                <div className="space-y-3">
                  {expiringItems.map(medicine => {
                    const expiryStatus = getExpiryStatus(medicine.expiryDate);
                    return (
                      <Card key={medicine.id} className="border-yellow-200">
                        <CardContent className="p-4">
                          <div className="flex items-center justify-between">
                            <div>
                              <h4 className="font-semibold">{medicine.name}</h4>
                              <p className="text-sm text-muted-foreground">
                                Batch: {medicine.batchNumber} | Stock: {medicine.stock} units
                              </p>
                            </div>
                            <div className="flex items-center space-x-2">
                              <Badge variant={expiryStatus.color as 'default' | 'secondary' | 'destructive' | 'warning' | 'success'}>
                                {expiryStatus.label}
                              </Badge>
                              <Button size="sm" variant="outline">
                                Mark for Return
                              </Button>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>
              )}
            </TabsContent>

            <TabsContent value="movements" className="space-y-4">
              <div className="rounded-md border">
                <table className="w-full">
                  <thead>
                    <tr className="border-b bg-muted/50">
                      <th className="text-left p-3">Date</th>
                      <th className="text-left p-3">Medicine</th>
                      <th className="text-left p-3">Type</th>
                      <th className="text-left p-3">Quantity</th>
                      <th className="text-left p-3">Reason</th>
                      <th className="text-left p-3">By</th>
                    </tr>
                  </thead>
                  <tbody>
                    {stockMovements.map(movement => (
                      <tr key={movement.id} className="border-b">
                        <td className="p-3">{movement.date}</td>
                        <td className="p-3">{movement.medicineName}</td>
                        <td className="p-3">
                          <Badge variant={movement.type === 'in' ? 'success' : 'destructive'}>
                            {movement.type === 'in' ? <TrendingUp className="h-3 w-3 mr-1" /> : <TrendingDown className="h-3 w-3 mr-1" />}
                            {movement.type.toUpperCase()}
                          </Badge>
                        </td>
                        <td className="p-3">
                          <span className={movement.type === 'in' ? 'text-green-600' : 'text-red-600'}>
                            {movement.type === 'in' ? '+' : '-'}{movement.quantity}
                          </span>
                        </td>
                        <td className="p-3">{movement.reason}</td>
                        <td className="p-3">{movement.performedBy}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {/* Stock Update Dialog */}
      {showAddStock && selectedMedicine && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <Card className="w-96">
            <CardHeader>
              <CardTitle>
                {stockUpdateType === 'add' ? 'Add Stock' : 'Remove Stock'}
              </CardTitle>
              <CardDescription>{selectedMedicine.name}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-sm font-medium">Current Stock</label>
                <p className="text-2xl font-bold">{selectedMedicine.stock} units</p>
              </div>
              <div>
                <label className="text-sm font-medium">
                  {stockUpdateType === 'add' ? 'Quantity to Add' : 'Quantity to Remove'}
                </label>
                <Input
                  type="number"
                  placeholder="Enter quantity"
                  value={stockUpdateAmount}
                  onChange={(e) => setStockUpdateAmount(e.target.value)}
                />
              </div>
              <div className="flex space-x-2">
                <Button 
                  variant="medical" 
                  className="flex-1"
                  onClick={() => handleUpdateStock(selectedMedicine)}
                >
                  Confirm
                </Button>
                <Button 
                  variant="outline" 
                  className="flex-1"
                  onClick={() => {
                    setShowAddStock(false);
                    setSelectedMedicine(null);
                    setStockUpdateAmount('');
                  }}
                >
                  Cancel
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};