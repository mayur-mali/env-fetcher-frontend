import React, { useEffect, useState } from "react";

import { createProjectApi, getAllProjectsApi } from "../services/api";
import { ProjectResponse } from "../types/apiType";
import { Table } from "../components/Table";
import { PiUploadDuotone } from "react-icons/pi";
import Modal from "../components/Modal";
import { toast } from "react-toastify";
import { AiOutlineLoading3Quarters } from "react-icons/ai";

const UploadEnvironmentFile = ({ projectId }: any) => {
  let [isOpen, setIsOpen] = useState(false);
  return (
    <div>
      <Modal title={"Upload Files"} open={isOpen} setOpen={setIsOpen}>
        <form
          onSubmit={(e) => {
            e.preventDefault();
          }}
        >
          <div className="flex flex-col gap-4">
            <label htmlFor="select-env-type" className="text-sm font-semibold">
              Select Environment Type
            </label>
            <select
              required
              id="select-env-type"
              className="border border-gray-300 rounded p-2 focus:outline-none "
            >
              <option value="">Select Environment Type</option>
              <option value="development">Development</option>
              <option value="production">Production</option>
              <option value="staging">Staging</option>
            </select>
            <label className="text-sm font-semibold">Project Name</label>
            <input
              type="file"
              placeholder="Enter project name"
              required
              accept=".env"
              className="block w-full text-sm text-white
                  file:mr-4 file:py-2 file:px-4
                  file:rounded-full file:border-0
                  file:text-sm file:font-semibold
                  file:bg-custom-black/50 file:text-grey-700
                  hover:file:bg-custom-black/100 file:disabled:bg-slate-200 file:disabled:text-gray-400 file:disabled:cursor-not-allowed file:cursor-pointer"
            />
            <button
              type="submit"
              className="px-4 py-2 h-10 disabled:bg-custom-black/50 bg-custom-black text-white rounded hover:bg-custom-black/90 cursor-pointer transition-colors"
            >
              Upload File
            </button>
          </div>
        </form>
      </Modal>

      <PiUploadDuotone
        onClick={() => setIsOpen(true)}
        className="text-2xl cursor-pointer"
      />
    </div>
  );
};

export default function Project() {
  const [projects, setProjects] = React.useState<ProjectResponse[] | null>([]);
  const [loading, setLoading] = React.useState<boolean>(true);
  const [createProjectLoading, setCreateProjectLoading] =
    useState<boolean>(false);
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [projectName, setProjectName] = useState<string>("");
  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const data = await getAllProjectsApi();
        setProjects(Array.isArray(data) ? data : [data]);
      } catch (error) {
        console.error("Failed to fetch projects:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchProjects();
  }, []);

  const createNewProject = async (e) => {
    e.preventDefault();
    if (!projectName) {
      toast.error("Project name is required");
      return;
    }
    try {
      setCreateProjectLoading(true);
      const res = await createProjectApi(projectName);
      if (res) {
        toast.success("Project created successfully");
        setIsOpen(false);
        setProjectName("");
        const updatedProjects = await getAllProjectsApi();
        setProjects(
          Array.isArray(updatedProjects) ? updatedProjects : [updatedProjects]
        );
      } else {
        toast.error("Failed to create project");
      }
    } catch (error) {
    } finally {
      setCreateProjectLoading(false);
    }
  };

  return (
    <div className="p-4">
      <Modal title={"Create Project"} open={isOpen} setOpen={setIsOpen}>
        <form onSubmit={createNewProject}>
          <div className="flex flex-col gap-4">
            <label className="text-sm font-semibold">Project Name</label>
            <input
              type="text"
              placeholder="Enter project name"
              required
              value={projectName}
              onChange={(e) => setProjectName(e.target.value)}
              className="border border-gray-300 rounded p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              type="submit"
              disabled={createProjectLoading}
              className="px-4 py-2 h-10 disabled:bg-custom-black/50 bg-custom-black text-white rounded hover:bg-custom-black/90 cursor-pointer transition-colors"
            >
              {createProjectLoading ? (
                <AiOutlineLoading3Quarters className=" animate-spin mx-auto" />
              ) : (
                "Create Project"
              )}
            </button>
          </div>
        </form>
      </Modal>
      <Table
        pagination={true}
        searchBox={
          <div className="flex justify-between items-center w-full ">
            <h1 className="text-2xl font-bold">Project List</h1>
            <button
              onClick={() => setIsOpen(true)}
              className="px-4 py-1.5 cursor-pointer bg-custom-black text-white rounded-full text-sm font-bold shadow"
            >
              Create Project
            </button>
          </div>
        }
        loading={loading}
        data={[
          ["Project Name", "Project Id", "Created At", "Action"],
          ...(projects
            ? projects?.map((project) => [
                project.name,
                project._id,
                "-",
                <UploadEnvironmentFile projectId={project._id} />,
              ])
            : []),
        ]}
      />
    </div>
  );
}
