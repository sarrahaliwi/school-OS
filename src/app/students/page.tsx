'use client';
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';

export default function Dashboard() {
  const [sessions, setSessions] = useState<any[]>([]);

  useEffect(() => {
    // Charger les données au démarrage
    const fetchSessions = async () => {
      const { data } = await supabase.from('sessions').select('*');
      if (data) setSessions(data);
    };
    fetchSessions();
  }, []);

  return (
    <div className="p-10 bg-gray-50 min-h-screen">
      <h1 className="text-3xl font-bold mb-8 text-slate-800">Tableau de bord School OS</h1>
      
      <div className="grid gap-6">
        {sessions.map((session) => (
          <div key={session.id} className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
            <div className="flex justify-between items-start">
              <div>
                <h2 className="text-xl font-semibold text-slate-700">{session.subject}</h2>
                <p className="text-slate-500">Statut : 
                  <span className={`ml-2 px-2 py-1 rounded text-xs ${session.status === 'completed' ? 'bg-green-100 text-green-700' : 'bg-blue-100 text-blue-700'}`}>
                    {session.status}
                  </span>
                </p>
              </div>
              <button className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition">
                Détails
              </button>
            </div>

            {/* C'EST ICI QUE LE RÉSULTAT DE N8N S'AFFICHE */}
            {session.summary ? (
              <div className="mt-4 p-4 bg-indigo-50 border-l-4 border-indigo-500 rounded">
                <p className="text-sm font-bold text-indigo-800 mb-1">✨ Résumé automatique (IA) :</p>
                <p className="text-slate-600 italic">"{session.summary}"</p>
              </div>
            ) : (
              <p className="mt-4 text-sm text-slate-400">Aucun résumé disponible pour le moment.</p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}