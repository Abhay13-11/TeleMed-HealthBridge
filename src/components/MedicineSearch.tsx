import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { ScrollArea } from '@/components/ui/scroll-area';
import { 
  Search, 
  Pill, 
  MapPin, 
  Clock, 
  ShoppingCart, 
  CheckCircle, 
  XCircle, 
  AlertTriangle, 
  Info, 
  Package, 
  Store,
  RefreshCw,
  Building2,
  Calendar
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { storageService } from '@/services/storage';
import { MedicineStock } from '@/types/medical';

export const MedicineSearch: React.FC = () => {
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState('');
  const [inventoryList, setInventoryList] = useState<MedicineStock[]>([]);
  const [selectedMedicine, setSelectedMedicine] = useState<MedicineStock | null>(null);
  const [isSearching, setIsSearching] = useState(false);
  const [cart, setCart] = useState<{ item: MedicineStock; quantity: number }[]>([]);

  const loadInventory = (query = '') => {
    setIsSearching(true);
    setTimeout(() => {
      const items = storageService.searchMedicineInventory(query);
      setInventoryList(items);
      setIsSearching(false);
    }, 200);
  };

  useEffect(() => {
    loadInventory();
  }, []);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    loadInventory(searchQuery);
  };

  const addToCart = (med: MedicineStock) => {
    if (med.stock <= 0) {
      toast({
        title: "Item Unavailable",
        description: `${med.name} is currently out of stock at the civil hospital pharmacy.`,
        variant: "destructive"
      });
      return;
    }

    setCart(prev => {
      const existing = prev.find(p => p.item.id === med.id);
      if (existing) {
        if (existing.quantity >= med.stock) {
          toast({
            title: "Stock Limit Reached",
            description: `Only ${med.stock} units currently available in stock.`,
            variant: "destructive"
          });
          return prev;
        }
        return prev.map(p => p.item.id === med.id ? { ...p, quantity: p.quantity + 1 } : p);
      }
      return [...prev, { item: med, quantity: 1 }];
    });

    toast({
      title: "Added to Medication Cart",
      description: `${med.name} added. Pick up at Nabha Civil Hospital Pharmacy.`,
    });
  };

  const handlePlaceOrder = () => {
    if (cart.length === 0) return;

    toast({
      title: "Prescription Reservation Placed",
      description: `Reserved ${cart.reduce((sum, c) => sum + c.quantity, 0)} items for pickup at Nabha Civil Hospital Pharmacy counter.`,
    });
    setCart([]);
  };

  return (
    <div className="space-y-4 text-stone-900 font-sans">
      {/* Search Header */}
      <Card className="border-stone-200 shadow-sm bg-white">
        <CardHeader className="p-4 pb-2">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <CardTitle className="text-base font-bold text-stone-900 flex items-center space-x-2">
                <Store className="h-5 w-5 text-emerald-800" />
                <span>Nabha Civil Hospital Medicine Inventory Lookup</span>
              </CardTitle>
              <CardDescription className="text-xs text-stone-500">
                Truthful, verified stock levels updated daily by hospital dispensary pharmacists.
              </CardDescription>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => { setSearchQuery(''); loadInventory(''); }}
              className="text-xs h-7 self-start sm:self-auto border-stone-300"
            >
              <RefreshCw className="h-3 w-3 mr-1" />
              Reset
            </Button>
          </div>
        </CardHeader>
        <CardContent className="p-4 pt-1">
          <form onSubmit={handleSearchSubmit} className="flex gap-2">
            <div className="relative flex-1">
              <Search className="h-4 w-4 absolute left-3 top-2.5 text-stone-400" />
              <Input
                placeholder="Search by generic name, brand or category (e.g. Paracetamol, Azithromycin, ORS)..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9 text-xs bg-stone-50/50 border-stone-200"
              />
            </div>
            <Button 
              type="submit" 
              className="bg-emerald-800 hover:bg-emerald-900 text-white text-xs px-4"
              disabled={isSearching}
            >
              {isSearching ? 'Searching...' : 'Check Stock'}
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* Main Content Grid */}
      <div className="grid lg:grid-cols-12 gap-4">
        {/* Medicine Results */}
        <div className="lg:col-span-8 space-y-3">
          {inventoryList.length === 0 ? (
            <Card className="border-stone-200 p-8 text-center bg-white">
              <Package className="h-10 w-10 text-stone-400 mx-auto mb-2" />
              <p className="font-semibold text-sm text-stone-800">No matching medicines found in dispensary</p>
              <p className="text-xs text-stone-500 mt-1">
                Try searching for a generic drug name or check with the hospital pharmacist directly.
              </p>
            </Card>
          ) : (
            <div className="space-y-2.5">
              {inventoryList.map((med) => {
                const isOutOfStock = med.stock === 0;
                const isLowStock = med.stock > 0 && med.stock <= (med.minStock || 30);
                
                return (
                  <Card 
                    key={med.id}
                    className={`border-stone-200 hover:border-emerald-600 transition-all cursor-pointer bg-white ${
                      selectedMedicine?.id === med.id ? 'ring-1 ring-emerald-700 border-emerald-700' : ''
                    }`}
                    onClick={() => setSelectedMedicine(med)}
                  >
                    <CardContent className="p-3.5">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
                        <div className="space-y-1">
                          <div className="flex items-center space-x-2">
                            <h4 className="font-bold text-xs text-stone-900">{med.name}</h4>
                            {isOutOfStock ? (
                              <Badge variant="destructive" className="text-[10px]">Out of Stock</Badge>
                            ) : isLowStock ? (
                              <Badge variant="warning" className="text-[10px]">Low Stock ({med.stock} left)</Badge>
                            ) : (
                              <Badge variant="success" className="text-[10px]">{med.stock} Units In Stock</Badge>
                            )}
                            {med.requiresPrescription && (
                              <span className="text-[10px] text-amber-800 bg-amber-50 px-1.5 py-0.2 rounded border border-amber-200 font-medium">
                                Prescription Required
                              </span>
                            )}
                          </div>

                          <div className="flex flex-wrap gap-x-3 gap-y-1 text-[11px] text-stone-500">
                            <span>Generic: <strong className="text-stone-700">{med.genericName || med.name}</strong></span>
                            <span>•</span>
                            <span>Category: {med.category || 'Dispensary Item'}</span>
                            <span>•</span>
                            <span>Rack: <strong className="text-stone-800">{med.rackNumber || 'Dispensary'}</strong></span>
                          </div>

                          <div className="flex items-center space-x-3 text-[11px] text-stone-400 pt-0.5">
                            <span className="flex items-center">
                              <Calendar className="h-3 w-3 mr-1 text-stone-400" />
                              Expiry: {med.expiryDate}
                            </span>
                            <span>•</span>
                            <span>Batch: {med.batchNumber || 'Dispensary Stock'}</span>
                            <span>•</span>
                            <span className="text-emerald-800 font-semibold">Subsidized Rate: ₹{med.price}</span>
                          </div>
                        </div>

                        <div className="flex items-center space-x-2 shrink-0 pt-2 sm:pt-0 border-t sm:border-0 border-stone-100">
                          <Button 
                            size="sm"
                            className="bg-emerald-800 hover:bg-emerald-900 text-white text-xs h-7 px-3"
                            disabled={isOutOfStock}
                            onClick={(e) => {
                              e.stopPropagation();
                              addToCart(med);
                            }}
                          >
                            <ShoppingCart className="h-3 w-3 mr-1" />
                            {isOutOfStock ? 'Unavailable' : 'Reserve'}
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          )}
        </div>

        {/* Selected Details & Cart Summary */}
        <div className="lg:col-span-4 space-y-4">
          {/* Reservation Cart */}
          <Card className="border-stone-200 bg-white shadow-sm">
            <CardHeader className="p-3.5 border-b border-stone-100">
              <CardTitle className="text-xs font-bold text-stone-900 flex items-center justify-between">
                <span>Dispensary Pickup Cart</span>
                <Badge variant="secondary" className="text-[10px]">{cart.length} Items</Badge>
              </CardTitle>
            </CardHeader>
            <CardContent className="p-3.5 space-y-3">
              {cart.length === 0 ? (
                <p className="text-xs text-stone-400 text-center py-4">No items reserved yet.</p>
              ) : (
                <div className="space-y-2">
                  {cart.map((c, i) => (
                    <div key={i} className="flex justify-between items-center text-xs p-2 bg-stone-50 rounded border border-stone-200">
                      <div>
                        <p className="font-semibold text-stone-800">{c.item.name}</p>
                        <p className="text-[10px] text-stone-500">Qty: {c.quantity} × ₹{c.item.price}</p>
                      </div>
                      <span className="font-semibold text-emerald-900">₹{c.quantity * c.item.price}</span>
                    </div>
                  ))}

                  <div className="pt-2 border-t border-stone-200 flex justify-between items-center text-xs font-bold">
                    <span>Total Subsidized:</span>
                    <span className="text-emerald-900">₹{cart.reduce((sum, c) => sum + (c.quantity * c.item.price), 0)}</span>
                  </div>

                  <Button 
                    size="sm"
                    className="w-full bg-emerald-800 hover:bg-emerald-900 text-white text-xs h-8 mt-2"
                    onClick={handlePlaceOrder}
                  >
                    Confirm Dispensary Reservation
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Pharmacy Details */}
          <div className="p-3.5 bg-stone-50 border border-stone-200 rounded-lg space-y-2 text-xs">
            <div className="flex items-center space-x-2 text-stone-900 font-semibold">
              <Building2 className="h-4 w-4 text-emerald-800" />
              <span>Nabha Civil Hospital Pharmacy</span>
            </div>
            <p className="text-stone-600 leading-relaxed text-[11px]">
              Located on Ground Floor, OPD Wing, Nabha Civil Hospital. Open Monday through Saturday, 08:00 AM – 04:00 PM for subsidized dispensing.
            </p>
            <div className="pt-1 border-t border-stone-200 text-[10px] text-stone-400">
              Stock status synced directly from hospital dispensary database.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MedicineSearch;
