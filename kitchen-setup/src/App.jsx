import React, { useState, useMemo, useEffect } from 'react';
import { Progress } from "@/components/ui/progress";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { CheckCircle, PlusCircle, Utensils, Coffee, Sandwich, IceCream, Droplet, Truck } from "lucide-react";

// -----------------------------
// Données des postes (dernières MAJ incluses)
// -----------------------------
const postes = {
  Wingman: [
    '5 grandes louches', '5 petites louches', '12 bols', '3 pinces jaunes', '2 pinces noires',
    '4 backup sauces', '4 Parmesan', 'Boîtes sur place petite et grande', 'Boîtes à emporter petite et grande',
    'Épices: 2 cajun, 2 lemon, 2 Brazil', 'Papier'
  ],
  Bombardier: [
    '2 bols', 'Frigo: boneless, tender, wings', 'Réchaud allumé et chargé eau (2 grands bacs gastro)',
    '1 pince rouge', '1 grande pince'
  ],
  Gunner: [
    '6 bols', 'Pinces rouge et noire', 'Épices: 5 winstop, 5 cajun, 2 lemon', 'Épice: sucre cannelle',
    'Frigo: frite, patate douce, maïs, churros', 'Boîtes sur place: petite et grande', 'Boîtes à emporter: petite et grande',
    'Papier', '3 biberons Nutella', '3 biberons ranch', '6 biberons cheddar', '3 biberons original',
    '2 petits gastro', 'Oreo', 'Lotus', '2 petites cuillères noires', 'Cuillère coleslaw',
    '1 petite pelle', '1 grande pelle', 'Backup sauce', '4 Parmesan', '2 grands bacs (réchaud)', 'Plateau'
  ],
  Burger: [
    'Papier burger', '4 petits gastro', '2 couvercles pour petits gastro', 'Coleslaw', 'Cornichons', 'Pain burger',
    '3 biberons ranch', '1 pince jaune', 'Cuillère coleslaw'
  ],
  'Pilote sur place': [
    'Plateaux', 'Stickers', '3 bacs sauces: ranch, honey mustard, blue cheese', 'Imprimante chargée', 'Verres'
  ],
  'Pilote à emporter': [
    'Petits et grands sacs', 'Stickers', 'Imprimante Deliveroo chargée', 'Verres'
  ],
  Milkshake: [
    '2 petites louches', 'Oreo et Lotus', 'Verres et couvercles', 'Pailles', '2 doseurs (fraise, chocolat, caramel)', 'Crème chantilly'
  ],
  Lavabo: [
    'Savon', 'Serviettes', 'Eau chaude'
  ],
  Décongélation: [
    'Wings', 'Maïs'
  ]
};

// -----------------------------
// Styles & icônes
// -----------------------------
const colors = {
  Wingman: 'bg-yellow-100',
  Bombardier: 'bg-blue-100',
  Gunner: 'bg-red-100',
  Burger: 'bg-orange-100',
  'Pilote sur place': 'bg-green-100',
  'Pilote à emporter': 'bg-teal-100',
  Milkshake: 'bg-pink-100',
  Lavabo: 'bg-gray-100',
  Décongélation: 'bg-purple-100',
  Ravitaillement: 'bg-lime-100'
};

const icons = {
  Wingman: Utensils,
  Bombardier: Coffee,
  Gunner: CheckCircle,
  Burger: Sandwich,
  'Pilote sur place': CheckCircle,
  'Pilote à emporter': CheckCircle,
  Milkshake: IceCream,
  Lavabo: Droplet,
  Décongélation: CheckCircle,
  Ravitaillement: Truck
};

