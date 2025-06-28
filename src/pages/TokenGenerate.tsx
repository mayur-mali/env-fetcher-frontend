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

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.target as HTMLFormElement);
    const envType = formData.get("envType");
    const projectId = formData.get("projectId");
    const description = formData.get("description");
    const selectedProject =
      projectData?.find((project) => project._id === projectId)?._id ||
      undefined;

    mutation.mutate({
      envType: envType as string,
      projectId: selectedProject,
      description: description ? (description as string) : "",
    });
  };

  const [toggeleState, setToggleState] = useState<boolean>(false);

  return (
    <div>
      <Modal title={"Generate Token"} open={isOpen} setOpen={setIsOpen}>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="flex flex-col gap-4">
            <label className="text-sm font-semibold">Project Name</label>
            <select
              name="projectId"
              required
              className="border border-gray-300 rounded p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Select Project</option>
              {projectData?.map((project) => (
                <option key={project._id} value={project._id}>
                  {project.name}
                </option>
              ))}
            </select>
            <label className="text-sm font-semibold">Environment Type</label>
            <select
              required
              id="select-env-type"
              name="envType"
              className="border border-gray-300 rounded p-2 focus:outline-none "
            >
              <option value="">Select Environment Type</option>
              <option value="dev">Development</option>
              <option value="prod">Production</option>
              <option value="test">Staging</option>
            </select>
            <label className="text-sm font-semibold">Description </label>
            <input
              type="text"
              name="description"
              placeholder="Enter token description (optional)"
              required
              className="border border-gray-300 rounded p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />

            <button
              type="submit"
              disabled={isLoading}
              className="px-4 py-2 h-10 disabled:bg-custom-black/50 bg-custom-black text-white rounded hover:bg-custom-black/90 cursor-pointer transition-colors"
            >
              {isLoading ? (
                <AiOutlineLoading3Quarters className=" animate-spin mx-auto" />
              ) : (
                "Generate Token"
              )}
            </button>
          </div>
        </form>
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
          ["Token", "Project Name", "Environment", "Active"],
          ...(data
            ? data?.map((token) => [
                token.token,
                token.projectId?.name,
                token.envType,
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
