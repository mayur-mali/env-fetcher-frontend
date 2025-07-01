import React, { useEffect, useRef, useState } from "react";

import {
  createProjectApi,
  generateProjectToken,
  getAllProjectsApi,
  updateProjectApi,
  uploadEnvironmentFileApi,
} from "../services/api";
import { ProjectResponse, Token } from "../types/apiType";
import { Table } from "../components/Table";
import { PiUploadDuotone } from "react-icons/pi";
import Modal from "../components/Modal";
import { toast } from "react-toastify";
import {
  AiFillInteraction,
  AiOutlineLoading3Quarters,
  AiTwotoneInteraction,
} from "react-icons/ai";
import { HiOutlineDotsVertical } from "react-icons/hi";
import BorderProgressBox from "../components/BorderProgressBox";
import { TbFileTypeTxt } from "react-icons/tb";
import { MdDelete, MdEdit, MdModeEdit, MdOutlineDelete } from "react-icons/md";
import { CgCopy } from "react-icons/cg";
import { FcFolder } from "react-icons/fc";
import TagInput from "../components/TagInput";
import { DrawerWrapper } from "../components/DrawerWrapper";
import EnvVersionsCompare from "../components/project-ui/EnvVersionsCompare";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import ToggleButton from "@components/ToggleButton";
import { FaCheck } from "react-icons/fa";

const randomColor = (randomNumber) => {
  const colorClasses = [
    "bg-red-100 text-red-800",
    "bg-green-100 text-green-800",
    "bg-blue-100 text-blue-800",
    "bg-yellow-100 text-yellow-800",
    "bg-pink-100 text-pink-800",
    "bg-purple-100 text-purple-800",
    "bg-indigo-100 text-indigo-800",
    "bg-teal-100 text-teal-800",
    "bg-orange-100 text-orange-800",
    "bg-emerald-100 text-emerald-800",
    "bg-cyan-100 text-cyan-800",
    "bg-lime-100 text-lime-800",
    "bg-rose-100 text-rose-800",
    "bg-sky-100 text-sky-800",
    "bg-violet-100 text-violet-800",
  ];

  return colorClasses[randomNumber];
};

export const ProjectDetailsCard = ({
  heading,
  subheading,
  isUpdate,
  updateProject,
  projectDetails,
}: {
  heading: string;
  subheading?: any;
  isUpdate?: boolean;
  projectDetails?: { type: string; id: string };
  updateProject?: {
    mutate: (data: any) => void;
    [key: string]: any;
    id: string;
  };
}) => {
  const [update, setUpdate] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const [inputValue, setInputValue] = useState<any>(subheading);
  useEffect(() => {
    if (!update) {
      setInputValue(subheading);
    }
  }, [subheading, update]);

  const handleOutsideClick = (event: any) => {
    if (inputRef.current && !inputRef.current.contains(event.target)) {
      setUpdate(false);
      setInputValue(subheading);
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleOutsideClick);
    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
    };
  }, []);

  return (
    <div>
      <div className="flex group justify-between items-center pr-4">
        <span className="text-sm text-gray-600">{heading}</span>
        {isUpdate && !update && (
          <MdEdit
            onClick={() => {
              setUpdate(!update);
            }}
            className="hidden cursor-pointer group-hover:block text-gray-400"
          />
        )}
      </div>
      {!isUpdate ? (
        <div className="text-gray-800">{subheading}</div>
      ) : (
        <div
          ref={inputRef}
          className={
            "flex  justify-between items-center mr-4 " +
            (update ? "border-b" : " border-none")
          }
        >
          <input
            type="text"
            disabled={!update}
            ref={inputRef}
            onChange={(e) => {
              setInputValue(e.target.value);
            }}
            className={
              "text-gray-800 shrink-0" + (update ? "  focus:outline-none" : " ")
            }
            name={heading}
            defaultValue={inputValue}
          />
          <FaCheck
            onClick={() => {
              updateProject &&
                updateProject.mutate({
                  projectId: projectDetails?.id || "",
                  projectDetails: {
                    [(projectDetails?.type || "") as string]: inputValue,
                  },
                });
            }}
            className={`${
              update ? "text-green-500 z-50 cursor-pointer" : "hidden"
            }`}
          />
        </div>
      )}
    </div>
  );
};

