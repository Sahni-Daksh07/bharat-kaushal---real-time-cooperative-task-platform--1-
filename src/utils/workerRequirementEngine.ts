import {
  ServiceItem,
  BookingScopeDetails,
  WorkerRequirementResult,
  WorkerRequirementType,
  ServicePricingModel,
  WorkerProfile,
  BookingWorker,
  BookingPriceBreakdown,
  CooperativePolicy,
} from '../types';

/**
 * Calculates the dynamic worker requirement for any service given customer-provided job scope details.
 */
export function calculateWorkerRequirement(
  service: ServiceItem,
  scope?: BookingScopeDetails
): WorkerRequirementResult {
  const reqType: WorkerRequirementType = service.worker_requirement_type || 'SINGLE_WORKER';
  const pricingModel: ServicePricingModel = service.pricing_model || 'PER_JOB';
  const defaultRoles: string[] = service.team_roles && service.team_roles.length > 0
    ? service.team_roles
    : ['Lead Craftsman', 'Technician Assistant', 'Support Helper'];

  // 1. SINGLE_WORKER: Always strictly 1 worker
  if (reqType === 'SINGLE_WORKER') {
    return {
      minimum_workers: 1,
      recommended_workers: 1,
      selected_workers: 1,
      worker_requirement_type: 'SINGLE_WORKER',
      pricing_model: pricingModel,
      reason: 'Standard single-artisan task calibrated for one certified professional.',
      team_roles: [defaultRoles[0] || 'Lead Craftsman'],
      scope_breakdown: 'Standard single-worker scope',
    };
  }

  // 2. MULTI_WORKER_COMPULSORY: Must require at least minimum_workers (>=2)
  if (reqType === 'MULTI_WORKER_COMPULSORY') {
    const minWorkers = Math.max(2, service.minimum_workers || 2);
    const recWorkers = Math.max(minWorkers, service.recommended_workers || minWorkers);
    const customCount = scope?.customWorkerCount ? Math.max(minWorkers, scope.customWorkerCount) : recWorkers;
    const selected = Math.max(minWorkers, customCount);

    const roles: string[] = [];
    for (let i = 0; i < selected; i++) {
      if (i === 0) roles.push(defaultRoles[0] || 'Lead Engineer / Specialist');
      else if (i === 1) roles.push(defaultRoles[1] || 'Assistant Specialist');
      else roles.push(defaultRoles[i] || `Support Crew Member #${i + 1}`);
    }

    return {
      minimum_workers: minWorkers,
      recommended_workers: recWorkers,
      selected_workers: selected,
      worker_requirement_type: 'MULTI_WORKER_COMPULSORY',
      pricing_model: pricingModel,
      reason: `Mandatory multi-worker cooperative standard. Minimum team of ${minWorkers} required for occupational safety and heavy structural protocols.`,
      team_roles: roles,
      scope_breakdown: `Compulsory crew size: ${selected} artisans (${minWorkers} minimum mandatory)`,
    };
  }

  // 3. MULTI_WORKER_CONDITIONAL: Evaluate custom rules & scope attributes
  let minWorkers = service.minimum_workers || 1;
  let recWorkers = service.recommended_workers || 2;
  let ruleReason = 'Evaluated based on standard residential scale.';
  let appliedRuleId: string | undefined = undefined;

  // If service has explicit configured rules in DB/catalog
  if (service.worker_requirement_rules && service.worker_requirement_rules.length > 0 && scope) {
    for (const rule of service.worker_requirement_rules) {
      let matches = false;
      const c = rule.criteria;

      if (c) {
        if (c.propertyTypes && scope.propertyType && c.propertyTypes.includes(scope.propertyType)) {
          matches = true;
        }
        if (c.minAreaSqFt && scope.areaSqFt && scope.areaSqFt >= c.minAreaSqFt) {
          matches = true;
        }
        if (c.minFloors && scope.floorsCount && scope.floorsCount >= c.minFloors) {
          matches = true;
        }
        if (c.minUnits && scope.unitsCount && scope.unitsCount >= c.minUnits) {
          matches = true;
        }
        if (c.treatmentTypes && scope.treatmentType && c.treatmentTypes.includes(scope.treatmentType)) {
          matches = true;
        }
        if (c.wallBreaking && scope.wallBreaking) {
          matches = true;
        }
        if (c.difficultAccess && scope.highAccessRopeNeeded) {
          matches = true;
        }
        if (c.postConstruction && scope.postConstruction) {
          matches = true;
        }
      }

      if (matches) {
        minWorkers = Math.max(minWorkers, rule.minWorkers);
        recWorkers = Math.max(recWorkers, rule.recommendedWorkers);
        ruleReason = rule.reason;
        appliedRuleId = rule.id;
        break;
      }
    }
  } else if (scope) {
    // Dynamic rule heuristics based on domain if rule list is empty
    const cat = (service.category || '').toLowerCase();
    const sName = (service.service_name || '').toLowerCase();

    // Pest Control scope heuristics
    if (cat.includes('pest')) {
      if (
        scope.treatmentType === 'Full Building Termite' ||
        scope.treatmentType === 'Termite' ||
        scope.propertyType === 'Commercial' ||
        scope.propertyType === 'Warehouse / Industrial' ||
        (scope.areaSqFt && scope.areaSqFt > 2000) ||
        (scope.floorsCount && scope.floorsCount >= 2)
      ) {
        minWorkers = 2;
        recWorkers = 3;
        ruleReason = 'Large premises / termite or multi-floor fogging requires a 2-3 artisan team for chemical handling safety.';
      } else if (scope.treatmentType === 'Mosquito Fogging' && (scope.areaSqFt || 0) > 1000) {
        minWorkers = 2;
        recWorkers = 2;
        ruleReason = 'Thermal outdoor mosquito fogging requires dual operation (operator + safety spotter).';
      } else {
        minWorkers = 1;
        recWorkers = 1;
        ruleReason = 'Standard single-dwelling pest application (cockroach/bed-bug spot treatment) is optimized for 1 technician.';
      }
    }

    // Cleaning / Deep Cleaning scope heuristics
    else if (cat.includes('cleaning')) {
      if (
        scope.postConstruction ||
        scope.propertyType === '4BHK+' ||
        scope.propertyType === 'Villa' ||
        scope.propertyType === 'Commercial' ||
        (scope.areaSqFt && scope.areaSqFt >= 1500)
      ) {
        minWorkers = 2;
        recWorkers = 3;
        ruleReason = 'Heavy deep-cleaning / large area (>1,500 sq ft) or post-construction dust mitigation requires 2–3 cleaners.';
      } else if (scope.propertyType === '3BHK' || (scope.areaSqFt && scope.areaSqFt >= 900)) {
        minWorkers = 2;
        recWorkers = 2;
        ruleReason = '3BHK full deep clean requires a dual-technician team for timely multi-room turnaround.';
      } else {
        minWorkers = 1;
        recWorkers = 1;
        ruleReason = 'Standard compact apartment / single room deep clean requires 1 technician.';
      }
    }

    // AC Installation / Servicing heuristics
    else if (cat.includes('ac')) {
      if ((scope.unitsCount && scope.unitsCount >= 2) || scope.highAccessRopeNeeded || (scope.floorsCount && scope.floorsCount >= 3)) {
        minWorkers = 2;
        recWorkers = 2;
        ruleReason = 'Multiple AC outdoor units / elevated high-wall outdoor condenser mounting requires an assistant for safe rigging.';
      } else if (sName.includes('installation') || sName.includes('uninstallation')) {
        minWorkers = 1;
        recWorkers = 2;
        ruleReason = 'AC outdoor unit handling is safer and faster with a 2-person team.';
      }
    }

    // Plumbing / Masonry / Welding / Waterproofing renovation heuristics
    else if (scope.wallBreaking || scope.highAccessRopeNeeded || (scope.unitsCount && scope.unitsCount >= 3)) {
      minWorkers = 2;
      recWorkers = 2;
      ruleReason = 'Heavy wall chiseling / multi-point piping / high elevation scaffolding requires a 2-person team.';
    }
  }

  // Determine selected count (customer can select between minWorkers and max, defaulting to recWorkers)
  let selected = recWorkers;
  if (scope?.customWorkerCount) {
    selected = Math.max(minWorkers, scope.customWorkerCount);
  }

  const roles: string[] = [];
  for (let i = 0; i < selected; i++) {
    if (i === 0) roles.push(defaultRoles[0] || 'Lead Specialist');
    else if (i === 1) roles.push(defaultRoles[1] || 'Assistant Specialist');
    else roles.push(defaultRoles[i] || `Support Crew Member #${i + 1}`);
  }

  return {
    minimum_workers: minWorkers,
    recommended_workers: recWorkers,
    selected_workers: selected,
    worker_requirement_type: 'MULTI_WORKER_CONDITIONAL',
    pricing_model: pricingModel,
    reason: ruleReason,
    team_roles: roles,
    applied_rule_id: appliedRuleId,
    scope_breakdown: `Conditional team requirement: ${selected} artisan(s) assigned (Min required: ${minWorkers}, Recommended: ${recWorkers})`,
  };
}

