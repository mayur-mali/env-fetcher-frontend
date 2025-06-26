import React from "react";
import { compareEvnVersionsApi } from "../../services/api";
import { TbCircleDashed } from "react-icons/tb";

interface Change {
  left: string;
  right: string;
  change: "added" | "removed";
}

interface CompareChangesProps {
  changes: Change[];
}

const CompareChanges: React.FC<CompareChangesProps> = ({ changes }) => {
  return (
    <div className="flex flex-col  w-full border border-gray-300 overflow-hidden rounded-md mt-4">
      {changes.map((change, index) => (
        <div
          key={index}
          className="flex flex-col md:flex-row w-full   overflow-hidden"
        >
          <div
            className={`w-full md:w-1/2 p-2 border-b  text-sm break-all overflow-x-auto ${
              change.change === "removed" ? "bg-red-100" : ""
            }`}
          >
            {change.left || <span className="text-gray-400">—</span>}
          </div>
          <div
            className={`w-full md:w-1/2 border-b  p-2 text-sm break-all overflow-x-auto ${
              change.change === "added" ? "bg-green-100" : ""
            }`}
          >
            {change.right || <span className="text-gray-400">—</span>}
          </div>
        </div>
      ))}
    </div>
  );
};

export default function EnvVersionsCompare({
  environmentFiles,
}: {
  environmentFiles: any[];
}) {
  const [selectedEnvFile, setSelectedEnvFile] = React.useState<any>(null);
  const [open, setOpen] = React.useState(false);
  const [envCompareResult, setEnvCompareResult] = React.useState<Change[]>([]);
  const [loadingEvnCompare, setLoadingEvnCompare] = React.useState(false);
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedEnvFile) return;
    const formData = new FormData(e.target as HTMLFormElement);
    const version1 = formData.get("version1") as string;
    const version2 = formData.get("version2") as string;
    if (!version1 || !version2) {
      alert("Please select both versions to compare.");
      return;
    }
    setLoadingEvnCompare(true);
    await compareEvnVersionsApi({
      projectId: selectedEnvFile.projectId,
      envType: selectedEnvFile.envType,
      version1,
      version2,
    })
      .then((res) => {
        setEnvCompareResult(res.result);
        setLoadingEvnCompare(false);
      })
      .catch((err) => {
        console.error("Error comparing versions:", err);
        setLoadingEvnCompare(false);
      })
      .finally(() => {
        setLoadingEvnCompare(false);
      });
  };
  return (
    <div className="overflow-auto flex flex-col">
      <div className="mt-6">
        <h3 className="text-sm font-medium text-gray-900 mb-3">
          Environment Files
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {environmentFiles.map((envFile: any) => (
            <button
              key={envFile?._id}
              onClick={() => {
                setOpen(true);
                setSelectedEnvFile(envFile);
              }}
              className="flex items-center justify-between p-2 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors duration-150"
            >
              <div className="flex items-center space-x-3">
                <svg
                  className="h-5 w-5 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                  />
                </svg>
                <div className="text-left">
                  <div className="text-sm font-medium text-gray-900">
                    {envFile?.envType.toUpperCase()}
                  </div>
                  <div className="text-xs text-gray-500">
                    {envFile?.versions.length} versions
                  </div>
                </div>
              </div>
              <svg
                className="h-5 w-5 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </button>
          )) || []}
        </div>
        {open && (
          <div className="bg-white border border-gray-200 rounded-md p-4 mt-4">
            <div className=" text-gray-500 mb-2">
              Select an environment file to compare versions. of{" "}
              {selectedEnvFile?.envType.toUpperCase()}
            </div>
            <form className="w-full" onSubmit={handleSubmit}>
              <div className="flex items-center w-full space-x-2 mb-4">
                <select
                  name="version1"
                  required
                  className="w-full focus:outline-none bg-white border border-gray-300 rounded-md p-2 text-sm text-gray-900"
                >
                  <option value="">Select Version</option>
                  {selectedEnvFile?.versions.map(
                    (version: any, index: number) => (
                      <option key={version._id} value={index}>
                        {"Version No:" + (index + 1)}
                      </option>
                    )
                  )}
                </select>

                <select
                  name="version2"
                  required
                  className="w-full focus:outline-none bg-white border border-gray-300 rounded-md p-2 text-sm text-gray-900"
                >
                  <option value="">Select Version</option>
                  {selectedEnvFile?.versions.map(
                    (version: any, index: number) => (
                      <option key={version._id} value={index}>
                        {"Version No:" + (index + 1)}
                      </option>
                    )
                  )}
                </select>
              </div>
              <button
                type="submit"
                disabled={loadingEvnCompare}
                className="px-4 py-2 h-10 disabled:cursor-not-allowed cursor-pointer w-full bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors duration-150"
              >
                {loadingEvnCompare ? (
                  <TbCircleDashed className=" mx-auto animate-spin duration-100 text-xl" />
                ) : (
                  "Compare Versions"
                )}
              </button>
            </form>
            {envCompareResult.length > 0 && (
              <div className="overflow-y-scroll max-h-96 mt-4">
                <CompareChanges changes={envCompareResult} />
              </div>
            )}
          </div>
        )}
      </div>
      {open && (
        <button
          onClick={() => {
            setOpen(false);
            setSelectedEnvFile(null);
            setEnvCompareResult([]);
          }}
          className="ml-auto px-4 mt-4 py-1.5 text-xs bg-blue-600 hover:bg-blue-500 rounded-md text-white"
        >
          Close
        </button>
      )}
    </div>
  );
}
