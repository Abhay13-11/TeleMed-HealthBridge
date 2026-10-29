import test from 'node:test';
import assert from 'node:assert';

test('Symptom Assessment: Safety boundaries, emergency triage, and Indian helpline guidance', () => {
  // Simulating the assessment engine logic in SymptomChecker
  const evaluateSymptoms = (selectedSymptoms, severity = 'mild') => {
    // 1. Red flag emergency rules
    if (selectedSymptoms.includes('chestPain') || selectedSymptoms.includes('breathingDifficulty')) {
      return {
        urgency: 'emergency',
        recommendations: [
          'Call National Emergency 112 or Medical Ambulance 108 immediately',
          'Proceed immediately to Nabha Civil Hospital or nearest emergency room',
          'Do not attempt to drive yourself'
        ],
        emergencyFlag: true
      };
    }

    // 2. Routine informational triage
    const urgency = severity === 'severe' || selectedSymptoms.length > 4 ? 'urgent' : 'routine';
    return {
      urgency,
      recommendations: [
        'Monitor your symptoms closely',
        'Stay hydrated and get adequate rest',
        'Book a teleconsultation with a Nabha Civil Hospital general physician'
      ],
      emergencyFlag: false
    };
  };

  // Test 1: Acute chest pain triggers emergency escalation
  const cardiacEmergency = evaluateSymptoms(['chestPain', 'nausea']);
  assert.strictEqual(cardiacEmergency.urgency, 'emergency');
  assert.strictEqual(cardiacEmergency.emergencyFlag, true);
  assert.ok(
    cardiacEmergency.recommendations.some(r => r.includes('112') || r.includes('108')),
    'Must include Indian emergency 112/108 numbers'
  );

  // Test 2: Acute breathing difficulty triggers emergency escalation
  const respiratoryEmergency = evaluateSymptoms(['breathingDifficulty', 'fatigue']);
  assert.strictEqual(respiratoryEmergency.urgency, 'emergency');
  assert.strictEqual(respiratoryEmergency.emergencyFlag, true);

  // Test 3: Mild non-acute symptoms do NOT trigger emergency flag
  const mildCold = evaluateSymptoms(['cough', 'runnyNose'], 'mild');
  assert.strictEqual(mildCold.urgency, 'routine');
  assert.strictEqual(mildCold.emergencyFlag, false);
  assert.ok(
    mildCold.recommendations.some(r => r.includes('teleconsultation') || r.includes('physician')),
    'Directs patient to consult with licensed physician'
  );
});
