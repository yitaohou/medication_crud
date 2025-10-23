import LocalStorageSync from "@/app/components/LocalStorageSync";
import ActionButtons from "@/app/components/medication/ActionButtons";
import AddMedicationButton from "@/app/components/medication/AddMedicationButton";
import DeleteMedicationButton from "@/app/components/medication/DeleteMedicationButton";
import EditMedicationButton from "@/app/components/medication/EditMedicationButton";
import ExpiredBanner from "@/app/components/medication/ExpiredBanner";
import ExpiringBanner from "@/app/components/medication/ExpiringBanner";
import ExportButton from "@/app/components/medication/ExportButton";
import ViewNotesButton from "@/app/components/medication/ViewNotesButton";
import ProgressBar from "@/app/components/ui/ProgressBar";
import RefillBadge from "@/app/components/ui/RefillBadge";
import { Medication } from "@/app/types";
import { formatDate, formatFrequency } from "@/app/utils";
import ResetButton from "@/app/components/medication/ResetButton";

async function getMedications(): Promise<Medication[]> {
  const res = await fetch('http://localhost:3000/api/medications', {
    cache: 'no-store',
  });

  if (!res.ok) {
    return [];
  }

  return res.json();
}

export default async function Home() {
  const medications = await getMedications();

  return (
    <div className="p-8 max-w-7xl mx-auto">
      <LocalStorageSync medications={medications} />

      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800">Medications</h1>
        <div className="flex gap-2">
          <ExportButton medications={medications} />
          <ResetButton />
          <AddMedicationButton />
        </div>
      </div>

      <ExpiredBanner />
      <ExpiringBanner />

      {medications.length === 0 ? (
        <p className="text-gray-600">No medications found.</p>
      ) : (
        <div className="overflow-x-auto shadow-md rounded-lg">
          <table className="table">
            <thead className="bg-gray-100">
              <tr>
                <th className="table-header">ID</th>
                <th className="table-header">Name</th>
                <th className="table-header">Dosage Consumption</th>
                <th className="table-header">Dosage Missed</th>
                <th className="table-header">Date & Frequency</th>
                <th className="table-header">Actions</th>
                <th className="table-header">Edits</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {medications.map((med) => {
                const dosageTaken = med.dosageTotal - med.dosageRemaining;
                const totalActions = dosageTaken + med.dosageMissed;
                return (
                  <tr key={`medication-list-item-${med.id}`} className="table-row">
                    <td className="table-cell">{med.id}</td>
                    <td className="table-cell">
                      <div className="flex gap-2 flex-col max-w-[200px]">
                        <div className="font-semibold truncate">{med.name}</div>
                        <div>
                          <ViewNotesButton name={med.name} note={med.note || ''} dnc={med.dnc} />
                        </div>
                      </div>
                    </td>
                    <td className="table-cell">
                      <div className="min-w-[150px]">
                        <div className="flex justify-between text-xs text-gray-600 mb-1">
                          <span>total: {med.dosageTotal}</span>
                          <span>remaining: {med.dosageRemaining}</span>
                        </div>
                        <ProgressBar
                          total={med.dosageTotal}
                          filled={dosageTaken}
                          bgColor="bg-gray-200"
                          barColor="bg-blue-500"
                          height="h-3"
                        />
                      </div>
                    </td>
                    <td className="table-cell">
                      <div className="min-w-[150px]">
                        <div className="flex justify-between text-xs text-gray-600 mb-1">
                          <span>taken: {dosageTaken}</span>
                          <span>missed: {med.dosageMissed}</span>
                        </div>
                        <ProgressBar
                          total={totalActions}
                          filled={dosageTaken}
                          bgColor="bg-orange-100"
                          barColor="bg-green-500"
                          height="h-3"
                        />
                      </div>
                    </td>
                    <td className="table-cell">
                      <div className="flex flex-col gap-1">
                        <div className="flex text-xs text-gray-600">
                          <span>start: &nbsp;</span>
                          <span>{formatDate(med.startDate).toLocaleDateString()}</span>
                        </div>
                        <div className="flex items-center text-xs text-gray-600">
                          <span>refill: &nbsp;</span>
                          <span>{formatDate(med.refillDate).toLocaleDateString()}</span>
                          <RefillBadge
                            refillDate={formatDate(med.refillDate)}
                            remainingDosage={med.dosageRemaining}
                          />
                        </div>
                        <div className="text-xs text-gray-600">{formatFrequency(med.frequency)}</div>
                      </div>
                    </td>
                    <td className="table-cell">
                      <div className="flex flex-col gap-2">
                        <ActionButtons
                          medication={med}
                        />
                      </div>
                    </td>
                    <td className="table-cell">
                      <div className="flex flex-col gap-2">
                        <EditMedicationButton medication={med} />
                        <DeleteMedicationButton
                          medicationId={med.id}
                          medicationName={med.name}
                        />
                      </div>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}