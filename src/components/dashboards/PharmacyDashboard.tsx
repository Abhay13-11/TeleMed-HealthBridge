import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Layout } from '@/components/layout/Layout';
import { 
  Package, 
  AlertTriangle, 
  TrendingUp, 
  Plus, 
  CheckCircle,
  ShoppingCart,
  Building2,
  X,
  Truck,
  Clock,
  DollarSign,
  BarChart3,
  Search,
  Filter,
  Download,
  Upload,
  Bell,
  Settings,
  Users,
  FileText,
  Calendar,
  Activity,
  Shield,
  Pill,
  Archive,
  RefreshCw,
  Phone,
  Mail,
  MapPin,
  CreditCard,
  TrendingDown,
  Zap,
  Heart,
  Star,
  Database,
  ClipboardList
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { storageService } from '@/services/storage';
import { MedicineStock } from '@/types/medical';
import { useToast } from '@/hooks/use-toast';
import { InventoryManagement } from '@/components/pharmacy/InventoryManagement';

const PharmacyDashboard = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState('overview');
  const [showAddMedicineCard, setShowAddMedicineCard] = useState(false);
  const [showUpdateInventoryCard, setShowUpdateInventoryCard] = useState(false);
  const [showLowStockAlert, setShowLowStockAlert] = useState(false);

  const [pharmacyStock, setPharmacyStock] = useState<MedicineStock[]>(() => {
    const stock = storageService.getInventory(user?.id);
    return stock.length > 0 ? stock : storageService.getInventory();
  });

  useEffect(() => {
    const stock = storageService.getInventory(user?.id);
    setPharmacyStock(stock.length > 0 ? stock : storageService.getInventory());
  }, [user?.id, activeTab]);

  const lowStockCount = pharmacyStock.filter(med => med.stock < 10).length;
  const outOfStockCount = pharmacyStock.filter(med => med.stock === 0).length;
  const totalMedicines = pharmacyStock.length;

  const handleQuickAddMedicine = () => {
    setActiveTab('inventory');
    toast({
      title: "Inventory Management",
      description: "Use the inventory management tools to add new medicines.",
    });
  };

  const handleQuickUpdateInventory = () => {
    setActiveTab('inventory');
    toast({
      title: "Inventory Management",
      description: "Use the inventory management tools to update stock levels.",
    });
  };

  const handleQuickLowStock = () => {
    setShowLowStockAlert(true);
  };

  // Animation variants
  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        delay: 0.1,
        type: "spring" as const,
        stiffness: 100
      }
    }
  };

  const buttonVariants = {
    hover: {
      scale: 1.05,
      boxShadow: "0 10px 20px rgba(0,0,0,0.1)",
      transition: { type: "spring" as const, stiffness: 400 }
    },
    tap: { scale: 0.95 }
  };

  const getStockStatus = (stock: number) => {
    if (stock === 0) return { label: 'Out of Stock', variant: 'destructive' as const };
    if (stock < 10) return { label: 'Low Stock', variant: 'secondary' as const };
    return { label: 'In Stock', variant: 'default' as const };
  };

  return (
    <Layout>
      <div className="px-4 md:px-6 lg:px-8 space-y-8 max-w-7xl mx-auto">
        <motion.div 
          className="text-center py-8"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-5xl font-bold bg-gradient-to-r from-purple-600 to-pink-500 bg-clip-text text-transparent mb-2">
            Pharmacy Management Hub
          </h1>
          <p className="text-xl text-gray-600">
            Welcome back, {user?.name} - Your digital pharmacy assistant
          </p>
        </motion.div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">Dashboard</TabsTrigger>
            <TabsTrigger value="inventory">Inventory</TabsTrigger>
            <TabsTrigger value="orders">Orders</TabsTrigger>
            <TabsTrigger value="requests">Requests</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <div className="grid md:grid-cols-4 gap-6">
              <motion.div
                custom={0}
                variants={cardVariants}
                initial="hidden"
                animate="visible"
                whileHover={{ y: -5, transition: { duration: 0.2 } }}
              >
                <Card className="shadow-xl border-0 bg-gradient-to-br from-purple-50 to-white overflow-hidden relative group">
                  <div className="absolute inset-0 bg-gradient-to-br from-purple-500 to-pink-500 opacity-0 group-hover:opacity-5 transition-opacity duration-300"></div>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-lg font-semibold">Total Medicines</CardTitle>
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
                    >
                      <Package className="h-6 w-6 text-purple-500" />
                    </motion.div>
                  </CardHeader>
                  <CardContent>
                    <motion.div 
                      className="text-4xl font-bold text-purple-600"
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ type: "spring", stiffness: 200, delay: 0.2 }}
                    >
                      {totalMedicines}
                    </motion.div>
                    <p className="text-sm text-gray-600 mt-2">In your inventory</p>
                  </CardContent>
                </Card>
              </motion.div>

              <motion.div
                custom={1}
                variants={cardVariants}
                initial="hidden"
                animate="visible"
                whileHover={{ y: -5, transition: { duration: 0.2 } }}
              >
                <Card className="shadow-xl border-0 bg-gradient-to-br from-orange-50 to-white overflow-hidden relative group">
                  <div className="absolute inset-0 bg-gradient-to-br from-orange-500 to-yellow-500 opacity-0 group-hover:opacity-5 transition-opacity duration-300"></div>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-lg font-semibold">Low Stock</CardTitle>
                    <motion.div
                      animate={{ scale: [1, 1.2, 1] }}
                      transition={{ duration: 2, repeat: Infinity }}
                    >
                      <AlertTriangle className="h-6 w-6 text-orange-500" />
                    </motion.div>
                  </CardHeader>
                  <CardContent>
                    <motion.div 
                      className="text-4xl font-bold text-orange-600"
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ type: "spring", stiffness: 200, delay: 0.3 }}
                    >
                      {lowStockCount}
                    </motion.div>
                    <p className="text-sm text-gray-600 mt-2">Need restocking</p>
                  </CardContent>
                </Card>
              </motion.div>

              <motion.div
                custom={2}
                variants={cardVariants}
                initial="hidden"
                animate="visible"
                whileHover={{ y: -5, transition: { duration: 0.2 } }}
              >
                <Card className="shadow-xl border-0 bg-gradient-to-br from-red-50 to-white overflow-hidden relative group">
                  <div className="absolute inset-0 bg-gradient-to-br from-red-500 to-pink-500 opacity-0 group-hover:opacity-5 transition-opacity duration-300"></div>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-lg font-semibold">Out of Stock</CardTitle>
                    <motion.div
                      animate={{ y: [0, -5, 0] }}
                      transition={{ duration: 1.5, repeat: Infinity, repeatDelay: 1 }}
                    >
                      <AlertTriangle className="h-6 w-6 text-red-500" />
                    </motion.div>
                  </CardHeader>
                  <CardContent>
                    <motion.div 
                      className="text-4xl font-bold text-red-600"
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ type: "spring", stiffness: 200, delay: 0.4 }}
                    >
                      {outOfStockCount}
                    </motion.div>
                    <p className="text-sm text-gray-600 mt-2">Urgent restocking</p>
                  </CardContent>
                </Card>
              </motion.div>

              <motion.div
                custom={3}
                variants={cardVariants}
                initial="hidden"
                animate="visible"
                whileHover={{ y: -5, transition: { duration: 0.2 } }}
              >
                <Card className="shadow-xl border-0 bg-gradient-to-br from-green-50 to-white overflow-hidden relative group">
                  <div className="absolute inset-0 bg-gradient-to-br from-green-500 to-emerald-500 opacity-0 group-hover:opacity-5 transition-opacity duration-300"></div>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-lg font-semibold">Monthly Sales</CardTitle>
                    <motion.div
                      animate={{ rotate: [0, 10, -10, 0] }}
                      transition={{ duration: 2, repeat: Infinity, repeatDelay: 1 }}
                    >
                      <TrendingUp className="h-6 w-6 text-green-500" />
                    </motion.div>
                  </CardHeader>
                  <CardContent>
                    <motion.div 
                      className="text-4xl font-bold text-green-600"
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ type: "spring", stiffness: 200, delay: 0.5 }}
                    >
                      ₹45,280
                    </motion.div>
                    <p className="text-sm text-gray-600 mt-2">+12% from last month</p>
                  </CardContent>
                </Card>
              </motion.div>
            </div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
            >
              <Card className="shadow-xl border-0 bg-white">
                <CardHeader className="bg-gradient-to-r from-purple-500 to-pink-500 text-white">
                  <CardTitle className="text-2xl">Pharmacy Toolkit</CardTitle>
                  <CardDescription className="text-purple-100">Essential pharmacy management tools</CardDescription>
                </CardHeader>
                <CardContent className="grid md:grid-cols-4 lg:grid-cols-4 gap-4 p-6">
                  <motion.div
                    variants={buttonVariants}
                    whileHover="hover"
                    whileTap="tap"
                  >
                    <Button 
                      variant="medical" 
                      className="h-32 w-full flex-col space-y-3 bg-gradient-to-br from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 text-white shadow-lg"
                      onClick={handleQuickAddMedicine}
                    >
                      <motion.div
                        animate={{ rotate: [0, 10, -10, 0] }}
                        transition={{ duration: 2, repeat: Infinity, repeatDelay: 1 }}
                      >
                        <Plus className="h-10 w-10" />
                      </motion.div>
                      <span className="text-lg font-semibold">Add Medicine</span>
                    </Button>
                  </motion.div>

                  <motion.div
                    variants={buttonVariants}
                    whileHover="hover"
                    whileTap="tap"
                  >
                    <Button 
                      variant="outline" 
                      className="h-32 w-full flex-col space-y-3 bg-gradient-to-br from-blue-100 to-blue-200 hover:from-blue-200 hover:to-blue-300 shadow-lg"
                      onClick={handleQuickUpdateInventory}
                    >
                      <Package className="h-10 w-10 text-blue-600" />
                      <span className="text-lg font-semibold">Inventory</span>
                    </Button>
                  </motion.div>

                  <motion.div
                    variants={buttonVariants}
                    whileHover="hover"
                    whileTap="tap"
                    animate={{ scale: [1, 1.05, 1] }}
                    transition={{ duration: 1, repeat: Infinity }}
                  >
                    <Button 
                      variant="destructive" 
                      className="h-32 w-full flex-col space-y-3 bg-gradient-to-br from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white shadow-lg relative overflow-hidden"
                      onClick={handleQuickLowStock}
                    >
                      <div className="absolute inset-0 bg-white opacity-20 animate-pulse"></div>
                      <AlertTriangle className="h-10 w-10 relative z-10" />
                      <span className="text-lg font-semibold relative z-10">Low Stock</span>
                    </Button>
                  </motion.div>

                  <motion.div
                    variants={buttonVariants}
                    whileHover="hover"
                    whileTap="tap"
                  >
                    <Button 
                      variant="outline" 
                      className="h-32 w-full flex-col space-y-3 bg-gradient-to-br from-green-100 to-green-200 hover:from-green-200 hover:to-green-300 shadow-lg"
                      onClick={() => {
                        toast({
                          title: "📊 Sales Analytics",
                          description: "Viewing sales reports and trends",
                        });
                      }}
                    >
                      <BarChart3 className="h-10 w-10 text-green-600" />
                      <span className="text-lg font-semibold">Analytics</span>
                    </Button>
                  </motion.div>

                  <motion.div
                    variants={buttonVariants}
                    whileHover="hover"
                    whileTap="tap"
                  >
                    <Button 
                      variant="outline" 
                      className="h-32 w-full flex-col space-y-3 bg-gradient-to-br from-cyan-100 to-cyan-200 hover:from-cyan-200 hover:to-cyan-300 shadow-lg"
                      onClick={() => {
                        toast({
                          title: "🚚 Delivery Management",
                          description: "Track and manage medicine deliveries",
                        });
                      }}
                    >
                      <Truck className="h-10 w-10 text-cyan-600" />
                      <span className="text-lg font-semibold">Deliveries</span>
                    </Button>
                  </motion.div>

                  <motion.div
                    variants={buttonVariants}
                    whileHover="hover"
                    whileTap="tap"
                  >
                    <Button 
                      variant="outline" 
                      className="h-32 w-full flex-col space-y-3 bg-gradient-to-br from-yellow-100 to-yellow-200 hover:from-yellow-200 hover:to-yellow-300 shadow-lg"
                      onClick={() => {
                        toast({
                          title: "📞 Supplier Contacts",
                          description: "Managing supplier relationships",
                        });
                      }}
                    >
                      <Building2 className="h-10 w-10 text-yellow-600" />
                      <span className="text-lg font-semibold">Suppliers</span>
                    </Button>
                  </motion.div>

                  <motion.div
                    variants={buttonVariants}
                    whileHover="hover"
                    whileTap="tap"
                  >
                    <Button 
                      variant="outline" 
                      className="h-32 w-full flex-col space-y-3 bg-gradient-to-br from-indigo-100 to-indigo-200 hover:from-indigo-200 hover:to-indigo-300 shadow-lg"
                      onClick={() => {
                        toast({
                          title: "💳 Billing & Payments",
                          description: "Process customer payments",
                        });
                      }}
                    >
                      <CreditCard className="h-10 w-10 text-indigo-600" />
                      <span className="text-lg font-semibold">Billing</span>
                    </Button>
                  </motion.div>

                  <motion.div
                    variants={buttonVariants}
                    whileHover="hover"
                    whileTap="tap"
                  >
                    <Button 
                      variant="outline" 
                      className="h-32 w-full flex-col space-y-3 bg-gradient-to-br from-pink-100 to-pink-200 hover:from-pink-200 hover:to-pink-300 shadow-lg"
                      onClick={() => {
                        toast({
                          title: "🔍 Medicine Search",
                          description: "Search medicine database",
                        });
                      }}
                    >
                      <Search className="h-10 w-10 text-pink-600" />
                      <span className="text-lg font-semibold">Search</span>
                    </Button>
                  </motion.div>

                  <motion.div
                    variants={buttonVariants}
                    whileHover="hover"
                    whileTap="tap"
                  >
                    <Button 
                      variant="outline" 
                      className="h-32 w-full flex-col space-y-3 bg-gradient-to-br from-emerald-100 to-emerald-200 hover:from-emerald-200 hover:to-emerald-300 shadow-lg"
                      onClick={() => {
                        toast({
                          title: "📋 Prescription Management",
                          description: "Verify and process prescriptions",
                        });
                      }}
                    >
                      <FileText className="h-10 w-10 text-emerald-600" />
                      <span className="text-lg font-semibold">Prescriptions</span>
                    </Button>
                  </motion.div>

                  <motion.div
                    variants={buttonVariants}
                    whileHover="hover"
                    whileTap="tap"
                  >
                    <Button 
                      variant="outline" 
                      className="h-32 w-full flex-col space-y-3 bg-gradient-to-br from-red-100 to-red-200 hover:from-red-200 hover:to-red-300 shadow-lg"
                      onClick={() => {
                        toast({
                          title: "📅 Expiry Management",
                          description: "Track medicine expiry dates",
                        });
                      }}
                    >
                      <Calendar className="h-10 w-10 text-red-600" />
                      <span className="text-lg font-semibold">Expiry Dates</span>
                    </Button>
                  </motion.div>

                  <motion.div
                    variants={buttonVariants}
                    whileHover="hover"
                    whileTap="tap"
                  >
                    <Button 
                      variant="outline" 
                      className="h-32 w-full flex-col space-y-3 bg-gradient-to-br from-teal-100 to-teal-200 hover:from-teal-200 hover:to-teal-300 shadow-lg"
                      onClick={() => {
                        toast({
                          title: "👥 Customer Database",
                          description: "Manage customer information",
                        });
                      }}
                    >
                      <Users className="h-10 w-10 text-teal-600" />
                      <span className="text-lg font-semibold">Customers</span>
                    </Button>
                  </motion.div>

                  <motion.div
                    variants={buttonVariants}
                    whileHover="hover"
                    whileTap="tap"
                  >
                    <Button 
                      variant="outline" 
                      className="h-32 w-full flex-col space-y-3 bg-gradient-to-br from-amber-100 to-amber-200 hover:from-amber-200 hover:to-amber-300 shadow-lg"
                      onClick={() => {
                        toast({
                          title: "📈 Reports",
                          description: "Generate business reports",
                        });
                      }}
                    >
                      <ClipboardList className="h-10 w-10 text-amber-600" />
                      <span className="text-lg font-semibold">Reports</span>
                    </Button>
                  </motion.div>
                </CardContent>
              </Card>
            </motion.div>
          </TabsContent>

        <TabsContent value="inventory" className="space-y-4">
          <InventoryManagement />
        </TabsContent>

        <TabsContent value="orders" className="space-y-4">
          <Card className="shadow-card">
            <CardHeader>
              <CardTitle>Recent Orders</CardTitle>
              <CardDescription>Manage customer orders and deliveries</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="border border-border rounded-lg p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Order #ORD-2024-0142</p>
                    <p className="text-sm text-muted-foreground">Customer: Amarjit Singh</p>
                  </div>
                  <Badge variant="secondary">Delivered</Badge>
                </div>
                <div className="space-y-1">
                  <p className="text-sm">Paracetamol 500mg x 2 strips - ₹40</p>
                  <p className="text-sm">Cetirizine 10mg x 1 strip - ₹25</p>
                </div>
                <div className="flex justify-between items-center">
                  <span className="font-medium">Total: ₹65</span>
                  <span className="text-xs text-muted-foreground">2 hours ago</span>
                </div>
              </div>

              <div className="border border-border rounded-lg p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Order #ORD-2024-0141</p>
                    <p className="text-sm text-muted-foreground">Customer: Priya Sharma</p>
                  </div>
                  <Badge variant="secondary">Processing</Badge>
                </div>
                <div className="space-y-1">
                  <p className="text-sm">Amoxicillin 500mg x 1 strip - ₹80</p>
                  <p className="text-sm">Vitamin D3 supplements x 1 bottle - ₹250</p>
                </div>
                <div className="flex justify-between items-center">
                  <span className="font-medium">Total: ₹330</span>
                  <Button size="sm" variant="medical">
                    Mark as Ready
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="requests" className="space-y-4">
          <Card className="shadow-card">
            <CardHeader>
              <CardTitle>Medicine Requests</CardTitle>
              <CardDescription>Patient queries about medicine availability</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="border border-border rounded-lg p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="font-medium">Krishna</span>
                  <Badge variant="secondary">2 hours ago</Badge>
                </div>
                <p className="text-sm text-muted-foreground">
                  Requesting availability for: Azithromycin 250mg
                </p>
                <div className="flex space-x-2">
                  <Button size="sm" variant="success">
                    Available - 45 units
                  </Button>
                  <Button size="sm" variant="outline">
                    Contact Patient
                  </Button>
                </div>
              </div>

              <div className="border border-border rounded-lg p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="font-medium">Meera Singh</span>
                  <Badge variant="secondary">5 hours ago</Badge>
                </div>
                <p className="text-sm text-muted-foreground">
                  Requesting availability for: Cetirizine 10mg
                </p>
                <div className="flex space-x-2">
                  <Button size="sm" variant="emergency">
                    Out of Stock
                  </Button>
                  <Button size="sm" variant="outline">
                    Suggest Alternative
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Low Stock Alert Card */}
          {showLowStockAlert && (
            <Card className="shadow-card border-orange-200 bg-orange-50">
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle className="text-orange-800">Low Stock Alert</CardTitle>
                  <CardDescription>Medicines requiring immediate attention</CardDescription>
                </div>
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={() => setShowLowStockAlert(false)}
                >
                  <X className="h-4 w-4" />
                </Button>
              </CardHeader>
              <CardContent className="space-y-4">
                {outOfStockCount > 0 && (
                  <div className="space-y-3">
                    <h3 className="font-semibold text-red-600">Out of Stock ({outOfStockCount})</h3>
                    {pharmacyStock.filter(m => m.stock === 0).slice(0, 3).map(medicine => (
                      <div key={medicine.id} className="flex justify-between items-center p-3 bg-white rounded-lg border border-red-200">
                        <div>
                          <p className="font-medium">{medicine.name}</p>
                          <p className="text-sm text-muted-foreground">{medicine.manufacturer}</p>
                        </div>
                        <Button size="sm" variant="destructive">
                          Order Now
                        </Button>
                      </div>
                    ))}
                  </div>
                )}

                {lowStockCount > 0 && (
                  <div className="space-y-3">
                    <h3 className="font-semibold text-orange-600">Low Stock ({lowStockCount})</h3>
                    {pharmacyStock.filter(m => m.stock > 0 && m.stock < 10).slice(0, 3).map(medicine => (
                      <div key={medicine.id} className="flex justify-between items-center p-3 bg-white rounded-lg border border-orange-200">
                        <div>
                          <p className="font-medium">{medicine.name}</p>
                          <p className="text-sm text-muted-foreground">Stock: {medicine.stock} units</p>
                        </div>
                        <Button size="sm" variant="warning">
                          Reorder
                        </Button>
                      </div>
                    ))}
                  </div>
                )}

                <div className="flex space-x-2 mt-4">
                  <Button variant="medical" className="flex-1" onClick={() => setActiveTab('inventory')}>
                    <ShoppingCart className="h-4 w-4 mr-1" />
                    Manage Inventory
                  </Button>
                  <Button variant="outline" className="flex-1">
                    <Building2 className="h-4 w-4 mr-1" />
                    Contact Suppliers
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>
      </div>
    </Layout>
  );
};

export default PharmacyDashboard;
