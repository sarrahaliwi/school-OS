"use client";
import React, { useEffect, useState } from 'react';
import { createClient } from '@supabase/supabase-js';

// Initialisation de Supabase
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export default function Sidebar() {
  const [sessions, setSessions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // 1. Charger les sessions depuis Supabase
  useEffect(() => {
    fetchSessions();
  }, []);

  const fetchSessions = async () => {
    const { data, error } = await supabase
      .from('sessions')
      .select('*')
      .order('start_at', { ascending: true });
    
    if (!error) setSessions(data);
    setLoading(false);
  };

  // 2. Fonction pour TERMINER un cours (Déclenche n8n)
  const handleComplete = async (id: string) => {
    const { error } = await supabase
      .from('sessions')
      .update({ 
        status: 'completed',
        notes: 'L’élève a bien progressé sur les exercices de révision.' 
      })
      .eq('id', id);

    if (error) {
      alert("Erreur");
    } else {
      alert("Cours terminé ! n8n prépare le résumé...");
      fetchSessions(); // Rafraîchir la liste
    }
  };

  return (
    <div className="w-80 h-screen bg-gray-50 border-r p-4 flex flex-col">
      <h1 className="text-xl font-bold mb-6 text-indigo-600">School OS</h1>
      
      <div className="flex-1 overflow-y-auto">
        <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-4">
          Sessions à venir
        </h2>

        {loading ? <p>Chargement...</p> : (
          <div className="space-y-3">
            {sessions.map((session) => (
              <div key={session.id} className="p-3 bg-white border rounded-lg shadow-sm">
                <div className="font-medium text-gray-800">{session.subject}</div>
                <div className="text-sm text-gray-500">
                  {new Date(session.start_at).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                </div>
                
                {session.status !== 'completed' ? (
                  <button
                    onClick={() => handleComplete(session.id)}
                    className="mt-2 w-full bg-indigo-50 text-indigo-600 py-1 px-2 rounded text-xs font-bold hover:bg-indigo-600 hover:text-white transition-colors"
                  >
                    Terminer la session
                  </button>
                ) : (
                  <span className="mt-2 block text-center text-xs text-green-600 font-bold bg-green-50 py-1 rounded">
                    ✅ Terminé (Résumé prêt)
                  </span>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="mt-auto pt-4 border-t text-xs text-gray-400">
        Connecté à Supabase & n8n
      </div>
    </div>
  );
}