import { useState, useEffect } from 'react';
import AdminLayout from '../components/AdminLayout';
import api from '../utils/api';
import { Mail, Send, CheckCircle2, Clock, FileText, ChevronDown, ChevronUp, Download, Search } from 'lucide-react';
import { toast } from 'sonner';
import { Skeleton } from '../components/Skeleton';

interface Inquiry {
  id: number;
  requesterName: string;
  requesterEmail: string;
  question: string;
  answerText: string;
  status: 'ABERTA' | 'RESPONDIDA';
  createdAt: string;
  attachmentName?: string;
  attachmentMime?: string;
}

const AdminInquiries = ({ setToken }: { setToken?: (v: string | null) => void }) => {
  const [inquiries, setInquiries] = useState<Inquiry[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'TODAS' | 'ABERTA' | 'RESPONDIDA'>('TODAS');
  const [answerText, setAnswerText] = useState('');
  const [expandedId, setExpandedId] = useState<number | null>(null);
  const [search, setSearch] = useState('');

  useEffect(() => {
    fetchInquiries();
  }, [filter, search]);

  const fetchInquiries = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (filter !== 'TODAS') params.append('status', filter);
      if (search) params.append('search', search);

      const { data } = await api.get(`/admin/inquiries?${params.toString()}`);
      setInquiries(data);
    } catch (err) {
      toast.error('Erro ao buscar lista de dúvidas.');
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = async (id: number, filename: string) => {
    try {
      const response = await api.get(`/admin/inquiries/${id}/attachment`, {
        responseType: 'blob'
      });
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', filename || `anexo-${id}`);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (err) {
      toast.error('Erro ao baixar anexo.');
    }
  };

  const handleAnswer = async (id: number) => {
    if (!answerText.trim()) {
      toast.error('A resposta não pode estar vazia.');
      return;
    }
    try {
      await api.put(`/admin/inquiries/${id}`, { answerText });
      toast.success('Dúvida respondida e aluno notificado por e-mail!');
      setAnswerText('');
      setExpandedId(null);
      fetchInquiries();
    } catch (err: any) {
      const msg = err.response?.data?.details?.[0]?.message || err.response?.data?.error || 'Erro ao enviar resposta.';
      toast.error(msg);
    }
  };

  return (
    <AdminLayout setToken={setToken}>
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white leading-tight">Dúvidas da Secretaria</h2>
          <p className="text-gray-500 dark:text-gray-400 text-sm">Responda às solicitações enviadas pelos estudantes</p>
        </div>

        <div className="flex bg-white dark:bg-slate-900 rounded-xl shadow-sm border border-gray-100 dark:border-slate-800 p-1">
          {(['TODAS', 'ABERTA', 'RESPONDIDA'] as const).map(f => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${
                filter === f 
                  ? 'bg-indigo-600 text-white shadow-md' 
                  : 'text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300'
              }`}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      <div className="mb-6 relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500" size={18} />
        <input
          type="text"
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Buscar por nome, e-mail ou conteúdo da dúvida..."
          className="w-full pl-12 pr-4 py-3 bg-white dark:bg-slate-900 dark:text-white rounded-2xl border border-gray-100 dark:border-slate-800 shadow-sm focus:ring-2 focus:ring-indigo-400 outline-none transition-all"
        />
      </div>

      <div className="space-y-4 transition-colors">
        {loading ? (
          <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 space-y-4 shadow-sm border border-gray-100 dark:border-slate-800">
            <Skeleton className="h-20 w-full" />
            <Skeleton className="h-20 w-full" />
            <Skeleton className="h-20 w-full" />
          </div>
        ) : inquiries.length === 0 ? (
          <div className="bg-white dark:bg-slate-900 rounded-2xl p-12 text-center border border-dashed border-gray-200 dark:border-slate-800">
            <Mail className="mx-auto text-gray-200 dark:text-slate-800 mb-4" size={48} />
            <p className="text-gray-400 dark:text-gray-500 italic">Nenhuma dúvida encontrada para este filtro.</p>
          </div>
        ) : (
          inquiries.map(inq => (
            <div 
              key={inq.id} 
              className={`bg-white dark:bg-slate-900 rounded-2xl shadow-sm border transition-all ${
                expandedId === inq.id ? 'border-indigo-400 dark:border-indigo-500 ring-4 ring-indigo-50 dark:ring-indigo-900/20' : 'border-gray-100 dark:border-slate-800 hover:border-indigo-200 dark:hover:border-slate-700'
              }`}
            >
              {/* Header Card */}
              <div 
                className="p-6 flex items-center justify-between cursor-pointer"
                onClick={() => setExpandedId(expandedId === inq.id ? null : inq.id)}
              >
                <div className="flex items-center gap-4">
                  <div className={`p-3 rounded-full ${inq.status === 'ABERTA' ? 'bg-amber-50 dark:bg-amber-950/30 text-amber-600' : 'bg-green-50 dark:bg-green-950/30 text-green-600'}`}>
                    {inq.status === 'ABERTA' ? <Clock size={20} /> : <CheckCircle2 size={20} />}
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-900 dark:text-white flex items-center gap-2">
                      {inq.requesterName}
                      <span className="text-[10px] text-gray-400 border border-gray-200 dark:border-slate-800 px-1 rounded uppercase tracking-tighter">#{inq.id}</span>
                    </h4>
                    <p className="text-xs text-gray-500 dark:text-gray-400">{inq.requesterEmail}</p>
                  </div>
                </div>
                
                <div className="hidden md:block flex-1 mx-8 max-w-lg">
                  <p className="text-sm text-gray-600 dark:text-gray-300 truncate italic">"{inq.question}"</p>
                </div>

                <div className="flex items-center gap-4">
                   <span className="text-[10px] text-gray-400 font-medium">{new Date(inq.createdAt).toLocaleDateString()}</span>
                   {expandedId === inq.id ? <ChevronUp size={20} className="text-gray-400" /> : <ChevronDown size={20} className="text-gray-400" />}
                </div>
              </div>

              {/* Expandable Content */}
              {expandedId === inq.id && (
                <div className="px-6 pb-6 pt-2 border-t border-gray-50 dark:border-slate-800 animate-fade-in">
                  <div className="bg-gray-50 dark:bg-slate-800/50 rounded-xl p-4 mb-6">
                    <p className="text-xs font-bold text-gray-400 dark:text-gray-500 uppercase mb-2">Dúvida do Aluno:</p>
                    <p className="text-gray-700 dark:text-gray-200 whitespace-pre-wrap">{inq.question}</p>
                    
                    {inq.attachmentName && (
                      <div className="mt-4 p-3 bg-white dark:bg-slate-700/50 border border-gray-100 dark:border-slate-600 rounded-lg flex items-center justify-between">
                         <div className="flex items-center gap-2 text-indigo-600 dark:text-indigo-400 text-sm font-medium">
                            <FileText size={16} />
                            <span>{inq.attachmentName}</span>
                         </div>
                         <button 
                           onClick={() => handleDownload(inq.id, inq.attachmentName!)}
                           className="flex items-center gap-2 bg-indigo-50 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300 px-3 py-1.5 rounded-lg text-xs hover:bg-indigo-100 transition-all font-bold"
                          >
                           <Download size={14} />
                           Baixar Anexo
                         </button>
                      </div>
                    )}
                  </div>

                  {inq.status === 'ABERTA' ? (
                    <div className="space-y-3">
                      <label className="text-xs font-bold text-indigo-400 dark:text-indigo-500 uppercase">Sua Resposta:</label>
                      <textarea 
                        className="w-full bg-white dark:bg-slate-800 border-2 border-indigo-50 dark:border-slate-700 rounded-xl p-4 text-sm focus:border-indigo-400 dark:focus:border-indigo-500 outline-none transition-all dark:text-white"
                        placeholder="Digite aqui a orientação para o aluno..."
                        rows={4}
                        value={answerText}
                        onChange={(e) => setAnswerText(e.target.value)}
                      />
                      <button 
                        onClick={() => handleAnswer(inq.id)}
                        className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 rounded-xl flex items-center justify-center gap-2 shadow-lg shadow-indigo-100 dark:shadow-none transition-all"
                      >
                        <Send size={18} />
                        Enviar Resposta Final
                      </button>
                    </div>
                  ) : (
                    <div className="bg-green-50/50 dark:bg-green-950/20 border border-green-100 dark:border-green-900/30 rounded-xl p-4">
                      <p className="text-xs font-bold text-green-600 dark:text-green-500 uppercase mb-2">Resposta Enviada em {new Date(inq.createdAt).toLocaleDateString()}:</p>
                      <p className="text-gray-600 dark:text-gray-300">{inq.answerText}</p>
                    </div>
                  )}
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </AdminLayout>
  );
};

export default AdminInquiries;