/**
 * Calculates pricing for a booking given the worker requirement and pricing model.
 */
export function calculateServiceBookingPricing(
  service: ServiceItem,
  requirement: WorkerRequirementResult,
  scope?: BookingScopeDetails,
  policy?: CooperativePolicy
): BookingPriceBreakdown {
  const baseRate = service.suggested_display_price_inr;
  const pricingModel = requirement.pricing_model || service.pricing_model || 'PER_JOB';
  const workerCount = requirement.selected_workers || 1;

  let baseLabour = baseRate;

  switch (pricingModel) {
    case 'PER_WORKER':
      baseLabour = baseRate * workerCount;
      break;
    case 'PER_DAY_PER_WORKER':
      baseLabour = baseRate * workerCount;
      break;
    case 'PER_UNIT':
      baseLabour = baseRate * (scope?.unitsCount && scope.unitsCount > 0 ? scope.unitsCount : 1);
      break;
    case 'PER_SQFT':
      baseLabour = baseRate * (scope?.areaSqFt && scope.areaSqFt > 0 ? scope.areaSqFt : 100);
      break;
    case 'PER_JOB':
    default:
      baseLabour = baseRate; // Fixed job price regardless of worker count
      break;
  }

  const grossAmount = Math.round(baseLabour);

  // Split according to cooperative policy
  const activeModel = policy?.activeModel || 'MODEL_A';
  const workerPercent = activeModel === 'MODEL_A' ? 0.945 : 0.95;
  const societyPercent = activeModel === 'MODEL_A' ? 0.035 : 0.025;
  const welfarePercent = activeModel === 'MODEL_A' ? 0.02 : 0.025;

  const workerShare = Math.round(grossAmount * workerPercent * 100) / 100;
  const societyShare = Math.round(grossAmount * societyPercent * 100) / 100;
  const welfareShare = Math.round(grossAmount * welfarePercent * 100) / 100;

  return {
    baseLabour: grossAmount,
    travelCharge: 0,
    urgencyCharge: 0,
    materialsTotal: 0,
    tax: 0,
    discount: 0,
    grossAmount,
    workerShare,
    societyShare,
    welfareShare,
    netPayable: grossAmount,
  };
}

