// planner_budget.js
// Budget-optimized calorie planner — fixed duplicate-item problem.
// Drop-in replacement: keeps planner.html + style.css unchanged.

(function () {
  'use strict';

  /* -------------------- DOM refs -------------------- */
  const form = document.getElementById('plannerForm');
  const resultsWrap = document.getElementById('results');

  /* -------------------- DATASET --------------------
     Each item: { id, name, kcal, protein, cost, servingText, tags }
     tags may include: breakfast, lunch, dinner, snack, veg, nonveg, protein
     ------------------------------------------------------------------ */
  const FOODS = [
    // ----- Paste your full FOODS array here (complete dataset) -----
    // Example entries (keep your full dataset from before in the same format):
    { id:'moong_chilla', name:'Moong Dal Chilla (2 pcs)', kcal:250, protein:12, cost:12, servingText:'Moong Dal Chilla (2 pcs)', tags:['breakfast','veg'] },
    { id:'besan_chilla', name:'Besan Chilla (2 pcs)', kcal:280, protein:14, cost:12, servingText:'Besan Chilla (2 pcs)', tags:['breakfast','veg'] },
    { id:'oats_chilla', name:'Oats Chilla', kcal:300, protein:10, cost:15, servingText:'Oats Chilla', tags:['breakfast','veg'] },
    { id:'veg_upma', name:'Vegetable Upma', kcal:280, protein:6, cost:12, servingText:'Vegetable Upma', tags:['breakfast','veg'] },
    { id:'poha_peanuts', name:'Poha with peanuts', kcal:320, protein:7, cost:10, servingText:'Poha with peanuts', tags:['breakfast','veg'] },
    { id:'masala_omelette', name:'Masala Omelette + 2 bread', kcal:280, protein:14, cost:15, servingText:'Masala Omelette + 2 bread', tags:['breakfast','nonveg'] },
    { id:'eggs_banana', name:'2 Boiled Eggs + Banana', kcal:240, protein:12, cost:12, servingText:'2 Boiled Eggs + Banana', tags:['breakfast','nonveg','protein'] },
    { id:'sprout_veg_salad', name:'Sprout & Veg Salad', kcal:180, protein:12, cost:15, servingText:'Sprout & Veg Salad', tags:['snack','breakfast','veg','protein'] },
    { id:'veg_daliya', name:'Veg Daliya', kcal:300, protein:8, cost:12, servingText:'Veg Daliya', tags:['breakfast','veg'] },
    { id:'ragi_dosa', name:'Ragi Dosa (2 small)', kcal:260, protein:7, cost:15, servingText:'Ragi Dosa (2 small)', tags:['breakfast','veg'] },
    { id:'idli_chutney', name:'Idli (3) + chutney', kcal:210, protein:6, cost:12, servingText:'Idli (3) + chutney', tags:['breakfast','veg'] },
    { id:'dosa_sambar', name:'Dosa + Sambar', kcal:350, protein:9, cost:20, servingText:'Dosa + Sambar', tags:['breakfast','veg'] },
    { id:'aloo_paratha', name:'Aloo Paratha (1) + Curd', kcal:350, protein:9, cost:20, servingText:'Aloo Paratha (1) + Curd', tags:['breakfast','veg'] },
    { id:'paneer_paratha', name:'Paneer Paratha (1) + Curd', kcal:420, protein:15, cost:30, servingText:'Paneer Paratha (1) + Curd', tags:['breakfast','veg','protein'] },
    { id:'roti_sabzi_simple', name:'Roti + Sabzi (simple)', kcal:250, protein:6, cost:10, servingText:'Roti + Sabzi (simple)', tags:['breakfast','lunch','dinner','veg'] },
    { id:'banana_oats_smoothie', name:'Banana + Milk + Oats Smoothie', kcal:350, protein:12, cost:20, servingText:'Banana + Milk + Oats Smoothie', tags:['breakfast','veg'] },
    { id:'pb_sandwich', name:'Peanut Butter Sandwich', kcal:350, protein:12, cost:18, servingText:'Peanut Butter Sandwich', tags:['breakfast','snack','veg'] },
    { id:'rava_idli', name:'Rava Idli (2 pcs)', kcal:180, protein:5, cost:10, servingText:'Rava Idli (2 pcs)', tags:['breakfast','veg'] },
    { id:'suji_cheela', name:'Suji Cheela', kcal:260, protein:7, cost:10, servingText:'Suji Cheela', tags:['breakfast','veg'] },
    { id:'bread_upma', name:'Bread Upma', kcal:300, protein:7, cost:10, servingText:'Bread Upma', tags:['breakfast','veg'] },

    /* Mid-range mains and snacks (21-40) */
    { id:'dal_rice_salad', name:'Dal + Rice + Salad', kcal:500, protein:14, cost:20, servingText:'Dal + Rice + Salad', tags:['lunch','dinner','veg'] },
    { id:'rajma_rice', name:'Rajma + Rice', kcal:550, protein:18, cost:22, servingText:'Rajma + Rice', tags:['lunch','dinner','veg','protein'] },
    { id:'chole_rice', name:'Chole + Rice', kcal:600, protein:16, cost:22, servingText:'Chole + Rice', tags:['lunch','dinner','veg'] },
    { id:'plain_khichdi', name:'Plain Khichdi', kcal:420, protein:12, cost:15, servingText:'Plain Khichdi', tags:['lunch','dinner','veg'] },
    { id:'veg_khichdi', name:'Veg Khichdi', kcal:480, protein:13, cost:18, servingText:'Veg Khichdi', tags:['lunch','dinner','veg'] },
    { id:'soya_curry_rice', name:'Soya Curry + Rice', kcal:550, protein:24, cost:18, servingText:'Soya Curry + Rice', tags:['lunch','dinner','veg','protein'] },
    { id:'paneer_bhurji', name:'Paneer Bhurji + 2 Chapati', kcal:520, protein:20, cost:30, servingText:'Paneer Bhurji + 2 Chapati', tags:['lunch','dinner','veg','protein'] },
    { id:'mixed_veg_chapati', name:'Mixed Veg Sabzi + 2 Chapati', kcal:400, protein:9, cost:18, servingText:'Mixed Veg Sabzi + 2 Chapati', tags:['lunch','dinner','veg'] },
    { id:'aloo_matar_roti', name:'Aloo Matar + Roti', kcal:350, protein:8, cost:15, servingText:'Aloo Matar + Roti', tags:['lunch','dinner','veg'] },
    { id:'lauki_roti', name:'Lauki Sabzi + Roti', kcal:300, protein:7, cost:12, servingText:'Lauki Sabzi + Roti', tags:['lunch','dinner','veg'] },
    { id:'cabbage_roti', name:'Cabbage Sabzi + Roti', kcal:320, protein:7, cost:12, servingText:'Cabbage Sabzi + Roti', tags:['lunch','dinner','veg'] },
    { id:'bhindi_roti', name:'Bhindi + Roti', kcal:330, protein:6, cost:15, servingText:'Bhindi + Roti', tags:['lunch','dinner','veg'] },
    { id:'sprouts_pulao', name:'Sprouts Pulao', kcal:420, protein:15, cost:20, servingText:'Sprouts Pulao', tags:['lunch','dinner','veg','protein'] },
    { id:'veg_fried_rice', name:'Veg Fried Rice', kcal:450, protein:8, cost:18, servingText:'Veg Fried Rice', tags:['lunch','dinner','veg'] },
    { id:'lentil_soup_chapati', name:'Lentil Soup + Chapati', kcal:300, protein:10, cost:10, servingText:'Lentil Soup + Chapati', tags:['lunch','dinner','veg'] },
    { id:'chicken_curry_rice', name:'Chicken Curry + Rice', kcal:650, protein:28, cost:50, servingText:'Chicken Curry + Rice', tags:['lunch','dinner','nonveg','protein'] },
    { id:'fish_curry_rice', name:'Fish Curry + Rice', kcal:550, protein:25, cost:45, servingText:'Fish Curry + Rice', tags:['lunch','dinner','nonveg','protein'] },
    { id:'roti_egg_curry', name:'Roti + Egg Curry', kcal:450, protein:16, cost:18, servingText:'Roti + Egg Curry', tags:['lunch','dinner','nonveg'] },
    { id:'kadhi_rice', name:'Kadhi + Rice', kcal:400, protein:10, cost:15, servingText:'Kadhi + Rice', tags:['lunch','dinner','veg'] },
    { id:'sambar_rice', name:'Sambar + Rice', kcal:380, protein:10, cost:15, servingText:'Sambar + Rice', tags:['lunch','dinner','veg'] },

    /* Mains (41-55) */
    { id:'roti_soya_masala', name:'Roti + Soya Masala', kcal:450, protein:22, cost:15, servingText:'Roti + Soya Masala', tags:['lunch','dinner','veg','protein'] },
    { id:'roti_paneer_sabzi', name:'Roti + Paneer Sabzi', kcal:460, protein:16, cost:25, servingText:'Roti + Paneer Sabzi', tags:['lunch','dinner','veg','protein'] },
    { id:'rice_dal_tadka', name:'Rice + Dal Tadka', kcal:480, protein:13, cost:20, servingText:'Rice + Dal Tadka', tags:['lunch','dinner','veg'] },
    { id:'daliya_khichdi', name:'Daliya Khichdi', kcal:400, protein:10, cost:15, servingText:'Daliya Khichdi', tags:['lunch','dinner','veg'] },
    { id:'carrot_peas_roti', name:'Carrot–Peas Sabzi + Roti', kcal:350, protein:8, cost:14, servingText:'Carrot–Peas Sabzi + Roti', tags:['lunch','dinner','veg'] },
    { id:'egg_bhurji_chapati', name:'Egg Bhurji + 2 Chapati', kcal:450, protein:20, cost:20, servingText:'Egg Bhurji + 2 Chapati', tags:['lunch','dinner','nonveg','protein'] },
    { id:'stuffed_paratha_curd', name:'Stuffed Paratha + Curd', kcal:450, protein:12, cost:20, servingText:'Stuffed Paratha + Curd', tags:['lunch','dinner','veg'] },
    { id:'lauki_kofta_roti', name:'Lauki Kofta (light) + Roti', kcal:420, protein:9, cost:18, servingText:'Lauki Kofta + Roti', tags:['lunch','dinner','veg'] },
    { id:'tofu_curry_rice', name:'Tofu Curry + Rice', kcal:500, protein:18, cost:25, servingText:'Tofu Curry + Rice', tags:['lunch','dinner','veg','protein'] },
    { id:'roti_seasonal_sabzi', name:'Roti + Seasonal Sabzi', kcal:330, protein:7, cost:12, servingText:'Roti + Seasonal Sabzi', tags:['lunch','dinner','veg'] },
    { id:'veg_soup_roti', name:'Vegetable Soup + Roti', kcal:220, protein:6, cost:10, servingText:'Vegetable Soup + Roti', tags:['lunch','dinner','veg'] },
    { id:'moong_dal_dosa', name:'Moong Dal Dosa + Chutney', kcal:320, protein:12, cost:15, servingText:'Moong Dal Dosa + Chutney', tags:['breakfast','lunch','veg'] },
    { id:'upma_night', name:'Upma (night-friendly)', kcal:260, protein:6, cost:10, servingText:'Upma (night-friendly)', tags:['breakfast','dinner','veg'] },
    { id:'curd_rice', name:'Curd Rice', kcal:380, protein:9, cost:15, servingText:'Curd Rice', tags:['lunch','dinner','veg'] },
    { id:'boiledveg_dal_roti', name:'Boiled Veg + Dal + Roti', kcal:400, protein:13, cost:18, servingText:'Boiled Veg + Dal + Roti', tags:['lunch','dinner','veg'] },

    /* Snacks and light meals (56-65) */
    { id:'sprout_salad', name:'Sprout Salad', kcal:180, protein:12, cost:12, servingText:'Sprout Salad', tags:['snack','veg','protein'] },
    { id:'roasted_peanuts_30g', name:'Roasted Peanuts 30g', kcal:170, protein:8, cost:6, servingText:'Roasted Peanuts (30g)', tags:['snack','veg','protein'] },
    { id:'fruit_bowl', name:'Fruit Bowl', kcal:120, protein:1, cost:15, servingText:'Fruit Bowl', tags:['snack','veg'] },
    { id:'curd_jaggery', name:'Curd + Jaggery', kcal:140, protein:4, cost:10, servingText:'Curd + Jaggery', tags:['snack','veg'] },
    { id:'roasted_makhana', name:'Roasted Makhana', kcal:150, protein:4, cost:18, servingText:'Roasted Makhana', tags:['snack','veg'] },
    { id:'boiled_chana', name:'Boiled Chana', kcal:210, protein:11, cost:8, servingText:'Boiled Chana', tags:['snack','veg','protein'] },
    { id:'boiled_sweet_potato', name:'Boiled Sweet Potato', kcal:130, protein:2, cost:10, servingText:'Boiled Sweet Potato', tags:['snack','veg'] },
    { id:'veg_sandwich', name:'Veg Sandwich', kcal:250, protein:7, cost:12, servingText:'Veg Sandwich', tags:['snack','breakfast','veg'] },
    { id:'egg_sandwich', name:'Egg Sandwich', kcal:300, protein:14, cost:18, servingText:'Egg Sandwich', tags:['snack','breakfast','nonveg'] },
    { id:'chickpea_salad', name:'Chickpea Salad', kcal:220, protein:10, cost:15, servingText:'Chickpea Salad', tags:['snack','veg','protein'] }
  ];

  // Derived convenience metrics (cost per kcal and cost per protein)
  FOODS.forEach(f => {
    f.cost_per_kcal = f.cost / Math.max(1, f.kcal);
    f.cost_per_protein = f.cost / Math.max(0.1, f.protein);
  });

  /* -------------------- basic helpers -------------------- */
  function round(n){ return Math.round(n); }
  function toFixedNumber(n, d=1){ const p=Math.pow(10,d); return Math.round(n*p)/p; }

  /* -------------------- validation & nutrition formulas -------------------- */
  function validateInputs(h,w,a){
    const errors=[];
    if(!h||isNaN(h)||h<50||h>300) errors.push('Enter height 50–300 cm.');
    if(!w||isNaN(w)||w<20||w>500) errors.push('Enter weight 20–500 kg.');
    if(!a||isNaN(a)||a<10||a>120) errors.push('Enter age 10–120 years.');
    return errors;
  }
  function computeBMR({weightKg,heightCm,ageYears,gender}){
    const base = 10*weightKg + 6.25*heightCm - 5*ageYears;
    if(String(gender).toLowerCase().includes('f')) return base - 161;
    if(String(gender).toLowerCase().includes('oth')) return base - 78;
    return base + 5;
  }
  function caloriesToMacros(calories, weightKg, proteinGPerKg=1.6, fatRatio=0.25){
    const proteinGrams = proteinGPerKg * weightKg;
    const proteinCalories = proteinGrams * 4;
    const fatCalories = calories * fatRatio;
    const fatGrams = fatCalories / 9;
    const remainingCalories = Math.max(0, calories - proteinCalories - fatCalories);
    const carbsGrams = remainingCalories / 4;
    return {
      proteinGrams: toFixedNumber(proteinGrams,1),
      fatGrams: toFixedNumber(fatGrams,1),
      carbsGrams: toFixedNumber(carbsGrams,1),
      proteinCalories: round(proteinCalories),
      fatCalories: round(fatCalories),
      carbsCalories: round(remainingCalories)
    };
  }
  function mealDistribution(totalCalories){
    return {
      breakfast: round(totalCalories * 0.25),
      lunch:     round(totalCalories * 0.30),
      dinner:    round(totalCalories * 0.30),
      snacks:    round(totalCalories * 0.15)
    };
  }

  /* -------------------- improved, duplicate-safe meal builder --------------------
     Key ideas:
     - maintain usedIds set across the day (buildDailyPlan creates it)
     - prefer items not already used (to avoid repeats)
     - only allow repeats as a last resort (when impossible to reach calories)
     - small safety caps to avoid infinite loops
  ------------------------------------------------------------------------------- */
  function buildMeal(mealCalories, mealTagList = [], strictVegetarian=false, preferNonVeg=false, usedIds = new Set()){
    // 1) Filter by meal tag + vegetarian constraint
    let candidates = FOODS.filter(f => {
      const matchesMeal = mealTagList.length === 0 || mealTagList.some(t => f.tags.includes(t));
      if(!matchesMeal) return false;
      if(strictVegetarian && !f.tags.includes('veg')) return false;
      return true;
    });

    // 2) Fallback to full list if nothing matched
    if(candidates.length === 0) candidates = FOODS.slice();

    // 3) Sort: prefer non-veg when asked, otherwise cheapest cost_per_kcal first
    candidates.sort((a,b) => {
      if(preferNonVeg){
        const aNon = a.tags.includes('nonveg') ? 0 : 1;
        const bNon = b.tags.includes('nonveg') ? 0 : 1;
        if(aNon !== bNon) return aNon - bNon;
      }
      return a.cost_per_kcal - b.cost_per_kcal;
    });

    const items = [];
    let remaining = mealCalories;
    let iter = 0;
    let allowRepeats = false; // only flip to true when we've exhausted unique choices

    // helper: pick best candidate respecting usedIds unless repeats allowed
    function pickFor(remainingKcal){
      // candidates that fit calorie constraint
      const fit = candidates.filter(c => c.kcal <= remainingKcal);
      // 1) Prefer fit & not used
      const fitNotUsed = fit.find(c => !usedIds.has(c.id));
      if(fitNotUsed) return fitNotUsed;
      // 2) If none fit but there are non-fit items smaller than remaining, check them too (some datasets)
      const notFitNotUsed = candidates.find(c => !usedIds.has(c.id) && c.kcal <= (mealCalories * 0.9));
      if(notFitNotUsed) return notFitNotUsed;
      // 3) If repeats allowed, pick cheapest fit or cheapest overall
      if(allowRepeats){
        return (fit[0] || candidates[0]) || null;
      }
      // 4) no pick possible without repeating
      return null;
    }

    // iterative selection
    while(remaining > mealCalories * 0.12 && iter < 12){
      iter++;
      let pick = pickFor(remaining);
      // If we couldn't pick (because all small picks used), allow repeats once
      if(!pick){
        // attempt to allow repeats if that helps reach kcal
        allowRepeats = true;
        pick = pickFor(remaining);
      }
      // If still no pick, break (no sensible items left)
      if(!pick) break;

      items.push({
        id: pick.id,
        name: pick.name,
        kcal: pick.kcal,
        protein: pick.protein,
        cost: pick.cost,
        serving: pick.servingText
      });

      // mark used (we mark even if allowRepeats true; usedIds prevents early repeats)
      usedIds.add(pick.id);
      remaining -= pick.kcal;
    }

    // Final attempt to top-up if still far below target: add cheapest item (prefer not used)
    if(remaining > mealCalories * 0.12){
      // choose cheapest candidate not used; fallback to absolute cheapest
      const notUsed = candidates.find(c => !usedIds.has(c.id));
      const pick = notUsed || candidates[0];
      if(pick){
        items.push({ id: pick.id, name: pick.name, kcal: pick.kcal, protein: pick.protein, cost: pick.cost, serving: pick.servingText });
        usedIds.add(pick.id);
      }
    }

    // compute totals for this meal
    const total = items.reduce((acc,it) => {
      acc.kcal += it.kcal;
      acc.protein += it.protein;
      acc.cost += it.cost;
      return acc;
    }, {kcal:0, protein:0, cost:0});

    return {
      items,
      totals: { kcal: total.kcal, protein: toFixedNumber(total.protein,1), cost: toFixedNumber(total.cost,1) }
    };
  }

  /* -------------------- ensure daily protein (duplicate-aware) -------------------- */
  function ensureDailyProtein(plan, proteinTarget, strictVegetarian=false, usedIds = new Set()){
    const currentProtein = plan.breakfast.totals.protein + plan.lunch.totals.protein + plan.dinner.totals.protein + plan.snacks.totals.protein;
    let needed = Math.max(0, proteinTarget - currentProtein);

    // cheapest protein candidates (respect vegetarian)
    const proteinPool = FOODS.filter(f => f.protein >= 6 && (!strictVegetarian || f.tags.includes('veg')))
                             .sort((a,b) => a.cost_per_protein - b.cost_per_protein);

    let iter = 0;
    while(needed > 0.5 && iter < 8 && proteinPool.length > 0){
      iter++;
      // pick a candidate not used yet if possible
      let pick = proteinPool.find(p => !usedIds.has(p.id)) || proteinPool[0];
      // add to snacks (keeps meals realistic)
      plan.snacks.items.push({ id: pick.id, name: pick.name, kcal: pick.kcal, protein: pick.protein, cost: pick.cost, serving: pick.servingText });
      usedIds.add(pick.id);
      plan.snacks.totals.kcal += pick.kcal;
      plan.snacks.totals.protein = toFixedNumber(plan.snacks.totals.protein + pick.protein,1);
      plan.snacks.totals.cost = toFixedNumber(plan.snacks.totals.cost + pick.cost,1);
      needed -= pick.protein;
    }
    return plan;
  }

  /* -------------------- top-level daily plan builder -------------------- */
  function buildDailyPlan(totalCalories, proteinTarget, strictVegetarian=true, preferNonVeg=false){
    const targets = mealDistribution(totalCalories);
    const usedIds = new Set(); // tracks used item IDs across the whole day

    const breakfast = buildMeal(targets.breakfast, ['breakfast'], strictVegetarian, preferNonVeg, usedIds);
    const lunch     = buildMeal(targets.lunch,     ['lunch'],     strictVegetarian, preferNonVeg, usedIds);
    const dinner    = buildMeal(targets.dinner,    ['dinner'],    strictVegetarian, preferNonVeg, usedIds);
    const snacks    = buildMeal(targets.snacks,    ['snack'],     strictVegetarian, preferNonVeg, usedIds);

    const plan = { breakfast, lunch, dinner, snacks };

    // If calories significantly under target, top-up with cheapest items (avoid used if possible)
    const currentCalories = breakfast.totals.kcal + lunch.totals.kcal + dinner.totals.kcal + snacks.totals.kcal;
    if(currentCalories < totalCalories * 0.92){
      const energyCandidates = FOODS.slice().sort((a,b) => a.cost_per_kcal - b.cost_per_kcal);
      let safety = 0;
      while((breakfast.totals.kcal + lunch.totals.kcal + dinner.totals.kcal + snacks.totals.kcal) < totalCalories * 0.95 && safety < 8){
        safety++;
        const pick = energyCandidates.find(e => !usedIds.has(e.id)) || energyCandidates[0];
        snacks.items.push({ id: pick.id, name: pick.name, kcal: pick.kcal, protein: pick.protein, cost: pick.cost, serving: pick.servingText });
        usedIds.add(pick.id);
        snacks.totals.kcal += pick.kcal;
        snacks.totals.protein = toFixedNumber(snacks.totals.protein + pick.protein,1);
        snacks.totals.cost = toFixedNumber(snacks.totals.cost + pick.cost,1);
      }
    }

    // ensure protein target
    const curProtein = toFixedNumber(breakfast.totals.protein + lunch.totals.protein + dinner.totals.protein + snacks.totals.protein,1);
    if(curProtein < proteinTarget - 0.5){
      ensureDailyProtein(plan, proteinTarget, strictVegetarian, usedIds);
    }

    // If preferNonVeg is requested, ensure at least one non-veg present (if dataset has nonveg)
    if(preferNonVeg){
      const anyNonVeg = FOODS.some(f => f.tags.includes('nonveg'));
      const dayHasNonVeg = [breakfast, lunch, dinner, snacks].some(m => m.items.some(it => {
        const f = FOODS.find(x => x.id === it.id);
        return f && f.tags.includes('nonveg');
      }));
      if(anyNonVeg && !dayHasNonVeg){
        // try replace the last item in lunch/dinner/snacks with a cheap non-veg main
        const nonvegMains = FOODS.filter(f => f.tags.includes('nonveg') && (f.tags.includes('lunch') || f.tags.includes('dinner'))).sort((a,b)=> a.cost_per_kcal - b.cost_per_kcal);
        if(nonvegMains.length){
          const replacement = nonvegMains[0];
          const tryReplace = meal => {
            if(meal.items.length === 0) return false;
            const removed = meal.items.pop();
            meal.totals.kcal -= removed.kcal;
            meal.totals.protein = toFixedNumber(meal.totals.protein - removed.protein,1);
            meal.totals.cost = toFixedNumber(meal.totals.cost - removed.cost,1);
            meal.items.push({ id: replacement.id, name: replacement.name, kcal: replacement.kcal, protein: replacement.protein, cost: replacement.cost, serving: replacement.servingText });
            meal.totals.kcal += replacement.kcal;
            meal.totals.protein = toFixedNumber(meal.totals.protein + replacement.protein,1);
            meal.totals.cost = toFixedNumber(meal.totals.cost + replacement.cost,1);
            return true;
          };
          tryReplace(lunch) || tryReplace(dinner) || tryReplace(snacks);
        }
      }
    }

    // sum totals
    const totals = ['breakfast','lunch','dinner','snacks'].reduce((acc,m)=>{
      acc.kcal += plan[m].totals.kcal;
      acc.protein += plan[m].totals.protein;
      acc.cost += plan[m].totals.cost;
      return acc;
    }, {kcal:0,protein:0,cost:0});
    totals.kcal = Math.round(totals.kcal);
    totals.protein = toFixedNumber(totals.protein,1);
    totals.cost = toFixedNumber(totals.cost,1);

    return { plan, totals };
  }

  /* -------------------- rendering helpers -------------------- */
  function clearResults(){ resultsWrap.innerHTML = ''; }

  function renderDayPlanCard(title, calories, macros, dailyPlan){
    const frag = document.createDocumentFragment();
    const card = document.createElement('article');
    card.className = 'card';
    card.style.marginBottom = '0.9rem';

    const h3 = document.createElement('h3');
    h3.textContent = `${title} — ${Math.round(calories)} kcal • ₹${dailyPlan.totals.cost}`;
    card.appendChild(h3);

    const p = document.createElement('p');
    p.className = 'small';
    p.textContent = `Macro targets: Protein ${macros.proteinGrams} g • Fat ${macros.fatGrams} g • Carbs ${macros.carbsGrams} g.`;
    card.appendChild(p);

    ['breakfast','lunch','dinner','snacks'].forEach(mealName=>{
      const meal = dailyPlan.plan[mealName];
      const box = document.createElement('div');
      box.style.marginTop = '0.6rem';
      box.innerHTML = `<strong style="text-transform:capitalize">${mealName} — ${meal.totals.kcal} kcal • ₹${meal.totals.cost}</strong>`;

      const ul = document.createElement('ul');
      ul.className = 'small';
      ul.style.margin = '0.35rem 0 0 0';

      meal.items.forEach(it=>{
        const li = document.createElement('li');
        li.textContent = `${it.serving} — ${it.kcal} kcal • ${it.protein} g protein • ₹${it.cost}`;
        ul.appendChild(li);
      });

      box.appendChild(ul);
      card.appendChild(box);
    });

    const tot = document.createElement('p');
    tot.className = 'small';
    tot.style.marginTop = '0.6rem';
    tot.innerHTML = `<strong>Daily total:</strong> ${dailyPlan.totals.kcal} kcal • ₹${dailyPlan.totals.cost} • Protein: ${dailyPlan.totals.protein} g`;
    card.appendChild(tot);

    frag.appendChild(card);
    return frag;
  }

  /* -------------------- main form handler -------------------- */
  form.addEventListener('submit', function(ev){
    ev.preventDefault();

    const height = Number(form.height.value);
    const weight = Number(form.weight.value);
    const age = Number(form.age.value);
    const gender = (form.gender && form.gender.value) ? form.gender.value : (form.querySelector('input[name="gender"]:checked') ? form.querySelector('input[name="gender"]:checked').value : 'male');
    const activity = Number(form.activity.value) || 1.2;

    // read diet preference (radio/select) robustly
    let dietChoice = 'veg';
    const checkedDiet = form.querySelector('input[name="diet"]:checked');
    if(checkedDiet && checkedDiet.value) dietChoice = checkedDiet.value;
    else if(form.diet && form.diet.value) dietChoice = form.diet.value;
    dietChoice = String(dietChoice).toLowerCase();

    // Interpretation rules:
    // - strictVegetarian: true when user chose vegetarian (and not a 'non' variant)
    // - preferNonVeg: true when user chose non-veg — we allow veg but prefer at least one nonveg item
    const strictVegetarian = dietChoice.includes('veg') && !dietChoice.includes('non');
    const preferNonVeg = dietChoice.includes('non') || dietChoice.includes('nonveg') || dietChoice.includes('non-veg');

    // validate inputs
    const errors = validateInputs(height, weight, age);
    if(errors.length){ alert(errors.join('\n')); return; }

    // compute BMR/TDEE & calorie targets
    const bmr = computeBMR({ weightKg: weight, heightCm: height, ageYears: age, gender });
    const tdee = bmr * activity;

    const normalCalories = Math.max(1000, Math.round(tdee));
    const leanCalories = Math.round(normalCalories * 0.80);
    const bulkCalories = Math.round(normalCalories * 1.20);

    const fatRatio = 0.25;
    const macrosLean = caloriesToMacros(leanCalories, weight, 2.0, fatRatio);
    const macrosNormal = caloriesToMacros(normalCalories, weight, 1.6, fatRatio);
    const macrosBulk = caloriesToMacros(bulkCalories, weight, 1.8, fatRatio);

    clearResults();

    // summary card
    const summaryCard = document.createElement('div');
    summaryCard.className = 'card';
    summaryCard.style.marginBottom = '0.9rem';
    summaryCard.innerHTML = `
      <h3>Results</h3>
      <p class="small">Diet: <strong>${strictVegetarian ? 'Vegetarian' : (preferNonVeg ? 'Non-vegetarian (preferred)' : 'Mixed')}</strong></p>
      <p class="small">BMR: <strong>${Math.round(bmr)} kcal/day</strong> • TDEE (activity applied): <strong>${Math.round(tdee)} kcal/day</strong></p>
      <p class="small">Building low-cost meal plans from the provided food dataset.</p>
    `;
    resultsWrap.appendChild(summaryCard);

    // build three plans (lean / normal / bulk)
    const leanPlan = buildDailyPlan(leanCalories, macrosLean.proteinGrams, strictVegetarian, preferNonVeg && !strictVegetarian);
    resultsWrap.appendChild(renderDayPlanCard('Leaning (low-budget)', leanCalories, macrosLean, leanPlan));

    const normalPlan = buildDailyPlan(normalCalories, macrosNormal.proteinGrams, strictVegetarian, preferNonVeg && !strictVegetarian);
    resultsWrap.appendChild(renderDayPlanCard('Normal (low-budget)', normalCalories, macrosNormal, normalPlan));

    const bulkPlan = buildDailyPlan(bulkCalories, macrosBulk.proteinGrams, strictVegetarian, preferNonVeg && !strictVegetarian);
    resultsWrap.appendChild(renderDayPlanCard('Bulking (low-budget)', bulkCalories, macrosBulk, bulkPlan));

    // copy summary button
    const copyCard = document.createElement('div');
    copyCard.className = 'card center';
    copyCard.style.marginTop = '0.6rem';
    copyCard.innerHTML = `
      <div class="small">Copy summary to clipboard.</div>
      <div style="margin-top:0.6rem;">
        <button class="btn" id="copyBudgetBtn">Copy summary</button>
      </div>
    `;
    resultsWrap.appendChild(copyCard);

    document.getElementById('copyBudgetBtn').addEventListener('click', function(){
      const text = [
        `Diet: ${strictVegetarian ? 'Vegetarian' : (preferNonVeg ? 'Non-vegetarian' : 'Mixed')}`,
        `BMR: ${Math.round(bmr)} kcal/day`,
        `TDEE: ${Math.round(tdee)} kcal/day`,
        `Leaning (low-budget): ${leanCalories} kcal — ₹${leanPlan.totals.cost} — P:${leanPlan.totals.protein}g`,
        `Normal (low-budget): ${normalCalories} kcal — ₹${normalPlan.totals.cost} — P:${normalPlan.totals.protein}g`,
        `Bulking (low-budget): ${bulkCalories} kcal — ₹${bulkPlan.totals.cost} — P:${bulkPlan.totals.protein}g`
      ].join('\n');
      if(navigator.clipboard && navigator.clipboard.writeText){
        navigator.clipboard.writeText(text).then(()=> alert('Summary copied to clipboard.'));
      } else {
        prompt('Copy the summary:', text);
      }
    });

    resultsWrap.scrollIntoView({ behavior:'smooth' });
  });

  // clear results on reset
  form.addEventListener('reset', function(){ setTimeout(()=> resultsWrap.innerHTML='',50); });

})();
