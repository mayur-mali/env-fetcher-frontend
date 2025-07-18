import React, { use, useEffect, useState } from "react";
import { Table } from "../components/Table";
import {
  assignDevelopersToGroupApi,
  createGroupApi,
  deleteGroupApi,
  getAllDevelopersApi,
  getAllGroupsApi,
  getAllProjectsApi,
  updateAccessOfGroup,
} from "../services/api";
import { toast } from "react-toastify";
import Modal from "../components/Modal";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import { MdDelete } from "react-icons/md";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { HiOutlineDotsVertical } from "react-icons/hi";
import { ProjectDetailsCard } from "./Project";
import { IoIosPeople } from "react-icons/io";
import { GrUpdate } from "react-icons/gr";
import MultiSelectDropdown from "@components/MultiSelectDropdown";

import { ProjectResponse } from "src/types/apiType";
import ProjectList, { Project } from "@components/ProjectList";
import ConfirmationDialog from "@components/ConfirmationDialog";
import { BsExclamationTriangle } from "react-icons/bs";
import { RiDeleteBin6Line } from "react-icons/ri";

const AssingDevelopersModal = ({ group }) => {
  const [isOpen, setIsOpen] = useState(false);
  const { data, isLoading } = useQuery({
    queryKey: ["developers"],
    queryFn: getAllDevelopersApi,
  });
  const queryClient = useQueryClient();

  const assignToGroup = useMutation({
    mutationFn: assignDevelopersToGroupApi,
    onSuccess: (data) => {
      toast.success("Developers assigned successfully");
      queryClient.invalidateQueries({ queryKey: ["groups"] });
      setIsOpen(false);
    },
    onError: (error) => {
      toast.error("Failed to assign developers");
      console.error("Error assigning developers:", error);
    },
  });
  const [selectDeveloperIds, setSelectDeveloperIds] = useState<string[]>(
    group.developers
      .filter((dev) => typeof dev._id === "string")
      .map((dev) => dev._id as string) || []
  );

  return (
    <>
      <Modal
        customDimensions={{
          height: "h-[250px]",
        }}
        className="max-w-md "
        title={"Assign Developers to Group"}
        open={isOpen}
        setOpen={setIsOpen}
      >
        <div className="flex flex-col justify-between gap-8">
          <MultiSelectDropdown
            label="Select Developers"
            options={
              data
                ? data
                    .filter((dev) => typeof dev._id === "string")
                    .map((dev) => ({
                      value: dev._id as string,
                      label: dev.name,
                    }))
                : []
            }
            selectedValues={selectDeveloperIds}
            onChange={setSelectDeveloperIds}
            placeholder="Select roles..."
          />

          <button
            type="submit"
            disabled={isLoading || selectDeveloperIds.length === 0}
            onClick={() => {
              assignToGroup.mutate({
                groupId: group._id,
                developerIds: selectDeveloperIds,
              });
            }}
            className="px-4 py-2 h-10  bg-custom-black text-white rounded hover:bg-custom-black/90 cursor-pointer transition-colors"
          >
            Assign Developers
          </button>
        </div>
      </Modal>
      <button
        onClick={() => setIsOpen(true)}
        className="flex h-10 cursor-pointer border border-gray-300 text-sm w-full items-center justify-between p-2 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors duration-150"
      >
        Assign Developers
        <IoIosPeople className="text-2xl cursor-pointer" />
      </button>
    </>
  );
};

