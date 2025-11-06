'use client';

import { useAppStore } from '@/store/useAppStore';
import { CheckCircle, XCircle, ExternalLink, Download, RotateCcw } from 'lucide-react';
import { cn } from '@/lib/utils';
import { exportReportToPDF } from '@/lib/pdf-export';
import type { AvailabilityStatus } from '@/types';

function StatusIcon({ status }: { status: AvailabilityStatus }) {
  if (status === 'available') {
    return <CheckCircle className="w-5 h-5 text-green-500" />;
  }
  if (status === 'taken') {
    return <XCircle className="w-5 h-5 text-red-500" />;
  }
  return <div className="w-5 h-5 rounded-full bg-gray-300" />;
}

function StatusBadge({ status }: { status: AvailabilityStatus }) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-sm font-medium',
        status === 'available' && 'bg-green-100 text-green-800',
        status === 'taken' && 'bg-red-100 text-red-800',
        status === 'checking' && 'bg-yellow-100 text-yellow-800',
        status === 'error' && 'bg-gray-100 text-gray-800'
      )}
    >
      <StatusIcon status={status} />
      {status === 'available' ? 'Disponible' : status === 'taken' ? 'Pris' : 'Inconnu'}
    </span>
  );
}

export default function AvailabilityReport() {
  const { availabilityReports, reset } = useAppStore();

  const handleExportPDF = () => {
    exportReportToPDF(availabilityReports);
  };

  const handleReset = () => {
    if (confirm('Voulez-vous recommencer une nouvelle recherche ?')) {
      reset();
    }
  };

  if (availabilityReports.length === 0) {
    return null;
  }

  return (
    <div className="w-full max-w-6xl mx-auto animate-fade-in">
      <div className="bg-white rounded-2xl shadow-xl p-8">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-900">
            Rapport de Disponibilité
          </h2>
          <div className="flex gap-3">
            <button
              onClick={handleExportPDF}
              className="px-4 py-2 flex items-center gap-2 text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 rounded-lg transition-colors"
            >
              <Download className="w-4 h-4" />
              Exporter en PDF
            </button>
            <button
              onClick={handleReset}
              className="px-4 py-2 flex items-center gap-2 text-sm font-medium text-gray-600 hover:text-gray-700 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <RotateCcw className="w-4 h-4" />
              Nouvelle recherche
            </button>
          </div>
        </div>

        <div className="space-y-8">
          {availabilityReports.map((report, index) => (
            <div key={index} className="border border-gray-200 rounded-xl p-6">
              {/* Header avec nom et score */}
              <div className="flex items-center justify-between mb-6 pb-4 border-b border-gray-200">
                <h3 className="text-2xl font-bold text-gray-900">{report.name}</h3>
                <div className="text-right">
                  <div className="text-3xl font-bold text-primary-600">{report.overallScore}%</div>
                  <div className="text-sm text-gray-600">Score de disponibilité</div>
                </div>
              </div>

              {/* Noms de domaine */}
              <div className="mb-6">
                <h4 className="text-lg font-semibold text-gray-900 mb-3">
                  Noms de domaine
                </h4>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-gray-200">
                        <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Extension</th>
                        <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Statut</th>
                        <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Registrar</th>
                        <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {report.domains.map((domain, i) => (
                        <tr key={i} className="border-b border-gray-100 hover:bg-gray-50">
                          <td className="py-3 px-4 font-medium text-gray-900">
                            {report.name}{domain.tld}
                          </td>
                          <td className="py-3 px-4">
                            <StatusBadge status={domain.status} />
                          </td>
                          <td className="py-3 px-4 text-gray-600">
                            {domain.registrar || '-'}
                          </td>
                          <td className="py-3 px-4">
                            {domain.link && domain.status === 'available' && (
                              <a
                                href={domain.link}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-1 text-primary-600 hover:text-primary-700 text-sm font-medium"
                              >
                                Acheter
                                <ExternalLink className="w-4 h-4" />
                              </a>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Marques déposées */}
              <div className="mb-6">
                <h4 className="text-lg font-semibold text-gray-900 mb-3">
                  Marques déposées
                </h4>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-gray-200">
                        <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Pays/Office</th>
                        <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Statut</th>
                        <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {report.trademarks.map((trademark, i) => (
                        <tr key={i} className="border-b border-gray-100 hover:bg-gray-50">
                          <td className="py-3 px-4 font-medium text-gray-900">
                            {trademark.country} ({trademark.office})
                          </td>
                          <td className="py-3 px-4">
                            <StatusBadge status={trademark.status} />
                          </td>
                          <td className="py-3 px-4">
                            {trademark.searchLink && (
                              <a
                                href={trademark.searchLink}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-1 text-primary-600 hover:text-primary-700 text-sm font-medium"
                              >
                                Rechercher
                                <ExternalLink className="w-4 h-4" />
                              </a>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Réseaux sociaux */}
              <div className="mb-6">
                <h4 className="text-lg font-semibold text-gray-900 mb-3">
                  Réseaux sociaux
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {report.socialMedia.map((social, i) => (
                    <div
                      key={i}
                      className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50"
                    >
                      <div className="flex items-center gap-3">
                        <StatusIcon status={social.status} />
                        <span className="font-medium text-gray-900">{social.platform}</span>
                      </div>
                      {social.status === 'available' && (
                        <a
                          href={social.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-primary-600 hover:text-primary-700 text-sm font-medium"
                        >
                          <ExternalLink className="w-4 h-4" />
                        </a>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* App Stores */}
              <div>
                <h4 className="text-lg font-semibold text-gray-900 mb-3">
                  App Stores
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {report.appStores.map((store, i) => (
                    <div
                      key={i}
                      className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50"
                    >
                      <div className="flex items-center gap-3">
                        <StatusIcon status={store.status} />
                        <span className="font-medium text-gray-900">
                          {store.store === 'ios' ? 'Apple App Store' : 'Google Play Store'}
                        </span>
                      </div>
                      {store.existingApp && (
                        <a
                          href={store.existingApp.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-primary-600 hover:text-primary-700 text-sm font-medium"
                        >
                          <ExternalLink className="w-4 h-4" />
                        </a>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
