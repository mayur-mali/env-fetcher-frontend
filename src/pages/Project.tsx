import React, { useEffect, useRef, useState } from "react";

import { createProjectApi, getAllProjectsApi } from "../services/api";
import { ProjectResponse } from "../types/apiType";
import { Table } from "../components/Table";
import { PiUploadDuotone } from "react-icons/pi";
import Modal from "../components/Modal";
import { toast } from "react-toastify";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import BorderProgressBox from "../components/BorderProgressBox";

const UploadEnvironmentFile = ({ projectId }: any) => {
  let [isOpen, setIsOpen] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploading, setUploading] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      if (inputRef.current) {
        inputRef.current.files = files;
      }
      handleNewFile(files[0]);
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      handleNewFile(file);
    }
  };

  const handleNewFile = (file) => {
    setSelectedFile(file);
    simulateUpload(file);
  };

  const deleteSelectedFile = () => {
    setSelectedFile(null);
    setUploading(false);
    setUploadProgress(0);
    if (inputRef.current) {
      inputRef.current.value = "";
    }
  };

  const simulateUpload = (file) => {
    setUploading(true);
    setUploadProgress(0);

    const sizeInKB = file.size / 1024;
    const estimatedDuration = Math.min(sizeInKB * 10, 5000);
    const steps = 100;
    const intervalTime = estimatedDuration / steps;

    let progress = 0;
    const interval = setInterval(() => {
      progress += 1;
      setUploadProgress(progress);
      if (progress >= 100) {
        clearInterval(interval);
        setTimeout(() => {
          setUploading(false);
        }, 1000);
      }
    }, intervalTime);
  };

  return (
    <div>
      <Modal
        hasChanged={true}
        title={"Upload Files"}
        open={isOpen}
        setOpen={setIsOpen}
      >
        <form
          onSubmit={(e) => {
            e.preventDefault();
            const formData = new FormData(e.target as HTMLFormElement);
            const envType = formData.get("envType");
            console.log(envType, selectedFile);
          }}
        >
          <div className="flex flex-col gap-4">
            <label htmlFor="select-env-type" className="text-sm font-semibold">
              Select Environment Type
            </label>
            <select
              required
              id="select-env-type"
              name="envType"
              className="border border-gray-300 rounded p-2 focus:outline-none "
            >
              <option value="">Select Environment Type</option>
              <option value="development">Development</option>
              <option value="production">Production</option>
              <option value="staging">Staging</option>
            </select>
            <p className="text-sm font-semibold">Upload your .env file</p>
            <div
              className={`flex flex-col items-center justify-center w-full ${
                isDragging ? "bg-blue-100" : ""
              }`}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
            >
              <div className="w-20 h-20 bg-amber-200 rounded-full"></div>

              {!uploading && (
                <div className="text-sm mb-2 w-full rounded-full text-blue-600 font-medium">
                  Uploading {uploadProgress}%
                  <div className="w-full mt-1 bg-gray-200 rounded-full h-2.5">
                    <div
                      className="bg-blue-600 h-2.5 rounded-full"
                      style={{ width: `${uploadProgress}%` }}
                    ></div>
                  </div>
                </div>
              )}
              <label
                htmlFor="dropzone-file"
                className={`flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-lg cursor-pointer  relative
    ${
      uploading
        ? "border-red-500 bg-red-50"
        : selectedFile
        ? "border-green-500 bg-green-50"
        : "border-gray-300 bg-gray-50 hover:bg-gray-100"
    }`}
              >
                {!selectedFile ? (
                  <div className="flex flex-col items-center justify-center pt-5 pb-6">
                    <svg
                      className="w-8 h-8 mb-4 text-gray-500 dark:text-gray-400"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 20 16"
                    >
                      <path
                        stroke="currentColor"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 
              5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 
              0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2"
                      />
                    </svg>
                    <p className="mb-2 text-sm text-gray-500 dark:text-gray-400">
                      <span className="font-semibold">Click to upload</span> or
                      drag and drop
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      .env file
                    </p>
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center pt-5 pb-6">
                    {selectedFile && !uploading && (
                      <div className="mt-4 w-full px-4 flex flex-col items-center text-center">
                        <p className="text-sm text-gray-700">
                          Selected file:{" "}
                          <span className="font-medium">
                            {selectedFile?.name}
                          </span>
                        </p>
                        <button
                          onClick={deleteSelectedFile}
                          className="mt-2 px-4 py-1 text-sm bg-red-500 text-white rounded hover:bg-red-600"
                        >
                          Delete File
                        </button>
                      </div>
                    )}
                  </div>
                )}

                <input
                  ref={inputRef}
                  id="dropzone-file"
                  type="file"
                  className="hidden"
                  onChange={handleFileChange}
                  accept=".env"
                />
              </label>
            </div>

            <button
              type="submit"
              disabled={!selectedFile || uploading}
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
