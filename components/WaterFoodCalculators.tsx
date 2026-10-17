'use client';

import React, { useState } from 'react';
import { Droplets, Utensils, CheckSquare, Square, Info, Sparkles, Shield, AlertCircle } from 'lucide-react';
import { HouseholdProfile } from '@/types/briefing';

interface WaterFoodCalculatorsProps {
  profile: HouseholdProfile;
  onOpenProfiler: () => void;
}

export function WaterFoodCalculators({ profile, onOpenProfiler }: WaterFoodCalculatorsProps) {
  const [checkedPantryItems, setCheckedPantryItems] = useState<Record<string, boolean>>({});

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

  // Food Calories Calculation (72 hours = 3 days)
  // Adult/Senior: ~2,000 kcal/day (6,000 kcal / 3 days)
  // Child: ~1,500 kcal/day (4,500 kcal / 3 days)
  // Infant: 72h formula supply
  const totalCalories = (adultCount + seniorCount) * 6000 + childCount * 4500;

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

  const togglePantry = (id: string) => {
    setCheckedPantryItems((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const checkedCount = Object.values(checkedPantryItems).filter(Boolean).length;
  const totalPantryCount = pantryTargets.length;

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

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Water Calculation Card */}
        <div className="bg-white border border-[#D0D0D0] p-6 shadow-xs flex flex-col justify-between">
          <div className="space-y-4">
            <div className="flex items-center justify-between border-b border-[#D0D0D0] pb-3">
              <div className="flex items-center gap-2">
                <Droplets className="w-5 h-5 text-blue-700" />
                <h3 className="font-serif text-lg font-bold text-[#1B2A4A]">
                  Potable Water Target
                </h3>
              </div>
              <span className="text-xs font-mono font-bold bg-blue-50 text-blue-900 px-2 py-0.5 border border-blue-200">
                72-Hour Baseline
              </span>
            </div>

            <div className="p-4 bg-[#F5F8FC] border-l-4 border-blue-700 space-y-1">
              <div className="text-xs text-blue-950 uppercase font-mono tracking-wider font-semibold">
                Household Total Volume:
              </div>
              <div className="font-serif text-3xl font-bold text-[#1B2A4A]">
                {totalWaterLitres} Litres
              </div>
              <p className="text-xs text-[#4A4A4A]">
                Minimum volume required to sustain {humanCount} {humanCount === 1 ? 'person' : 'people'}
                {petCount > 0 ? ` and ${petCount} pets` : ''} through 3 days of mains failure.
              </p>
            </div>

            {/* Breakdown */}
            <div className="space-y-2 text-xs text-[#333333]">
              <div className="flex justify-between py-1 border-b border-[#EFEFEA]">
                <span>Drinking &amp; Direct Hydration:</span>
                <strong className="font-mono">{drinkingLitres + infantDrinkingLitres} Litres</strong>
              </div>
              <div className="flex justify-between py-1 border-b border-[#EFEFEA]">
                <span>Basic Hygiene &amp; Cooking:</span>
                <strong className="font-mono">{sanitationLitres} Litres</strong>
              </div>
              {petCount > 0 && (
                <div className="flex justify-between py-1 border-b border-[#EFEFEA]">
                  <span>Domestic Pets Hydration:</span>
                  <strong className="font-mono">{petLitres} Litres</strong>
                </div>
              )}
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-[#D0D0D0] text-[11px] text-[#4A4A4A] flex items-start gap-1.5">
            <Info className="w-3.5 h-3.5 text-blue-700 shrink-0 mt-0.5" />
            <span>
              Tip: Keep 6 x 5-litre supermarket water bottles stored under stairs or behind utility cupboards for an effortless 30L buffer.
            </span>
          </div>
        </div>

        {/* Food Pantry Target Card */}
        <div className="bg-white border border-[#D0D0D0] p-6 shadow-xs flex flex-col justify-between">
          <div className="space-y-4">
            <div className="flex items-center justify-between border-b border-[#D0D0D0] pb-3">
              <div className="flex items-center gap-2">
                <Utensils className="w-5 h-5 text-amber-700" />
                <h3 className="font-serif text-lg font-bold text-[#1B2A4A]">
                  Non-Perishable Food Pantry
                </h3>
              </div>
              <span className="text-xs font-mono font-bold bg-amber-50 text-amber-900 px-2 py-0.5 border border-amber-200">
                {totalCalories.toLocaleString()} kcal target
              </span>
            </div>

            <div className="p-4 bg-[#FBF9F5] border-l-4 border-amber-700 space-y-1">
              <div className="text-xs text-amber-950 uppercase font-mono tracking-wider font-semibold">
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
                <span className="font-bold text-[#1B2A4A]">{checkedCount} / {totalPantryCount} Secured</span>
              </div>
              <div className="h-2 w-full bg-[#EAEAE2] overflow-hidden border border-[#D0D0D0]">
                <div
                  className="h-full bg-amber-700 transition-all"
                  style={{ width: `${(checkedCount / totalPantryCount) * 100}%` }}
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
      <div className="bg-white border border-[#D0D0D0] p-5 shadow-xs space-y-3">
        <h3 className="font-serif text-base font-bold text-[#1B2A4A] flex items-center justify-between">
          <span>72-Hour Grocery Checklist for Your Household</span>
          <span className="text-xs font-sans font-normal text-[#4A4A4A]">
            Tick off as items are secured in your larder
          </span>
        </h3>

        <div className="divide-y divide-[#EFEFEA] border border-[#EFEFEA]">
          {pantryTargets.map((item) => {
            const isChecked = !!checkedPantryItems[item.id];
            return (
              <div
                key={item.id}
                onClick={() => togglePantry(item.id)}
                className={`p-3 flex items-start gap-3 cursor-pointer transition-colors ${
                  isChecked ? 'bg-[#F9FAF8]' : 'hover:bg-[#FAF9F5]'
                }`}
              >
                <button
                  type="button"
                  className="mt-0.5 text-[#1B2A4A] focus:outline-none shrink-0"
                  aria-label={isChecked ? `Unmark ${item.label}` : `Mark ${item.label}`}
                >
                  {isChecked ? (
                    <CheckSquare className="w-5 h-5 text-emerald-700 fill-emerald-50" />
                  ) : (
                    <Square className="w-5 h-5 text-[#4A4A4A]" />
                  )}
                </button>

                <div className="flex-1 text-xs">
                  <div className="flex items-center gap-2 mb-0.5">
                    <span className="font-mono text-[10px] uppercase tracking-wider text-[#666666] bg-[#EFEFEA] px-1.5 py-0.2">
                      {item.category}
                    </span>
                  </div>
                  <strong className={`font-semibold text-sm block leading-snug ${isChecked ? 'text-[#333333]' : 'text-[#1B2A4A]'}`}>
                    {item.label}
                  </strong>
                  <p className="text-[#666666] mt-0.5 leading-relaxed">
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
