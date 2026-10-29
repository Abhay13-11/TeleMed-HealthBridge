import test from 'node:test';
import assert from 'node:assert';
import { storageService } from './helpers/storage.mjs';

// Mock localStorage
const storage = new Map();
global.localStorage = {
  getItem: (key) => storage.get(key) || null,
  setItem: (key, val) => storage.set(key, String(val)),
  removeItem: (key) => storage.delete(key),
  clear: () => storage.clear()
};

test('Pharmacy Inventory: Stock adjustments, validations, and role restrictions', async () => {
  storage.clear();

  const pharmacist = { id: '3', name: 'Rural Health Pharmacy', role: 'pharmacy', email: 'pharm@demo.com' };
  const patient = { id: '1', name: 'Krishna', role: 'patient', email: 'k@demo.com' };

  // 1. Initial inventory lookup
  const initialStock = storageService.getInventory();
  assert.ok(initialStock.length >= 4, 'Seeded inventory is populated');

  // Verify Cetirizine is truthfully out-of-stock in seed data
  const cetirizine = initialStock.find(m => m.name.toLowerCase().includes('cetirizine'));
  assert.ok(cetirizine, 'Cetirizine exists');
  assert.strictEqual(cetirizine.stock, 0, 'Cetirizine seed stock must be truthfully 0');

  // 2. Patient cannot modify inventory
  assert.throws(() => {
    storageService.updateStockQuantity(cetirizine.id, 50, 'set', patient);
  }, /Unauthorized: Only pharmacists can update pharmacy inventory/);

  // 3. Pharmacist replenishment
  const replenished = storageService.updateStockQuantity(cetirizine.id, 100, 'set', pharmacist);
  assert.strictEqual(replenished.stock, 100, 'Stock updated to 100');

  // 4. Pharmacist dispensing / deduction
  const dispensed = storageService.updateStockQuantity(cetirizine.id, -20, 'adjust', pharmacist);
  assert.strictEqual(dispensed.stock, 80, 'Stock reduced by 20 units');

  // 5. Negative stock protection
  const invalidDeduction = storageService.updateStockQuantity(cetirizine.id, -100, 'adjust', pharmacist);
  assert.strictEqual(invalidDeduction.stock, 0, 'Stock should clamp at 0 and not become negative');
});
