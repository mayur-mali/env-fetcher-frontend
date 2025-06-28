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

export default function Groups() {
  const queryClient = useQueryClient();
  const [loading, setLoading] = React.useState<boolean>(false);

  const [isOpen, setIsOpen] = React.useState<boolean>(false);

  const { data: groups, isLoading } = useQuery({
    queryKey: ["groups"],
    queryFn: getAllGroupsApi,
    staleTime: 1000 * 60 * 1, // 1 minute
  });

  // useEffect(() => {
  //   const fetchAllGroups = async () => {
  //     try {
  //       setLoading(true);
  //       const data = await getAllGroupsApi();
  //       setGroups(data);
  //     } catch (error) {
  //       console.error("Failed to fetch groups:", error);
  //     } finally {
  //       setLoading(false);
  //     }
  //   };
  //   fetchAllGroups();
  // }, []);

  // const createGroup = async (e) => {
  //   e.preventDefault();
  //   const formData = new FormData(e.target);
  //   const data = Object.fromEntries(formData.entries());
  //   try {
  //     setLoading(true);
  //     const res = await createGroupApi({
  //       name: data.name.toString(),
  //       description: data.description.toString(),
  //     });

  //     if (res) {
  //       setIsOpen(false);
  //       toast.success("Group created successfully");
  //       const data = await getAllGroupsApi();
  //       setGroups(data);
  //     }
  //   } catch (error) {
  //     toast.error("Failed to create group");
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  // const deleteGroup = async (groupId) => {
  //   try {
  //     setLoading(true);
  //     await deleteGroupApi(groupId);
  //     toast.success("Group deleted successfully");
  //     const data = await getAllGroupsApi();
  //     setGroups(data);
  //   } catch (error) {
  //     toast.error("Failed to delete group");
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  return (
    <div>
      <Modal title={"Create Group"} open={isOpen} setOpen={setIsOpen}>
        <form>
          <div className="flex flex-col gap-4">
            <label className="text-sm font-semibold">Group Name</label>
            <input
              type="text"
              name="name"
              placeholder="Enter Name"
              required
              className="border border-gray-300 rounded p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <label className="text-sm font-semibold">Description </label>
            <input
              type="text"
              name="description"
              placeholder="Enter Description"
              required
              className="border border-gray-300 rounded p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />

            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 h-10 disabled:bg-custom-black/50 bg-custom-black text-white rounded hover:bg-custom-black/90 cursor-pointer transition-colors"
            >
              {loading ? (
                <AiOutlineLoading3Quarters className=" animate-spin mx-auto" />
              ) : (
                "Create Group"
              )}
            </button>
          </div>
        </form>
      </Modal>

      <Table
        pagination={true}
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
          ["Group Name", "Description", "Action"],
          ...(groups
            ? groups?.map((group) => [
                group.name,
                group.description,
                <GroupDrawer group={group} />,
              ])
            : []),
        ]}
      />
    </div>
  );
}
