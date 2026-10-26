'use client';

import React, { useState } from 'react';
import { Droplets, Utensils, CheckSquare, Square, Info, Sparkles, Check } from 'lucide-react';
import { HouseholdProfile, UserProgress } from '@/types/briefing';
import { togglePantryItem, setAllPantryItems } from '@/lib/storage';

interface WaterFoodCalculatorsProps {
  profile: HouseholdProfile;
  progress?: UserProgress;
  onOpenProfiler: () => void;
}

export function WaterFoodCalculators({
  profile,
  progress,
  onOpenProfiler,
}: WaterFoodCalculatorsProps) {
  const [localChecked, setLocalChecked] = useState<Record<string, boolean>>({});

  const adultCount = profile.members.filter((m) => m.category === 'adult').length;
  const seniorCount = profile.members.filter((m) => m.category === 'senior').length;
  const childCount = profile.members.filter((m) => m.category === 'child').length;
  const infantCount = profile.members.filter((m) => m.category === 'infant').length;
  const petCount = profile.hasPets ? profile.petCount : 0;
  const humanCount = profile.members.length;

  // Water Calculation (UK Civil Emergency Standard: 3L / person / day for 72 hours = 9L per person)
  // Drinking baseline: 2L per adult/senior/child daily = 6L for 72h
  // Hygiene & food rehydration: 1L per person daily = 3L for 72h
  const drinkingLitres = (adultCount + seniorCount + childCount) * 6;
  const infantDrinkingLitres = infantCount * 4.5; // for formula / sterilisation
  const sanitationLitres = humanCount * 3;
  const petLitres = petCount * 4.5; // 1.5L / day

  const totalWaterLitres = Math.round(
    drinkingLitres + infantDrinkingLitres + sanitationLitres + petLitres
  );

  // Practical Pantry Targets
  const pantryTargets = [
    {
      id: 'water-bottles',
      category: 'Water',
      label: `${Math.ceil(totalWaterLitres / 5)} x 5-Litre sealed mineral water bottles (or ${Math.ceil(totalWaterLitres / 2)} x 2L bottles)`,
      detail: `Provides the full ${totalWaterLitres}L reserve for drinking, basic cooking, and sanitising.`,
    },
    {
      id: 'tinned-proteins',
      category: 'Proteins',
      label: `${(adultCount + seniorCount + childCount) * 3} tins of ready-to-eat proteins (tuna, salmon, chicken, corned beef, baked beans)`,
      detail: 'Provides essential amino acids and sodium with zero required cooking.',
    },
    {
      id: 'carbs',
      category: 'Carbohydrates',
      label: `${Math.ceil((adultCount + seniorCount + childCount) * 0.8)} kg dry pasta / quick-cook rice / rolled oats`,
      detail: 'High-density caloric foundation that stays shelf-stable for years.',
    },
    {
      id: 'veg-fruit',
      category: 'Vegetables & Fruits',
      label: `${(adultCount + seniorCount + childCount) * 2} tins of vegetables & fruit in juice`,
      detail: 'Maintains dietary fibre, vitamins, and natural liquid hydration.',
    },
    {
      id: 'dairy-milk',
      category: 'Dairy / Fats',
      label: `${Math.max(2, Math.ceil(humanCount * 1.5))} litres of UHT long-life whole milk or oat/soya alternative`,
      detail: 'Instant calories, calcium, and tea/coffee compatibility.',
    },
    {
      id: 'quick-energy',
      category: 'Energy Snacks',
      label: `${humanCount * 3} nutrient-dense snack bars / nuts / dried fruit packs / chocolate`,
      detail: 'High-morale rapid energy without lighting stoves.',
    },
  ];

  if (infantCount > 0) {
    pantryTargets.push({
      id: 'infant-formula',
      category: 'Infant Sustenance',
      label: `${infantCount * 6} x 200ml bottles of ready-to-feed sterile liquid baby formula & clean teats`,
      detail: 'Crucial: powdered formula requires boiled potable water; liquid bottles are safe immediately.',
    });
  }

  if (petCount > 0) {
    pantryTargets.push({
      id: 'pet-provisions',
      category: 'Pet Sustenance',
      label: `${petCount * 6} tins / pouches of wet pet food & 1kg dry biscuits`,
      detail: 'Preserves your pet without compromising human food stocks.',
    });
  }

  const checkedPantryItems = progress?.pantryChecklist ?? localChecked;

  const handleToggle = (id: string) => {
    if (progress) {
      togglePantryItem(id);
    } else {
      setLocalChecked((prev) => ({
        ...prev,
        [id]: !prev[id],
      }));
    }
  };

  const handleToggleAll = (targetValue: boolean) => {
    const allIds = pantryTargets.map((t) => t.id);
    if (progress) {
      setAllPantryItems(allIds, targetValue);
    } else {
      const next: Record<string, boolean> = {};
      allIds.forEach((id) => {
        next[id] = targetValue;
      });
      setLocalChecked(next);
    }
  };

  const checkedCount = pantryTargets.filter((item) => !!checkedPantryItems[item.id]).length;
  const totalPantryCount = pantryTargets.length;
  const progressPercent = Math.round((checkedCount / totalPantryCount) * 100);

  return (
    <section className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b-2 border-[#1B2A4A] pb-3">
        <div>
          <span className="text-xs font-mono tracking-wider uppercase text-[#8B1A1A] font-bold">
            Tailored Household Logistics
          </span>
          <h2 className="font-serif text-2xl font-bold text-[#1B2A4A]">
            72-Hour Water &amp; Pantry Target Calculator
          </h2>
        </div>
        <button
          onClick={onOpenProfiler}
          className="text-xs font-semibold text-[#1B2A4A] hover:underline"
        >
          Change Household ({humanCount} members{petCount > 0 ? `, ${petCount} pets` : ''}) &rarr;
        </button>
      </div>

      <p className="text-xs sm:text-sm text-[#4A4A4A] leading-relaxed max-w-3xl">
        Calculated against UK civil contingency planning assumptions. During severe disruptions to the National Grid or municipal water supplies, commercial logistics and supermarket deliveries fail within 48 to 72 hours.
      </p>

      {/* Main Calculation Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Card 1: Water Requirement */}
        <div className="bg-white border border-[#D0D0D0] p-5 shadow-xs flex flex-col justify-between">
          <div className="space-y-4">
            <div className="flex items-center justify-between border-b border-[#EFEFEA] pb-3">
              <span className="text-xs font-mono tracking-wider uppercase text-[#1B2A4A] font-semibold flex items-center gap-1.5">
                <Droplets className="w-4 h-4 text-sky-700" />
                Mains Water Outage Baseline
              </span>
              <span className="text-[11px] font-mono text-[#666666]">
                3L / person / day
              </span>
            </div>

            <div className="space-y-1">
              <div className="text-[11px] font-mono uppercase tracking-wider text-[#666666]">
                Total Potable Reserve:
              </div>
              <div className="font-serif text-3xl font-bold text-[#1B2A4A]">
                {totalWaterLitres} Litres
              </div>
              <p className="text-xs text-[#4A4A4A]">
                Minimum 72-hour stockpile for {humanCount} person{humanCount !== 1 ? 's' : ''}{petCount > 0 ? ` and ${petCount} pet${petCount !== 1 ? 's' : ''}` : ''}.
              </p>
            </div>

            <div className="space-y-2 text-xs text-[#333333] pt-2 border-t border-[#EFEFEA]">
              <div className="flex justify-between">
                <span>Drinking baseline (2L/day):</span>
                <span className="font-mono font-semibold">{drinkingLitres} L</span>
              </div>
              {infantCount > 0 && (
                <div className="flex justify-between text-purple-950 bg-purple-50 px-1.5 py-0.5">
                  <span className="flex items-center gap-1">
                    <Sparkles className="w-3 h-3 text-purple-700" />
                    Infant sterile feed supply:
                  </span>
                  <span className="font-mono font-semibold">{infantDrinkingLitres} L</span>
                </div>
              )}
              <div className="flex justify-between">
                <span>Essential food prep &amp; hand hygiene (1L/day):</span>
                <span className="font-mono font-semibold">{sanitationLitres} L</span>
              </div>
              {petCount > 0 && (
                <div className="flex justify-between text-amber-950 bg-amber-50 px-1.5 py-0.5">
                  <span>Pet hydration ({petCount} animal{petCount !== 1 ? 's' : ''}):</span>
                  <span className="font-mono font-semibold">{petLitres} L</span>
                </div>
              )}
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-[#D0D0D0] text-[11px] text-[#4A4A4A] flex items-start gap-1.5">
            <Info className="w-3.5 h-3.5 text-sky-700 shrink-0 mt-0.5" />
            <span>
              Tip: Keep sealed commercial water bottles in cool, dark spots. Do not use previously opened milk cartons.
            </span>
          </div>
        </div>

        {/* Card 2: Food & Calories Requirement */}
        <div className="bg-white border border-[#D0D0D0] p-5 shadow-xs flex flex-col justify-between">
          <div className="space-y-4">
            <div className="flex items-center justify-between border-b border-[#EFEFEA] pb-3">
              <span className="text-xs font-mono tracking-wider uppercase text-[#1B2A4A] font-semibold flex items-center gap-1.5">
                <Utensils className="w-4 h-4 text-amber-700" />
                Emergency Food Storage
              </span>
              <span className="text-[11px] font-mono text-[#666666]">
                Non-perishable
              </span>
            </div>

            <div className="space-y-1">
              <div className="text-[11px] font-mono uppercase tracking-wider text-[#666666]">
                Caloric Cushion:
              </div>
              <div className="font-serif text-3xl font-bold text-[#1B2A4A]">
                3 Days / {humanCount} Persons
              </div>
              <p className="text-xs text-[#4A4A4A]">
                Calculated on 2,000 kcal/day per adult and 1,500 kcal/day per child.
              </p>
            </div>

            <div className="space-y-1 text-xs text-[#333333]">
              <div className="flex items-center justify-between font-mono text-[11px] text-[#666666] pb-1">
                <span>Pantry Acquisition Status:</span>
                <span className="font-bold text-[#1B2A4A]">{checkedCount} / {totalPantryCount} Secured ({progressPercent}%)</span>
              </div>
              <div className="h-2 w-full bg-[#EAEAE2] overflow-hidden border border-[#D0D0D0]">
                <div
                  className="h-full bg-emerald-700 transition-all duration-300"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-[#D0D0D0] text-[11px] text-[#4A4A4A] flex items-start gap-1.5">
            <Info className="w-3.5 h-3.5 text-amber-700 shrink-0 mt-0.5" />
            <span>
              Store ambient foods you already eat. Do not purchase survival rations; rotate standard grocery tins into ordinary dinners.
            </span>
          </div>
        </div>
      </div>

      {/* Interactive Pantry Shopping Checklist */}
      <div className="bg-white border border-[#D0D0D0] p-5 shadow-xs space-y-4">
        {/* Auto-Sync with Check List Banner */}
        <div className="p-3 bg-[#FAF9F5] border-l-4 border-emerald-600 text-xs text-[#222222] flex items-start gap-2.5 shadow-2xs">
          <Sparkles className="w-4 h-4 text-emerald-700 shrink-0 mt-0.5" />
          <div>
            <strong className="text-emerald-950 font-semibold block sm:inline mr-1">
              Check List &amp; Ready Score Auto-Sync Active:
            </strong>
            <span className="text-[#4A4A4A]">
              Checking off water and pantry provisions here directly updates the corresponding items on your household Check List and advances your Ready Score.
            </span>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#EFEFEA] pb-3">
          <div>
            <h3 className="font-serif text-base font-bold text-[#1B2A4A] flex items-center gap-2">
              <span>72-Hour Grocery Checklist for Your Household</span>
              {checkedCount === totalPantryCount && totalPantryCount > 0 && (
                <span className="inline-flex items-center gap-1 text-[11px] font-mono font-semibold text-emerald-800 bg-emerald-50 px-2 py-0.5 border border-emerald-300">
                  <Check className="w-3.5 h-3.5 text-emerald-700" />
                  All Secured
                </span>
              )}
            </h3>
            <p className="text-xs text-[#4A4A4A] mt-0.5">
              Click anywhere on a measure to check it off as items are secured in your domestic pantry
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <span className="text-xs font-mono font-bold text-[#1B2A4A] bg-[#FAF9F5] px-2.5 py-1 border border-[#D0D0D0]">
              {checkedCount} / {totalPantryCount} Secured
            </span>
            <button
              type="button"
              onClick={() => handleToggleAll(checkedCount < totalPantryCount)}
              className="text-xs font-semibold text-[#1B2A4A] hover:text-[#8B1A1A] hover:underline font-mono cursor-pointer"
            >
              {checkedCount === totalPantryCount ? 'Clear all' : 'Mark all secured'}
            </button>
          </div>
        </div>

        <div className="divide-y divide-[#EFEFEA] border border-[#EFEFEA]">
          {pantryTargets.map((item) => {
            const isChecked = !!checkedPantryItems[item.id];
            return (
              <div
                key={item.id}
                role="checkbox"
                aria-checked={isChecked}
                tabIndex={0}
                onClick={() => handleToggle(item.id)}
                onKeyDown={(e) => {
                  if (e.key === ' ' || e.key === 'Enter') {
                    e.preventDefault();
                    handleToggle(item.id);
                  }
                }}
                className={`p-3.5 flex items-start gap-3.5 cursor-pointer select-none transition-colors ${
                  isChecked
                    ? 'bg-emerald-50/50 hover:bg-emerald-50/70'
                    : 'hover:bg-[#FAF9F5]'
                }`}
              >
                <div
                  className="mt-0.5 text-[#1B2A4A] shrink-0"
                  aria-hidden="true"
                >
                  {isChecked ? (
                    <CheckSquare className="w-5 h-5 text-emerald-700 fill-emerald-100" />
                  ) : (
                    <Square className="w-5 h-5 text-[#666666] hover:text-[#1B2A4A]" />
                  )}
                </div>

                <div className="flex-1 text-xs">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-mono text-[10px] uppercase tracking-wider text-[#666666] bg-[#EFEFEA] px-1.5 py-0.5">
                      {item.category}
                    </span>
                    {isChecked && (
                      <>
                        <span className="text-[10px] font-mono text-emerald-800 font-bold uppercase tracking-wide">
                          • Secured in pantry
                        </span>
                        <span className="text-[10px] font-mono text-emerald-700 bg-emerald-100/70 px-1.5 py-0.5 rounded-xs ml-auto">
                          ✓ Updates Check List
                        </span>
                      </>
                    )}
                  </div>
                  <strong
                    className={`font-semibold text-sm block leading-snug transition-colors ${
                      isChecked
                        ? 'text-emerald-950 line-through decoration-emerald-700/40'
                        : 'text-[#1B2A4A]'
                    }`}
                  >
                    {item.label}
                  </strong>
                  <p className={`mt-0.5 leading-relaxed ${isChecked ? 'text-emerald-900/80' : 'text-[#666666]'}`}>
                    {item.detail}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