const AssingAccessModal = ({ group }) => {
  const queryClient = useQueryClient();
  const [isOpen, setIsOpen] = useState(false);
  const [projects, setProjects] = useState<any[]>([]);

  const { data, isLoading } = useQuery<ProjectResponse[] | null>({
    queryKey: ["getAllProjects"],
    queryFn: getAllProjectsApi,
    staleTime: 0,
  });

  const updateGroupAccess = useMutation({
    mutationFn: updateAccessOfGroup,
    onSuccess: (data) => {
      toast.success("Access updated successfully");
      queryClient.invalidateQueries({ queryKey: ["groups"] });
      setIsOpen(false);
    },
    onError: (error) => {
      toast.error("Failed to update access");
      console.error("Failed to update access ", error);
    },
  });

  const handleProjectsChange = (updatedProjects: Project[]) => {
    setProjects(updatedProjects);
  };

  return (
    <>
      <Modal
        className="max-w-md "
        title={"Update Group Access"}
        open={isOpen}
        setOpen={setIsOpen}
      >
        <div className="flex flex-col justify-between gap-8">
          <ProjectList
            initialProjects={[
              ...(data && !isLoading
                ? data.map((d) => {
                    return {
                      _id: d._id,
                      name: d.name,
                      description: d.description,
                      envType: ["test", "dev", "prod"],
                      status: d.status,
                      isDeleted: d.isDelete,
                      checked: false,
                      selectedEnvTypes: [],
                    };
                  })
                : []),
            ]}
            title="Select Projects"
            onProjectsChange={handleProjectsChange}
          />

          <button
            type="submit"
            disabled={projects.length === 0}
            onClick={() => {
              if (projects.length === 0) {
                toast.error("Please select at least one project");
                return;
              }
              updateGroupAccess.mutate({
                groupId: group._id,
                access: projects
                  .map((d) => {
                    return {
                      projectId: d._id,
                      envType: d.selectedEnvTypes,
                    };
                  })
                  .filter((d) => d.envType.length > 0),
              });
            }}
            className="px-4 py-2 h-10 disabled:bg-gray-300 bg-custom-black text-white rounded hover:bg-custom-black/90 cursor-pointer transition-colors"
          >
            Update
          </button>
        </div>
      </Modal>
      <button
        onClick={() => setIsOpen(true)}
        className="flex border h-10 border-gray-300 cursor-pointer text-sm w-full items-center justify-between p-2 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors duration-150"
      >
        Update Access
        <GrUpdate className="text-xl cursor-pointer" />
      </button>
    </>
  );
};

const GroupDrawer = ({ group }) => {
  let [isOpen, setIsOpen] = useState(false);
  return (
    <div>
      <HiOutlineDotsVertical
        onClick={() => setIsOpen(true)}
        className="cursor-pointer text-xl"
      />
      <Modal
        title={""}
        open={isOpen}
        setOpen={setIsOpen}
        type="drawer"
        position="right"
        customDimensions={{
          width: "w-[500px]",
          height: "h-full",
        }}
      >
        <div className="mt-4 ">
          <p className="text-md border-b border-gray-300 pb-2">
            GROUP OVERVIEW
          </p>

          <div className="grid grid-cols-2 gap-4 mt-2">
            <ProjectDetailsCard
              heading={"Group Name"}
              subheading={group?.name}
            />
            <ProjectDetailsCard heading={"Group ID"} subheading={group._id} />
            <ProjectDetailsCard
              heading={"Description"}
              subheading={group.description}
            />
            <ProjectDetailsCard
              heading={"Managed By"}
              subheading={group.admin.firstName + " " + group.admin.lastName}
            />
            <ProjectDetailsCard
              heading={"Last Updated"}
              subheading={new Date(group.updatedAt).toLocaleString()}
            />

            <ProjectDetailsCard
              heading={"Created"}
              subheading={new Date(group.createdAt).toLocaleString()}
            />
            <ProjectDetailsCard
              heading={"Group Member Count"}
              subheading={group?.developers?.length || 0}
            />
            <ProjectDetailsCard
              heading={"Projects"}
              subheading={group?.access?.length ? group?.access.length : "None"}
            />
          </div>
          <h3 className="text-md border-b border-gray-300 pb-2 my-4">Action</h3>
          <div className="col-span-2 flex items-center justify-between gap-2">
            <AssingDevelopersModal group={group} />
            <AssingAccessModal group={group} />
          </div>
        </div>
      </Modal>
    </div>
  );
};

