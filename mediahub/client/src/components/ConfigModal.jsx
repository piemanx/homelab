import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { X, Save, AlertCircle } from 'lucide-react';

const ConfigModal = ({ isOpen, onClose, onConfigSaved }) => {
  const [configJson, setConfigJson] = useState('');
  const [error, setError] = useState(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (isOpen) {
      // Fetch fresh config when modal opens
      axios.get('/api/config')
        .then(res => {
          setConfigJson(JSON.stringify(res.data, null, 2));
          setError(null);
        })
        .catch(err => {
          console.error("Failed to fetch config:", err);
          setError("Failed to load configuration.");
        });
    }
  }, [isOpen]);

  const handleSave = async () => {
    setSaving(true);
    setError(null);

    try {
      // Validate JSON syntax
      const parsedConfig = JSON.parse(configJson);

      // Send to server
      await axios.post('/api/config', parsedConfig);
      
      if (onConfigSaved) onConfigSaved();
      onClose();
    } catch (err) {
      if (err instanceof SyntaxError) {
        setError("Invalid JSON format: " + err.message);
      } else {
        setError("Failed to save: " + (err.response?.data?.error || err.message));
      }
    } finally {
      setSaving(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="bg-surface rounded-2xl shadow-2xl w-full max-w-3xl flex flex-col max-h-[90vh] border border-white/10">
        
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-white/10">
          <h2 className="text-2xl font-bold text-white">Configuration</h2>
          <button 
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 flex-1 overflow-hidden flex flex-col">
          <p className="text-slate-400 mb-4 text-sm">
            Edit the raw JSON configuration below. Ensure syntax is correct before saving.
          </p>
          
          {error && (
            <div className="mb-4 p-3 bg-red-500/10 border border-red-500/20 text-red-200 rounded-lg flex items-center gap-2 text-sm">
              <AlertCircle size={16} />
              {error}
            </div>
          )}

          <textarea
            value={configJson}
            onChange={(e) => setConfigJson(e.target.value)}
            className="flex-1 w-full bg-slate-950 text-slate-200 font-mono text-sm p-4 rounded-lg border border-white/10 focus:border-brand focus:ring-1 focus:ring-brand outline-none resize-none"
            spellCheck="false"
          />
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-white/10 flex justify-end gap-3">
          <button 
            onClick={onClose}
            className="px-4 py-2 text-slate-300 hover:text-white hover:bg-white/5 rounded-lg transition-colors font-medium"
          >
            Cancel
          </button>
          <button 
            onClick={handleSave}
            disabled={saving}
            className="flex items-center gap-2 px-6 py-2 bg-brand hover:bg-blue-600 text-white rounded-lg transition-colors font-bold disabled:opacity-50 disabled:cursor-not-allowed shadow-[0_0_15px_rgba(59,130,246,0.4)]"
          >
            {saving ? 'Saving...' : (
              <>
                <Save size={18} />
                Save Changes
              </>
            )}
          </button>
        </div>

      </div>
    </div>
  );
};

export default ConfigModal;
