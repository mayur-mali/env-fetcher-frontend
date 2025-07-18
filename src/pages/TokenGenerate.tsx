import Modal from "@components/Modal";
import { Table } from "@components/Table";
import ToggleButton from "@components/ToggleButton";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import React, { useState } from "react";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import {
  deactivateTokenApi,
  generateProjectToken,
  getAllProjectsApi,
  getAllTokensApi,
} from "../services/api";
import { CustomSelect } from "@components/CustomSelect";
import { toast } from "react-toastify";

const TokenGenerate: React.FC = () => {
  const queryClient = useQueryClient();
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const { data, isLoading } = useQuery({
    queryKey: ["tokens"],
    queryFn: getAllTokensApi,
    staleTime: 1000 * 60 * 1,
  });
  const { data: projectData } = useQuery({
    queryKey: ["projects"],
    queryFn: getAllProjectsApi,
    staleTime: 1000 * 60 * 1,
  });

  const mutation = useMutation({
    mutationFn: generateProjectToken,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tokens"] });
      setIsOpen(false);
    },
    onError: (error) => {
      console.error("Error generating token:", error);
    },
  });
  const tokenDeactivation = useMutation({
    mutationFn: deactivateTokenApi,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tokens"] });
      setIsOpen(false);
    },
    onError: (error) => {
      console.error("Error generating token:", error);
    },
  });
  const [selectedProject, setProjectSelected] = useState({ id: "", name: "" });
  const [selectedEnvType, setEnvTypeSelected] = useState({
    id: "dev",
    name: "dev",
  });
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.target as HTMLFormElement);
    if (!selectedProject.id || !selectedEnvType.id) {
      toast.warn("Please select a project and environment type.");
      return;
    }
    const description = formData.get("description");

    mutation.mutate({
      envType: selectedEnvType.id,
      projectId: selectedProject.id,
      description: description ? (description as string) : "",
    });
  };

  return (
    <div>
      <Modal
        title={""}
        open={isOpen}
        setOpen={setIsOpen}
        type="drawer"
        position="bottom"
        customDimensions={{
          width: "w-full",
          height: "h-[60vh]",
        }}
      >
        <div className="max-w-md mx-auto">
          <h2 className="font-medium text-2xl text-gray-900 mt-2">
            Generate a New Token
          </h2>
          <p className="leading-6 mt-2 text-gray-600">
            Please fill out the form below to generate a new token for your
            project. Ensure that you select the correct project and environment
            type.
          </p>

          <form onSubmit={handleSubmit}>
            <div className="flex flex-col ">
              <label className="font-medium text-gray-900 text-sm mt-4 mb-2 block">
                Project Name
              </label>

              <CustomSelect
                options={
                  projectData?.map((project) => ({
                    id: project._id,
                    name: project.name,
                  })) || []
                }
                value={selectedProject}
                onChange={setProjectSelected}
                filter={true}
                inputClassName="border border-gray-200 bg-white w-full px-3 h-9 rounded-lg outline-none  focus:ring-2 focus:ring-black/5 text-gray-900"
              />

              <label className="font-medium text-gray-900 text-sm mt-4 mb-2 block">
                Environment Type
              </label>

              <CustomSelect
                options={
                  ["dev", "prod", "test"]?.map((env) => ({
                    id: env,
                    name: env,
                  })) || []
                }
                value={selectedEnvType}
                onChange={setEnvTypeSelected}
                //filter={true}
                inputClassName="border border-gray-200 bg-white w-full px-3 h-9 rounded-lg outline-none  focus:ring-2 focus:ring-black/5 text-gray-900"
              />
              <label className="font-medium text-gray-900 text-sm mt-4 mb-2 block">
                Description{" "}
              </label>
              <textarea
                rows={4}
                required
                name="description"
                className="border border-gray-200 bg-white w-full resize-none rounded-lg p-3 pt-2.5 text-gray-900 outline-none focus:ring-2 focus:ring-black/5 focus:ring-offset-0"
              />

              <button
                type="submit"
                disabled={isLoading}
                className="px-4 py-2 mt-4 h-10 disabled:bg-custom-black/50 disabled:cursor-not-allowed bg-custom-black text-white rounded hover:bg-custom-black/90 cursor-pointer transition-colors"
              >
                {isLoading ? (
                  <AiOutlineLoading3Quarters className=" animate-spin mx-auto" />
                ) : (
                  "Generate Token"
                )}
              </button>
            </div>
          </form>
        </div>
      </Modal>
      <Table
        minHeight={" h-auto"}
        searchBox={
          <div className="flex justify-between items-center w-full ">
            <h1 className="text-2xl font-bold">Tokens</h1>
            <button
              onClick={() => setIsOpen(true)}
              className="px-4 py-1.5 cursor-pointer bg-custom-black text-white rounded-full text-sm font-bold shadow"
            >
              Generate Token
            </button>
          </div>
        }
        data={[
          [
            "Token",
            "Project Name",
            "Environment",
            "Created At",
            "Updated At",
            "Active",
          ],
          ...(data
            ? data?.map((token) => [
                token.token,
                token.projectId?.name,
                token.envType,
                token.createdAt
                  ? new Date(token.createdAt).toLocaleString()
                  : "-",
                token.updatedAt
                  ? new Date(token.updatedAt).toLocaleString()
                  : "-",
                <ToggleButton
                  isOn={token.isActive}
                  isDiseble={!token.isActive}
                  handleToggle={() => {
                    const tokenId = token._id;
                    if (!tokenId) return;
                    tokenDeactivation.mutate(tokenId);
                  }}
                  className="ml-2"
                />,
              ])
            : []),
        ]}
      />
    </div>
  );
};

export default TokenGenerate;