const DeleteGroup: React.FC = ({}) => {
  const [isDeleteOpen, setIsDeleteOpen] = React.useState(false);
  const queryClient = useQueryClient();
  // const deleteDeveloper = useMutation({
  //   mutationFn: deleteDeveloperApi,
  //   onSuccess: () => {
  //     toast.success("Developer deleted successfully");
  //     setIsDeleteOpen(false);
  //     queryClient.invalidateQueries({ queryKey: ["getAllDevelopers"] });
  //   },
  //   onError: () => {
  //     toast.error("Failed to delete developer");
  //   },
  // });
  return (
    <div>
      <RiDeleteBin6Line
        onClick={() => {
          setIsDeleteOpen(true);
        }}
        className="text-2xl text-red-400 cursor-pointer"
      />
      <Modal open={isDeleteOpen} className="max-w-md" setOpen={setIsDeleteOpen}>
        <ConfirmationDialog
          isOpen={isDeleteOpen}
          onClose={() => setIsDeleteOpen(false)}
          onConfirm={() => {}}
          title="Delete Group"
          description="Are you sure you want to delete this group? This action cannot be undone."
          IconComponent={BsExclamationTriangle}
          confirmText="Yes, Delete"
          cancelText="No, Keep It"
        />
      </Modal>
    </div>
  );
};

export default function Groups() {
  const queryClient = useQueryClient();

  const [isOpen, setIsOpen] = React.useState<boolean>(false);

  const { data: groups, isLoading } = useQuery({
    queryKey: ["groups"],
    queryFn: getAllGroupsApi,
    staleTime: 1000 * 60 * 1, // 1 minute
  });

  const createGroup = useMutation({
    mutationFn: createGroupApi,
    onSuccess: (data) => {
      toast.success("Group created successfully");
      queryClient.invalidateQueries({ queryKey: ["groups"] });
      setIsOpen(false);
    },
    onError: (error) => {
      toast.error("Failed to create group");
      console.error("Error creating group:", error);
    },
  });

  const handleCreateGroup = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const data = Object.fromEntries(formData.entries());
    createGroup.mutate({
      name: data.name.toString(),
      description: data.description.toString(),
    });
  };

  return (
    <div>
      <Modal
        open={isOpen}
        setOpen={setIsOpen}
        type="drawer"
        position="bottom"
        customDimensions={{
          width: "w-full",
          height: "h-[50vh]",
        }}
      >
        <div className="max-w-md mx-auto h-full ">
          <h2 className="font-medium text-2xl text-gray-900 mt-2">
            Create New Group
          </h2>
          <p className="leading-6 mt-2 text-gray-600">
            Create a new group to manage developers and projects efficiently.
            Fill in the details below to get started.
          </p>
          <form onSubmit={handleCreateGroup}>
            <div className="flex flex-col">
              <label className="font-medium text-gray-900 text-sm mt-4 mb-2 block">
                Group Name
              </label>
              <input
                type="text"
                name="name"
                required
                className="border border-gray-200 bg-white w-full px-3 h-9 rounded-lg outline-none focus:ring-2 focus:ring-black/5 text-gray-900"
              />
              <label className="font-medium text-gray-900 text-sm mt-4 mb-2 block">
                Description
              </label>
              <textarea
                rows={4}
                name="description"
                required
                className="border border-gray-200 bg-white w-full resize-none rounded-lg p-3 pt-2.5 text-gray-900 outline-none focus:ring-2 focus:ring-black/5 focus:ring-offset-0"
              />

              <button
                type="submit"
                disabled={createGroup.isPending}
                className="h-[44px] mt-4 bg-black text-gray-50 rounded-lg disabled:cursor-not-allowed cursor-pointer disabled:bg-black/50 w-full font-medium"
              >
                {createGroup.isPending ? (
                  <AiOutlineLoading3Quarters className=" animate-spin mx-auto" />
                ) : (
                  "Create Group"
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
            <h1 className="text-2xl font-bold">Group List</h1>
            <button
              onClick={() => setIsOpen(true)}
              className="px-4 py-1.5 cursor-pointer bg-custom-black text-white rounded-full text-sm font-bold shadow"
            >
              Create Group
            </button>
          </div>
        }
        loading={isLoading}
        data={[
          ["Group Name", "Description", "Actions"],
          ...(groups
            ? groups?.map((group) => [
                group.name,
                group.description,
                <div className="flex items-center gap-x-4">
                  <GroupDrawer group={group} />
                  <DeleteGroup />
                </div>,
              ])
            : []),
        ]}
      />
    </div>
  );
}