export default function App() {
  // 🔒 Clés de sauvegarde locale
  const LS_CHECKED_KEY = 'kitchen_setup_checked_v1';
  const LS_RAVI_KEY = 'kitchen_setup_ravi_v1';

  const [checked, setChecked] = useState({}); // postes + ravitaillement (persisté)
  const [raviDone, setRaviDone] = useState({}); // ravitaillement (persisté)
  const [view, setView] = useState('home');
  const [showBanner, setShowBanner] = useState(false);

  // -----------------------------
  // Persistence
  // -----------------------------
  useEffect(() => {
    try {
      const savedChecked = JSON.parse(localStorage.getItem(LS_CHECKED_KEY) || '{}');
      if (savedChecked && typeof savedChecked === 'object') setChecked(savedChecked);
    } catch {}
    try {
      const savedRavi = JSON.parse(localStorage.getItem(LS_RAVI_KEY) || '{}');
      if (savedRavi && typeof savedRavi === 'object') setRaviDone(savedRavi);
    } catch {}
  }, []);

  useEffect(() => {
    try { localStorage.setItem(LS_CHECKED_KEY, JSON.stringify(checked)); } catch {}
  }, [checked]);
  useEffect(() => {
    try { localStorage.setItem(LS_RAVI_KEY, JSON.stringify(raviDone)); } catch {}
  }, [raviDone]);

  // -----------------------------
  // Helpers progression (postes)
  // -----------------------------
  const toggleCheck = (poste, item) => {
    const key = poste + '-' + item;
    setChecked(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const progress = (poste) => {
    const items = postes[poste];
    const done = items.filter(item => checked[poste + '-' + item]).length;
    return Math.round((done / items.length) * 100);
  };

  const globalProgress = () => {
    const totalItems = Object.values(postes).flat().length;
    const doneItems = Object.keys(checked).filter(k => checked[k] && !k.startsWith('RAV-')).length;
    return Math.round((doneItems / totalItems) * 100);
  };

  // -----------------------------
  // Ravitaillement : totaux (sans boîtes/papier) avec 1 case par item
  // -----------------------------
  const ravitaillementSpec = useMemo(() => {
    const T = {
      'Bols': 0,
      'Grandes louches': 0,
      'Petites louches': 0,
      'Pinces (total)': 0,
      'Pinces jaunes': 0,
      'Pinces noires': 0,
      'Pinces rouges': 0,
      'Petites pinces': 0,
      'Grandes pinces': 0,
      'Petites pelles': 0,
      'Grandes pelles': 0,
      'Petits gastro': 0,
      'Grands bacs (réchaud)': 0,
      'Biberons (total)': 0,
      'Biberons Nutella': 0,
      'Biberons ranch': 0,
      'Biberons cheddar': 0,
      'Biberons original': 0,
      'Parmesan': 0,
      'Épices (total)': 0,
      'Épices cajun': 0,
      'Épices lemon': 0,
      'Épices Brazil': 0,
      'Épice sucre cannelle': 0,
      'Plateaux': 0,
      'Bacs plastiques (grands) [sauce]': 3,
      'Bacs plastiques (petits) [sauce]': 3
    };

    const add = (key, n = 1) => (T[key] = (T[key] || 0) + n);
    const numFrom = (s) => parseInt((s.match(/\\d+/) || [1])[0]);

    Object.values(postes).forEach((items) => {
      items.forEach((raw) => {
        const s = raw.toLowerCase();
        const n = numFrom(raw);

        if (s.includes('bol')) add('Bols', n);
        if (s.includes('louche')) {
          if (s.includes('grande')) add('Grandes louches', n);
          else if (s.includes('petite')) add('Petites louches', n);
        }
        if (s.includes('pince')) {
          add('Pinces (total)', n);
          if (s.includes('jaune')) add('Pinces jaunes', n);
          if (s.includes('noire')) add('Pinces noires', n);
          if (s.includes('rouge')) add('Pinces rouges', n);
          if (s.includes('petite')) add('Petites pinces', n);
          if (s.includes('grande')) add('Grandes pinces', n);
        }
        if (s.includes('pelle')) {
          if (s.includes('petite')) add('Petites pelles', n);
          if (s.includes('grande')) add('Grandes pelles', n);
        }
        if (s.includes('petits gastro')) add('Petits gastro', n);
        if (s.includes('grands bacs') && s.includes('réchaud')) add('Grands bacs (réchaud)', n);
        if (s.includes('biberon')) {
          add('Biberons (total)', n);
          if (s.includes('nutella')) add('Biberons Nutella', n);
          if (s.includes('ranch')) add('Biberons ranch', n);
          if (s.includes('cheddar')) add('Biberons cheddar', n);
          if (s.includes('original')) add('Biberons original', n);
        }
        if (s.includes('parmesan')) add('Parmesan', n);
        if (s.includes('épice')) {
          add('Épices (total)', n);
          if (s.includes('cajun')) add('Épices cajun', n);
          if (s.includes('lemon')) add('Épices lemon', n);
          if (s.includes('brazil')) add('Épices Brazil', n);
          if (s.includes('sucre') && s.includes('cannelle')) add('Épice sucre cannelle', n);
        }
        if (s.includes('plateau')) add('Plateaux', n);
      });
    });

    // Forcer Petits gastro à 6
    T['Petits gastro'] = 6;

    return T;
  }, []);

  // 1 seule case par item de ravitaillement
  const [/*raviDone already declared above*/] = [];
  const keyR = (label) => `RAV-${label}`;
  const toggleRavi = (label) => setRaviDone(prev => ({ ...prev, [keyR(label)]: !prev[keyR(label)] }));

  const progressRavitaillement = () => {
    const items = Object.keys(ravitaillementSpec);
    const done = items.filter(lbl => raviDone[keyR(lbl)]).length;
    return Math.round((done / Math.max(items.length, 1)) * 100);
  };

  // 🔄 Réinitialisation TOTALE
  const resetAll = () => {
    if (!window.confirm('Voulez-vous vraiment tout réinitialiser ?')) return;
    setChecked({});
    setRaviDone({});
    try {
      localStorage.removeItem(LS_CHECKED_KEY);
      localStorage.removeItem(LS_RAVI_KEY);
    } catch {}
    setShowBanner(true);
    setTimeout(() => setShowBanner(false), 3000);
  };

  // -----------------------------
  // Rendu UI
  // -----------------------------
  if (view === 'home') {
    return (
      <div className="p-6 text-center space-y-6 bg-gray-900 text-white min-h-screen">
        {/* Bandeau succès fixe */}
        {showBanner && (
          <div className="fixed top-4 left-1/2 -translate-x-1/2 bg-green-600 text-white px-4 py-2 rounded-xl shadow z-50">
            ✅ Réinitialisation terminée
          </div>
        )}
        <h1 className="text-3xl font-bold">🍳 Mise en Place Cuisine</h1>
        <p className="text-lg">Suivez la préparation de chaque poste et vérifiez la mise en place complète.</p>
        <div className="w-full max-w-md mx-auto">
          <Progress value={globalProgress()} className="mb-2" />
          <p>{globalProgress()}% globalement complété</p>
          <div className="mt-3">
            <Button variant="outline" onClick={resetAll}>🔄 Réinitialiser tout</Button>
          </div>
        </div>

        {/* Ravitaillement centré en haut */}
        <div className="flex justify-center mt-6">
          <motion.div
            whileHover={{ scale: 1.05 }}
            className={`p-4 w-72 rounded-2xl cursor-pointer ${colors.Ravitaillement} text-black shadow-lg`}
            onClick={() => setView('Ravitaillement')}
          >
            <div className="flex items-center justify-center flex-col">
              <Truck className="mb-2" />
              <h2 className="font-semibold">Ravitaillement</h2>
              <p className="text-xs opacity-70">1 case par item + totaux</p>
            </div>
          </motion.div>
        </div>

        {/* Autres postes */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-6">
          {Object.keys(postes).map((poste) => {
            const Icon = icons[poste];
            return (
              <motion.div
                key={poste}
                whileHover={{ scale: 1.05 }}
                className={`p-4 rounded-2xl cursor-pointer ${colors[poste]} text-black shadow-lg`}
                onClick={() => setView(poste)}
              >
                <div className="flex items-center justify-center flex-col">
                  <Icon className="mb-2" />
                  <h2 className="font-semibold">{poste}</h2>
                  <p>{progress(poste)}%</p>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    );
  }

  if (view === 'Ravitaillement') {
    const entries = Object.entries(ravitaillementSpec);
    return (
      <div className="p-6 bg-gray-900 text-white min-h-screen">
        <div className="flex items-center justify-between mb-4">
          <Button variant="outline" onClick={() => setView('home')}>⬅ Retour</Button>
          <Button variant="outline" onClick={() => setRaviDone({})}>Réinitialiser</Button>
        </div>
        <Card className={`shadow-md ${colors.Ravitaillement} text-black`}>
          <CardHeader>
            <CardTitle>Ravitaillement</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="mb-4">Valide chaque catégorie d'ustensile. Le total attendu reste affiché.</p>
            <Progress value={progressRavitaillement()} className="mb-4" />
            <ul className="space-y-3">
              {entries.map(([label, total]) => {
                const ok = !!raviDone[keyR(label)];
                return (
                  <li key={label} className={`flex items-center justify-between p-3 rounded-xl ${ok ? 'bg-green-200' : 'bg-white/70'}`}>
                    <div className="flex items-center gap-3">
                      <input
                        type="checkbox"
                        className="h-5 w-5"
                        checked={ok}
                        onChange={() => toggleRavi(label)}
                      />
                      <span className="font-medium">{label}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      {ok && <CheckCircle className="h-5 w-5 text-green-700" />}
                      <span className="font-semibold">{total}</span>
                    </div>
                  </li>
                );
              })}
            </ul>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Vue d'un poste
  return (
    <div className="p-6 bg-gray-900 text-white min-h-screen">
      <Button variant="outline" className="mb-4" onClick={() => setView('home')}>⬅ Retour</Button>
      <Card className={`shadow-md ${colors[view]} text-black`}>
        <CardHeader>
          <CardTitle className="flex justify-between items-center">
            {view}
            <span className="text-sm text-muted-foreground">{progress(view)}%</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <motion.div initial={{ width: 0 }} animate={{ width: `${progress(view)}%` }}>
            <Progress value={progress(view)} className="mb-4" />
          </motion.div>
          <ul className="space-y-3">
            {postes[view].map((item) => (
              <li key={item} className="flex items-center gap-3">
                <Button
                  variant={checked[view + '-' + item] ? "default" : "outline"}
                  size="icon"
                  onClick={() => toggleCheck(view, item)}
                  className="rounded-full"
                >
                  <PlusCircle className="h-5 w-5" />
                </Button>
                <span className={checked[view + '-' + item] ? 'line-through opacity-60' : ''}>{item}</span>
              </li>
            ))}
          </ul>
          <Button
            variant="outline"
            className="mt-6 w-full"
            onClick={() => postes[view].forEach(item => setChecked(prev => ({ ...prev, [view + '-' + item]: false })))}
          >
            Réinitialiser le poste
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}