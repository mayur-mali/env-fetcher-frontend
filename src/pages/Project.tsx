import React, { useEffect, useRef, useState } from "react";

import {
  createProjectApi,
  generateProjectToken,
  getAllProjectsApi,
  uploadEnvironmentFileApi,
} from "../services/api";
import { GenerateProjectToken, ProjectResponse } from "../types/apiType";
import { Table } from "../components/Table";
import { PiUploadDuotone } from "react-icons/pi";
import Modal from "../components/Modal";
import { toast } from "react-toastify";
import {
  AiFillInteraction,
  AiOutlineLoading3Quarters,
  AiTwotoneInteraction,
} from "react-icons/ai";
import BorderProgressBox from "../components/BorderProgressBox";
import { TbFileTypeTxt } from "react-icons/tb";
import { MdOutlineDelete } from "react-icons/md";
import { CgCopy } from "react-icons/cg";
import { FcFolder } from "react-icons/fc";
import TagInput from "../components/TagInput";

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
          onSubmit={async (e) => {
            e.preventDefault();
            const formData = new FormData(e.target as HTMLFormElement);
            const envType = formData.get("envType");

            const res = await uploadEnvironmentFileApi({
              projectId,
              envType: envType as string,
              envFile: selectedFile as Blob,
            });

            console.log(res);
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
              <option value="dev">Development</option>
              <option value="prod">Production</option>
              <option value="test">Staging</option>
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
              <label
                htmlFor="dropzone-file"
                className={`flex flex-col border-gray-300 bg-gray-50 hover:bg-gray-100 items-center justify-center w-full h-32 border-2 border-dashed rounded-lg relative
   ${selectedFile ? " cursor-not-allowed" : " cursor-pointer"} `}
              >
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

                <input
                  ref={inputRef}
                  id="dropzone-file"
                  type="file"
                  className="hidden"
                  onChange={handleFileChange}
                  accept=".env"
                  disabled={selectedFile ? true : false}
                />
              </label>
            </div>
            {selectedFile && (
              <div className=" relative border border-gray-300 rounded-md h-10">
                <div
                  className={
                    " flex justify-center absolute items-center h-full  rounded-md px-4 py-2 " +
                    (uploadProgress < 100
                      ? " bg-gradient-to-r from-red-50 to-red-600"
                      : " bg-gradient-to-r from-lime-50 to-lime-300")
                  }
                  style={{ width: uploadProgress + "%" }}
                >
                  {selectedFile && !uploading ? (
                    <div className="flex justify-between w-full items-center">
                      <p className="font-bold text-sm">
                        Selected file: {selectedFile?.name}
                      </p>
                      <MdOutlineDelete
                        onClick={deleteSelectedFile}
                        className="text-xl cursor-pointer"
                      />
                    </div>
                  ) : (
                    <span
                      className={
                        "text-xs font-semibold " +
                        (uploadProgress < 100
                          ? "text-red-500"
                          : "text-green-600")
                      }
                    >
                      {uploadProgress}%
                    </span>
                  )}
                </div>
              </div>
            )}
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
const GenerateToken = ({ projectId }: any) => {
  let [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [token, setToken] = useState<string>("");
  return (
    <div>
      <Modal
        hasChanged={true}
        title={"Upload Files"}
        open={isOpen}
        setOpen={setIsOpen}
      >
        <form
          onSubmit={async (e) => {
            e.preventDefault();
            const formData = new FormData(e.target as HTMLFormElement);
            const envType = formData.get("envType");
            try {
              setLoading(true);
              const res = await generateProjectToken({
                projectId: projectId,
                envType: envType?.toString(),
              });
              setToken(res?.token?.toString() ?? "");
            } catch (error) {
              // toast.error(error.message);
            } finally {
              setLoading(false);
            }
          }}
        >
          <div className="flex flex-col gap-4">
            <label htmlFor="select-env-type" className="text-sm font-semibold">
              Generate Token
            </label>
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

            <div className="rounded-md h-20 flex justify-between items-center p-4 bg-gray-50 border border-gray-200">
              <p className=" max-w-2xl truncate">{token}</p>
              <CgCopy
                onClick={() => {
                  navigator.clipboard
                    .writeText(token)
                    .then(() => {
                      toast.success("Copied to clipboard");
                    })
                    .catch((err) => {
                      toast.error("Error while copying");
                    });
                }}
                className="text-2xl cursor-pointer"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 h-10 disabled:bg-custom-black/50 bg-custom-black text-white rounded hover:bg-custom-black/90 cursor-pointer transition-colors"
            >
              Generate Token
            </button>
          </div>
        </form>
      </Modal>

      <AiTwotoneInteraction
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
  const [tags, setTags] = useState([]);
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [projectDetails, setProjectDetails] = useState<{
    name: string;
    description: string;
    tags: never[];
  }>({
    name: "",
    description: "",
    tags: [],
  });

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

    if (!projectDetails.name) {
      toast.error("Project name is required");
      return;
    }
    try {
      setCreateProjectLoading(true);
      const res = await createProjectApi({
        name: projectDetails.name,
        description: projectDetails.description,
        tags: projectDetails.tags,
      });
      if (res) {
        toast.success("Project created successfully");
        setIsOpen(false);
        setProjectDetails({
          name: "",
          description: "",
          tags: [],
        });
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
              value={projectDetails.name}
              onChange={(e) =>
                setProjectDetails({ ...projectDetails, name: e.target.value })
              }
              className="border border-gray-300 rounded p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <label className="text-sm font-semibold">Description</label>
            <input
              type="text"
              placeholder="Enter project description"
              name="description"
              required
              value={projectDetails.description}
              onChange={(e) =>
                setProjectDetails({
                  ...projectDetails,
                  description: e.target.value,
                })
              }
              className="border border-gray-300 rounded p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <label className="text-sm font-semibold">Tags</label>
            <TagInput tags={projectDetails.tags} setTags={setProjectDetails} />
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
          [
            "Project Name",
            "Project Id",
            "Created At",
            "Generate Token",
            "Upload Env",
          ],
          ...(projects
            ? projects?.map((project) => [
                <div className="flex flex-col gap-y-4">
                  <div className="flex gap-x-2 items-center">
                    <FcFolder className="text-xl shrink-0" />
                    <p className="font-bold text-lg">{project.name}</p>
                  </div>

                  {project?.envFiles && project?.envFiles.length > 0 && (
                    <span className="flex flex-wrap gap-2">
                      {project.envFiles.map((envFile, idx) => (
                        <span
                          className={
                            "px-3 font-bold text-[10px] py-1 w-fit rounded-[20px] " +
                            (envFile.envType === "dev"
                              ? "bg-green-200 text-green-800"
                              : envFile.envType === "test"
                              ? "bg-yellow-200 text-yellow-800"
                              : "bg-red-200 text-red-800")
                          }
                          key={idx}
                        >
                          {envFile.envType === "dev"
                            ? "🟢"
                            : envFile.envType === "test"
                            ? "🟡"
                            : "🔴"}{" "}
                          {envFile.envType}
                        </span>
                      ))}
                    </span>
                  )}
                </div>,
                project._id,
                project.createdAt
                  ? new Date(project.createdAt).toLocaleString()
                  : "-",
                <GenerateToken projectId={project._id} />,
                <UploadEnvironmentFile projectId={project._id} />,
              ])
            : []),
        ]}
      />
    </div>
  );
}