const UpdateDrawer = ({ project, updateProject }) => {
  let [isOpen, setIsOpen] = useState(false);
  return (
    <>
      <HiOutlineDotsVertical
        onClick={() => setIsOpen(true)}
        className="cursor-pointer text-xl"
      />
      <Modal
        customDimensions={{
          width: "w-[500px]",
          height: "h-full",
        }}
        type="drawer"
        position="right"
        open={isOpen}
        setOpen={setIsOpen}
      >
        <div className="mt-4 ">
          <p className="text-md border-b border-gray-300 pb-2">
            PROJECT OVERVIEW
          </p>

          <div className="grid grid-cols-2 gap-4 mt-2">
            <ProjectDetailsCard
              heading={"Project Name"}
              subheading={project.name}
              projectDetails={{
                type: "name",
                id: project._id,
              }}
              isUpdate
              updateProject={updateProject}
            />
            <ProjectDetailsCard
              heading={"Last Updated"}
              subheading={new Date(project.updatedAt).toLocaleString()}
            />

            <ProjectDetailsCard
              heading={"Description"}
              subheading={project.description || "No description provided"}
            />
            <ProjectDetailsCard
              heading={"Project ID"}
              subheading={project._id}
            />
            <ProjectDetailsCard
              heading={"Created"}
              subheading={new Date(project.createdAt).toLocaleString()}
            />
            <ProjectDetailsCard
              heading={"Status"}
              subheading={
                <div className="flex items-center space-x-2">
                  <span className="relative inline-flex h-2 w-2">
                    <span
                      className={`animate-ping absolute inline-flex h-full w-full rounded-full ${
                        project.status === "active"
                          ? "bg-green-400"
                          : "bg-gray-400"
                      } opacity-75`}
                    ></span>
                    <span
                      className={`relative inline-flex rounded-full h-2 w-2 ${
                        project.status === "active"
                          ? "bg-green-500"
                          : "bg-gray-500"
                      }`}
                    ></span>
                  </span>
                  <span className="text-sm font-medium text-gray-700">
                    {project.status
                      ? project.status.charAt(0).toUpperCase() +
                        project.status.slice(1)
                      : ""}
                  </span>
                </div>
              }
            />
          </div>
        </div>
        <div className="mt-4 ">
          <p className="text-md border-b border-gray-300 pb-2">
            TECHNICAL STACK
          </p>
          <div>
            {project?.tags && project.tags.length > 0 ? (
              <div className="flex flex-wrap gap-2 mt-2">
                {project.tags.map((tag, index) => (
                  <span
                    key={index}
                    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${randomColor(
                      index % 14
                    )}`}
                  >
                    {tag}
                  </span>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 mt-2">No tags available</p>
            )}
          </div>
        </div>
        <div className="overflow-y-auto mt-4 max-h-[30rem] ">
          {project?.envFiles && project?.envFiles.length > 0 ? (
            <EnvVersionsCompare environmentFiles={project?.envFiles} />
          ) : null}
          <h3 className="text-sm font-medium text-gray-900 my-3">Action</h3>
          <div className="flex justify-between items-center gap-x-4">
            <UploadEnvironmentFile projectId={project._id} />
            <GenerateToken projectId={project._id} />
          </div>
        </div>
      </Modal>
    </>
  );
};

const UploadEnvironmentFile = ({ projectId }: any) => {
  const queryClient = useQueryClient();
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

  const mutation = useMutation({
    mutationFn: uploadEnvironmentFileApi,
    onSuccess: (data) => {
      toast.success(data.message);
      setSelectedFile(null);
      setUploadProgress(0);
      setUploading(false);
      setIsOpen(false);
      if (inputRef.current) {
        inputRef.current.value = "";
      }

      queryClient.invalidateQueries({ queryKey: ["getAllProjects"] });
    },
    onError: () => {
      toast.error("Failed to create project");
    },
  });

  return (
    <div className="w-full">
      <Modal
        preventOutsideClose={true}
        title={"Upload Files"}
        open={isOpen}
        setOpen={setIsOpen}
      >
        <form
          onSubmit={async (e) => {
            e.preventDefault();
            const formData = new FormData(e.target as HTMLFormElement);
            const envType = formData.get("envType");
            mutation.mutate({
              projectId,
              envType: envType as string,
              envFile: selectedFile as Blob,
            });
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

      <button
        onClick={() => setIsOpen(true)}
        className="flex border h-10 border-gray-300 cursor-pointer text-sm w-full items-center justify-between p-2 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors duration-150"
      >
        Upload Environment File
        <PiUploadDuotone className="text-2xl cursor-pointer" />
      </button>
    </div>
  );
};
const GenerateToken = ({ projectId }: any) => {
  const queryClient = useQueryClient();
  let [isOpen, setIsOpen] = useState(false);
  const [token, setToken] = useState<string>("");
  useEffect(() => {
    if (isOpen === false) {
      setToken("");
    }
  }, [isOpen]);
  const mutation = useMutation({
    mutationFn: generateProjectToken,
    onSuccess: (data) => {
      toast.success("Token generated successfully");
      setToken(data.token || "");

      queryClient.invalidateQueries({ queryKey: ["getAllProjects"] });
    },
    onError: (error) => {
      toast.error(error.message || "Failed to generate token");
    },
  });

  return (
    <div className="w-full">
      <Modal
        preventOutsideClose={true}
        title={"Generate Token"}
        open={isOpen}
        setOpen={setIsOpen}
      >
        <form
          onSubmit={async (e) => {
            e.preventDefault();
            const formData = new FormData(e.target as HTMLFormElement);
            const envType = formData.get("envType");
            const description = formData.get("description");

            mutation.mutate({
              projectId: projectId,
              envType: envType?.toString(),
              description: description?.toString(),
            });
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
            <input
              type="text"
              name="description"
              placeholder="Enter token description (optional)"
              className="border border-gray-300 rounded p-2 focus:outline-none "
            />
            {!mutation.isPending && token && (
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
            )}

            <button
              type="submit"
              disabled={mutation.isPending}
              className="px-4 py-2 h-10 disabled:bg-custom-black/50 bg-custom-black text-white rounded hover:bg-custom-black/90 cursor-pointer transition-colors"
            >
              {mutation.isPending ? (
                <AiOutlineLoading3Quarters className=" animate-spin mx-auto" />
              ) : (
                "Generate Token"
              )}
            </button>
          </div>
        </form>
      </Modal>

      <button
        onClick={() => setIsOpen(true)}
        className="flex cursor-pointer border h-10 border-gray-300 text-sm w-full items-center justify-between p-2 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors duration-150"
      >
        Generate Token
        <AiFillInteraction className="text-2xl cursor-pointer" />
      </button>
    </div>
  );
};

export default function Project() {
  const queryClient = useQueryClient();
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

  const { data, isLoading } = useQuery<ProjectResponse[] | null>({
    queryKey: ["getAllProjects"],
    queryFn: getAllProjectsApi,
    staleTime: 0,
  });
  const mutation = useMutation({
    mutationFn: createProjectApi,
    onSuccess: () => {
      toast.success("Project created successfully");
      setIsOpen(false);
      setProjectDetails({ name: "", description: "", tags: [] });

      queryClient.invalidateQueries({ queryKey: ["getAllProjects"] });
    },
    onError: () => {
      toast.error("Failed to create project");
    },
  });

  const updateProject = useMutation({
    mutationFn: ({
      projectId,
      projectDetails,
    }: {
      projectId: string;
      projectDetails: {
        name?: string;
        description?: string;
        tags?: never[];
        status?: string;
        isDeleted?: boolean;
      };
    }) => {
      return updateProjectApi({
        projectId,
        name: projectDetails.name,
        description: projectDetails.description,
        tags: projectDetails.tags,
        status: projectDetails.status,
        isDeleted: projectDetails.isDeleted,
      });
    },
    onSuccess: () => {
      toast.success("Project updated successfully");
      queryClient.invalidateQueries({ queryKey: ["getAllProjects"] });
    },
    onError: () => {
      toast.error("Failed to update project");
    },
  });

  const createNewProject = async (e) => {
    e.preventDefault();

    if (!projectDetails.name) {
      toast.error("Project name is required");
      return;
    }
    mutation.mutate({
      name: projectDetails.name,
      description: projectDetails.description,
      tags: projectDetails.tags,
    });
  };

  return (
    <div className="p-4">
      <Modal
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
            New Project
          </h2>
          <p className="leading-6 mt-2 text-gray-600">
            Get started by filling in the information below to create your new
            project.
          </p>
          <form onSubmit={createNewProject}>
            <div className="flex flex-col">
              <label className="font-medium text-gray-900 text-sm mt-4 mb-2 block">
                Project Name
              </label>
              <input
                type="text"
                required
                value={projectDetails.name}
                onChange={(e) =>
                  setProjectDetails({ ...projectDetails, name: e.target.value })
                }
                className="border border-gray-200 bg-white w-full px-3 h-9 rounded-lg outline-none focus:ring-2 focus:ring-black/5 text-gray-900"
              />
              <label className="font-medium text-gray-900 text-sm mt-4 mb-2 block">
                Tags
              </label>
              <TagInput
                tags={projectDetails}
                placeholder=""
                setTags={setProjectDetails}
              />

              <label className="font-medium text-gray-900 text-sm mt-4 mb-2 block">
                Description
              </label>
              <textarea
                rows={4}
                required
                value={projectDetails.description}
                onChange={(e) =>
                  setProjectDetails({
                    ...projectDetails,
                    description: e.target.value,
                  })
                }
                className="border border-gray-200 bg-white w-full resize-none rounded-lg p-3 pt-2.5 text-gray-900 outline-none focus:ring-2 focus:ring-black/5 focus:ring-offset-0"
              />

              <button
                type="submit"
                disabled={
                  !projectDetails.name || projectDetails.tags.length === 0
                }
                className="px-4 py-2 mt-8 h-10 disabled:bg-custom-black/50 disabled:cursor-not-allowed bg-custom-black text-white rounded hover:bg-custom-black/90 cursor-pointer transition-colors"
              >
                {mutation.isPending ? (
                  <AiOutlineLoading3Quarters className=" animate-spin mx-auto" />
                ) : (
                  "Create Project"
                )}
              </button>
            </div>
          </form>
        </div>
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
        loading={isLoading}
        data={[
          ["Project Name", "Project Id", "Created At", "Status", "Action"],
          ...(data
            ? data?.map((project, index) => [
                <div className="flex flex-col gap-y-4">
                  <div className="flex gap-x-2 items-center">
                    <FcFolder className="text-xl shrink-0" />
                    <p className="font-medium text-md ">{project.name} </p>
                  </div>
                </div>,

                <span className="text-md">{project._id}</span>,
                <span className="font-medium text-md">
                  {" "}
                  {project.createdAt
                    ? new Date(project.createdAt).toLocaleString()
                    : "-"}
                </span>,

                <div className="flex items-center space-x-2">
                  <ToggleButton
                    isOn={project.status === "active"}
                    handleToggle={() => {
                      updateProject.mutate({
                        projectId: project._id,
                        projectDetails: {
                          status:
                            project.status === "active" ? "inactive" : "active",
                        },
                      });
                    }}
                    className="ml-2"
                  />
                  <span className="relative inline-flex h-2 w-2">
                    <span
                      className={`animate-ping absolute inline-flex h-full w-full rounded-full ${
                        project.status === "active"
                          ? "bg-green-400"
                          : "bg-gray-400"
                      } opacity-75`}
                    ></span>
                    <span
                      className={`relative inline-flex rounded-full h-2 w-2 ${
                        project.status === "active"
                          ? "bg-green-500"
                          : "bg-gray-500"
                      }`}
                    ></span>
                  </span>
                  <span className="text-sm font-medium text-gray-700">
                    {project.status
                      ? project.status.charAt(0).toUpperCase() +
                        project.status.slice(1)
                      : ""}
                  </span>
                </div>,
                <UpdateDrawer
                  project={project}
                  updateProject={updateProject}
                />,
              ])
            : []),
        ]}
      />
    </div>
  );
}