/**
 * Checks worker availability and forms the booking team.
 * If insufficient workers are available for the required team size, provides alternative scheduling slots.
 */
export function findAvailableTeamForService(
  allWorkers: WorkerProfile[],
  service: ServiceItem,
  requiredCount: number,
  preselectedWorkerId?: string
): {
  isAvailable: boolean;
  leadWorker?: WorkerProfile;
  team: BookingWorker[];
  missingCount: number;
  availableWorkersCount: number;
  alternativeSlots: string[];
} {
  const categoryLower = (service.category || '').toLowerCase();

  // 1. Find verified, available workers matching category
  let eligibleWorkers = allWorkers.filter(
    (w) =>
      w.verificationStatus === 'VERIFIED' &&
      w.availability &&
      (w.skills.some((s) => s.name.toLowerCase() === categoryLower) ||
        w.primaryTrade.toLowerCase().includes(categoryLower) ||
        categoryLower.includes(w.primaryTrade.toLowerCase()))
  );

  // 2. If preselected worker is chosen, prioritize them as lead
  if (preselectedWorkerId) {
    const preselected = allWorkers.find((w) => w.id === preselectedWorkerId);
    if (preselected && !eligibleWorkers.some((w) => w.id === preselected.id)) {
      eligibleWorkers.unshift(preselected);
    } else if (preselected) {
      eligibleWorkers = [preselected, ...eligibleWorkers.filter((w) => w.id !== preselected.id)];
    }
  }

  // 3. If exact category match is insufficient, expand to other verified available workers in cooperative
  if (eligibleWorkers.length < requiredCount) {
    const otherAvailable = allWorkers.filter(
      (w) =>
        w.verificationStatus === 'VERIFIED' &&
        w.availability &&
        !eligibleWorkers.some((ew) => ew.id === w.id)
    );
    eligibleWorkers = [...eligibleWorkers, ...otherAvailable];
  }

  // 4. Sort by Trust Score + Reliability
  eligibleWorkers.sort((a, b) => {
    const scoreA = a.trustScore * 0.4 + a.reliabilityScore * 0.3 - a.completedJobs * 0.05;
    const scoreB = b.trustScore * 0.4 + b.reliabilityScore * 0.3 - b.completedJobs * 0.05;
    return scoreB - scoreA;
  });

  const availableCount = eligibleWorkers.length;
  const isAvailable = availableCount >= requiredCount;
  const missingCount = Math.max(0, requiredCount - availableCount);

  // Team formation
  const defaultRoles = service.team_roles || ['Lead Craftsman', 'Technician Assistant', 'Support Crew Member'];
  const team: BookingWorker[] = [];

  for (let i = 0; i < Math.min(requiredCount, eligibleWorkers.length); i++) {
    const w = eligibleWorkers[i];
    team.push({
      id: w.id,
      workerName: w.name,
      phone: w.phone,
      role: defaultRoles[i] || (i === 0 ? 'Lead Specialist' : `Crew Specialist #${i + 1}`),
      isLead: i === 0,
      rating: w.rating || 4.9,
      trade: w.primaryTrade,
      trustScore: w.trustScore || 88,
      status: 'ASSIGNED',
      assignedAt: new Date().toISOString(),
    });
  }

  const alternativeSlots = [
    'Tomorrow, 09:30 AM (Full Crew Available)',
    'Tomorrow, 02:30 PM (Full Crew Available)',
    'Day after Tomorrow, 10:00 AM (Recommended Peak Crew)',
    'Saturday, 11:00 AM (Full Weekend Roster)',
  ];

  return {
    isAvailable,
    leadWorker: eligibleWorkers[0],
    team,
    missingCount,
    availableWorkersCount: availableCount,
    alternativeSlots,
  };
}
