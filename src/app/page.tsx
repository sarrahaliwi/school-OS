'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';

export default function DashboardPage() {
  const [sessions, setSessions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // 1. Charger les données depuis Supabase
  const fetchSessions = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('sessions')
      .select('*, students(name)') // Jointure pour avoir le nom de l'élève
      .order('start_at', { ascending: true });

    if (!error && data) {
      setSessions(data);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchSessions();
  }, []);

  // 2. Fonction pour terminer une session (Déclenche n8n via Supabase)
  const handleFinishSession = async (sessionId: string) => {
    const fakeNotes = "L'élève a bien progressé sur les équations, mais doit revoir les priorités opératoires.";
    
    const { error } = await supabase
      .from('sessions')
      .update({ 
        status: 'completed',
        notes: fakeNotes 
      })
      .eq('id', sessionId);

    if (error) {
      alert("Erreur lors de la mise à jour");
    } else {
      alert("Session terminée ! n8n prépare le résumé IA...");
      // On rafraîchit les données pour voir le changement de statut
      setTimeout(fetchSessions, 2000); 
    }
  };

  if (loading) return <div className="p-10 text-center">Chargement de School OS...</div>;

  return (
    <main className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        <header className="mb-8 flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">School OS</h1>
            <p className="text-gray-600">Gestion des sessions et résumés IA</p>
          </div>
          <button 
            onClick={fetchSessions}
            className="text-sm bg-white border px-3 py-1 rounded hover:bg-gray-100"
          >
            Actualiser
          </button>
        </header>

        <div className="grid gap-6">
          {sessions.map((session) => (
            <div key={session.id} className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
              <div className="flex justify-between items-start">
                <div>
                  <h2 className="text-xl font-semibold text-gray-800">
                    {session.students?.name || 'Élève inconnu'}
                  </h2>
                  <p className="text-blue-600 font-medium">{session.subject}</p>
                  <p className="text-sm text-gray-400 mt-1">
                    📅 {new Date(session.start_at).toLocaleString('fr-FR')}
                  </p>
                </div>
                
                <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase ${
                  session.status === 'completed' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
                }`}>
                  {session.status === 'completed' ? 'Terminé' : 'Prévu'}
                </span>
              </div>

              {/* Affichage du résumé IA s'il existe */}
              {session.summary ? (
                <div className="mt-4 p-4 bg-blue-50 border-l-4 border-blue-400 rounded">
                  <p className="text-sm font-bold text-blue-800 mb-1">✨ Résumé automatique (IA) :</p>
                  <p className="text-gray-700 italic">"{session.summary}"</p>
                </div>
              ) : session.status === 'completed' ? (
                <p className="mt-4 text-sm text-gray-400 animate-pulse italic">
                  ⏳ n8n génère le résumé...
                </p>
              ) : null}

              {/* Bouton d'action */}
              {session.status !== 'completed' && (
                <button
                  onClick={() => handleFinishSession(session.id)}
                  className="mt-6 w-full bg-gray-900 text-white py-2 rounded-lg font-medium hover:bg-gray-800 transition-colors"
                >
                  Terminer la session et générer le rapport
                </button>
              )}
            </div>
          ))}

          {sessions.length === 0 && (
            <p className="text-center text-gray-500 mt-10">Aucune session trouvée dans Supabase.</p>
          )}
        </div>
      </div>
    </main>
  );
}